'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { main, parseFlags } = require('../bin/inv');

function withTempStore(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-'));
  const prev = process.env.INV_FILE;
  process.env.INV_FILE = path.join(dir, 'inventory.json');
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.INV_FILE;
    else process.env.INV_FILE = prev;
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('parseFlags splits positionals and --flags', () => {
  assert.deepEqual(parseFlags(['A-1', 'Widget', '3', '--price', '150']), {
    positional: ['A-1', 'Widget', '3'],
    flags: { price: '150' },
  });
});

test('add then list round-trips through the store', () => {
  withTempStore(() => {
    assert.equal(main(['add', 'A-1', 'Widget', '3', '--price', '150']), 'added 3 x A-1\n');
    assert.match(main(['list']), /A-1\s+Widget\s+3\s+\$1\.50/);
  });
});

test('unknown command prints usage', () => {
  withTempStore(() => {
    assert.match(main(['nope']), /^usage:/);
  });
});
