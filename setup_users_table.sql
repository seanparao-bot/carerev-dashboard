-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('SuperAdmin', 'Admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert initial SuperAdmin (bcrypt hash of "admin123", rounds=10)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@carerev.com', '$2b$10$0ZoKOEAkFOkgaWk4hy4c2.TGmIq7WKM.8xJLJxQfMj.D4PVfBGaKC', 'SuperAdmin')
ON CONFLICT (email) DO NOTHING;
