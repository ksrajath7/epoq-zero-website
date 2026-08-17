import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const DOMAIN = 'https://epoqzero.com';

const ignoreFiles = ['404.html'];

function generateSitemap() {
    console.log('🗺️ Generating sitemap...');

    const urls = [];

    // 1. Scan root directory
    const rootFiles = fs.readdirSync(PROJECT_ROOT);
    rootFiles.forEach(file => {
        if (file.endsWith('.html') && !ignoreFiles.includes(file)) {
            const name = file === 'index.html' ? '' : file.replace('.html', '');
            urls.push(`${DOMAIN}/${name}`);
        }
    });

    // 2. Scan projects directory
    const projectsDir = path.join(PROJECT_ROOT, 'projects');
    if (fs.existsSync(projectsDir)) {
        const projectFiles = fs.readdirSync(projectsDir);
        projectFiles.forEach(file => {
            if (file.endsWith('.html') && !ignoreFiles.includes(file)) {
                const name = file.replace('.html', '');
                urls.push(`${DOMAIN}/projects/${name}`);
            }
        });
    }

    // 3. Construct XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url === DOMAIN + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    // 4. Ensure public dir exists and write file
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR);
    }
    
    const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);
    
    console.log(`✅ Sitemap generated at: ${sitemapPath}`);
    console.log(`🔗 Total URLs: ${urls.length}`);
}

generateSitemap();
