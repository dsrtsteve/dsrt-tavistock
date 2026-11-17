create type public.app_role as enum ('admin', 'staff', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text not null,
  image text,
  status text not null default 'pending'
    check (status in ('active', 'inactive', 'pending')),
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

-- Preserve existing administrator access when introducing the role model.
insert into public.profiles (id, name, email, image, status, role, created_at)
select
  u.id,
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), ''),
  coalesce(u.email, ''),
  nullif(coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture', ''), ''),
  case when u.email_confirmed_at is null then 'pending' else 'active' end,
  case when a.user_id is not null then 'admin'::public.app_role else 'user'::public.app_role end,
  u.created_at
from auth.users u
left join public.admin_users a on a.user_id = u.id
on conflict (id) do nothing;

create function public.has_role(required public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = required
  );
$$;
revoke all on function public.has_role(public.app_role) from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated;

create function public.protect_profile_role()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.role <> 'user' and current_user <> 'postgres'
       and not public.has_role('admin'::public.app_role) then
      raise exception 'Only administrators may assign elevated roles'
        using errcode = '42501';
    end if;
  elsif new.role is distinct from old.role
        and not public.has_role('admin'::public.app_role) then
    raise exception 'Only administrators may change user roles'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function public.protect_profile_role() from public, anon, authenticated;
create trigger protect_profile_role
before insert or update of role on public.profiles
for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;
grant select, insert, update, delete on public.profiles to authenticated;

create policy "Administrators manage all profiles"
on public.profiles for all to authenticated
using ((select public.has_role('admin'::public.app_role)))
with check ((select public.has_role('admin'::public.app_role)));

create policy "Staff read all profiles"
on public.profiles for select to authenticated
using ((select public.has_role('staff'::public.app_role)));

create policy "Users read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));
