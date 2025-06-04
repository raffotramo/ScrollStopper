// Patch for import.meta.dirname compatibility in Node.js 20.18.1
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up global compatibility
globalThis.__serverDirname = path.resolve(__dirname, '..');

// Patch import.meta if dirname is undefined
if (typeof import.meta.dirname === 'undefined') {
  Object.defineProperty(import.meta, 'dirname', {
    get() { return globalThis.__serverDirname; },
    configurable: true
  });
}