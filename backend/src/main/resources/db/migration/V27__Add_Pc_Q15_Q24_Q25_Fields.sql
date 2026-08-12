-- V27: Add missing Q15 (programme_monitored), Q24 (self_reliance_stable_income_count), and Q25 (self_reliance_trained_count) to pc_submissions table

ALTER TABLE pc_submissions ADD COLUMN programme_monitored BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE pc_submissions ADD COLUMN self_reliance_stable_income_count INT DEFAULT 0 NOT NULL;
ALTER TABLE pc_submissions ADD COLUMN self_reliance_trained_count INT DEFAULT 0 NOT NULL;
