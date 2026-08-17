/**
 * inject-canonicals.js
 * Automatically injects <link rel="canonical"> and <meta property="og:url">
 * into every HTML page that is missing them.
 *
 * This fixes the Google Search Console "Duplicate without user-selected canonical" issue.
 *
 * URL format matches sitemap.xml (no trailing .html):
 *   index.html           → https://epoqzero.com/
 *   about.html           → https://epoqzero.com/about
 *   education-crm-software.html → https://epoqzero.com/education-crm-software
 *   projects/ad-din.html → https://epoqzero.com/projects/ad-din
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'https://epoqzero.com';

const ignoreFiles = ['404.html'];

/**
 * Derive the canonical URL for a given file path.
 */
function getCanonicalUrl(filePath) {
    const rel = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');

    if (rel === 'index.html') return `${DOMAIN}/`;

    // Strip .html extension and build clean URL
    const clean = rel.replace(/\.html$/, '');
    return `${DOMAIN}/${clean}`;
}

/**
 * Inject canonical + og:url into an HTML file if they are missing.
 * Replaces any incorrect canonical (e.g., with .html suffix) with the correct one.
 */
function processFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const canonicalUrl = getCanonicalUrl(filePath);

    // Build the tags we want
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}">`;
    const ogUrlTag = `<meta property="og:url" content="${canonicalUrl}">`;

    let changed = false;

    // --- Handle canonical ---
    const existingCanonical = html.match(/<link\s+rel="canonical"[^>]*>/i);
    if (existingCanonical) {
        // Replace whatever is there with the correct one
        const corrected = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag);
        if (corrected !== html) {
            html = corrected;
            changed = true;
            console.log(`  ✏️  Fixed canonical → ${canonicalUrl}`);
        }
    } else {
        // Inject before </head>
        html = html.replace('</head>', `    ${canonicalTag}\n</head>`);
        changed = true;
        console.log(`  ➕ Added canonical → ${canonicalUrl}`);
    }

    // --- Handle og:url ---
    const existingOgUrl = html.match(/<meta\s+property="og:url"[^>]*>/i);
    if (existingOgUrl) {
        const corrected = html.replace(/<meta\s+property="og:url"[^>]*>/i, ogUrlTag);
        if (corrected !== html) {
            html = corrected;
            changed = true;
            console.log(`  ✏️  Fixed og:url   → ${canonicalUrl}`);
        }
    } else {
        // Inject after the canonical tag
        html = html.replace(canonicalTag, `${canonicalTag}\n    ${ogUrlTag}`);
        changed = true;
        console.log(`  ➕ Added og:url   → ${canonicalUrl}`);
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
    } else {
        console.log(`  ✅ Already correct`);
    }
}

function run() {
    console.log('🔗 Injecting canonical & og:url tags...\n');

    const fileSets = [
        // Root HTML files
        ...fs.readdirSync(PROJECT_ROOT)
            .filter(f => f.endsWith('.html') && !ignoreFiles.includes(f))
            .map(f => path.join(PROJECT_ROOT, f)),

        // projects/ HTML files
        ...(() => {
            const pDir = path.join(PROJECT_ROOT, 'projects');
            if (!fs.existsSync(pDir)) return [];
            return fs.readdirSync(pDir)
                .filter(f => f.endsWith('.html') && !ignoreFiles.includes(f))
                .map(f => path.join(pDir, f));
        })(),
    ];

    let total = 0;
    for (const filePath of fileSets) {
        const rel = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
        console.log(`📄 ${rel}`);
        processFile(filePath);
        total++;
        console.log('');
    }

    console.log(`\n✅ Done. Processed ${total} HTML files.`);
}

run();
