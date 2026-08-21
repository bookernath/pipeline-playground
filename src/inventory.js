'use strict';

/**
 * Pure inventory model. Items are keyed by SKU. No I/O lives here.
 * @typedef {{ sku: string, name: string, qty: number, priceCents: number }} Item
 */

function assertSku(sku) {
  if (typeof sku !== 'string' || !/^[A-Z0-9-]{2,32}$/.test(sku)) {
    throw new TypeError('sku must be 2-32 uppercase letters, digits, or hyphens');
  }
}

function assertQty(qty) {
  if (!Number.isInteger(qty) || qty < 1) throw new RangeError('qty must be a positive integer');
}

/** @param {Item[]} items */
function addItem(items, { sku, name, qty, priceCents = 0 }) {
  assertSku(sku);
  assertQty(qty);
  if (typeof name !== 'string' || !name.trim()) throw new TypeError('name is required');
  if (!Number.isInteger(priceCents) || priceCents < 0) throw new RangeError('priceCents must be a non-negative integer');
  const next = items.map((i) => ({ ...i }));
  const existing = next.find((i) => i.sku === sku);
  if (existing) {
    existing.qty += qty;
    if (priceCents) existing.priceCents = priceCents;
  } else {
    next.push({ sku, name: name.trim(), qty, priceCents });
  }
  return next;
}

/** @param {Item[]} items */
function removeItem(items, sku, qty) {
  assertSku(sku);
  assertQty(qty);
  const existing = items.find((i) => i.sku === sku);
  if (!existing) throw new Error(`unknown sku ${sku}`);
  if (existing.qty < qty) throw new RangeError(`cannot remove ${qty} of ${sku}; only ${existing.qty} in stock`);
  return items.map((i) => (i.sku === sku ? { ...i, qty: i.qty - qty } : { ...i }));
}

/** @param {Item[]} items */
function listItems(items) {
  return items.map((i) => ({ ...i })).sort((a, b) => a.sku.localeCompare(b.sku));
}

/** @param {Item[]} items */
function totalValueCents(items) {
  return items.reduce((sum, i) => sum + i.qty * i.priceCents, 0);
}

module.exports = { addItem, removeItem, listItems, totalValueCents };
