-- Run this in your Supabase SQL editor (project > SQL Editor)
-- Creates the three tables needed for user data storage

create table if not exists watchlist (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  created_at timestamp with time zone default now(),
  unique(user_email, media_id, media_type)
);

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  rating text not null check (rating in ('like', 'dislike')),
  created_at timestamp with time zone default now(),
  unique(user_email, media_id, media_type)
);

create table if not exists watch_history (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  viewed_at timestamp with time zone default now()
);

-- Optional: index for faster lookups
create index if not exists watchlist_user_idx on watchlist(user_email);
create index if not exists ratings_user_idx on ratings(user_email);
create index if not exists history_user_idx on watch_history(user_email);
