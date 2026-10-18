-- Separate operational call-outs from team journal updates.
alter table public.blog_posts
  alter column category set default 'Rescue';

alter table public.blog_posts
  drop constraint if exists blog_posts_category_check;

update public.blog_posts
set category = 'Team News'
where category = 'Team news';

alter table public.blog_posts
  add constraint blog_posts_category_check
  check (category in ('Rescue', 'Search', 'Incident', 'Training', 'Community', 'Team News', 'Fundraising'));
