import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(PROJECT_ROOT, '..');

async function deploy() {
    try {
        console.log('🚀 Pushing master branch to origin...');
        execSync('git push origin master', { stdio: 'inherit', cwd: REPO_ROOT });
        console.log('✅ Pushed master branch to origin.');

        console.log('🚀 Pushing deploy branch to origin...');
        execSync('git push origin deploy', { stdio: 'inherit', cwd: REPO_ROOT });
        console.log('✅ Pushed deploy branch to origin.');

        console.log('🎉 Successfully deployed changes to both master and deploy branches!');
    } catch (error) {
        console.error('❌ Deployment push failed:', error.message);
        process.exit(1);
    }
}

deploy();
