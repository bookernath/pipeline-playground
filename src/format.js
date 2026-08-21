'use strict';

function money(cents) {
  return '$' + (cents / 100).toFixed(2);
}

/** Render items as a fixed-width table. Returns a string with a trailing newline. */
function renderTable(items) {
  if (!items.length) return '(empty)\n';
  const rows = items.map((i) => [i.sku, i.name, String(i.qty), money(i.priceCents)]);
  const header = ['SKU', 'NAME', 'QTY', 'PRICE'];
  const widths = header.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
  const line = (cols) => cols.map((v, c) => v.padEnd(widths[c])).join('  ').trimEnd();
  return [line(header), ...rows.map(line)].join('\n') + '\n';
}

module.exports = { renderTable, money };
