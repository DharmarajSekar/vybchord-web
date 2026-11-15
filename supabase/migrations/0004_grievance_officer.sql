-- FR-P12 / NFR-6: Grievance Officer details shown in the Privacy Policy (DPDP Act 2023), editable in admin.
alter table site_settings add column if not exists grievance_officer_name text;
alter table site_settings add column if not exists grievance_officer_email text;
