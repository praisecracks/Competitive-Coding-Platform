import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '..', 'app', 'dashboard', 'learning', 'data.ts');

let content = readFileSync(filePath, 'utf8');

let pattern = /code: "/g;
let lastIndex = 0;
let result = '';
let match;

while ((match = pattern.exec(content)) !== null) {
    // Append text before the match
    result += content.slice(lastIndex, match.index);

    // Find the end of the string (closing quote followed by comma)
    let i = match.index + match[0].length; // position after opening quote
    let escaped = false;
    let endQuote = -1;

    while (i < content.length) {
        let ch = content[i];
        if (escaped) {
            escaped = false;
        } else if (ch === '\\') {
            escaped = true;
        } else if (ch === '"') {
            if (content[i + 1] === ',') {
                endQuote = i;
                break;
            }
        }
        i++;
    }

    if (endQuote === -1) {
        // No proper closing found; keep original and move on
        result += match[0];
        lastIndex = match.index + match[0].length;
        continue;
    }

    // Extract inner content (between the quotes)
    let inner = content.slice(match.index + match[0].length, endQuote);
    // Replace actual newlines with escaped \n
    let transformed = inner.replace(/\r?\n/g, '\\n');
    // Write replacement
    result += `code: "${transformed}",`;
    // Move past closing quote and comma
    lastIndex = endQuote + 2;
}

result += content.slice(lastIndex);

writeFileSync(filePath, result, 'utf8');
console.log('Fixed multi-line code strings in data.ts');
