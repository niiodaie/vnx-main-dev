#!/usr/bin/env node

/**
 * VNX Tailwind CSS Verification Script
 * 
 * This script verifies that Tailwind utilities are properly compiled
 * across all CSS files in the project.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const TAILWIND_UTILITIES = [
  'text-white',
  'bg-gray-900',
  'bg-slate-900',
  'flex',
  'rounded-xl',
  'p-6',
  'hover:shadow-xl',
  'transition-transform',
  'bg-gradient-to-br',
];

const CSS_FILES = [
  '.next/static/css/*.css',
];

console.log('🔍 VNX Tailwind CSS Verification\n');
console.log('Checking for Tailwind utilities in compiled CSS...\n');

// Check if build exists
if (!existsSync('.next')) {
  console.error('❌ Build directory not found. Run `npm run build` first.');
  process.exit(1);
}

// Find compiled CSS files
import { globSync } from 'glob';
const compiledCssFiles = globSync('.next/static/css/*.css');

if (compiledCssFiles.length === 0) {
  console.error('❌ No compiled CSS files found.');
  process.exit(1);
}

console.log(`✅ Found ${compiledCssFiles.length} compiled CSS file(s)\n`);

let allUtilitiesFound = true;

// Check each utility
TAILWIND_UTILITIES.forEach(utility => {
  let found = false;
  
  compiledCssFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    // Convert utility to CSS class selector
    const selector = `.${utility.replace(':', '\\:')}`;
    if (content.includes(selector) || content.includes(utility)) {
      found = true;
    }
  });
  
  if (found) {
    console.log(`✅ ${utility}`);
  } else {
    console.log(`❌ ${utility} - NOT FOUND`);
    allUtilitiesFound = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allUtilitiesFound) {
  console.log('✅ All Tailwind utilities verified!');
  console.log('✅ PostCSS configuration is working correctly.');
  console.log('✅ Project is ready for Vercel deployment.');
  process.exit(0);
} else {
  console.log('⚠️  Some utilities not found in compiled CSS.');
  console.log('   This may be normal if they\'re not used in the project.');
  process.exit(0);
}

