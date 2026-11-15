-- FR-P3: product detail needs a problem statement and security notes (editable in admin, FR-A3).
alter table products add column if not exists problem text;
alter table products add column if not exists security_notes text[] default '{}';
