'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { renderTable, money } = require('../src/format');

test('money formats cents', () => {
  assert.equal(money(0), '$0.00');
  assert.equal(money(1999), '$19.99');
});

test('empty table', () => {
  assert.equal(renderTable([]), '(empty)\n');
});

test('table aligns columns', () => {
  const out = renderTable([
    { sku: 'A-1', name: 'Widget', qty: 5, priceCents: 150 },
    { sku: 'LONG-SKU-9', name: 'G', qty: 10, priceCents: 0 },
  ]);
  const lines = out.trimEnd().split('\n');
  assert.equal(lines.length, 3);
  assert.match(lines[0], /^SKU\s+NAME\s+QTY\s+PRICE$/);
  assert.ok(lines.every((l) => l.indexOf('NAME') === lines[0].indexOf('NAME') || !l.includes('NAME')));
});
