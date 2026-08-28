alter table leads add column if not exists qualification_score integer not null default 0;
alter table leads add column if not exists qualification_label text not null default 'early';
alter table leads add column if not exists qualification_reasons text[] not null default '{}';

alter table leads drop constraint if exists leads_qualification_label_check;
alter table leads add constraint leads_qualification_label_check check (qualification_label in ('early', 'promising', 'high-intent'));

create index if not exists leads_qualification_score_idx on leads (qualification_score desc);
