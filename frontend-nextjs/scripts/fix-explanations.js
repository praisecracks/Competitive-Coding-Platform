const fs = require('fs');

const filePath = './app/dashboard/learning/data/algorithm-patterns.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all examples that end with just code and } with code, explanation }
content = content.replace(
  /`([^`]*)`\s*\}\s*\},?\s*(practice|challenge|\})/g,
  (match, codeContent, nextProp) => {
    // Check if explanation already exists
    if (match.includes('explanation:')) {
      return match;
    }
    return `\`${codeContent}\`,
              explanation: "Example implementation demonstrating the algorithm pattern."
            },${nextProp === '}' ? '' : '\n            ' + nextProp}`;
  }
);

fs.writeFileSync(filePath, content);
console.log('Fixed all missing explanations');