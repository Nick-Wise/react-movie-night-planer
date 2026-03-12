create table if not exists public.watchlist_items (
  external_id text primary key,
  title text not null,
  year integer,
  poster_url text,
  genre text,
  description text,
  runtime_minutes integer,
  streaming_service text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  planned_date text,
  status text not null default 'want' check (status in ('want', 'watching', 'watched')),
  user_rating numeric check (user_rating is null or (user_rating >= 1 and user_rating <= 5)),
  notes text not null default '',
  added_at timestamptz not null default timezone('utc', now())
);
