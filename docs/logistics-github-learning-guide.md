# GitHub learning guide for Aivanta's logistics offer

Reviewed 14 September 2026 against the maintainers' repositories, documentation and public GitHub API metadata. These projects explain relevant industry models and implementation patterns. They do **not** establish that LPC Global Logistics, KLN or a particular prospect uses them. No third-party project was installed into Aivanta.

## Start here

Prioritize DCSA for ocean-freight terminology, ERPNext or OpenBoxes for operational workflows, and Docling for a future extraction experiment. Add Fleetbase when researching road dispatch; use ONE Record to connect your aviation background to air-cargo data exchange. Avoid trying to deploy all of them.

| Project | Business context and what to inspect | Relevance to Aivanta | License reported by repository |
| --- | --- | --- | --- |
| [DCSA OpenAPI](https://github.com/dcsaorg/DCSA-OpenAPI) | Ocean-shipping interface specifications; start with `bkg`, `ebl`, `tnt` and `reference-data` | Learn booking, transport-document and tracking concepts before defining an import/export contract | Apache-2.0 |
| [DCSA Conformance Gateway](https://github.com/dcsaorg/Conformance-Gateway) | Executable reference and conformance scenarios for interacting parties | Learn how to test an integration's sequence and behavior, not just JSON shape | Apache-2.0 |
| [ERPNext](https://github.com/frappe/erpnext) | Purchasing, stock and accounting workflows; inspect `erpnext/stock/doctype` | Study how document information becomes receipts, stock movements and shipment records | GPL-3.0 |
| [OpenBoxes](https://github.com/openboxes/openboxes) | Warehouse inventory and stock movements; inspect `grails-app/domain/org/pih/warehouse` | Useful for receiving discrepancies, picking, shipping and inventory ownership | EPL-1.0 |
| [Fleetbase](https://github.com/fleetbase/fleetbase) | Order board, dispatch, tracking, service zones and API/webhook integration | Road transport and delivery workflow reference; evaluate existing operational tools before building another | AGPL-3.0 default; commercial option |
| [OCA Stock Logistics Workflow](https://github.com/OCA/stock-logistics-workflow) | Odoo stock extensions, backorders, packaging weight and approval workflows | Concrete examples of operational exceptions and human approval boundaries | AGPL-3.0 at repository level; check each module |
| [IATA ONE Record](https://github.com/IATA-Cargo/ONE-Record) | Air-cargo data models, ontology, API and security specifications | A useful bridge from CAA engineering to air-freight information exchange | MIT |
| [Docling](https://github.com/docling-project/docling) | Document conversion, layout, OCR, tables and structured exports | Candidate component for turning authorized PDFs into evidence-bearing data for the review UI | MIT code; model licenses separate |

The project descriptions and license labels above are first-party claims, not independent security or suitability assessments. Fleetbase explicitly describes its dual licensing; OCA instructs users to inspect each module's manifest; Docling distinguishes code licensing from individual model licensing. Before commercial reuse, review the specific versions and components involved rather than treating all GitHub code as interchangeable.

## Focused reading and exercises

### 1. Understand ocean-shipment records before extracting them

Read DCSA's [booking documentation](https://dcsa.org/standards/booking/documentation-booking-2) alongside the [OpenAPI folders](https://github.com/dcsaorg/DCSA-OpenAPI). Compare a booking, a transport document and a tracking event. Record which references identify the business shipment and which identify documents or equipment. Build a glossary and map the demo's four fields to candidate real-world fields. Do not assume the demo schema is DCSA-compliant.

Use the [Conformance Gateway](https://github.com/dcsaorg/Conformance-Gateway) later to inspect an executable scenario. The README offers Docker or a manual Spring Boot/Angular setup. A passing scenario concerns the supported standard behavior; it does not establish Kenyan regulatory compliance or access to a carrier's API.

### 2. Follow goods through a warehouse

In [ERPNext's stock doctypes](https://github.com/frappe/erpnext/tree/develop/erpnext/stock/doctype), start with `purchase_receipt`, `packing_slip`, `delivery_note`, `shipment`, `stock_reconciliation` and `landed_cost_voucher`. Follow the code and tests for one receipt. Ask what changes when only part of the expected quantity arrives.

Alternatively, use [OpenBoxes' domain modules](https://github.com/openboxes/openboxes/tree/develop/grails-app/domain/org/pih/warehouse): `receiving`, `inventory`, `picklist`, `shipping` and `invoice`. Its origins are in healthcare supply chains; general warehouse concepts transfer, but its defaults should not be presented as LPC's business rules.

Produce an expected-versus-received example with 120 expected cartons and 112 received. Identify the owner who records the discrepancy and what downstream actions should wait. This is stronger discovery preparation than simply showing that you can query a PDF.

### 3. Study exceptions and transport ownership

Fleetbase's [README and linked API documentation](https://github.com/fleetbase/fleetbase) show an order lifecycle, tracking and integration surfaces. Trace who updates an order and which event would support a customer-status response. Distinguish an operator's estimate from a recorded event.

OCA's [module catalogue](https://github.com/OCA/stock-logistics-workflow) includes `stock_picking_show_backorder`, `stock_picking_tier_validation` and `delivery_total_weight_from_packaging`. These are useful examples of partial fulfilment, approval and packaging weight. Use the branch matching the target Odoo version; modules are not standalone services.

### 4. Use your aviation background for air-cargo data, with care

ONE Record contains dated standard folders and a working draft. Inspect the [2026-07-standard folder](https://github.com/IATA-Cargo/ONE-Record/tree/master/2026-07-standard), including its status readme, `Data-Model` and `API-Security`. Select the version that the actual integration partner supports. A published folder is not by itself evidence of adoption by a prospect.

Prepare an air-freight variant of the shipment map. Identify where shipment, piece, transport and document concepts differ from the sea-freight example. Experience with traceability and controlled workflows from CAA systems helps here; it does not replace learning forwarding operations.

### 5. Evaluate document extraction only after defining the fields

Docling provides concrete [examples](https://github.com/docling-project/docling/tree/main/docs/examples), including `minimal.py`, `full_page_ocr.py`, `export_tables.py` and `extraction.ipynb`. Start with one synthetic PDF and compare output to a manually checked record. Keep source locations and unknown values visible. Docling conversion is not a ready-made customs-validation engine.

For a private pilot, evaluate representative authorized documents and distinguish OCR errors, field-mapping errors and genuine business discrepancies. Do not add a general-purpose agent platform just to parse three document types.

## Maintenance snapshot

The public GitHub API reported all eight repositories as unarchived. Their latest push dates in this snapshot fell between 7 and 14 September 2026. This shows recent repository activity, not stable releases, production readiness or a security audit. Before selecting a component, pin a release and review its changelog, unresolved issues, dependencies and supported runtime. The corresponding metadata is available at `https://api.github.com/repos/{owner}/{repository}` for each linked repository.

## Build an evidence pack in four focused sessions

1. **Ocean freight:** a one-page glossary and reference map using DCSA.
2. **Warehouse operations:** a receipt-to-dispatch diagram and a partial-receipt exception using ERPNext or OpenBoxes.
3. **Document preparation:** a synthetic three-document pack, expected answers, and the existing Aivanta demo export.
4. **Prospect validation:** a workflow walkthrough with an operator; annotate which assumptions were confirmed, corrected or remain unknown.

Keep a small evidence register: claim, source/version, illustrative example, applicability to the prospect, and the question that still needs answering. Label the resulting artifact “Independent logistics workflow demonstration.” Do not call it an LPC/KLN case study or imply an integration, partnership or endorsement.

The next commercial milestone is a client who can identify a repeated task, provide authorized examples and approve a bounded pilot. The repositories help you arrive with better questions and a concrete demonstration; the operator supplies evidence about their actual business.
