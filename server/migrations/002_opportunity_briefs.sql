alter table leads add column if not exists opportunity_brief jsonb;
create index if not exists leads_opportunity_brief_idx on leads using gin (opportunity_brief);
