import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync, readFileSync } from 'fs';

// Helper to get all HTML files in a directory
const getHtmlFiles = (dir) => {
  const files = readdirSync(resolve(__dirname, dir));
  return files
    .filter(file => file.endsWith('.html'))
    .reduce((acc, file) => {
      const name = file.replace('.html', '');
      acc[name] = resolve(__dirname, dir, file);
      return acc;
    }, {});
};

export default defineConfig({
  // Set base to './' for relative paths in GitHub Pages
  base: './',
  plugins: [
    {
      name: 'clean-urls-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const pathname = url.pathname;

            // Normalize path to check if corresponding HTML file exists on disk
            let targetFile = pathname;
            if (!pathname.includes('.') && pathname !== '/') {
              targetFile = pathname + '.html';
            }

            // If requesting an HTML file (or clean URL that resolves to HTML)
            if (targetFile.endsWith('.html') || !pathname.includes('.')) {
              const absolutePath = resolve(__dirname, targetFile.replace(/^\//, ''));

              if (!existsSync(absolutePath)) {
                // Read and serve 404.html directly to bypass Vite import analysis pipeline
                const content404 = readFileSync(resolve(__dirname, '404.html'), 'utf8');
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content404);
                return;
              } else if (!pathname.includes('.') && pathname !== '/') {
                // Valid clean URL, rewrite internally to direct HTML file
                req.url = pathname + '.html' + url.search;
              }
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '404': resolve(__dirname, '404.html'),
        about: resolve(__dirname, 'about.html'),
        brands: resolve(__dirname, 'brands.html'),
        'android-app-development-thrissur-kerala': resolve(__dirname, 'android-app-development-thrissur-kerala.html'),
        'best-mobile-app-development-company-in-kerala': resolve(__dirname, 'best-mobile-app-development-company-in-kerala.html'),
        'education-crm-software': resolve(__dirname, 'education-crm-software.html'),
        'real-estate-crm-software': resolve(__dirname, 'real-estate-crm-software.html'),
        'logistics-crm-software': resolve(__dirname, 'logistics-crm-software.html'),
        'multimedia-crm-software': resolve(__dirname, 'multimedia-crm-software.html'),
        'healthcare-crm-software': resolve(__dirname, 'healthcare-crm-software.html'),
        'retail-crm-software': resolve(__dirname, 'retail-crm-software.html'),
        'billing-crm-software': resolve(__dirname, 'billing-crm-software.html'),
        'travel-crm-software': resolve(__dirname, 'travel-crm-software.html'),
        ...getHtmlFiles('projects'),
      },
    },
  },
});
