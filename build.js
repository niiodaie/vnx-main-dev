#!/usr/bin/env node

// Simple build script for VNX Nexus static site
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Building VNX Nexus...');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static files to dist
const sourceFile = path.join(__dirname, 'frontend', 'index.html');
const destFile = path.join(distDir, 'index.html');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✓ Copied index.html to dist/');
} else {
  console.log('✓ Using embedded HTML in server');
}

console.log('✓ Build completed successfully');
console.log('✓ Ready for deployment');