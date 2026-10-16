-- Admin membership is managed only by a database owner, never by a browser.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy "Read own admin membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  title text not null check (length(trim(title)) between 3 and 160),
  excerpt text not null check (length(trim(excerpt)) between 10 and 350),
  body text not null check (length(trim(body)) between 20 and 100000),
  category text not null default 'Rescue' check (category in ('Rescue', 'Training', 'Community', 'Team news')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  event_date date not null default current_date,
  location text check (length(location) <= 150),
  incident_number integer check (incident_number > 0),
  rescue_type text check (length(rescue_type) <= 100),
  source_url text check (source_url ~ '^https://[^ ]+$' and length(source_url) <= 2000),
  cover_path text check (cover_path ~ '^[a-f0-9-]{36}\.(jpg|png|webp)$'),
  cover_alt text check (length(cover_alt) <= 300),
  cover_caption text check (length(cover_caption) <= 500),
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_timestamp check (status <> 'published' or published_at is not null),
  constraint image_description check (cover_path is null or coalesce(length(trim(cover_alt)), 0) > 0)
);
create index blog_posts_published_date_idx on public.blog_posts (event_date desc) where status = 'published';
create index blog_posts_author_idx on public.blog_posts (author_id);
create index blog_posts_cover_idx on public.blog_posts (cover_path) where status = 'published';
alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon;
grant select, insert, update on public.blog_posts to authenticated;

create policy "Public published posts" on public.blog_posts for select to anon
  using (status = 'published');
create policy "Members read published posts and admins read all" on public.blog_posts for select to authenticated
  using (status = 'published' or exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins create posts" on public.blog_posts for insert to authenticated
  with check (author_id = (select auth.uid()) and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins edit posts" on public.blog_posts for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create function public.stamp_blog_post() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.slug <> old.slug then
    raise exception 'Published links are permanent. Create a new post to use a different URL.';
  end if;
  new.created_at := old.created_at;
  new.author_id := old.author_id;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
revoke all on function public.stamp_blog_post() from public, anon, authenticated;
create trigger stamp_blog_post before update on public.blog_posts
  for each row execute function public.stamp_blog_post();

-- Private bucket: a draft photo cannot be fetched by knowing its URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Public published blog photos" on storage.objects for select to anon
  using (bucket_id = 'blog-images' and exists (
    select 1 from public.blog_posts where cover_path = name and status = 'published'
  ));
create policy "Members read published photos and admins read all" on storage.objects for select to authenticated
  using (bucket_id = 'blog-images' and (
    exists (select 1 from public.admin_users where user_id = (select auth.uid()))
    or exists (select 1 from public.blog_posts where cover_path = name and status = 'published')
  ));
create policy "Admins upload blog photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ));
-- No overwrite/delete grants: old images stay available to posts using them.
