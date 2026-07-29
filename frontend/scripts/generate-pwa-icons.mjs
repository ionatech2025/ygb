import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));

await sharp(svg).resize(192, 192).png().toFile(join(publicDir, 'pwa-192.png'));
await sharp(svg).resize(512, 512).png().toFile(join(publicDir, 'pwa-512.png'));

console.log('Generated pwa-192.png and pwa-512.png from favicon.svg');
