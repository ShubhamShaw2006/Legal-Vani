-- Run this in your Supabase SQL Editor

-- 1. Create the Users table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create the OTP Sessions table
CREATE TABLE public.otp_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Setup Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts and selects for our custom API endpoints to interact with
CREATE POLICY "Allow anonymous read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read" ON public.otp_sessions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.otp_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON public.otp_sessions FOR DELETE USING (true);
