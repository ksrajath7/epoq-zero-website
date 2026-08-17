import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const rootDir = 'c:/Users/rajat/Documents/GitHub/nebula-app-studio';
const files = [
  'education-crm-software.html',
  'real-estate-crm-software.html',
  'logistics-crm-software.html',
  'multimedia-crm-software.html',
  'healthcare-crm-software.html',
  'retail-crm-software.html',
  'billing-crm-software.html'
];

for (const file of files) {
  const filePath = join(rootDir, file);
  try {
    let content = readFileSync(filePath, 'utf8');
    
    // Replace href="#contact" with href="/#contact"
    const originalCount = (content.match(/href="#contact"/g) || []).length;
    if (originalCount > 0) {
      content = content.replace(/href="#contact"/g, 'href="/#contact"');
      writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${originalCount} contact link(s) in ${file}`);
    } else {
      console.log(`ℹ️ No contact links found in ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
}

console.log('✅ Contact redirection setup complete!');
