import { useState } from 'react';
import { canExport, createExport, documentNames, inspectPack, samplePack, type DocumentKind, type Finding, type Review, type ShipmentPack } from './shipment';

export function ShipmentCheck() {
  const [pack, setPack] = useState<ShipmentPack>({ ...samplePack });
  const [findings, setFindings] = useState<Finding[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [reviewer, setReviewer] = useState('');
  const [exported, setExported] = useState('');
  const [scenario, setScenario] = useState('mismatch');
  const [activeSource, setActiveSource] = useState<DocumentKind>('invoice');

  function reset(next: ShipmentPack) { setPack(next); setFindings([]); setReviews({}); setExported(''); }
  function loadScenario(value: string) {
    setScenario(value);
    reset({ ...samplePack, bill: value === 'matched' ? samplePack.bill.replace('Packages: 112', 'Packages: 120')
      : value === 'missing' ? samplePack.bill.replace('Gross weight kg: 2400', 'Gross weight kg:') : samplePack.bill });
  }
  function inspect() {
    const next = inspectPack(pack);
    setFindings(next); setReviews(Object.fromEntries(next.map((f) => [f.field, { value: f.value, note: '', approved: false }]))); setExported('');
  }
  function update(field: string, change: Partial<Review>) {
    setReviews((current) => ({ ...current, [field]: { ...current[field], approved: false, ...change } })); setExported('');
  }
  function download() {
    const text = JSON.stringify(createExport(findings, reviews, reviewer), null, 2);
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'aivanta-synthetic-reviewed-shipment.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setExported(text);
  }

  return <section id="shipment-check" className="shipment-check container">
    <p className="eyebrow">AIVANTA LABS · INTERACTIVE SAMPLE</p>
    <h2>A shipment file you can actually check.</h2>
    <p>Compare three synthetic documents, inspect the evidence, and approve an export. This sample reads labelled text with fixed rules; it demonstrates the review workflow, not AI or PDF extraction accuracy. Everything stays in your browser.</p>
    <div className="shipment-toolbar">
      <label>Example scenario<select value={scenario} onChange={(e) => loadScenario(e.target.value)}><option value="mismatch">Package counts disagree</option><option value="missing">Missing gross weight</option><option value="matched">Matching documents</option></select></label>
      <button className="button button--primary" type="button" onClick={inspect}>Check shipment file</button>
    </div>
    <div className="shipment-workspace">
      <aside className="shipment-source">
        <h3>1. Source documents</h3>
        <p>Use only invented data here. Edit a labelled value to try another discrepancy.</p>
        <div className="shipment-tabs" aria-label="Source documents">{(Object.keys(documentNames) as DocumentKind[]).map((kind) => <button type="button" aria-pressed={activeSource === kind} key={kind} onClick={() => setActiveSource(kind)}>{documentNames[kind]}</button>)}</div>
        <label>{documentNames[activeSource]} text<textarea rows={11} value={pack[activeSource]} onChange={(e) => reset({ ...pack, [activeSource]: e.target.value })} /></label>
        <details open><summary>Source lines · {documentNames[activeSource]}</summary><ol className="shipment-lines">{pack[activeSource].split('\n').map((line, i) => <li id={`source-${activeSource}-${i + 1}`} key={i}>{line || '—'}</li>)}</ol></details>
      </aside>
      <div className="shipment-review">
        <h3>2. Evidence and review</h3>
        {!findings.length ? <p className="shipment-empty">Choose “Check shipment file” to compare references, consignees, package counts, and gross weights. Net weight is kept separate.</p> : <>
          <p role="status">{findings.filter((f) => f.issue).length} fields need attention. Review all four fields before export.</p>
          {findings.map((finding) => <article className={`shipment-finding ${finding.issue ? 'needs-review' : ''}`} key={finding.field}>
            <h4>{finding.field} <span>{finding.issue ? 'Needs attention' : 'Sources agree'}</span></h4>
            {finding.issue && <p>{finding.issue}</p>}
            <ul>{finding.evidence.map((e) => <li key={`${e.document}-${e.line}`}><button type="button" className="shipment-evidence" onClick={() => { setActiveSource(e.document); setTimeout(() => document.getElementById(`source-${e.document}-${e.line}`)?.scrollIntoView({ block: 'nearest' }), 0); }}>{documentNames[e.document]} · line {e.line}</button>: <strong>{e.value || 'Missing'}</strong></li>)}</ul>
            <label>Reviewed {finding.field.toLowerCase()}<input value={reviews[finding.field].value} onChange={(e) => update(finding.field, { value: e.target.value })} /></label>
            <label>Review note for {finding.field.toLowerCase()}<input placeholder={finding.issue ? 'Explain your resolution (at least 10 characters)' : 'Required if you change the suggested value'} value={reviews[finding.field].note} onChange={(e) => update(finding.field, { note: e.target.value })} /></label>
            <label className="shipment-approval"><input type="checkbox" checked={reviews[finding.field].approved} onChange={(e) => update(finding.field, { approved: e.target.checked })} />I reviewed {finding.field.toLowerCase()}</label>
          </article>)}
        </>}
      </div>
    </div>
    <div className="shipment-export"><div><h3>3. Export the reviewed sample</h3><p>All fields need approval and valid values. Missing, conflicting, or changed values need a resolution note. This does not submit a customs declaration.</p></div><label>Reviewer name<input value={reviewer} onChange={(e) => { setReviewer(e.target.value); setExported(''); }} placeholder="Use a demo name" /></label><button className="button button--primary" type="button" disabled={!canExport(findings, reviews, reviewer)} onClick={download}>Download reviewed JSON</button></div>
    {exported && <div role="status"><p>Reviewed synthetic shipment exported. Source evidence and resolution notes are included.</p><details><summary>Inspect export</summary><pre className="shipment-json">{exported}</pre></details></div>}
  </section>;
}
