-- Schema for Smart Waste Mapping Platform

-- 1. Create custom enum types
CREATE TYPE user_role AS ENUM ('citizen', 'cleaner', 'admin');
CREATE TYPE report_status AS ENUM ('pending', 'assigned', 'in_progress', 'cleaned', 'verified', 'rejected');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');

-- 2. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'citizen',
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Reports table
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  cleaner_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  severity severity_level DEFAULT 'medium',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Realtime for reports
ALTER PUBLICATION supabase_realtime ADD TABLE reports;

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reports RLS
CREATE POLICY "Reports are viewable by everyone." 
ON reports FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reports." 
ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own pending reports." 
ON reports FOR UPDATE USING (
  auth.uid() = reporter_id AND status = 'pending'
);

CREATE POLICY "Cleaners can update assigned reports."
ON reports FOR UPDATE USING (
  auth.uid() = cleaner_id
);
