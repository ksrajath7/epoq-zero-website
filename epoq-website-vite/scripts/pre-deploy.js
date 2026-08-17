import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(PROJECT_ROOT, '..');
const TARGET_DIR = path.join(REPO_ROOT, 'docs');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

async function predeploy() {
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

        console.log('🐙 Checking for repository changes and syncing...');
        try {
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
            console.log(`📍 Current branch: ${currentBranch}`);

            execSync('git add .', { stdio: 'inherit', cwd: REPO_ROOT });
            const statusOutput = execSync('git status --porcelain', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

            if (statusOutput) {
                const commitMessage = generateCommitMessage(statusOutput);
                const safeMessage = commitMessage.replace(/"/g, "'");
                console.log(`💬 Generated Commit Message: "${safeMessage}"`);
                execSync(`git commit -m "${safeMessage}"`, { stdio: 'inherit', cwd: REPO_ROOT });
                console.log('✅ Committed changes.');
            } else {
                console.log('ℹ️ No changes detected to commit (working tree clean).');
            }

            if (currentBranch === 'master') {
                console.log('ℹ️ Already on master branch. Git add & commit completed (no push).');
            } else {
                console.log(`🔀 Merging '${currentBranch}' into master...`);
                execSync('git checkout master', { stdio: 'inherit', cwd: REPO_ROOT });
                execSync(`git merge ${currentBranch}`, { stdio: 'inherit', cwd: REPO_ROOT });
                console.log(`✅ Successfully merged '${currentBranch}' into master.`);
                execSync(`git checkout ${currentBranch}`, { stdio: 'inherit', cwd: REPO_ROOT });
                console.log(`🔄 Switched back to '${currentBranch}'.`);
            }
        } catch (gitErr) {
            console.warn('⚠️ Git operations warning:', gitErr.message);
        }

        console.log('🎉 Pre-deployment sync completed successfully!');

    } catch (error) {
        console.error('❌ Pre-deployment failed:', error.message);
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

function generateCommitMessage(statusOutput) {
    try {
        if (!statusOutput) {
            return 'pre-deploy: clean build update';
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
            return `pre-deploy: ${parts.join('; ')}`;
        }
        return 'pre-deploy: production build updates';
    } catch (err) {
        console.warn('⚠️ Could not generate custom commit message, using fallback:', err.message);
        return 'pre-deploy: automatic site build update';
    }
}

predeploy();
