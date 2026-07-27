-- V2 seed users shipped with a bcrypt hash that does not verify against the documented password "password".
UPDATE users
SET password_hash = '$2a$10$D5EX9kumkFbIks0gLxG8OeCGWc6xA9o0erBj2gqwmc9sxucDcB9g2'
WHERE phone_number IN ('0770000000', '0771111111');
