-- ============================================================
-- Local Baazar — Supabase Database Schema
-- Paste and run this SQL in Supabase SQL Editor
-- ============================================================

-- ========================
-- 1. PROFILES TABLE
-- ========================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  avatar_url text,
  seller_rating numeric(3,2) default 0,
  buyer_rating numeric(3,2) default 0,
  locality text,
  joined_since text default extract(year from now())::text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profile auto-create trigger when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, locality)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'locality', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================
-- 2. PRODUCTS TABLE
-- ========================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  seller_name text not null,
  seller_rating numeric(3,2) default 0,
  name text not null,
  short_description text not null,
  description text not null,
  category text not null,
  price numeric(10,2) not null,
  distance text,
  locality text not null,
  rating numeric(3,2) default 0,
  image_url text,
  stock_status text check (stock_status in ('in-stock', 'low-stock', 'out-of-stock')) default 'in-stock',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========================
-- 3. ORDERS TABLE
-- ========================
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  buyer_name text not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  seller_name text not null,
  quantity int not null default 1,
  price numeric(10,2) not null,
  delivery_method text check (delivery_method in ('delivery', 'pickup')) not null,
  status text check (status in ('pending', 'shipped', 'delivered', 'picked-up', 'cancelled')) default 'pending',
  date date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========================
-- 4. WISHLISTS TABLE
-- ========================
create table if not exists public.wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ========================
-- 5. REVIEWS TABLE
-- ========================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewer_name text not null,
  rating int check (rating between 1 and 5) not null,
  comment text not null,
  created_at timestamptz default now()
);

-- ========================
-- 6. CONVERSATIONS TABLE
-- ========================
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  participant_one_id uuid references public.profiles(id) on delete cascade not null,
  participant_two_id uuid references public.profiles(id) on delete cascade not null,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz default now(),
  unique(participant_one_id, participant_two_id)
);

-- ========================
-- 7. MESSAGES TABLE
-- ========================
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ========================
-- 8. LIVE SESSIONS TABLE
-- ========================
create table if not exists public.live_sessions (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references public.profiles(id) on delete cascade not null,
  host_name text not null,
  title text not null,
  cover_image text,
  locality text not null,
  viewers int default 0,
  is_active boolean default true,
  product_id uuid references public.products(id) on delete set null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Profiles: readable by everyone, update only own profile
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products: read all, seller CRUD only
alter table public.products enable row level security;
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Sellers can insert products" on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own products" on public.products for update using (auth.uid() = seller_id);
create policy "Sellers can delete own products" on public.products for delete using (auth.uid() = seller_id);

-- Orders: buyer and seller both can see own orders
alter table public.orders enable row level security;
create policy "Buyers see own orders" on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can place orders" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "Sellers can update order status" on public.orders for update using (auth.uid() = seller_id);

-- Wishlists: only own wishlist
alter table public.wishlists enable row level security;
create policy "Users see own wishlist" on public.wishlists for select using (auth.uid() = user_id);
create policy "Users can manage wishlist" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "Users can remove from wishlist" on public.wishlists for delete using (auth.uid() = user_id);

-- Reviews: read all, logged-in users can add
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Logged in users can review" on public.reviews for insert with check (auth.uid() = reviewer_id);
create policy "Users can delete own review" on public.reviews for delete using (auth.uid() = reviewer_id);

-- Conversations: only participants can see
alter table public.conversations enable row level security;
create policy "Participants can view conversations" on public.conversations for select
  using (auth.uid() = participant_one_id or auth.uid() = participant_two_id);
create policy "Users can create conversations" on public.conversations for insert
  with check (auth.uid() = participant_one_id);
create policy "Participants can update conversations" on public.conversations for update
  using (auth.uid() = participant_one_id or auth.uid() = participant_two_id);

-- Messages: conversation participants
alter table public.messages enable row level security;
create policy "Participants can view messages" on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.participant_one_id = auth.uid() or c.participant_two_id = auth.uid())
  ));
create policy "Users can send messages" on public.messages for insert
  with check (auth.uid() = sender_id);
create policy "Recipients can mark messages read" on public.messages for update
  using (auth.uid() != sender_id);

-- Live Sessions: read all, host CRUD only
alter table public.live_sessions enable row level security;
create policy "Live sessions viewable by everyone" on public.live_sessions for select using (true);
create policy "Hosts can create live sessions" on public.live_sessions for insert with check (auth.uid() = host_id);
create policy "Hosts can update own session" on public.live_sessions for update using (auth.uid() = host_id);

-- ============================================================
-- REALTIME ENABLE (Must also be enabled in Supabase Dashboard)
-- ============================================================
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.live_sessions;
