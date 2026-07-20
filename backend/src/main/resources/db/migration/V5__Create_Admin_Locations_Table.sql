-- V5: Create admin_locations table and seed with Uganda administrative locations

CREATE TABLE admin_locations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id UUID,
    level VARCHAR(50) NOT NULL,
    CONSTRAINT fk_admin_locations_parent FOREIGN KEY (parent_id) REFERENCES admin_locations(id)
);

-- Seed Districts
-- Kampala District
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('d2a5c167-07dd-46e4-ba34-469268af5100', 'Kampala', NULL, 'DISTRICT');

-- Wakiso District
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('d2a5c167-07dd-46e4-ba34-469268af5200', 'Wakiso', NULL, 'DISTRICT');

-- Gulu District
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('d2a5c167-07dd-46e4-ba34-469268af5300', 'Gulu', NULL, 'DISTRICT');


-- Seed Subcounties
-- Kampala District Subcounties (Divisions)
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('a2a5c167-07dd-46e4-ba34-469268af5101', 'Central Division', 'd2a5c167-07dd-46e4-ba34-469268af5100', 'SUBCOUNTY'),
('a2a5c167-07dd-46e4-ba34-469268af5102', 'Kawempe Division', 'd2a5c167-07dd-46e4-ba34-469268af5100', 'SUBCOUNTY');

-- Wakiso District Subcounties
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('a2a5c167-07dd-46e4-ba34-469268af5201', 'Entebbe Division', 'd2a5c167-07dd-46e4-ba34-469268af5200', 'SUBCOUNTY'),
('a2a5c167-07dd-46e4-ba34-469268af5202', 'Kira Division', 'd2a5c167-07dd-46e4-ba34-469268af5200', 'SUBCOUNTY');

-- Gulu District Subcounties
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('a2a5c167-07dd-46e4-ba34-469268af5301', 'Bardege Division', 'd2a5c167-07dd-46e4-ba34-469268af5300', 'SUBCOUNTY'),
('a2a5c167-07dd-46e4-ba34-469268af5302', 'Pece Division', 'd2a5c167-07dd-46e4-ba34-469268af5300', 'SUBCOUNTY');


-- Seed Parishes
-- Central Division Parishes
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('b2a5c167-07dd-46e4-ba34-469268af5111', 'Kisenyi I', 'a2a5c167-07dd-46e4-ba34-469268af5101', 'PARISH'),
('b2a5c167-07dd-46e4-ba34-469268af5112', 'Nakasero II', 'a2a5c167-07dd-46e4-ba34-469268af5101', 'PARISH');

-- Kawempe Division Parishes
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('b2a5c167-07dd-46e4-ba34-469268af5121', 'Bwaise I', 'a2a5c167-07dd-46e4-ba34-469268af5102', 'PARISH');

-- Entebbe Division Parishes
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('b2a5c167-07dd-46e4-ba34-469268af5211', 'Bugonga', 'a2a5c167-07dd-46e4-ba34-469268af5201', 'PARISH');


-- Seed Villages
-- Kisenyi I Villages
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('e2a5c167-07dd-46e4-ba34-469268af5131', 'Kakajjo Zone', 'b2a5c167-07dd-46e4-ba34-469268af5111', 'VILLAGE'),
('e2a5c167-07dd-46e4-ba34-469268af5132', 'Central Zone', 'b2a5c167-07dd-46e4-ba34-469268af5111', 'VILLAGE');

-- Bugonga Villages
INSERT INTO admin_locations (id, name, parent_id, level) VALUES
('e2a5c167-07dd-46e4-ba34-469268af5231', 'Bugonga Village A', 'b2a5c167-07dd-46e4-ba34-469268af5211', 'VILLAGE');
