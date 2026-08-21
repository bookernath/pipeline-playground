#!/usr/bin/env node
'use strict';
const { addItem, removeItem, listItems } = require('../src/inventory');
const { load, save } = require('../src/store');
const { renderTable } = require('../src/format');

function usage() {
  return [
    'usage:',
    '  inv add <sku> <name> <qty> [--price <cents>]',
    '  inv remove <sku> <qty>',
    '  inv list',
  ].join('\n') + '\n';
}

function parseFlags(args) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      flags[args[i].slice(2)] = args[i + 1];
      i++;
    } else positional.push(args[i]);
  }
  return { positional, flags };
}

function main(argv) {
  const [cmd, ...rest] = argv;
  const { positional, flags } = parseFlags(rest);
  const items = load();
  switch (cmd) {
    case 'add': {
      const [sku, name, qty] = positional;
      const next = addItem(items, { sku, name, qty: Number(qty), priceCents: flags.price ? Number(flags.price) : 0 });
      save(next);
      return `added ${qty} x ${sku}\n`;
    }
    case 'remove': {
      const [sku, qty] = positional;
      save(removeItem(items, sku, Number(qty)));
      return `removed ${qty} x ${sku}\n`;
    }
    case 'list':
      return renderTable(listItems(items));
    default:
      return usage();
  }
}

if (require.main === module) {
  try {
    process.stdout.write(main(process.argv.slice(2)));
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(1);
  }
}

module.exports = { main, parseFlags };
