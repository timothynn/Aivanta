import { describe, expect, it } from 'vitest';
import { canExport, createExport, inspectPack, samplePack, type Review } from './shipment';

describe('shipment checking', () => {
  it('finds the actual package conflict and preserves source line evidence', () => {
    const findings = inspectPack(samplePack);
    expect(findings.filter((f) => f.issue).map((f) => f.field)).toEqual(['Packages']);
    expect(findings.find((f) => f.field === 'Packages')?.evidence).toContainEqual({ document: 'bill', line: 4, value: '112' });
    expect(findings.find((f) => f.field === 'Gross weight kg')?.issue).toBe('');
  });
  it('does not substitute net weight when gross weight is missing', () => {
    const pack = { ...samplePack, packing: samplePack.packing.replace('Gross weight kg: 2400\n', '') };
    const finding = inspectPack(pack).find((f) => f.field === 'Gross weight kg');
    expect(finding?.issue).toContain('Missing or invalid in Packing list');
    expect(finding?.evidence.map((e) => e.value)).not.toContain('2160');
  });
  it.each(['NaN', '-2', '2 cartons', '0', '1.5'])('rejects invalid package count %s', (value) => {
    const finding = inspectPack({ ...samplePack, bill: samplePack.bill.replace('Packages: 112', `Packages: ${value}`) }).find((f) => f.field === 'Packages');
    expect(finding?.issue).toContain('Missing or invalid');
  });
  it('flags repeated fields rather than silently selecting the last value', () => {
    expect(inspectPack({ ...samplePack, bill: `${samplePack.bill}\nPackages: 120` }).find((f) => f.field === 'Packages')?.issue).toContain('Repeated field');
  });
  it('requires reviewed valid fields, identity and discrepancy notes before export', () => {
    const findings = inspectPack(samplePack);
    const reviews: Record<string, Review> = Object.fromEntries(findings.map((f) => [f.field, { value: f.value, note: '', approved: true }]));
    expect(canExport(findings, reviews, 'Demo Reviewer')).toBe(false);
    expect(() => createExport(findings, reviews, 'Demo Reviewer')).toThrow();
    reviews.Packages.note = 'Demo correction confirmed against the packing list.';
    expect(canExport(findings, reviews, '')).toBe(false);
    const exported = createExport(findings, reviews, 'Demo Reviewer');
    expect(exported.synthetic).toBe(true);
    expect(exported.fields.find((f) => f.field === 'Packages')).toMatchObject({ value: '120', sourceIssue: expect.stringContaining('disagree'), evidence: expect.any(Array) });
    reviews.Packages.value = 'many';
    expect(canExport(findings, reviews, 'Demo Reviewer')).toBe(false);
  });
});
