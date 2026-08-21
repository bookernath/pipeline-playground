'use strict';
// A dependency-free lint: no console.log in src/, every src file starts with 'use strict'.
const fs = require('node:fs');
const path = require('node:path');

let failures = 0;
for (const dir of ['src', 'bin']) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const text = fs.readFileSync(full, 'utf8');
    if (!/['"]use strict['"];/.test(text.split('\n').slice(0, 3).join('\n'))) {
      console.error(`${full}: missing 'use strict'`);
      failures++;
    }
    if (dir === 'src' && /console\.log\(/.test(text)) {
      console.error(`${full}: console.log is not allowed in src/`);
      failures++;
    }
  }
}
if (failures) process.exit(1);
console.log('lint ok');
