#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
let errors = [];

const htmlFiles = [
  ...fs.readdirSync(root).filter(name => name.endsWith('.html')).map(name => path.join(root, name)),
  ...fs.readdirSync(path.join(root, 'admin')).filter(name => name.endsWith('.html')).map(name => path.join(root, 'admin', name))
];

function shouldSkip(ref) {
  if (!ref || ref.startsWith('#')) return true;
  const lower = ref.toLowerCase();
  return lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('javascript:') ||
    ref.includes('${');
}

function stripQueryAndHash(ref) {
  return ref.split('#')[0].split('?')[0];
}

for (const filePath of htmlFiles) {
  const fileDir = path.dirname(filePath);
  const relFile = path.relative(root, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  const matches = content.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g);
  for (const match of matches) {
    const rawRef = match[1].trim();
    if (shouldSkip(rawRef)) continue;

    const cleanRef = stripQueryAndHash(rawRef);
    if (!cleanRef) continue;

    let target;
    if (cleanRef.startsWith('/')) {
      target = path.join(root, cleanRef.replace(/^\/+/, ''));
    } else {
      target = path.resolve(fileDir, cleanRef);
    }

    if (!fs.existsSync(target)) {
      errors.push(`${relFile}: missing reference -> ${rawRef}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Broken local references found:');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

console.log('Local link and asset reference check passed.');
