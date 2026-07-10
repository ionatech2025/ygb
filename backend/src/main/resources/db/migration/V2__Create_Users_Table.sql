CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for testing
-- Admin user: 0770000000, Data Collector: 0771111111
-- password hashes can just be dummy for now, e.g. bcrypt hash of 'password'
-- bcrypt for 'password': $2a$10$rN2g7x1x9m9j1s7m9g2bA.3rX1v5j9b2e8r9c0z4f1v3j9b2e8r9c
INSERT INTO users (id, name, phone_number, password_hash, role, is_active, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Default Admin', '0770000000', '$2a$10$KHK5f8Lz/uT8/0S91J9LRe4hF/t08qH7wR/70P71k0T8y.4XJ7.sC', 'ADMIN', true, CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222222', 'Default Collector', '0771111111', '$2a$10$KHK5f8Lz/uT8/0S91J9LRe4hF/t08qH7wR/70P71k0T8y.4XJ7.sC', 'DATA_COLLECTOR', true, CURRENT_TIMESTAMP);
