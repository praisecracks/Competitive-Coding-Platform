const fs = require('fs');
const path = 'frontend-nextjs/app/dashboard/learning/data/algorithm-patterns.ts';
const fullPath = path;
const str = fs.readFileSync(fullPath, 'utf8');

let result = '';
let pos = 0;
const codeKey = 'code:';

while (true) {
  let idx = str.indexOf(codeKey, pos);
  if (idx === -1) {
    result += str.slice(pos);
    break;
  }
  // Append everything up to and including 'code:'
  result += str.slice(pos, idx + codeKey.length);
  let cursor = idx + codeKey.length;
  // Capture whitespace after colon
  while (cursor < str.length && str[cursor] === ' ') {
    result += ' ';
    cursor++;
  }
  if (cursor >= str.length || str[cursor] !== '`') {
    // No backtick after code:, just continue copying
    pos = cursor;
    continue;
  }
  // Opening backtick found at cursor
  result += '`'; // include opening backtick
  const contentStart = cursor + 1;
  let searchPos = contentStart;
  let foundClosing = false;
  while (searchPos < str.length) {
    const nextBack = str.indexOf('`', searchPos);
    if (nextBack === -1) break;
    const after = str.slice(nextBack + 1);
    if (/^\s*,/.test(after)) {
      // Found closing backtick
      const content = str.substring(contentStart, nextBack);
      const escaped = content
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
      result += escaped;
      result += '`'; // closing backtick
      pos = nextBack + 1; // continue after closing backtick
      foundClosing = true;
      break;
    } else {
      searchPos = nextBack + 1;
    }
  }
  if (!foundClosing) {
    result += str.slice(contentStart);
    break;
  }
}

fs.writeFileSync(fullPath, result, 'utf8');
console.log('Fixed algorithm-patterns.ts');
