const fs = require('fs');

const filePath = './app/dashboard/learning/data/algorithm-patterns.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Simple replacement: add explanation after code blocks that don't have it
content = content.replace(
  /(\`[\s\S]*?\`\s*\}\s*\},?)\s*(practice|challenge)/g,
  '$1\n              explanation: "Example implementation of the algorithm pattern.",\n            $2'
);

fs.writeFileSync(filePath, content);
console.log('Added explanations to examples');