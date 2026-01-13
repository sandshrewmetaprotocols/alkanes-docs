#!/usr/bin/env node

/**
 * Build script for documentation
 *
 * This script:
 * 1. Validates MDX files
 * 2. Generates navigation metadata
 * 3. Copies reference files
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'app', '[locale]', 'docs');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const META_DIR = path.join(PUBLIC_DIR, 'docs-meta');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Find all MDX files recursively
function findMdxFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findMdxFiles(fullPath, files);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Validate MDX file
function validateMdxFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // Check for H1 title
  if (!content.match(/^#\s+.+$/m)) {
    errors.push('Missing H1 title');
  }

  // Check for broken internal links (basic check)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[2];
    // Only check internal links
    if (href.startsWith('/') && !href.startsWith('//')) {
      // This is a basic check - in production you'd verify the path exists
      if (href.includes('undefined') || href.includes('null')) {
        errors.push(`Potentially broken link: ${href}`);
      }
    }
  }

  return errors;
}

// Generate navigation structure from file system
function generateNavigation() {
  const navigation = [];

  // Define the navigation structure
  const sections = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Introduction', href: '/docs' },
        { title: 'Quick Start', href: '/docs/quickstart' },
        { title: 'Installation', href: '/docs/installation' },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        { title: 'How Alkanes Work', href: '/docs/concepts/alkanes' },
        { title: 'Protorunes', href: '/docs/concepts/protorunes' },
        { title: 'DIESEL Token', href: '/docs/concepts/diesel' },
      ],
    },
    {
      title: 'CLI Reference',
      items: [
        { title: 'Overview', href: '/docs/cli' },
        { title: 'Wallet Commands', href: '/docs/cli/wallet' },
        { title: 'Deploy Commands', href: '/docs/cli/deploy' },
      ],
    },
    {
      title: 'Subfrost API',
      items: [
        { title: 'Overview', href: '/docs/api' },
        { title: 'REST Endpoints', href: '/docs/api/rest' },
        { title: 'JSON-RPC', href: '/docs/api/jsonrpc' },
      ],
    },
    {
      title: 'Building Contracts',
      items: [
        { title: 'Project Setup', href: '/docs/contracts/setup' },
        { title: 'Storage & State', href: '/docs/contracts/storage' },
        { title: 'Testing', href: '/docs/contracts/testing' },
      ],
    },
    {
      title: 'Tutorials',
      items: [
        { title: 'Wrap/Unwrap BTC', href: '/docs/tutorials/wrap-btc' },
        { title: 'Build a Token', href: '/docs/tutorials/token' },
      ],
    },
  ];

  return sections;
}

// Copy reference files from alkanes-rs (if available)
function copyReferenceFiles() {
  const alkanesRsDir = path.join(PROJECT_ROOT, 'reference', 'alkanes-rs');
  const luaExamplesDir = path.join(alkanesRsDir, 'lua');
  const destDir = path.join(PUBLIC_DIR, 'lua-examples');

  if (fs.existsSync(luaExamplesDir)) {
    ensureDir(destDir);

    const files = fs.readdirSync(luaExamplesDir);
    for (const file of files) {
      if (file.endsWith('.lua')) {
        const src = path.join(luaExamplesDir, file);
        const dest = path.join(destDir, file);
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${file}`);
      }
    }
  } else {
    console.log('alkanes-rs reference not found, skipping Lua examples copy');
  }
}

// Main
function main() {
  console.log('Building documentation...\n');

  ensureDir(META_DIR);
  ensureDir(PUBLIC_DIR);

  // Find and validate MDX files
  console.log('Validating MDX files...');
  const mdxFiles = findMdxFiles(DOCS_DIR);
  let hasErrors = false;

  for (const file of mdxFiles) {
    const relativePath = path.relative(PROJECT_ROOT, file);
    const errors = validateMdxFile(file);

    if (errors.length > 0) {
      console.warn(`\n  ${relativePath}:`);
      errors.forEach(err => console.warn(`    - ${err}`));
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log(`  ✓ All ${mdxFiles.length} files valid`);
  }

  // Generate navigation
  console.log('\nGenerating navigation...');
  const navigation = generateNavigation();
  const navPath = path.join(META_DIR, 'navigation.json');
  fs.writeFileSync(navPath, JSON.stringify(navigation, null, 2));
  console.log(`  ✓ Wrote ${navPath}`);

  // Copy reference files
  console.log('\nCopying reference files...');
  copyReferenceFiles();

  console.log('\n✓ Documentation build complete!');
}

main();
