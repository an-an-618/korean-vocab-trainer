create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  vercel_user_id text not null unique,
  email text,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists wordbook_items (
  user_id uuid not null references users(id) on delete cascade,
  word_id text not null,
  note text,
  created_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create table if not exists study_stats (
  user_id uuid not null references users(id) on delete cascade,
  word_id text not null,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  last_seen_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create index if not exists wordbook_items_user_created_idx
  on wordbook_items (user_id, created_at desc);

create index if not exists study_stats_user_last_seen_idx
  on study_stats (user_id, last_seen_at desc);
