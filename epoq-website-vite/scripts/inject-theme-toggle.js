import fs from 'fs';
import path from 'path';

const projectsDir = './projects';

const earlyScript = `    <!-- Early theme detection to prevent flash of unstyled content (FOUC) -->
    <script>
        (function () {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        })();
    </script>
</head>`;

const themeScriptTag = `    <script type="module" src="/theme.js"></script>\n    <script type="module" src="/main.js"></script>`;

const files = fs.readdirSync(projectsDir);

files.forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already processed
    if (content.includes('theme-toggle')) {
        console.log(`Skipping ${file} - already has theme toggle.`);
        return;
    }

    console.log(`Processing ${file}...`);

    // 1. Inject Early Head Script
    content = content.replace('</head>', earlyScript);

    // 2. Inject Navbar Mobile Theme Toggle
    // We want to insert the mobile toggle button right before `<a href="/#contact" class="btn-primary mobile-only">Get in Touch</a>`
    // or `<a href="#contact" ...>`
    const mobileBtnRegex = /<a href="(?:\/)?#contact" class="btn-primary mobile-only">Get in Touch<\/a>/;
    const mobileToggleHtml = `<button class="theme-toggle mobile-only">
                <span class="theme-toggle-icon">🎨</span>
                <span class="theme-toggle-text">Comic Mode</span>
            </button>\n            `;
    
    if (mobileBtnRegex.test(content)) {
        content = content.replace(mobileBtnRegex, (match) => mobileToggleHtml + match);
    } else {
        console.warn(`Could not find mobile Get in Touch button in ${file}`);
    }

    // 3. Inject Navbar Desktop Theme Toggle
    // We want to wrap the desktop button in a flex container with the desktop toggle
    const desktopBtnRegex = /<a href="(?:\/)?#contact" class="btn-primary desktop-only">Get in Touch<\/a>/;
    
    if (desktopBtnRegex.test(content)) {
        content = content.replace(desktopBtnRegex, (match) => {
            return `<div style="display: flex; align-items: center; gap: 15px;">
            <button class="theme-toggle desktop-only">
                <span class="theme-toggle-icon">🎨</span>
                <span class="theme-toggle-text">Comic Mode</span>
            </button>
            ${match}
        </div>`;
        });
    } else {
        console.warn(`Could not find desktop Get in Touch button in ${file}`);
    }

    // 4. Inject Bottom Theme Script Tag
    const mainScriptRegex = /<script type="module" src="(?:\/)?main\.js"><\/script>/;
    if (mainScriptRegex.test(content)) {
        content = content.replace(mainScriptRegex, themeScriptTag);
    } else {
        // Try fallback with simple body end replacement
        if (content.includes('</body>')) {
            content = content.replace('</body>', `    <script type="module" src="/theme.js"></script>\n    <script type="module" src="/main.js"></script>\n</body>`);
        } else {
            console.warn(`Could not find main.js script tag or body end in ${file}`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${file}`);
});
console.log('All project files updated.');
