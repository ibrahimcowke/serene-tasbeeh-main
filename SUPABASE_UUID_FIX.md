# Supabase UUID Error Fix

## Problem
The application is showing this error:
```
invalid input syntax for type uuid: "acc-1768743283592"
https://iayrnphhejailcplszhp.supabase.co/rest/v1/accounts 400 (Bad Request)
```

## Root Cause
The error indicates that:
1. There's an `accounts` table in your Supabase database that we're not using in the current code
2. Something (likely a database trigger or RLS policy) is trying to insert records with non-UUID IDs like `"acc-1768743283592"`
3. The `accounts` table has a UUID column that's rejecting these non-UUID values

## Solution

### Option 1: Remove the accounts table (Recommended if not needed)
If you don't need the `accounts` table:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **Table Editor**
4. Find and delete the `accounts` table
5. Check **Database** → **Triggers** for any triggers related to accounts and delete them

### Option 2: Fix the trigger/function generating bad IDs
If you need the accounts table:

1. Go to **Database** → **Functions** in Supabase
2. Look for any function that creates account records
3. Update the ID generation to use `gen_random_uuid()` instead of string concatenation

Example fix:
```sql
-- Instead of:
INSERT INTO accounts (id, ...) VALUES ('acc-' || extract(epoch from now()), ...);

-- Use:
INSERT INTO accounts (id, ...) VALUES (gen_random_uuid(), ...);
```

### Option 3: Disable auto-sync temporarily
If you want to use the app without cloud sync:

1. Don't sign in with Google
2. Use the app in local-only mode
3. Your data will be saved in browser storage only

## What I've Fixed in the Code
I've updated the `syncToCloud` function to:
- Validate that user IDs are proper UUIDs before attempting sync
- Add better error logging to help diagnose issues
- Handle errors gracefully without crashing the app

## Next Steps
1. Check your Supabase database for the `accounts` table
2. Either remove it or fix the trigger creating bad IDs
3. Ensure your `profiles` table exists with this schema:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tasbeeh_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```
