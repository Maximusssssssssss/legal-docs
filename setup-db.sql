create table persons (id uuid primary key default gen_random_uuid(), full_name text not null, inn text, address text, phone text, email text, passport text, date_of_birth text, ogrnip text, created_at timestamptz default now());

create table documents (id uuid primary key default gen_random_uuid(), template_id text not null, title text not null, content text not null, data jsonb default '{}', created_at timestamptz default now(), status text default 'draft');

create index idx_persons_inn on persons(inn);

create index idx_persons_name on persons(full_name);

create index idx_documents_created on documents(created_at desc);

create index idx_documents_template on documents(template_id);

alter table persons enable row level security;

alter table documents enable row level security;

create policy "Allow all for persons" on persons for all using (true);

create policy "Allow all for documents" on documents for all using (true);
