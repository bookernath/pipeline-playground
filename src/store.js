'use strict';
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_FILE = 'inventory.json';

function resolveFile(file) {
  return path.resolve(process.cwd(), file || process.env.INV_FILE || DEFAULT_FILE);
}

function load(file) {
  const target = resolveFile(file);
  if (!fs.existsSync(target)) return [];
  const raw = fs.readFileSync(target, 'utf8');
  const parsed = raw.trim() ? JSON.parse(raw) : [];
  if (!Array.isArray(parsed)) throw new Error(`${target} does not contain an array`);
  return parsed;
}

function save(items, file) {
  const target = resolveFile(file);
  fs.writeFileSync(target, JSON.stringify(items, null, 2) + '\n');
  return target;
}

module.exports = { load, save, resolveFile };
