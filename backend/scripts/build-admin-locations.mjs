import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourceDir = join(root, 'src/main/resources/location/source');
const outJson = join(root, 'src/main/resources/location/admin-locations-dataset.json');
const outSql = join(root, 'src/main/resources/db/migration/V9__Seed_Kampala_Ntungamo_Admin_Locations.sql');
const outMirrorSql = join(
  root,
  'src/main/resources/db/migration/V11__Mirror_Admin_Locations_To_Submission_Locations.sql'
);

function stableId(scope, ...parts) {
  const hash = createHash('sha256').update([scope, ...parts].join('\0')).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function titleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function pushLocation(locations, seen, entry) {
  if (seen.has(entry.id)) return;
  seen.add(entry.id);
  locations.push(entry);
}

function parseKampala(raw) {
  const locations = [];
  const seen = new Set();
  const districtName = titleCase(raw.district);
  const districtId = stableId('district', districtName);
  pushLocation(locations, seen, {
    id: districtId,
    name: districtName,
    parentId: null,
    level: 'DISTRICT',
  });

  for (const division of raw.divisions ?? []) {
    const subcountyName = titleCase(division.division);
    const subcountyId = stableId('subcounty', districtName, subcountyName);
    pushLocation(locations, seen, {
      id: subcountyId,
      name: subcountyName,
      parentId: districtId,
      level: 'SUBCOUNTY',
    });

    for (const parishBlock of division.parishes ?? []) {
      const parishName = titleCase(parishBlock.parish);
      const parishId = stableId('parish', districtName, subcountyName, parishName);
      pushLocation(locations, seen, {
        id: parishId,
        name: parishName,
        parentId: subcountyId,
        level: 'PARISH',
      });

      for (const villageNameRaw of parishBlock.villages ?? []) {
        const villageName = titleCase(villageNameRaw);
        const villageId = stableId('village', districtName, subcountyName, parishName, villageName);
        pushLocation(locations, seen, {
          id: villageId,
          name: villageName,
          parentId: parishId,
          level: 'VILLAGE',
        });
      }
    }
  }

  return locations;
}

function parseNtungamo(raw) {
  const locations = [];
  const seen = new Set();
  const districtName = titleCase(raw.district);
  const districtId = stableId('district', districtName);
  pushLocation(locations, seen, {
    id: districtId,
    name: districtName,
    parentId: null,
    level: 'DISTRICT',
  });

  for (const subcountyBlock of raw.subcounties ?? []) {
    const subcountyName = titleCase(subcountyBlock.subcounty);
    const subcountyId = stableId('subcounty', districtName, subcountyName);
    pushLocation(locations, seen, {
      id: subcountyId,
      name: subcountyName,
      parentId: districtId,
      level: 'SUBCOUNTY',
    });

    for (const parishBlock of subcountyBlock.parishes ?? []) {
      const parishName = titleCase(parishBlock.parish);
      const parishId = stableId('parish', districtName, subcountyName, parishName);
      pushLocation(locations, seen, {
        id: parishId,
        name: parishName,
        parentId: subcountyId,
        level: 'PARISH',
      });

      for (const villageNameRaw of parishBlock.villages ?? []) {
        const villageName = titleCase(villageNameRaw);
        const villageId = stableId('village', districtName, subcountyName, parishName, villageName);
        pushLocation(locations, seen, {
          id: villageId,
          name: villageName,
          parentId: parishId,
          level: 'VILLAGE',
        });
      }
    }
  }

  return locations;
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function toSql(locations) {
  const header = `-- Generated from location/source/*.json — Kampala + Ntungamo administrative units
TRUNCATE admin_locations CASCADE;

`;
  const values = locations
    .map((loc) => {
      const parent = loc.parentId ? `'${loc.parentId}'` : 'NULL';
      return `('${loc.id}', '${sqlEscape(loc.name)}', ${parent}, '${loc.level}')`;
    })
    .join(',\n');

  return `${header}INSERT INTO admin_locations (id, name, parent_id, level) VALUES\n${values};\n`;
}

function toMirrorSql() {
  return `-- Mirror canonical admin_locations (Kampala + Ntungamo) into submission locations FK table.
-- Generated alongside V9 by backend/scripts/build-admin-locations.mjs

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
`;
}

const kampala = JSON.parse(readFileSync(join(sourceDir, 'kampala_location_data.json'), 'utf8'));
const ntungamo = JSON.parse(readFileSync(join(sourceDir, 'ntungamo_location_data.json'), 'utf8'));
const locations = [...parseKampala(kampala), ...parseNtungamo(ntungamo)];

mkdirSync(dirname(outJson), { recursive: true });
writeFileSync(outJson, JSON.stringify({ locations }, null, 2));
writeFileSync(outSql, toSql(locations));
writeFileSync(outMirrorSql, toMirrorSql());

console.log(`Wrote ${locations.length} locations to:`);
console.log(`  ${outJson}`);
console.log(`  ${outSql}`);
console.log(`  ${outMirrorSql}`);
