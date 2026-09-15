export type DocumentKind = 'invoice' | 'packing' | 'bill';
export const documentNames: Record<DocumentKind, string> = {
  invoice: 'Commercial invoice', packing: 'Packing list', bill: 'Bill of lading',
};
export type ShipmentPack = Record<DocumentKind, string>;
export type FieldName = 'Shipment reference' | 'Consignee' | 'Packages' | 'Gross weight kg';
export const fieldNames: FieldName[] = ['Shipment reference', 'Consignee', 'Packages', 'Gross weight kg'];
export type Evidence = { document: DocumentKind; line: number; value: string };
export type Finding = { field: FieldName; evidence: Evidence[]; value: string; issue: string };

// Explicit fixture parsing: this public demonstration never calls a model or uploads documents.
export function inspectPack(pack: ShipmentPack): Finding[] {
  return fieldNames.map((field) => {
    const evidence = (Object.keys(documentNames) as DocumentKind[]).flatMap((document) =>
      pack[document].split('\n').flatMap((line, index) => {
        const separator = line.indexOf(':');
        return line.slice(0, separator).trim() === field && separator >= 0
          ? [{ document, line: index + 1, value: line.slice(separator + 1).trim() }] : [];
      }),
    );
    const numeric = field === 'Packages' || field === 'Gross weight kg';
    const valid = (value: string) => value.trim() !== '' && (!numeric ||
      (/^\d+(\.\d+)?$/.test(value) && Number(value) > 0 && (field !== 'Packages' || Number.isInteger(Number(value)))));
    const missing = (Object.keys(documentNames) as DocumentKind[]).filter((kind) => !evidence.some((e) => e.document === kind && valid(e.value)));
    const duplicate = (Object.keys(documentNames) as DocumentKind[]).some((kind) => evidence.filter((e) => e.document === kind).length > 1);
    const values = new Set(evidence.map((e) => numeric ? String(Number(e.value)) : e.value.trim().toLowerCase()));
    const issue = duplicate ? 'Repeated field: inspect the source before choosing a value.'
      : missing.length ? `Missing or invalid in ${missing.map((kind) => documentNames[kind]).join(', ')}.`
      : values.size > 1 ? 'Documents disagree. Confirm the correct value with the shipment owner.' : '';
    return { field, evidence, value: evidence.find((e) => valid(e.value))?.value ?? '', issue };
  });
}

export function validReviewedValue(field: FieldName, value: string): boolean {
  if (field === 'Packages' || field === 'Gross weight kg') {
    return /^\d+(\.\d+)?$/.test(value) && Number(value) > 0 && (field !== 'Packages' || Number.isInteger(Number(value)));
  }
  return value.trim().length > 0;
}

export const samplePack: ShipmentPack = {
  invoice: 'SYNTHETIC EXAMPLE — COMMERCIAL INVOICE\nInvoice: INV-DEMO-042\nShipment reference: AIV-DEMO-042\nConsignee: Example Coast Supplies\nPackages: 120\nGross weight kg: 2400\nCurrency: USD\nInvoice total: 18000',
  packing: 'SYNTHETIC EXAMPLE — PACKING LIST\nShipment reference: AIV-DEMO-042\nConsignee: Example Coast Supplies\nPackages: 120\nGross weight kg: 2400\nNet weight kg: 2160\nContents: General merchandise, cartons',
  bill: 'SYNTHETIC EXAMPLE — BILL OF LADING\nShipment reference: AIV-DEMO-042\nConsignee: Example Coast Supplies\nPackages: 112\nGross weight kg: 2400\nPort of discharge: Mombasa\nTransport document: BOL-DEMO-042',
};

export type Review = { value: string; note: string; approved: boolean };
export function canExport(findings: Finding[], reviews: Record<string, Review>, reviewer: string): boolean {
  return Boolean(reviewer.trim()) && findings.length === fieldNames.length && findings.every((finding) => {
    const review = reviews[finding.field];
    return review?.approved && validReviewedValue(finding.field, review.value) &&
      (!(finding.issue || review.value !== finding.value) || review.note.trim().length >= 10);
  });
}

export function createExport(findings: Finding[], reviews: Record<string, Review>, reviewer: string) {
  if (!canExport(findings, reviews, reviewer)) throw new Error('Complete the review before exporting.');
  return {
    schemaVersion: 1, synthetic: true, reviewedBy: reviewer.trim(), reviewedAt: new Date().toISOString(),
    fields: findings.map((finding) => ({ field: finding.field, value: reviews[finding.field].value,
      resolution: reviews[finding.field].note, sourceIssue: finding.issue, evidence: finding.evidence })),
  };
}
