/*
  # Add cover photo field to users table

  1. Changes
    - Add `cover_photo` field to users table for cover image URLs
    - Update existing users to have null cover_photo initially

  2. Security
    - No RLS changes needed as users table policies already exist
*/

-- Add cover_photo field to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'cover_photo'
  ) THEN
    ALTER TABLE users ADD COLUMN cover_photo text;
  END IF;
END $$;

-- Add index for cover_photo field
CREATE INDEX IF NOT EXISTS idx_users_cover_photo ON users(cover_photo) WHERE cover_photo IS NOT NULL;