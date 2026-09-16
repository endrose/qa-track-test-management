-- ============================================================
-- Migration: Hash plaintext passwords with bcrypt
-- Run this SQL on your PostgreSQL database to migrate
-- existing plaintext passwords to bcrypt hashes.
-- 
-- Default password for all migrated users: "password"
-- bcrypt hash (cost 12): $2b$12$aQMyQpMy8xSvrwo5.vr7OeafTvQni1dF/hu1wHNAmj.NeT.fWc2ri
-- ============================================================

-- Update users that still have plaintext passwords (not starting with $2b$)
UPDATE users
SET "passwordHash" = '$2b$12$aQMyQpMy8xSvrwo5.vr7OeafTvQni1dF/hu1wHNAmj.NeT.fWc2ri'
WHERE "passwordHash" NOT LIKE '$2%';

-- Verify the migration
SELECT id, email, name, role, status,
  CASE 
    WHEN "passwordHash" LIKE '$2%' THEN '✓ Hashed (bcrypt)'
    ELSE '✗ Plaintext (NOT SAFE)'
  END AS password_status
FROM users;
