-- Add receipts and receipt_items tables

CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  student_name TEXT,
  student_id TEXT,
  date DATE,
  payment_mode TEXT,
  transaction_id TEXT,
  amount_paid NUMERIC,
  balance NUMERIC,
  subtotal NUMERIC,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS receipt_items (
  id SERIAL PRIMARY KEY,
  receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS receipts_created_at_idx ON receipts(created_at);
