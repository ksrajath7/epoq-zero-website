import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Define directories
const rootDir = 'c:/Users/rajat/Documents/GitHub/nebula-app-studio';
const projectsDir = join(rootDir, 'projects');

// Get all html files in root
const rootFiles = readdirSync(rootDir).filter(f => f.endsWith('.html'));
// Get all html files in projects
const projectFiles = readdirSync(projectsDir).filter(f => f.endsWith('.html'));

console.log(`Found ${rootFiles.length} root HTML files and ${projectFiles.length} project HTML files.`);

function cleanUrlInContent(content, filename) {
  let count = 0;
  // Regex to match href="any_path.html" with optional query or hash parameters
  const newContent = content.replace(/href="([^"]+?\.html)(#[^"]*|\?[^"]*)?"/g, (match, path, hash = '') => {
    count++;
    
    // 1. If it refers to index.html, rewrite to homepage '/'
    if (path.endsWith('index.html')) {
      const homeLink = path.startsWith('/') ? '/' : '/';
      return `href="${homeLink}${hash}"`;
    }
    
    // 2. Otherwise, simply remove the .html extension
    const cleanPath = path.substring(0, path.length - 5);
    return `href="${cleanPath}${hash}"`;
  });
  
  if (count > 0) {
    console.log(`✨ Replaced ${count} link(s) in ${filename}`);
  }
  return newContent;
}

// Process root files
for (const file of rootFiles) {
  const filePath = join(rootDir, file);
  const content = readFileSync(filePath, 'utf8');
  const newContent = cleanUrlInContent(content, file);
  writeFileSync(filePath, newContent, 'utf8');
}

// Process project files
for (const file of projectFiles) {
  const filePath = join(projectsDir, file);
  const content = readFileSync(filePath, 'utf8');
  const newContent = cleanUrlInContent(content, `projects/${file}`);
  writeFileSync(filePath, newContent, 'utf8');
}

console.log('✅ Clean URL migration complete!');
