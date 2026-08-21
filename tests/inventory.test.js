'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { addItem, removeItem, listItems, totalValueCents } = require('../src/inventory');

test('add creates and then increments', () => {
  let items = addItem([], { sku: 'A-1', name: 'Widget', qty: 2, priceCents: 150 });
  items = addItem(items, { sku: 'A-1', name: 'Widget', qty: 3 });
  assert.deepEqual(items, [{ sku: 'A-1', name: 'Widget', qty: 5, priceCents: 150 }]);
});

test('add validates inputs', () => {
  assert.throws(() => addItem([], { sku: 'bad sku', name: 'x', qty: 1 }), TypeError);
  assert.throws(() => addItem([], { sku: 'A-1', name: '', qty: 1 }), TypeError);
  assert.throws(() => addItem([], { sku: 'A-1', name: 'x', qty: 0 }), RangeError);
  assert.throws(() => addItem([], { sku: 'A-1', name: 'x', qty: 1, priceCents: -1 }), RangeError);
});

test('remove decrements and refuses to go negative', () => {
  const items = addItem([], { sku: 'B-2', name: 'Gadget', qty: 2 });
  assert.equal(removeItem(items, 'B-2', 1)[0].qty, 1);
  assert.throws(() => removeItem(items, 'B-2', 3), RangeError);
  assert.throws(() => removeItem(items, 'Z-9', 1), Error);
});

test('list sorts by sku and does not mutate', () => {
  const items = [
    { sku: 'Z-1', name: 'z', qty: 1, priceCents: 0 },
    { sku: 'A-1', name: 'a', qty: 1, priceCents: 0 },
  ];
  const snapshot = JSON.stringify(items);
  assert.deepEqual(listItems(items).map((i) => i.sku), ['A-1', 'Z-1']);
  assert.equal(JSON.stringify(items), snapshot);
});

test('total value', () => {
  const items = [
    { sku: 'A-1', name: 'a', qty: 2, priceCents: 150 },
    { sku: 'B-1', name: 'b', qty: 1, priceCents: 1000 },
  ];
  assert.equal(totalValueCents(items), 1300);
});
