-- Jul 2026 client change (PDM §1 item 6): normalize mixed-case roman numeral suffixes
-- in Kampala and Ntungamo admin location labels to lowercase roman numerals.
--
-- Rule applied to every matching row in admin_locations (IDs unchanged):
--   "... I"   -> "... i"     e.g. Kamwokya I -> Kamwokya i
--   "... Ii"  -> "... ii"    e.g. Kamwokya Ii -> Kamwokya ii
--   "... Iii" -> "... iii"   e.g. Kisenyi Iii -> Kisenyi iii
--   "... Iv"  -> "... iv"    e.g. Kololo Iv -> Kololo iv
--   "... V"   -> "... v"     e.g. Kasenke V -> Kasenke v
--
-- Spot-check parish examples (Central Division, Kampala):
--   496f65c7-febe-4b6a-8f7e-aa23e0041597: Kamwokya I -> Kamwokya i
--   33ff1b1b-0691-4c48-8925-d04ef4f6391f: Kamwokya Ii -> Kamwokya ii
--   aca0e9f2-89dd-49fc-8099-e227011e9547: Kisenyi I -> Kisenyi i
--
-- Spot-check village examples (Kampala Central parish):
--   dce3381a-41e6-44ff-848c-183b40754a9f: Kakajjo Ii -> Kakajjo ii
--   9c3f92ce-4ed6-4fbd-8e08-3c9ab862d89e: Namaalwa I -> Namaalwa i
--
-- Spot-check Ntungamo examples:
--   7a79b74b-4f5f-425f-8188-c7a975410980: Nyakihanga I -> Nyakihanga i
--   fb70edd4-d716-4f2f-827d-9295513cac07: Nyakihanga Ii -> Nyakihanga ii
--
-- Order matters: longest suffix first so "Ii" is not partially matched as "I".

UPDATE admin_locations SET name = regexp_replace(name, ' Iii$', ' iii') WHERE name ~ ' Iii$';
UPDATE admin_locations SET name = regexp_replace(name, ' Ii$', ' ii') WHERE name ~ ' Ii$';
UPDATE admin_locations SET name = regexp_replace(name, ' Iv$', ' iv') WHERE name ~ ' Iv$';
UPDATE admin_locations SET name = regexp_replace(name, ' V$', ' v') WHERE name ~ ' V$';
UPDATE admin_locations SET name = regexp_replace(name, ' I$', ' i') WHERE name ~ ' I$';

-- Keep submission FK location mirror in sync (collector forms reference locations.id).
UPDATE locations AS l
SET name = al.name
FROM admin_locations AS al
WHERE l.id = al.id
  AND l.name IS DISTINCT FROM al.name;
