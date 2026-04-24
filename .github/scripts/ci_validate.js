#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
let hasError = false;

const requiredFiles = [
  'README.md',
  'index.html',
  'donate.html',
  'share.html',
  'donors.json',
  path.join('certificates', 'data.json'),
  path.join('css', 'style.css'),
  path.join('js', 'script.js')
];

const requiredDirs = ['images', 'css', 'js', 'certificates'];

function fail(message) {
  hasError = true;
  console.error(`ERROR: ${message}`);
}

for (const dir of requiredDirs) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full) || !fs.statSync(full).isDirectory()) {
    fail(`Missing required directory: ${dir}`);
  }
}

for (const file of requiredFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    fail(`Missing required file: ${file}`);
  }
}

function validateJson(filePath) {
  const full = path.join(root, filePath);
  if (!fs.existsSync(full)) return;

  try {
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (filePath === 'donors.json') {
      if (!Array.isArray(data.donors)) {
        fail('donors.json must contain a donors array');
      }
    }
  } catch (error) {
    fail(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

validateJson('donors.json');
validateJson(path.join('certificates', 'data.json'));

const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith('.html'));
if (htmlFiles.length < 5) {
  fail('Expected at least 5 HTML pages in repository root');
}

if (hasError) {
  process.exit(1);
}

console.log('Repository structure and JSON validation passed.');
