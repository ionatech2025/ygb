-- Mirror canonical admin_locations (Kampala + Ntungamo) into submission locations FK table.
-- Collector forms, offline cache, and admin dashboard filters must share the same UUIDs.

DELETE FROM locations l
WHERE l.id IN (
    'd1111111-1111-1111-1111-111111111111',
    'e2222222-2222-2222-2222-222222222222',
    'b3333333-3333-3333-3333-333333333333',
    'f4444444-4444-4444-4444-444444444444'
)
AND NOT EXISTS (
    SELECT 1 FROM submissions s
    WHERE s.district_id = l.id
       OR s.subcounty_id = l.id
       OR s.parish_id = l.id
       OR s.village_id = l.id
);

INSERT INTO locations (id, name, type, parent_id)
SELECT id, name, level, parent_id
FROM admin_locations
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    type = EXCLUDED.type,
    parent_id = EXCLUDED.parent_id;
