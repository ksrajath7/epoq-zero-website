import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(PROJECT_ROOT, '..');
const TARGET_DIR = path.join(REPO_ROOT, 'docs');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

async function deploy() {
    try {
        console.log('🚀 Starting build...');
        execSync('npm run build', { stdio: 'inherit', cwd: PROJECT_ROOT });
        console.log('✅ Build completed.');

        if (!fs.existsSync(TARGET_DIR)) {
            console.log(`📁 Creating target docs directory: ${TARGET_DIR}`);
            fs.mkdirSync(TARGET_DIR, { recursive: true });
        }

        console.log(`🧹 Cleaning target directory: ${TARGET_DIR}`);
        const files = fs.readdirSync(TARGET_DIR);

        for (const file of files) {
            const filePath = path.join(TARGET_DIR, file);
            try {
                if (fs.statSync(filePath).isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
                console.log(`   Deleted: ${file}`);
            } catch (err) {
                console.warn(`   Could not delete ${file}: ${err.message}`);
            }
        }

        console.log(`📦 Copying files from ${DIST_DIR} to ${TARGET_DIR}`);
        copyRecursiveSync(DIST_DIR, TARGET_DIR);

        console.log('🐙 Performing git add, commit, and push in repository...');
        try {
            execSync('git add .', { stdio: 'inherit', cwd: REPO_ROOT });
            const commitMessage = generateCommitMessage(REPO_ROOT);
            const safeMessage = commitMessage.replace(/"/g, "'");
            console.log(`💬 Generated Commit Message: "${safeMessage}"`);
            execSync(`git commit -m "${safeMessage}"`, { stdio: 'inherit', cwd: REPO_ROOT });
            execSync('git push origin master', { stdio: 'inherit', cwd: REPO_ROOT });
        } catch (gitErr) {
            console.warn('⚠️ Git operations warning (possibly no changes to commit):', gitErr.message);
        }

        console.log('🎉 Deployment sync completed successfully!');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function generateCommitMessage(repoRoot) {
    try {
        const statusOutput = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf8' }).trim();
        if (!statusOutput) {
            return 'deploy: clean build update';
        }

        const lines = statusOutput.split('\n');
        const added = [];
        const modified = [];
        const deleted = [];

        for (const line of lines) {
            const status = line.substring(0, 2).trim();
            const filePath = line.substring(3).trim();
            const baseName = path.basename(filePath);

            if (status.includes('A') || status === '??') {
                added.push(baseName);
            } else if (status.includes('M')) {
                modified.push(baseName);
            } else if (status.includes('D')) {
                deleted.push(baseName);
            }
        }

        const parts = [];
        if (added.length > 0) {
            parts.push(`added ${added.slice(0, 3).join(', ')}${added.length > 3 ? '...' : ''}`);
        }
        if (modified.length > 0) {
            // Filter out compiled CSS and JS assets containing hash symbols in name
            const cleanModified = modified.filter(f => !f.match(/^(main|theme|style|project-style|epoq-connect)-.*\.(js|css)$/));
            const displayModified = cleanModified.length > 0 ? cleanModified : modified;
            parts.push(`updated ${displayModified.slice(0, 3).join(', ')}${displayModified.length > 3 ? '...' : ''}`);
        }
        if (deleted.length > 0) {
            const cleanDeleted = deleted.filter(f => !f.match(/^(main|theme|style|project-style|epoq-connect)-.*\.(js|css)$/));
            const displayDeleted = cleanDeleted.length > 0 ? cleanDeleted : deleted;
            parts.push(`deleted ${displayDeleted.slice(0, 3).join(', ')}${displayDeleted.length > 3 ? '...' : ''}`);
        }

        if (parts.length > 0) {
            return `deploy: ${parts.join('; ')}`;
        }
        return 'deploy: production build updates';
    } catch (err) {
        console.warn('⚠️ Could not generate custom commit message, using fallback:', err.message);
        return 'deploy: automatic site build update';
    }
}

deploy();
