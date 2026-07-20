-- V6: Track server receipt time for successfully synced submissions

ALTER TABLE submissions
    ADD COLUMN synced_at TIMESTAMP;

-- Best-effort backfill for existing SYNCED rows (no historical server timestamp available)
UPDATE submissions
SET synced_at = form_completed_at
WHERE status = 'SYNCED';
