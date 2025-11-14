/*
  # Create Master Credentials System

  1. New Tables
    - `master_credentials`
      - `id` (uuid, primary key)
      - `username` (text, unique) - Master username
      - `password_hash` (text) - Hashed master password
      - `description` (text) - Description of the master account
      - `is_active` (boolean) - Whether the account is active
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz) - Last time this credential was used

  2. Security
    - Enable RLS on `master_credentials` table
    - Only service role can access this table
    - No public access allowed

  3. Initial Data
    - Creates a master account with username: admin
    - Password: Master@2024
    - Password is hashed using pgcrypto extension
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create master credentials table
CREATE TABLE IF NOT EXISTS master_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE master_credentials ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies (no public access)
CREATE POLICY "No public access to master credentials"
  ON master_credentials
  FOR ALL
  TO public
  USING (false);

-- Insert master credential (username: admin, password: Master@2024)
INSERT INTO master_credentials (username, password_hash, description)
VALUES (
  'admin',
  crypt('Master@2024', gen_salt('bf')),
  'Master administrator account'
)
ON CONFLICT (username) DO NOTHING;

-- Create function to validate master credentials
CREATE OR REPLACE FUNCTION validate_master_credentials(
  p_username text,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_password_hash text;
  v_is_active boolean;
BEGIN
  -- Get password hash and active status
  SELECT password_hash, is_active
  INTO v_password_hash, v_is_active
  FROM master_credentials
  WHERE username = p_username;

  -- Check if user exists and is active
  IF v_password_hash IS NULL OR v_is_active = false THEN
    RETURN false;
  END IF;

  -- Validate password
  IF v_password_hash = crypt(p_password, v_password_hash) THEN
    -- Update last used timestamp
    UPDATE master_credentials
    SET last_used_at = now()
    WHERE username = p_username;
    
    RETURN true;
  END IF;

  RETURN false;
END;
$$;