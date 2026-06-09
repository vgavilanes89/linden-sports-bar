import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiUrl =
  'https://tumenu.online/api/all/menu/web/7110eda4d09e062aa5e4a390b0a572ac0d2c02221';

const res = await fetch(apiUrl);
const data = await res.json();

console.log('Top-level keys:', Object.keys(data));
if (Array.isArray(data)) {
  console.log('Array length:', data.length);
  console.log('First item keys:', Object.keys(data[0] || {}));
  console.log('Sample:', JSON.stringify(data[0], null, 2).slice(0, 2000));
} else {
  console.log('Sample:', JSON.stringify(data, null, 2).slice(0, 3000));
}

const outPath = path.join(__dirname, '..', 'src', 'data', 'menu-data.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log('Saved to', outPath);
