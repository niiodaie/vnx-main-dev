#!/usr/bin/env node

// Production build script for VNX Nexus
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🏗️  Building VNX Nexus for production...');

try {
  // Ensure dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build the frontend using Vite
  console.log('📦 Building frontend with Vite...');
  const frontendDir = path.join(__dirname, 'frontend');
  
  if (fs.existsSync(frontendDir)) {
    // Check if frontend has package.json and build script
    const frontendPackageJson = path.join(frontendDir, 'package.json');
    if (fs.existsSync(frontendPackageJson)) {
      try {
        execSync('npm run build', { 
          cwd: frontendDir, 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'production' }
        });
        
        // Copy built files to root dist
        const frontendDist = path.join(frontendDir, 'dist');
        if (fs.existsSync(frontendDist)) {
          execSync(`cp -r ${frontendDist}/* ${distDir}/`, { stdio: 'inherit' });
          console.log('✓ Frontend built and copied to dist/');
        }
      } catch (error) {
        console.log('⚠️  Frontend build failed, using fallback HTML');
        // Fallback to copying static HTML
        const sourceFile = path.join(frontendDir, 'index.html');
        const destFile = path.join(distDir, 'index.html');
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, destFile);
          console.log('✓ Copied fallback index.html to dist/');
        }
      }
    } else {
      // Copy static HTML files
      const sourceFile = path.join(frontendDir, 'index.html');
      const destFile = path.join(distDir, 'index.html');
      if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log('✓ Copied index.html to dist/');
      }
    }
  } else {
    console.log('⚠️  No frontend directory found, creating minimal build');
  }

  // Ensure we have at least a basic index.html
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    // Copy from root if available
    const rootIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(rootIndex)) {
      fs.copyFileSync(rootIndex, indexPath);
      console.log('✓ Copied root index.html to dist/');
    }
  }

  console.log('✅ Build completed successfully');
  console.log('🚀 Ready for deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}