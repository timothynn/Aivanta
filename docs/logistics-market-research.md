# Logistics prospect research

Reviewed 11 September 2026. Public-source findings for Aivanta's proposed LPC and Kerry/KLN conversations. Company descriptions establish advertised services, not operational performance, purchasing authority, or installed software. Recommendations below are hypotheses to test in discovery.

## What the earlier research gets right, and what needs correction

### LPC Global Logistics

The first-party website is now discoverable at the **www** hostname, although direct page extraction was unreliable. Its indexed content advertises ocean/air freight, road transport, customs clearing, warehousing/distribution, marine insurance, project/heavy cargo, and container freight station services. It refers to **Miritini CFS**; do not repeat the earlier Port Reitz address without asking LPC to reconcile the location. Its company-managed LinkedIn profile additionally lists packing/removals, reverse logistics, last-mile delivery, logistics advisory, and courier services. These give a broader discovery map than air/sea/land alone. [LPC website](https://www.lpcgl.com/), [LPC company profile](https://ke.linkedin.com/company/lpc-global-logistics-limited).

KRA's published 2026–2028 customs-agent list contains LPC Global Logistics Limited with a displayed expiry of 31 December 2026. This is stronger corroboration of customs activity than a commercial directory. [KRA licensed customs agents](https://www.kra.go.ke/images/publications/LICENSED-CUSTOMS-AGENTS-2026-2028.pdf).

Do not use the pasted employee/revenue estimates to call LPC an owner-operator, assume instant purchasing authority, or assert customer counts. Website marketing statistics are not validated business intelligence. LPC's actual software, job volumes, amendment rates, buyer, and authority to provide customer documents remain unknown. A spreadsheet-based workflow can still support a narrow read-only pilot; it does not automatically require an ERP replacement first.

### Kerry / KLN

The official Kenya directory entry is labelled **“KLN Agent”** and provides contact.kenya@kln.com. It does not establish a wholly owned country office, the contracting entity, the local service portfolio, or the budget holder. Group navigation links are not evidence that every listed service is delivered by the Kenya agent. Ask who the user's Kerry contact actually represents before designing a proposal. [KLN Kenya](https://www.kln.com/en/network/africa/kenya/).

KLN's current digitalisation page lists warehouse, freight, transport, and order-management systems (KWMS/KFMS/KTMS/KOMS), KLN Online visibility, analytics, ePOD, and AI cameras. Its Oceania site separately describes KerrierVISION, local EDI integration, and CargoWise One integration. The IoT smart-sensor announcement exists, but dates to 2019. These verify existing group/regional capability, **not Kenya deployment**. [KLN digitalisation](https://www.kln.com/en/expertise/products/digitalisation/), [KLN Oceania supply-chain solutions](https://oceania.kln.com/solutions/supply-chain-solutions/), [2019 sensor announcement](https://www.kln.com/en/press/press-release/2019/kerry-logistics-introduces-iot-solution-to-global-supply-chain-with-smart-sensor/).

There is no evidence here for “Kenya cannot buy,” a 12–18 month sales cycle, or “only viable in year two.” Nor is there evidence that its systems lack Kenya-specific integrations. Treat local authority, approved vendors, APIs, and unmet workflow gaps as discovery questions. Approach both prospects if there is access; prioritize whichever supplies an accountable sponsor, usable sample data, a measurable pain, and a path to payment.

## Kenyan customs systems and existing competition

**KRA iCMS and KenTrade's single window are distinct, integrated systems.** KRA identifies iCMS as its customs platform. KenTrade manages the National Electronic Single Window/Trade Facilitation Platform (TFP). KenTrade's December 2022 newsletter calls TFP an enhancement of TradeNet and records migration of the iCMS/TradeNet integration to TFP. Avoid describing iCMS entries as simply entered “via TradeNet,” and do not infer public write APIs or access rights. [KRA iCMS notice](https://www.kra.go.ke/news-center/public-notices/554-implementation-of-integrated-customs-management-system-icms-for-cargo-clearance), [KenTrade](https://kentrade.go.ke/), [KenTrade December 2022 newsletter, page 6](https://www.kentrade.go.ke/wp-content/uploads/2023/01/KENTRADE-QUARTER-EDITION-II-DEC-2022-2.pdf).

KRA's import-process guidance lists commercial invoices, packing lists, transport documents, IDFs, and applicable permits among declaration inputs. This supports a document-preparation opportunity, but not the assertion that these clients re-key the same six documents on every shipment. [KRA import/export process brochure](https://www.kra.go.ke/images/publications/Customs-brochure---Import-and-Export-Processes-v3.pdf).

The competition includes the customer's existing software. CargoWise already markets AI commercial-invoice ingestion and commodity/compliance screening. Before building, ask which modules are licensed, enabled, and suitable for the actual workflow. Configuration and integration may be the right paid service. [CargoWise ComplianceWise](https://www.cargowise.com/solutions/cargowise-customs/compliancewise/).

## Pilot opportunities, ranked for discovery

The following ranking is a proposed starting point, not a measured ROI finding.

| Candidate | Smallest useful pilot | Evidence needed before committing |
| --- | --- | --- |
| Shipment document review | One shipment type; extract agreed fields from invoice, packing list, and B/L or AWB; show source evidence, missing fields, and explainable discrepancies; human-approved export into the existing workflow | Representative authorized documents, current preparation time, field definitions, reviewer, and actual export/import format |
| Shipment status reply drafting | Match an inquiry to one job; draft a response citing current job evidence and its timestamp; operator sends | Reliable job identifier, permitted inbox/job access, status ownership, stale-data handling, measured reply workload |
| Free-time exception monitor | One carrier/terminal workflow; human-confirmed dates and contractual rules; deterministic deadlines and escalation | Actual agreements, event availability, responsible operator, disputed/incomplete-date rules, and attributable historical charges |
| Warehouse receiving reconciliation | Compare one supplier's delivery documents with expected receipt records and queue discrepancies | WMS/export access, item-code mapping, units, partial receipts, and discrepancy baseline |
| Quote preparation | Extract RFQ facts and assemble a draft from approved current rates | Maintained rate cards, applicable surcharges, currencies, validity dates, and commercial approval |

For document review, a weight difference is not automatically an error: first distinguish gross/net weight, item/consignment totals, and units. For deadline monitoring, model port/terminal storage, carrier demurrage, and detention separately using the actual agreement, including combined terms where applicable. Do not promise that an alert could prevent every charge or count hypothetical avoided fees as realized savings.

Defer HS classification as the first offer unless a qualified customs reviewer owns the evaluation and authoritative tariff/ruling sources are available. Historic accepted entries are examples, not proof that a classification is correct today. A regulatory chatbot also creates an ongoing source-maintenance obligation. Start with preparation and review before regulatory decision support.

## Data handling implications for a pilot

The Act protects information about identifiable natural persons; commercial pricing is not automatically personal data, although documents can contain personal contact or consignee information. It requires lawful, limited, accurate processing and appropriate retention. Cross-border processing has statutory conditions; a blanket claim that all data must remain in Kenya would be wrong. [Data Protection Act, sections 2, 25 and 48–50](https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31).

Document controller/processor roles, instructions, approved subprocessors, access controls, retention/deletion, and hosting/model locations before real documents enter the pilot. The General Regulations address processor contracts and subprocessor authorization. Determine whether a DPIA is needed for the actual processing rather than treating every small AI demo identically. [General Regulations, regulations 24–26](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng%402022-01-14), [ODPC guidance library](https://www.odpc.go.ke/guidelines-2/).

Registration is not an unconditional one-size-fits-all statement: ODPC describes a small-entity exemption requiring both revenue below KES 5 million and fewer than ten employees, but lists transport-service processing among non-exempt categories. Confirm how the actual client and Aivanta processing roles fall within these rules. [ODPC registration FAQ](https://www.odpc.go.ke/faqs/).

For the public demo, use synthetic shipment packs. For a real pilot, agree model-provider training/retention terms and a data-processing arrangement that reflects the chosen service; “not used for training” does not itself mean zero retention or no international transfer. Keep confidential business data protected contractually even where it is not personal data.

## First-call questions that settle the direction

1. Can an operator show one completed normal job and one exception from document arrival to final handoff?
2. Which system holds the authoritative job record, and which manual step is repeated most?
3. Which capabilities already exist in the licensed software, and why are they unused or insufficient?
4. What time, correction, delay, or response metric can we baseline on recent jobs?
5. Who owns the workflow, approves IT/data access, authorizes spend, and reviews pilot output?
6. Can the client authorize a bounded representative sample, and what export/API route already exists?
7. What result would justify paying for deployment, and what support hours are actually required?

No outreach, client contact, or software implementation was performed as part of this research.
