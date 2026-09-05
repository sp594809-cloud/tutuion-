-- Question Papers Table for Cloudflare R2 / PDF Link Storage
CREATE TABLE IF NOT EXISTS question_papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  batch TEXT NOT NULL,
  file_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
