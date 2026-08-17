import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const projectsDir = 'c:/Users/rajat/Documents/GitHub/nebula-app-studio/projects';
const files = readdirSync(projectsDir).filter(f => f.endsWith('.html') && f !== 'epoq-connect.html');

console.log(`Found ${files.length} project files to process.`);

function findSectionEnd(content, startIndex) {
  let depth = 1;
  let index = startIndex + 8; // skip "<section"
  
  while (depth > 0 && index < content.length) {
    const nextStart = content.indexOf('<section', index);
    const nextEnd = content.indexOf('</section>', index);
    
    if (nextEnd === -1) {
      break; // unbalanced tags
    }
    
    if (nextStart !== -1 && nextStart < nextEnd) {
      depth++;
      index = nextStart + 8;
    } else {
      depth--;
      index = nextEnd + 10;
    }
  }
  return index;
}

for (const file of files) {
  const filePath = join(projectsDir, file);
  const content = readFileSync(filePath, 'utf8');
  
  // We want to replace the content inside <main class="project-content">...</main>
  const mainRegex = /<main class="project-content">([\s\S]*?)<\/main>/;
  const mainMatch = content.match(mainRegex);
  if (!mainMatch) {
    console.log(`⚠️ Skip (no main class): ${file}`);
    continue;
  }
  
  const originalMain = mainMatch[1];
  let newMain = originalMain;
  
  // Find all sections: story-section, about, or creation-story inside main
  const secStartRegex = /<section class="(story-section|about|creation-story)"/g;
  let match;
  let sections = [];
  
  while ((match = secStartRegex.exec(originalMain)) !== null) {
    const startIndex = match.index;
    const endIndex = findSectionEnd(originalMain, startIndex);
    const originalSec = originalMain.substring(startIndex, endIndex);
    const secClass = match[1];
    
    sections.push({ originalSec, secClass });
  }
  
  let modifiedAny = false;
  let sideBySideCount = 0; // Track the index of side-by-side elements in this file for alternation
  
  for (const { originalSec, secClass } of sections) {
    // Check if the section contains a gallery-item
    if (!originalSec.includes('gallery-item')) {
      continue; // No image, leave as is
    }
    
    // Parse elements inside this section
    // We extract all paragraphs, tags, headings, and gallery-items in order
    const elementRegex = /(<div class="section-tag"[\s\S]*?<\/div>|<h2>[\s\S]*?<\/h2>|<p[\s\S]*?<\/p>|<div class="gallery-item[\s\S]*?<\/div>)/g;
    const elements = [...originalSec.matchAll(elementRegex)].map(m => m[0]);
    
    // Group elements by gallery-item boundaries
    let parts = [];
    let currentPart = { text: [], img: null };
    
    for (const el of elements) {
      if (el.includes('gallery-item')) {
        currentPart.img = el;
        parts.push(currentPart);
        currentPart = { text: [], img: null };
      } else {
        currentPart.text.push(el);
      }
    }
    if (currentPart.text.length > 0) {
      parts.push(currentPart);
    }
    
    // Construct the new HTML for this section
    let newSecHtml = '';
    for (const part of parts) {
      const textHtml = part.text.join('\n            ').trim();
      const imgHtml = part.img ? part.img.trim() : null;
      
      if (textHtml && imgHtml) {
        // Both text and image present -> side-by-side section!
        const isReversed = (sideBySideCount % 2 === 1);
        const reversedClass = isReversed ? ' reversed' : '';
        
        newSecHtml += `\n        <section class="${secClass} side-by-side${reversedClass}">\n            <div class="story-text">\n                ${textHtml}\n            </div>\n            ${imgHtml}\n        </section>\n`;
        sideBySideCount++;
      } else if (textHtml) {
        // Only text present -> standard section
        newSecHtml += `\n        <section class="${secClass}">\n            ${textHtml}\n        </section>\n`;
      } else if (imgHtml) {
        // Only image present -> standard section containing the image
        newSecHtml += `\n        <section class="${secClass}">\n            ${imgHtml}\n        </section>\n`;
      }
    }
    
    // Safe replacement using a function to avoid special character ($) interpretation
    newMain = newMain.replace(originalSec, () => newSecHtml.trim());
    modifiedAny = true;
  }
  
  if (modifiedAny) {
    // Replace main inside the file content safely
    const newContent = content.replace(mainRegex, () => `<main class="project-content">\n        ${newMain.trim()}\n    </main>`);
    writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Restructured: ${file}`);
  } else {
    console.log(`ℹ️ No changes needed: ${file}`);
  }
}
