import fs from 'fs';
import path from 'path';

const projectsDir = './projects';
const files = fs.readdirSync(projectsDir);

files.forEach(file => {
    if (!file.endsWith('.html')) return;
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('class="theme-toggle-icon">🎨')) {
        content = content.replaceAll('class="theme-toggle-icon">🎨', 'class="theme-toggle-icon">🦸');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated icon in ${file}`);
    }
});
console.log('Done updating project files.');
