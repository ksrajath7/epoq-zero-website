/**
 * generate-favicons.js
 * Generates PNG favicon files from the favicon.svg using sharp (if available)
 * or falls back to creating solid-color PNGs with the logo embedded.
 *
 * Run: node scripts/generate-favicons.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// Check if sharp is available
let sharp;
try {
    sharp = (await import('sharp')).default;
} catch {
    console.log('📦 sharp not found, installing...');
    execSync('npm install sharp --save-dev', { cwd: ROOT, stdio: 'inherit' });
    sharp = (await import('sharp')).default;
}

const svgPath = path.join(PUBLIC, 'favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
];

console.log('🎨 Generating favicons from favicon.svg...\n');

for (const { name, size } of sizes) {
    const outPath = path.join(PUBLIC, name);
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outPath);
    console.log(`  ✅ ${name} (${size}x${size})`);
}

console.log('\n✅ All favicon PNGs generated successfully!');
