import { LearningTrack } from "../data";

export const masterJavascript: LearningTrack = {
  id: "master-javascript",
  title: "Master JavaScript",
  subtitle: "Beginner to Advanced",
  description: "Complete JavaScript journey from basics to building real applications. Every concept taught with clear examples you can run instantly.",
  type: "master_track",
  icon: "Code2",
  color: "yellow",
  coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=600",
  totalHours: 32,
  language: "javascript",
  category: "JavaScript",
  topics: [
    {
      id: "js-intro",
      title: "Introduction to JavaScript",
      description: "What is JavaScript and how it powers the web",
      duration: "30 min",
      subtopics: [
        {
          id: "js-what-is",
          title: "What is JavaScript?",
          content: {
            explanation: [
              "JavaScript is a programming language that makes websites interactive. Alongside HTML (structure) and CSS (style), JavaScript adds behavior: clicking buttons, submitting forms, animating elements, fetching data from servers, and much more.",
              "",
              "Originally created for browsers, JavaScript now runs almost everywhere: servers (Node.js), mobile apps (React Native), desktop apps (Electron), and even databases (MongoDB).",
              "",
              "**Key characteristics:**",
              "• Interpreted (no compilation step needed)",
              "• Dynamically typed (variables can hold any type)",
              "• Single-threaded but asynchronous",
              "• Prototype-based (objects inherit from other objects)",
              "• First-class functions (functions can be passed as values)"
            ],
            example: {
              title: "Your First JavaScript",
              code: `// This is a comment - it's ignored by the computer
console.log("Hello, World!");

// JavaScript can do math
console.log(2 + 2);  // 4

// And work with text
console.log("Hello" + " " + "JavaScript");`,
              explanation: "`console.log()` prints values - it's how developers debug and verify their code works. You can run this code directly in the CodeMaster playground!"
            },
            practice: "Write `console.log('Learning JavaScript!')` and run it in the playground."
          }
        },
        {
          id: "js-how-runs",
          title: "How JavaScript Runs in the Browser",
          content: {
            explanation: [
              "**Note: This topic explains browser concepts. The code examples are conceptual and won't run in the playground, but the explanations are valuable for understanding JavaScript's environment.**",
              "",
              "When you load a webpage, the browser reads HTML, CSS, and JavaScript. The JavaScript engine (V8 in Chrome, SpiderMonkey in Firefox) executes your code line by line.",
              "",
              "JavaScript runs inside an environment that provides:",
              "• `console` object for logging",
              "• `document` object to manipulate HTML",
              "• `window` object (global) with timers (`setTimeout`, `setInterval`) and more",
              "• `fetch` for network requests",
              "",
              "**In the CodeMaster playground, you have a pure JavaScript environment without HTML/CSS, but you can still use timers, fetch, and console!**"
            ],
            example: {
              title: "Pure JavaScript That Works in Playground",
              code: `// These work in the playground:
console.log("JavaScript running!");

setTimeout(() => {
  console.log("This runs after 1 second");
}, 1000);

// Fetch works too (API calls)
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json())
  .then(data => console.log(data.title))
  .catch(err => console.error(err));`,
              explanation: "The playground supports pure JavaScript including timers, promises, fetch, and console methods. DOM manipulation (`document.getElementById`) is NOT supported because there's no HTML document."
            },
            practice: "Run the setTimeout example above in the playground and observe the delayed output."
          }
        }
      ]
    },
    {
      id: "js-variables",
      title: "Variables & Data Types",
      description: "Learn how to store and work with data in JavaScript, from numbers and text to true/false values.",
      duration: "75 min",
      subtopics: [
        {
          id: "js-var-intro",
          title: "What is a Variable?",
          content: {
            explanation: [
              "A variable is a named container that holds a value. Think of it like a labeled box, you put something inside and later you can check what's there.",
              "",
              "Variables let you reuse values without typing them repeatedly. If you need to change a value, you only update it once, everywhere it's used updates automatically.",
              "",
              "JavaScript gives you three keywords to create variables: `let`, `const`, and the older `var`. We'll start with `let` and `const` because they are safer and less confusing."
            ],
            example: {
              title: "Create Your First Variables",
              code: `let userName = "Alice";
let userAge = 25;
let isSubscribed = true;

console.log(userName);      // "Alice"
console.log(userAge);       // 25
console.log(isSubscribed);  // true`,
              explanation: "We created three variables: a string (text), a number, and a boolean (true/false). Each variable stores a different type of data."
            },
            practice: "Create a variable called `score` with value 100, then log it to the console."
          }
        },
        {
          id: "js-var-let",
          title: "Using `let` - Reassignable Variables",
          content: {
            explanation: [
              "The `let` keyword declares a variable that can be changed later. This is perfect for values that will update during your program, like a score that increases, a counter that increments, or a user's selected option.",
              "",
              "Variables declared with `let` have 'block scope'. That means they only exist inside the curly braces `{ }` where they were created. This prevents accidental changes from other parts of your code.",
              "",
              "You can reassign a `let` variable as many times as you need:"
            ],
            example: {
              title: "Reassigning a Variable",
              code: `let highScore = 50;
console.log(highScore);  // 50

highScore = 75;
console.log(highScore);  // 75

highScore = highScore + 25;
console.log(highScore);  // 100`,
              explanation: "We changed `highScore` three times. Each assignment overwrites the old value. This is why `let` is great for values that change."
            },
            practice: "Create a variable `level` set to 1. Increase it by 1, then log the new value."
          }
        },
        {
          id: "js-var-const",
          title: "Using `const` - Values That Never Change",
          content: {
            explanation: [
              "`const` creates a variable that cannot be reassigned. Use it for values that should never change, like configuration settings, mathematical constants (PI), or references to functions and objects you want to keep intact.",
              "",
              "Like `let`, `const` also has block scope. The key difference: you must provide an initial value when you declare a `const`, and you cannot assign a new value later.",
              "",
              "**Important:** `const` only prevents reassignment. If the value is an object or array, you can still modify its contents (this is called mutation)."
            ],
            example: {
              title: "Constant Values",
              code: `const APP_NAME = "CodeMaster";
const MAX_USERS = 1000;

console.log(APP_NAME);   // "CodeMaster"
console.log(MAX_USERS);  // 1000

// This would cause an error:
// MAX_USERS = 2000;  // ❌ TypeError: Assignment to constant variable`,
              explanation: "Notice we use UPPER_CASE naming for constants by convention, this signals to other developers that this value should not change. Trying to reassign a `const` crashes your code."
            },
            practice: "Create a constant `TAX_RATE` with value 0.08 and log it."
          }
        },
        {
          id: "js-var-var",
          title: "The `var` Keyword (Legacy)",
          content: {
            explanation: [
              "`var` is the old way to declare variables. It still works, but it has problems that can cause bugs. You might see `var` in older code or tutorials, but we recommend using `let` and `const` instead.",
              "",
              "The main issues with `var`:",
              "• It has function scope (not block scope) - it 'leaks' outside of loops and if-blocks",
              "• It gets hoisted (moved to the top of its scope) before code runs, which can be confusing",
              "• You can redeclare the same `var` variable multiple times, which can accidentally overwrite values"
            ],
            example: {
              title: "Why `var` Is Problematic",
              code: `// Block scope issue with var
for (var i = 0; i < 3; i++) {
  console.log("Inside loop:", i);  // 0, 1, 2
}
console.log("Outside loop:", i);  // 3 - i 'leaked' out! 🚨

// With let (correct behavior):
for (let j = 0; j < 3; j++) {
  console.log("Inside loop:", j);  // 0, 1, 2
}
// console.log(j);  // ❌ ReferenceError - j doesn't exist here`,
              explanation: "The `var` variable `i` survives after the loop finishes, this can cause unexpected bugs. `let` correctly limits the variable to the block where it was created."
            },
            practice: "Run the example above to see the difference between `var` and `let`."
          }
        },
        {
          id: "js-types-overview",
          title: "JavaScript Data Types - Overview",
          content: {
            explanation: [
              "JavaScript values belong to different types. Understanding types helps you avoid bugs and write cleaner code.",
              "",
              "There are two main categories:",
              "",
              "**Primitive Types** - simple, immutable values stored directly:",
              "• `String` - text, like `'Hello'` or `'CodeMaster'`",
              "• `Number` - integers and decimals, like `42` or `3.14`",
              "• `Boolean` - `true` or `false`",
              "• `null` - intentional absence of value",
              "• `undefined` - value not yet assigned",
              "• `BigInt` - very large numbers",
              "• `Symbol` - unique identifiers (advanced)",
              "",
              "**Reference Types** - complex values stored as objects:",
              "• `Object` - collections of key-value pairs `{ name: 'John' }`",
              "• `Array` - ordered lists `[1, 2, 3]`",
              "• `Function` - callable code blocks"
            ],
            example: {
              title: "Checking Types with typeof",
              code: `console.log(typeof "Hello");      // "string"
console.log(typeof 42);         // "number"
console.log(typeof 3.14);       // "number"
console.log(typeof true);       // "boolean"
console.log(typeof null);       // "object" 🚨 (quirk!)
console.log(typeof undefined);  // "undefined"
console.log(typeof [1,2,3]);    // "object"
console.log(typeof {a: 1});     // "object"
console.log(typeof function(){}); // "function"`,
              explanation: "The `typeof` operator tells you the type of any value. Notice `null` incorrectly reports as 'object' - this is a long-standing JavaScript bug you should be aware of."
            },
            practice: "Create one variable of each primitive type and log their types using `typeof`."
          }
        },
        {
          id: "js-types-string",
          title: "Strings - Working with Text",
          content: {
            explanation: [
              "Strings store text data. They can contain letters, numbers, spaces, and symbols. JavaScript strings are immutable, methods on a string return a new string; they don't modify the original.",
              "",
              "You can create strings with single quotes `'` or double quotes `\". Backticks \\` allow template literals, strings that can embed variables inside `${expression}`.",
              "",
              "Common string operations:"
            ],
            example: {
              title: "String Basics and Methods",
              code: `// Creating strings
let name = "Alice";
let message = 'Welcome to CodeMaster';
let template = \`Hello, \${name}! You have 5 new messages.\`;

// String properties and methods
console.log(name.length);           // 5 - length of string
console.log(name.toUpperCase());    // "ALICE"
console.log(name.toLowerCase());    // "alice"
console.log(name.includes("li"));   // true - contains "li"?
console.log(name.split(""));        // ["A","l","i","c","e"] - split into array

// Concatenation
let fullGreeting = "Hello, " + name + "!";
console.log(fullGreeting);  // "Hello, Alice!"`,
              explanation: "Strings have many built-in methods for transforming and checking text. Template literals (backticks) are the modern way to build strings that include variables."
            },
            practice: "Create a variable `city` with your city name. Print it in uppercase and check if it contains the letter 'a'."
          }
        },
        {
          id: "js-types-number",
          title: "Numbers - Integers, Floats, and Math",
          content: {
            explanation: [
              "JavaScript has only one number type: `number` (IEEE 754 double-precision floating point). This means it can represent both integers like `42` and decimals like `3.14`.",
              "",
              "Special numeric values:",
              "• `Infinity` - positive infinity (larger than any number)",
              "• `-Infinity` - negative infinity",
              "• `NaN` - 'Not a Number' (result of invalid math like 0/0 or parseInt('abc'))",
              "",
              "**Floating point precision alert:** 0.1 + 0.2 equals 0.30000000000000004, not exactly 0.3. This is a known IEEE 754 behavior; for money use integer cents or a library."
            ],
            example: {
              title: "Number Operations and Special Values",
              code: `let integer = 42;
let decimal = 3.14159;
let negative = -10;

// Arithmetic
console.log(10 + 5);     // 15
console.log(10 - 5);     // 5
console.log(10 * 5);     // 50
console.log(10 / 3);     // 3.333...
console.log(10 % 3);     // 1 - remainder

// Special values
console.log(1 / 0);      // Infinity
console.log(-1 / 0);     // -Infinity
console.log(0 / 0);      // NaN
console.log(Number("abc")); // NaN

// Math object
console.log(Math.PI);            // 3.14159...
console.log(Math.floor(3.9));    // 3 - round down
console.log(Math.ceil(3.1));     // 4 - round up
console.log(Math.random());      // 0-1 random number`,
              explanation: "JavaScript's `Math` object provides constants and functions for common math operations. Use `Math.floor()` to drop decimals, `Math.ceil()` to round up, and `Math.random()` for random numbers."
            },
            practice: "Calculate the area of a circle with radius 5 using Math.PI and radius squared. Print the result."
          }
        },
        {
          id: "js-types-boolean",
          title: "Booleans - true or false",
          content: {
            explanation: [
              "Booleans represent truth values: `true` or `false`. They are the foundation of all conditional logic, `if` statements, loops, and comparisons all produce or use booleans.",
              "",
              "JavaScript also treats other values as 'truthy' or 'falsy' when used in a boolean context:",
              "",
              "**Falsy values** (act like false): `false`, `0`, `-0`, `0n` (BigInt zero), `\"\"` (empty string), `null`, `undefined`, `NaN`",
              "**Truthy values** (act like true): everything else, `\"0\"`, `\"false\"`, `[]`, `{}`, functions, non-zero numbers, non-empty strings"
            ],
            example: {
              title: "Truthy vs Falsy",
              code: `// Explicit booleans
let isActive = true;
let isCompleted = false;

// Testing truthiness
if ("hello") { console.log("String is truthy"); }
if (0) { console.log("Zero is truthy"); } else { console.log("Zero is falsy"); }
if ("") { console.log("Empty string is truthy"); } else { console.log("Empty string is falsy"); }
if ([]) { console.log("Empty array is truthy"); }
if ({}) { console.log("Empty object is truthy"); }

// Comparison operators return booleans
console.log(5 > 3);     // true
console.log(5 === 5);   // true (strict equality)
console.log(5 == "5");  // true (loose equality - avoid!)
console.log(5 !== 3);   // true`,
              explanation: "Any value can be used where a boolean is expected. JavaScript automatically converts to true or false. For clarity, use strict equality `===` instead of loose `==` to avoid unexpected type conversions."
            },
            practice: "Write an if-statement that checks if a variable `score` is greater than 50, and print 'Pass' if true, 'Fail' if false."
          }
        },
        {
          id: "js-null-undefined",
          title: "`null` and `undefined` - Absence of Value",
          content: {
            explanation: [
              "`undefined` means a variable has been declared but not assigned a value yet. It's the default state of newly declared variables (without initialization).",
              "",
              "`null` means 'no value' - an intentional absence. You assign `null` to say 'this variable exists but currently has nothing.' Think of `undefined` as 'not yet set' and `null` as 'explicitly empty.'",
              "",
              "Key difference: `undefined` is the system's default; `null` is programmer-chosen."
            ],
            example: {
              title: "undefined vs null",
              code: `let notAssigned;
console.log(notAssigned);        // undefined - never given a value
console.log(typeof notAssigned); // "undefined"

let empty = null;
console.log(empty);              // null - we set it to nothing on purpose
console.log(typeof empty);       // "object" - another JavaScript quirk!

// Checking for absence
if (notAssigned === undefined) {
  console.log("Variable was never set");
}
if (empty === null) {
  console.log("We intentionally set this to empty");
}

// Common pattern: reset a variable
let userName = "Alice";
userName = null;  // Clear it - user logged out or removed`,
              explanation: "Use `null` to clear a variable's value (like logging out a user). Checking `=== null` tells you the variable was deliberately emptied. `undefined` just means you never gave it anything."
            },
            practice: "Create a variable `middleName` but don't assign anything. Log its value. Then assign it to null and log again."
          }
        }
      ]
    },
    {
      id: "js-operators",
      title: "Operators",
      description: "Perform calculations, comparisons, and logical operations",
      duration: "40 min",
      subtopics: [
        {
          id: "js-arithmetic",
          title: "Arithmetic Operators",
          content: {
            explanation: [
              "Arithmetic operators perform mathematical calculations:",
              "• `+` addition",
              "• `-` subtraction",
              "• `*` multiplication",
              "• `/` division (returns float)",
              "• `%` modulo (remainder)",
              "• `**` exponentiation (power)",
              "",
              "JavaScript follows standard operator precedence (PEMDAS): parentheses first, then exponents, multiplication/division, addition/subtraction."
            ],
            example: {
              title: "Math in JavaScript",
              code: `let a = 10, b = 3;

console.log(a + b);   // 13
console.log(a - b);   // 7
console.log(a * b);   // 30
console.log(a / b);   // 3.333...
console.log(a % b);   // 1 (remainder)
console.log(a ** b);  // 10^3 = 1000

// Operator precedence
console.log(2 + 3 * 4);    // 14 (multiplication first)
console.log((2 + 3) * 4);  // 20 (parentheses change order)

// Increment and decrement
let count = 5;
count++;  // post-increment: adds 1
console.log(count);  // 6
++count;  // pre-increment: adds 1
console.log(count);  // 7

// Shorthand assignment
let x = 10;
x += 5;   // same as x = x + 5 → 15
x *= 2;   // same as x = x * 2 → 30
console.log(x);`,
              explanation: "`++` adds 1, `--` subtracts 1. Pre-increment (`++x`) changes before using the value; post-increment (`x++`) changes after. Shorthand operators (`+=`, `-=`, etc.) make code more concise."
            },
            practice: "Calculate the total cost: 5 items at $19.99 each plus 8% tax. Use variables and print the result."
          }
        },
        {
          id: "js-comparison",
          title: "Comparison Operators",
          content: {
            explanation: [
              "Comparison operators compare two values and return a boolean (`true` or `false`).",
              "",
              "**Equality checks:**",
              "• `===` strict equality (checks value AND type) - use this!",
              "• `==` loose equality (converts types before comparing) - avoid it",
              "• `!==` strict inequality",
              "• `!=` loose inequality",
              "",
              "**Relational comparisons:**",
              "• `>` greater than",
              "• `<` less than",
              "• `>=` greater than or equal",
              "• `<=` less than or equal"
            ],
            example: {
              title: "Comparing Values",
              code: `// Strict equality (recommended)
console.log(5 === 5);      // true (same value, same type)
console.log(5 === "5");    // false (number vs string)

// Loose equality (avoid - confusing!)
console.log(5 == "5");     // true - converts string to number!
console.log(false == 0);   // true - converts boolean to 0!
console.log(null == undefined); // true - special case

// Relational comparisons
console.log(10 > 5);     // true
console.log(10 <= 10);   // true
console.log(7 < 3);      // false

// Works with strings (lexicographic order)
console.log("apple" < "banana");  // true (a comes before b)
console.log("10" < "2");     // true! (compares as strings: "1" < "2")
console.log(10 < "2");       // false (converts "2" to 2, 10 < 2 false)`,
              explanation: "Always use `===` and `!==` unless you have a specific reason not to. Loose equality (`==`) has complex type conversion rules that lead to bugs. String comparisons use alphabetical order, which can be surprising with numbers as strings."
            },
            practice: "Write comparisons that check if a variable `age` is 18 or older, and if `name` equals 'Alice'."
          }
        }
      ]
    },
    {
      id: "js-conditionals",
      title: "Conditionals",
      description: "Make decisions in your code, run different code based on conditions",
      duration: "50 min",
      subtopics: [
        {
          id: "js-if-else",
          title: "If / Else Statements",
          content: {
            explanation: [
              "Conditional statements let your program make decisions. The `if` statement checks a condition, if it's true, a block of code runs; if false, that block is skipped.",
              "",
              "`else` extends `if` to provide an alternative path when the condition fails. You can chain multiple conditions with `else if`.",
              "",
              "The condition inside `()` must evaluate to a boolean (`true`/`false`). JavaScript converts non-boolean values automatically (truthy/falsy)."
            ],
            example: {
              title: "Basic If/Else",
              code: `let temperature = 32;

if (temperature > 30) {
  console.log("It's hot outside!");
} else if (temperature > 20) {
  console.log("It's warm outside.");
} else if (temperature > 10) {
  console.log("It's cool outside.");
} else {
  console.log("It's cold outside!");
}

// Example with multiple conditions
let age = 18;
let hasPermission = true;

if (age >= 18 && hasPermission) {
  console.log("Access granted");
} else {
  console.log("Access denied");
}`,
              explanation: "Conditions are checked top to bottom. The first true condition's block runs, then the rest are skipped. If none match, the `else` block runs (if present)."
            },
            practice: "Write an if/else chain that prints 'A' for scores >= 90, 'B' for >= 80, 'C' for >= 70, and 'F' for below 70."
          }
        },
        {
          id: "js-switch",
          title: "Switch Statements",
          content: {
            explanation: [
              "The `switch` statement selects one of many code blocks to execute. It's cleaner than a long `if/else if` chain when comparing the same variable against multiple constant values.",
              "",
              "Each `case` defines a value to compare against. If a match is found, that block runs. `break` prevents 'fall-through' to the next case. The `default` block runs if no case matches."
            ],
            example: {
              title: "Grade Calculator with Switch",
              code: `let grade = "B";

switch (grade) {
  case "A":
    console.log("Excellent!");
    break;
  case "B":
    console.log("Good job!");
    break;
  case "C":
    console.log("Pass.");
    break;
  case "D":
    console.log("Needs improvement.");
    break;
  case "F":
    console.log("Failed.");
    break;
  default:
    console.log("Invalid grade");
}

// Multiple cases sharing same code
let day = 3;
switch (day) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Weekday");
    break;
  case 6:
  case 7:
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}`,
              explanation: "Switch compares using strict equality (`===`). Always include `break` unless you intentionally want multiple cases to execute. The `default` case handles unexpected values."
            },
            practice: "Create a switch that prints the full name of a day given abbreviation: 'Mon' -> 'Monday', 'Tue' -> 'Tuesday', etc."
          }
        },
        {
          id: "js-ternary",
          title: "Ternary Operator - Quick Conditionals",
          content: {
            explanation: [
              "The ternary operator is a shorthand for simple `if/else` assignments. It's one line and great for choosing between two values.",
              "",
              "Syntax: `condition ? valueIfTrue : valueIfFalse`",
              "",
              "Use it for simple decisions. For complex logic with many branches, use regular `if/else` for clarity."
            ],
            example: {
              title: "Ternary in Action",
              code: `let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status);  // "Adult"

// Without ternary:
let result;
if (age >= 18) {
  result = "Adult";
} else {
  result = "Minor";
}

// Nested ternary (avoid, hard to read):
let score = 85;
let grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
console.log(grade);  // "B"

// Better to use if/else for complex logic
let betterGrade;
if (score >= 90) betterGrade = "A";
else if (score >= 80) betterGrade = "B";
else if (score >= 70) betterGrade = "C";
else betterGrade = "F";`,
              explanation: "The ternary returns one of two values based on a condition. It's an expression (produces a value), unlike `if` which is a statement. Use it for simple, readable decisions, but avoid nesting."
            },
            practice: "Use a ternary to set `message = isLoggedIn ? 'Welcome back!' : 'Please log in.'`"
          }
        }
      ]
    },
    {
      id: "js-loops",
      title: "Loops & Iteration",
      description: "Master all loop types - for, while, forEach, and iterators",
      duration: "70 min",
      subtopics: [
        {
          id: "js-loop-for",
          title: "For Loops - Classic Counter-Based Iteration",
          content: {
            explanation: [
              "The classic `for` loop gives you full control: initialization, condition, and iteration expression. Perfect when you need the index or to iterate a specific number of times.",
              "",
              "Syntax: `for (init; condition; update) { … }`. The loop continues while condition is true."
            ],
            example: {
              title: "For Loop Patterns",
              code: `// Count from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// Iterate backwards
for (let i = 10; i >= 0; i--) {
  console.log(i);  // 10, 9, ..., 0
}

// Iterate array by index
let fruits = ["apple", "banana", "orange"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// Skip even numbers
for (let i = 1; i <= 10; i += 2) {
  console.log(i);  // 1, 3, 5, 7, 9
}`,
              explanation: "For loops are explicit and readable for counting. Use `i < array.length` not `i <= array.length` - the latter goes out of bounds."
            },
            practice: "Use a for loop to calculate the sum of numbers from 1 to 100. Print the sum after the loop."
          }
        },
        {
          id: "js-loop-forof",
          title: "for...of - Iterate Any Iterable",
          content: {
            explanation: [
              "`for...of` is the modern way to loop over arrays, strings, maps, sets, and other iterables. It gives you the VALUE directly, not the index.",
              "",
              "Use it when you don't need the index. It's cleaner and less error-prone than classic `for`."
            ],
            example: {
              title: "for...of in Action",
              code: `let fruits = ["apple", "banana", "orange"];

// Get each value
for (let fruit of fruits) {
  console.log(fruit);
}
// apple, banana, orange

// With index using entries()
for (let [index, fruit] of fruits.entries()) {
  console.log(index + ":", fruit);
}
// 0: apple, 1: banana, 2: orange

// Strings are iterable too
let str = "Hello";
for (let char of str) {
  console.log(char);
}
// H, e, l, l, o`,
              explanation: "`for...of` works with anything that has a `[Symbol.iterator]` method. Arrays, strings, Maps, Sets, and more."
            },
            practice: "Given an array of numbers, use `for...of` to count how many are even."
          }
        },
        {
          id: "js-loop-while",
          title: "while and do...while - Condition-Based Loops",
          content: {
            explanation: [
              "`while` loops run WHILE a condition is true. The condition is checked BEFORE each iteration.",
              "",
              "`do...while` runs the body AT LEAST ONCE, then checks the condition. Use when you need the body to execute at least once regardless."
            ],
            example: {
              title: "While Loops",
              code: `// while - check before
let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}
// 0, 1, 2

// do...while - runs at least once
let j = 0;
do {
  console.log(j);  // prints 0 even though condition is false!
  j++;
} while (j < 0);

// Practical example: find first number divisible by 7 and 5
let n = 1;
while (true) {
  if (n % 7 === 0 && n % 5 === 0) {
    console.log("Found:", n);
    break;
  }
  n++;
}

// Limited attempts
let attempts = 0;
while (attempts < 3) {
  console.log("Attempt", attempts + 1);
  attempts++;
}`,
              explanation: "Beware infinite loops, ensure the condition eventually becomes false. `do...while` is rare but useful for retry logic where you want the body to run at least once."
            },
            practice: "Write a `while` loop that adds random numbers (1–10) to a sum until the sum exceeds 100, then print the sum and count of numbers added."
          }
        },
        {
          id: "js-loop-break-continue",
          title: "Control Flow - break, continue",
          content: {
            explanation: [
              "Inside any loop:",
              "• `break` - exits the loop immediately",
              "• `continue` - skips to the next iteration",
              "",
              "These are useful for early termination or skipping specific iterations."
            ],
            example: {
              title: "break and continue",
              code: `// break - stop early
for (let i = 0; i < 10; i++) {
  if (i === 5) break;  // stop at 5
  console.log(i);
}
// 0, 1, 2, 3, 4

// continue - skip this iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;  // skip 2
  console.log(i);
}
// 0, 1, 3, 4

// Find first number divisible by 7
for (let n = 1; ; n++) {
  if (n % 7 === 0) {
    console.log("Found:", n);  // 7
    break;
  }
}

// Skip odd numbers
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) continue;
  console.log(i);  // even numbers only: 2, 4, 6, 8, 10
}`,
              explanation: "`break` exits the loop entirely. `continue` jumps to the next iteration. Use them sparingly, they can make loops harder to follow if overused."
            },
            practice: "Loop from 1 to 50. Print only odd numbers using `continue`. Stop completely when you encounter 33 using `break`."
          }
        }
      ]
    },
    {
      id: "js-functions",
      title: "Functions",
      description: "Create reusable blocks of code that accept inputs and return outputs",
      duration: "85 min",
      subtopics: [
        {
          id: "js-func-basics",
          title: "What Is a Function?",
          content: {
            explanation: [
              "A function is a reusable block of code that performs a specific task. You write it once, call it many times, and pass different inputs (parameters) to get different outputs.",
              "",
              "Functions help you:",
              "• Avoid repeating code (DRY principle)",
              "• Organize your program into logical pieces",
              "• Test and debug in isolation",
              "",
              "There are several ways to define functions in JavaScript: function declarations, function expressions, and arrow functions."
            ],
            example: {
              title: "Your First Function",
              code: `// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Calling the function
let message = greet("Alice");
console.log(message);  // "Hello, Alice!"

// Another call with different input
console.log(greet("Bob"));  // "Hello, Bob!"`,
              explanation: "We defined a `greet` function that accepts a `name` parameter and returns a greeting string. The `return` keyword sends a value back to the caller. Without `return`, the function returns `undefined`."
            },
            practice: "Write a function `multiply(a, b)` that returns the product of two numbers. Test it with 3 and 4."
          }
        },
        {
          id: "js-func-params",
          title: "Parameters and Arguments",
          content: {
            explanation: [
              "Parameters are the variable names listed in the function definition. Arguments are the actual values you pass when calling the function.",
              "",
              "JavaScript is flexible with arguments:",
              "• You can pass fewer arguments than parameters, missing ones become `undefined`",
              "• You can pass more arguments than parameters, extra ones are ignored",
              "• Default parameters (`function greet(name = 'Guest')`) provide fallback values"
            ],
            example: {
              title: "Parameters in Action",
              code: `function introduce(name, age, city) {
  console.log(\`I'm \${name}, \${age} years old from \${city}\`);
}

// Provide all three arguments
introduce("Sarah", 28, "Lagos");  // Works

// Missing arguments become undefined
introduce("John", 25);  // city is undefined

// Default parameters (ES6+)
function welcome(name = "Guest") {
  return "Welcome, " + name;
}
console.log(welcome());        // "Welcome, Guest"
console.log(welcome("Emma"));  // "Welcome, Emma"`,
              explanation: "Default parameters (`name = 'Guest'`) are evaluated at call time. They prevent `undefined` values and make your functions more robust."
            },
            practice: "Create a function `areaOfRectangle(width, height)` that returns width * height. Add a default width of 1 if not provided."
          }
        },
        {
          id: "js-func-return",
          title: "Return Values & Early Returns",
          content: {
            explanation: [
              "The `return` statement sends a value back to the caller and immediately exits the function. A function without `return` gives `undefined`.",
              "",
              "You can have multiple `return` statements, often used for early exit, handling edge cases first before the main logic."
            ],
            example: {
              title: "Early Returns",
              code: `function divide(a, b) {
  // Guard clause - handle error early
  if (b === 0) {
    console.error("Cannot divide by zero");
    return null;  // Exit early
  }
  
  // Main logic only runs if b != 0
  return a / b;
}

console.log(divide(10, 2));  // 5
console.log(divide(10, 0));  // null

// Function with multiple returns
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

console.log(getGrade(85));  // "B"`,
              explanation: "Early returns (guard clauses) handle edge cases upfront, making the happy path less indented and easier to read."
            },
            practice: "Write a function `getDayName(dayNumber)` that returns 'Monday' for 1, 'Tuesday' for 2, etc. Return 'Invalid' for out-of-range numbers."
          }
        },
        {
          id: "js-arrow-func",
          title: "Arrow Functions - Modern Syntax",
          content: {
            explanation: [
              "Arrow functions provide a shorter, cleaner syntax. They were introduced in ES6 and are now the standard for most use cases, especially callbacks and array methods.",
              "",
              "Key differences from regular functions:",
              "• No `function` keyword, use `=>` after parameters",
              "• Implicit `return` when body is a single expression (no curly braces)",
              "• No own `this` binding, `this` comes from the surrounding scope"
            ],
            example: {
              title: "Arrow Function Variants",
              code: `// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function with explicit return
const addArrow = (a, b) => {
  return a + b;
};

// Arrow with implicit return (no braces, single expression)
const multiply = (a, b) => a * b;

// No parameters need parentheses
const sayHello = () => "Hello!";

// Single parameter can omit parentheses
const double = n => n * 2;

console.log(add(2,3));      // 5
console.log(multiply(2,3)); // 6
console.log(double(5));     // 10`,
              explanation: "Arrow functions with implicit return are concise for one-liners. For longer functions, use curly braces and explicit `return`."
            },
            practice: "Rewrite a regular function as an arrow: `function square(x) { return x * x; }`"
          }
        },
        {
          id: "js-func-callbacks",
          title: "Callbacks - Functions as Arguments",
          content: {
            explanation: [
              "In JavaScript, functions are 'first-class citizens', you can pass them as arguments to other functions, return them from functions, and store them in variables.",
              "",
              "A callback is a function passed as an argument to another function. The receiving function calls the callback at the appropriate time. This pattern is everywhere: array methods (`map`, `filter`), timers (`setTimeout`), and async operations."
            ],
            example: {
              title: "Passing Functions Around",
              code: `// Higher-order function - takes a function as argument
function calculate(a, b, operation) {
  return operation(a, b);
}

// Different operations (callbacks)
function add(x, y) { return x + y; }
function subtract(x, y) { return x - y; }
function multiply(x, y) { return x * y; }

console.log(calculate(10, 5, add));       // 15
console.log(calculate(10, 5, subtract));  // 5
console.log(calculate(10, 5, multiply));  // 50

// With array methods
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(function(n) { return n * 2; });
console.log(doubled);  // [2, 4, 6, 8, 10]

// Arrow function as callback (cleaner)
let tripled = numbers.map(n => n * 3);
console.log(tripled);  // [3, 6, 9, 12, 15]`,
              explanation: "Higher-order functions accept other functions as arguments. This decouples the 'what' from the 'how'."
            },
            practice: "Write a function `processNumbers(arr, callback)` that applies the callback to every element and returns a new array. Test with `n => n * 2`."
          }
        },
        {
          id: "js-closures-scope",
          title: "Closures & Lexical Scope",
          content: {
            explanation: [
              "A closure is a function that remembers its outer variables even after the outer function has finished executing. This is one of JavaScript's most powerful features.",
              "",
              "Lexical scope means that a function's scope is determined by where it is written, not where it is called.",
              "",
              "Real-world uses:",
              "• Creating private variables",
              "• Function factories",
              "• Callbacks and event handlers",
              "• Module patterns"
            ],
            example: {
              title: "Closures in Action",
              code: `// Basic closure example
function outerFunction(x) {
  function innerFunction(y) {
    return x + y;  // inner remembers x from outer
  }
  return innerFunction;
}

let add5 = outerFunction(5);
console.log(add5(3));  // 8 - closure remembers x=5
console.log(add5(10)); // 15

// Function factory - creates counter functions
function createCounter(initial = 0) {
  let count = initial;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

let counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.getValue());  // 12

// Private variables (module pattern)
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // private variable
  
  return {
    deposit: (amount) => {
      if (amount > 0) balance += amount;
      return balance;
    },
    withdraw: (amount) => {
      if (amount > 0 && amount <= balance) balance -= amount;
      return balance;
    },
    getBalance: () => balance
  };
}

let account = createBankAccount(100);
console.log(account.getBalance()); // 100
console.log(account.deposit(50));  // 150
console.log(account.withdraw(30)); // 120
console.log(account.balance);      // undefined - private!`,
              explanation: "Closures allow functions to 'remember' variables from their outer scope. This enables data privacy and powerful functional programming patterns."
            },
            practice: "Write a function `createMultiplier(multiplier)` that returns a function which multiplies any number by the multiplier. Example: `const double = createMultiplier(2); double(5) -> 10`."
          }
        }
      ]
    },
    {
      id: "js-arrays",
      title: "Arrays & Array Methods",
      description: "Master arrays, ordered lists with powerful built-in methods",
      duration: "75 min",
      subtopics: [
        {
          id: "js-array-intro",
          title: "What Is an Array?",
          content: {
            explanation: [
              "An array is an ordered collection of values. Think of it like a numbered shelf, each item has a position (index) starting at 0.",
              "",
              "Arrays can hold any type of value: numbers, strings, booleans, objects, even other arrays. They are mutable (changeable) and one of the most used data structures in JavaScript.",
              "",
              "Arrays have a `length` property that tells you how many items they contain."
            ],
            example: {
              title: "Creating and Inspecting Arrays",
              code: `// Create an array
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, "hello", true, null];

// Access by index (zero-based)
console.log(fruits[0]);  // "apple"
console.log(fruits[2]);  // "orange"

// Length
console.log(fruits.length);  // 3

// Out of bounds returns undefined
console.log(fruits[10]);  // undefined`,
              explanation: "Arrays use zero-based indexing. The first element is at index 0."
            },
            practice: "Create an array `colors` with three color names. Print the first and last elements."
          }
        },
        {
          id: "js-array-methods",
          title: "Essential Array Methods - push, pop, shift, unshift",
          content: {
            explanation: [
              "These four methods let you add and remove elements from the beginning or end of an array:",
              "• `push(...items)` - add to END, returns new length",
              "• `pop()` - remove and return LAST item",
              "• `unshift(...items)` - add to BEGINNING, returns new length",
              "• `shift()` - remove and return FIRST item"
            ],
            example: {
              title: "Adding and Removing Elements",
              code: `let stack = [1, 2, 3];

// push - add to end
stack.push(4);
console.log(stack);  // [1, 2, 3, 4]

// pop - remove from end
let last = stack.pop();
console.log(last);   // 4
console.log(stack);  // [1, 2, 3]

// unshift - add to front
stack.unshift(0);
console.log(stack);  // [0, 1, 2, 3]

// shift - remove from front
let first = stack.shift();
console.log(first);  // 0
console.log(stack);  // [1, 2, 3]`,
              explanation: "`push` and `pop` make an array work like a stack (LIFO). `shift` and `unshift` are slower because they must move all other elements."
            },
            practice: "Start with `let line = ['a', 'b', 'c']`. Use `push` to add 'd', then `shift` to remove 'a'. Print the final array."
          }
        },
        {
          id: "js-array-transform",
          title: "map, filter, reduce - Transform Arrays",
          content: {
            explanation: [
              "These methods are the foundation of functional array processing:",
              "• `map(callback)` - transforms each element into a new value",
              "• `filter(callback)` - keeps only elements that return `true`",
              "• `reduce(callback, initial)` - combines all elements into a single value",
              "",
              "All are NON-DESTRUCTIVE, they return new arrays/values without changing the original."
            ],
            example: {
              title: "map, filter, reduce",
              code: `let numbers = [1, 2, 3, 4, 5];

// map - transform each element
let doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// filter - select elements
let evens = numbers.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4]

// reduce - combine to single value
let sum = numbers.reduce((total, n) => total + n, 0);
console.log(sum);  // 15

// Chaining methods
let result = numbers
  .filter(n => n > 2)
  .map(n => n * 10)
  .reduce((sum, n) => sum + n, 0);
console.log(result);  // (3+4+5)*10 = 120

// Original array unchanged
console.log(numbers);  // [1, 2, 3, 4, 5]`,
              explanation: "`map` transforms values, `filter` selects them, `reduce` aggregates them. Method chaining creates powerful data processing pipelines."
            },
            practice: "Given `prices = [10, 20, 30]`, use `map` to add 10% tax, then `filter` to keep prices under 25, then `reduce` to sum them."
          }
        },
        {
          id: "js-array-find",
          title: "Finding Elements - find, some, every",
          content: {
            explanation: [
              "These methods check arrays for matching elements:",
              "• `find(callback)` - returns first matching element or `undefined`",
              "• `some(callback)` - returns `true` if ANY element matches",
              "• `every(callback)` - returns `true` if ALL elements match"
            ],
            example: {
              title: "Searching Arrays",
              code: `let users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 17 },
  { id: 3, name: "Charlie", age: 30 }
];

// find - get first match
let user = users.find(u => u.id === 2);
console.log(user);  // { id: 2, name: "Bob", age: 17 }

// some - check if any match
let hasMinor = users.some(u => u.age < 18);
console.log(hasMinor);  // true (Bob is 17)

// every - check if all match
let allAdults = users.every(u => u.age >= 18);
console.log(allAdults);  // false (Bob is 17)

// find with primitive array
let numbers = [10, 20, 30, 40];
let found = numbers.find(n => n > 25);
console.log(found);  // 30 (first match)`,
              explanation: "Use `find` for a single matching item, `some` for existence check, `every` for validation."
            },
            practice: "Given `scores = [85, 92, 78, 66, 89]`, use `some` to check if any are below 70, and `every` to check if all are above 60."
          }
        },
        {
          id: "js-map-set",
          title: "Map & Set - Modern Collections",
          content: {
            explanation: [
              "Map and Set are modern JavaScript collections that offer better performance and clearer APIs than plain objects for certain use cases:",
              "",
              "**Map** - key-value pairs where keys can be ANY type (not just strings):",
              "• `set(key, value)` - add or update",
              "• `get(key)` - retrieve value",
              "• `has(key)` - check existence",
              "• `delete(key)` - remove entry",
              "• `size` property (not length!)",
              "",
              "**Set** - unique values, no duplicates:",
              "• `add(value)` - add value (duplicates ignored)",
              "• `has(value)` - check existence",
              "• `delete(value)` - remove value",
              "• `size` property"
            ],
            example: {
              title: "Map and Set",
              code: `// Map - keys can be objects, functions, any type
let userMap = new Map();

// Set values
userMap.set("name", "Alice");
userMap.set(42, "answer");
userMap.set({ id: 1 }, "object key");

// Get values
console.log(userMap.get("name"));  // "Alice"
console.log(userMap.get(42));      // "answer"
console.log(userMap.has("name"));  // true
console.log(userMap.size);         // 3

// Iterate Map
for (let [key, value] of userMap) {
  console.log(\`\${key} -> \${value}\`);
}

// Set - unique values only
let numbers = new Set();

numbers.add(1);
numbers.add(2);
numbers.add(2);  // ignored - already exists
numbers.add(3);

console.log(numbers);           // Set(3) {1, 2, 3}
console.log(numbers.has(2));    // true
console.log(numbers.size);      // 3

// Practical: remove duplicates from array
let duplicates = [1, 2, 2, 3, 3, 3, 4];
let unique = [...new Set(duplicates)];
console.log(unique);  // [1, 2, 3, 4]

// Practical: count occurrences
let fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
let fruitCount = new Map();

for (let fruit of fruits) {
  fruitCount.set(fruit, (fruitCount.get(fruit) || 0) + 1);
}
console.log(fruitCount);
// Map(3) { 'apple' => 3, 'banana' => 2, 'orange' => 1 }`,
              explanation: "Use Map when you need non-string keys or frequent additions/deletions. Use Set when you need to store unique values and check membership efficiently."
            },
            practice: "Create a Set of your favorite movies. Add 5 movies, then check if a specific movie exists. Then convert the Set to an array."
          }
        }
      ]
    },
    {
      id: "js-objects",
      title: "Objects & Properties",
      description: "Work with key-value pairs and object methods",
      duration: "80 min",
      subtopics: [
        {
          id: "js-obj-basics",
          title: "Object Fundamentals",
          content: {
            explanation: [
              "Objects are collections of key-value pairs. Keys are strings, values can be any type. Objects are reference types, copying an object copies the reference, not the data.",
              "",
              "Create objects with object literals `{}` - the most common way."
            ],
            example: {
              title: "Creating and Accessing Objects",
              code: `// Object literal
let user = {
  name: "Alice",
  age: 25,
  isAdmin: false,
  hobbies: ["reading", "coding"]
};

// Access properties
console.log(user.name);        // dot notation
console.log(user["age"]);      // bracket notation

// Dynamic access
let key = "isAdmin";
console.log(user[key]);        // false

// Update properties
user.age = 26;
user.city = "NYC";  // adds new property

// Check if property exists
console.log("age" in user);           // true
console.log(user.hasOwnProperty("name"));  // true`,
              explanation: "Dot notation is cleaner but requires a valid identifier name. Bracket notation allows dynamic keys and special characters."
            },
            practice: "Create a `book` object with title, author, and year. Access each property both ways (dot and bracket)."
          }
        },
        {
          id: "js-obj-methods",
          title: "Object Methods - keys, values, entries",
          content: {
            explanation: [
              "JavaScript provides built-in methods to inspect objects:",
              "• `Object.keys(obj)` - array of property names",
              "• `Object.values(obj)` - array of values",
              "• `Object.entries(obj)` - array of `[key, value]` pairs",
              "",
              "These are great for iteration and transformation."
            ],
            example: {
              title: "Inspecting Objects",
              code: `let user = { name: "Alice", age: 25, role: "admin" };

// Get keys, values, entries
console.log(Object.keys(user));    // ["name", "age", "role"]
console.log(Object.values(user));  // ["Alice", 25, "admin"]
console.log(Object.entries(user));
// [["name","Alice"], ["age",25], ["role","admin"]]

// Iterate with for...of
for (let [key, value] of Object.entries(user)) {
  console.log(\`\${key}: \${value}\`);
}

// Transform object using entries
let userWithPrefix = Object.fromEntries(
  Object.entries(user).map(([key, value]) => [\`user_\${key}\`, value])
);
console.log(userWithPrefix);
// { user_name: "Alice", user_age: 25, user_role: "admin" }`,
              explanation: "`Object.entries` combined with `Object.fromEntries` lets you transform objects functionally."
            },
            practice: "Given `{a:1, b:2, c:3}`, use `Object.values` to get an array of values, then sum them with `reduce`."
          }
        },
        {
          id: "js-obj-destructuring",
          title: "Object Destructuring - Extract Properties",
          content: {
            explanation: [
              "Destructuring lets you unpack object properties into variables in a single line.",
              "",
              "Pattern: `let { prop1, prop2 } = obj`",
              "Rename: `let { prop: newName } = obj`",
              "Defaults: `let { a = 1 } = obj`"
            ],
            example: {
              title: "Destructuring in Action",
              code: `let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  address: { city: "NYC", country: "USA" }
};

// Basic destructuring
let { name, age } = user;
console.log(name, age);  // Alice 25

// Rename during destructuring
let { name: userName, email: userEmail } = user;
console.log(userName);  // Alice

// Default values
let { phone = "N/A", status = "active" } = user;
console.log(phone);   // "N/A"

// Nested destructuring
let { address: { city, country } } = user;
console.log(city);    // "NYC"

// Function parameter destructuring
function greet({ name, greeting = "Hello" }) {
  console.log(\`\${greeting}, \${name}!\`);
}
greet({ name: "Alice" });  // "Hello, Alice!"`,
              explanation: "Destructuring is everywhere in modern code, function parameters, React props, config extraction."
            },
            practice: "Destructure a `product` object to extract `title` and `price`, renaming `title` to `productName`."
          }
        },
        {
          id: "js-classes-deep",
          title: "Classes Deep Dive - Modern OOP",
          content: {
            explanation: [
              "ES6 classes provide a cleaner syntax for object-oriented programming. UNDER THE HOOD they still use prototypes, but classes are what you'll use in modern codebases.",
              "",
              "Key features:",
              "• `constructor()` - initializes new instances",
              "• Instance methods - added to prototype automatically",
              "• `static` methods - belong to the class itself (like Array.isArray)",
              "• `extends` - inheritance",
              "• `super` - call parent constructor/methods",
              "• Private fields `#field` - truly private (ES2022)",
              "• Getters and setters - computed properties"
            ],
            example: {
              title: "Modern Classes",
              code: `// Basic class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
  
  static describe() {
    console.log("Animals are living organisms");
  }
}

// Inheritance
class Dog extends Animal {
  // Private field (ES2022)
  #breed;
  
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.#breed = breed;
  }
  
  // Getter
  get breed() {
    return this.#breed;
  }
  
  // Setter with validation
  set breed(value) {
    if (value && value.length > 0) {
      this.#breed = value;
    }
  }
  
  // Override method
  speak() {
    console.log(\`\${this.name} says Woof!\`);
  }
  
  getInfo() {
    return \`\${this.name} is a \${this.#breed}\`;
  }
  
  // Static method
  static createDefault() {
    return new Dog("Max", "Mixed");
  }
}

// Usage
let animal = new Animal("Generic");
animal.speak();  // "Generic makes a sound"

let dog = new Dog("Buddy", "Golden Retriever");
dog.speak();  // "Buddy says Woof!"
console.log(dog.breed);  // "Golden Retriever"
console.log(dog.getInfo());  // "Buddy is a Golden Retriever"

let defaultDog = Dog.createDefault();
console.log(defaultDog.name);  // "Max"

// Private fields are truly private
// console.log(dog.#breed);  // ❌ SyntaxError - private field`,
              explanation: "Classes make OOP in JavaScript intuitive. Use `#` for truly private fields (encapsulation). Static methods are called on the class, not instances."
            },
            practice: "Create a `Vehicle` class with `make`, `model`, and a `start()` method. Then extend it with `Car` that adds a `drive()` method."
          }
        }
      ]
    },
    {
      id: "js-dates-regex",
      title: "Dates & Regular Expressions",
      description: "Work with dates, times, and pattern matching",
      duration: "45 min",
      subtopics: [
        {
          id: "js-dates",
          title: "Working with Dates",
          content: {
            explanation: [
              "JavaScript's Date object handles dates and times. Months are 0-indexed (January = 0).",
              "",
              "Common operations:",
              "• Create dates with `new Date()` or specific values",
              "• Get components: `getFullYear()`, `getMonth()`, `getDate()`, etc.",
              "• Format with `toLocaleDateString()`",
              "• Calculate differences (timestamps in milliseconds)"
            ],
            example: {
              title: "Date Operations",
              code: `// Create dates
let now = new Date();
let specific = new Date(2024, 0, 15);  // Jan 15, 2024 (month 0)
let fromTimestamp = new Date(1700000000000);

// Get components
console.log(now.getFullYear());    
console.log(now.getMonth());       // 0-11 (0 = January)
console.log(now.getDate());        // day of month (1-31)
console.log(now.getDay());         // day of week (0-6, 0 = Sunday)
console.log(now.getHours());       // 0-23

// Format dates
console.log(now.toLocaleDateString());     
console.log(now.toLocaleTimeString());     
console.log(now.toLocaleString());         

// Custom formatting
let options = { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
};
console.log(now.toLocaleDateString('en-US', options));

// Date calculations (age calculator)
function calculateAge(birthDate) {
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

let birthday = new Date(1990, 5, 15);  // June 15, 1990
console.log(calculateAge(birthday));

// Days between dates
let date1 = new Date(2024, 0, 1);
let date2 = new Date(2024, 0, 15);
let diffMs = date2 - date1;  // milliseconds
let diffDays = diffMs / (1000 * 60 * 60 * 24);
console.log(diffDays);  // 14 days`,
              explanation: "Dates are tricky. Always test edge cases (leap years, time zones). Use timestamps (milliseconds since 1970) for calculations to avoid month/day confusion."
            },
            practice: "Create a function that calculates how many days until your next birthday from today."
          }
        },
        {
          id: "js-regex",
          title: "Regular Expressions - Pattern Matching",
          content: {
            explanation: [
              "Regular expressions (regex) find patterns in strings. They're powerful for validation, searching, and replacing text.",
              "",
              "Basic patterns:",
              "• `\\d` - any digit (0-9)",
              "• `\\w` - any word character (a-z, A-Z, 0-9, _)",
              "• `\\s` - any whitespace",
              "• `.` - any character except newline",
              "• `[abc]` - any of a, b, or c",
              "• `[^abc]` - anything except a, b, c",
              "",
              "Quantifiers:",
              "• `*` - zero or more",
              "• `+` - one or more",
              "• `?` - zero or one",
              "• `{3}` - exactly 3",
              "• `{2,5}` - 2 to 5"
            ],
            example: {
              title: "Regex Patterns",
              code: `// Create regex
let re1 = /hello/;  // literal
let re2 = new RegExp("hello");  // constructor

// Test if pattern exists
console.log(/hello/.test("hello world"));  // true
console.log(/world/.test("hello"));        // false

// Common validations
function isValidEmail(email) {
  let pattern = /^[\\w.-]+@[\\w.-]+\\.\\w+$/;
  return pattern.test(email);
}

console.log(isValidEmail("user@example.com"));  // true
console.log(isValidEmail("invalid"));           // false

function isValidPhone(phone) {
  let pattern = /^\\d{3}-\\d{3}-\\d{4}$/;
  return pattern.test(phone);
}

console.log(isValidPhone("123-456-7890"));  // true

// Extract matches
let text = "My email is alice@example.com and bob@test.com";
let emails = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/g);
console.log(emails);  // ["alice@example.com", "bob@test.com"]

// Replace with regex
let messy = "  Hello   World  ";
let clean = messy.replace(/\\s+/g, " ");
console.log(clean);  // "Hello World"

let date = "2024-01-15";
let formatted = date.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, "$2/$3/$1");
console.log(formatted);  // "01/15/2024"

// Flags
console.log(/hello/i.test("HELLO"));  // i = case insensitive
let multiline = "line1\\nline2\\nline3";
console.log(multiline.match(/^line\\d/gm));  // m = multiline`,
              explanation: "Regex syntax is dense but powerful. Start with simple patterns and test thoroughly. Use online regex testers to experiment."
            },
            practice: "Write a regex to validate a ZIP code (5 digits, optional 4-digit extension like 12345-6789). Test with several inputs."
          }
        }
      ]
    },
    {
      id: "js-storage",
      title: "Browser Storage (Conceptual)",
      description: "Learn how to persist data in the browser - for when you build web applications",
      duration: "30 min",
      subtopics: [
        {
          id: "js-localstorage",
          title: "localStorage & sessionStorage",
          content: {
            explanation: [
              "**Note: These examples explain browser storage concepts. The code won't run in the playground because localStorage requires a browser environment, but understand the patterns for when you build web apps.**",
              "",
              "Web storage lets you save data in the user's browser that persists across page reloads.",
              "",
              "**localStorage** - data never expires (until manually cleared)",
              "**sessionStorage** - data cleared when tab closes",
              "",
              "Both store strings only. Use `JSON.stringify()` for objects/arrays.",
              "",
              "Key methods:",
              "• `setItem(key, value)` - store data",
              "• `getItem(key)` - retrieve data",
              "• `removeItem(key)` - delete item",
              "• `clear()` - delete all"
            ],
            example: {
              title: "localStorage Pattern (Browser Only)",
              code: `// This pattern works in browsers, not in playground:
/*
// Save data
localStorage.setItem("username", "Alice");
localStorage.setItem("theme", "dark");

// Save object (stringify first)
let user = { name: "Alice", score: 100 };
localStorage.setItem("userData", JSON.stringify(user));

// Retrieve data
let name = localStorage.getItem("username");
console.log(name);  // "Alice"

// Retrieve and parse object
let savedUser = JSON.parse(localStorage.getItem("userData"));
console.log(savedUser.score);  // 100

// Remove item
localStorage.removeItem("theme");
*/`,
              explanation: "In a real browser environment, localStorage persists data across sessions. Use it for user preferences, saved game states, or offline-capable apps. Never store sensitive data like passwords."
            },
            practice: "Conceptual practice: Describe how you would save a user's theme preference (dark/light mode) using localStorage."
          }
        }
      ]
    },
    {
      id: "js-error-handling",
      title: "Error Handling",
      description: "Manage errors gracefully with try/catch",
      duration: "30 min",
      subtopics: [
        {
          id: "js-try-catch",
          title: "try, catch, finally",
          content: {
            explanation: [
              "Errors happen. `try/catch` lets you handle them without crashing your program.",
              "",
              "• `try` block - code that might throw an error",
              "• `catch` block - runs if error occurs, receives error object",
              "• `finally` block - runs regardless (cleanup code)",
              "",
              "Use it for: network requests, user input, JSON parsing, and any operation that might fail."
            ],
            example: {
              title: "Handling Errors",
              code: `// Basic try/catch
try {
  let result = 10 / 0;  // No error (Infinity)
  console.log(result);
  
  // This will throw
  let data = JSON.parse("invalid json");
} catch (error) {
  console.error("Something went wrong:", error.message);
} finally {
  console.log("This always runs");
}

// Practical: safe JSON parsing
function safeJSONParse(str) {
  try {
    return { data: JSON.parse(str), error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

let result1 = safeJSONParse('{"name":"Alice"}');
console.log(result1.data);  // { name: "Alice" }

let result2 = safeJSONParse("invalid");
console.log(result2.error);  // "Unexpected token i in JSON..."

// Throwing custom errors
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (err) {
  console.error(err.message);  // "Division by zero is not allowed"
}`,
              explanation: "Always validate data that comes from outside your program (user input, API responses). Use `try/catch` to handle the unexpected gracefully."
            },
            practice: "Write a function `safeDivide(a, b)` that returns the result or 'Cannot divide by zero' if b is 0. Use try/catch or condition."
          }
        }
      ]
    },
    {
      id: "js-async",
      title: "Asynchronous JavaScript",
      description: "Promises, async/await, fetch, and handling async operations",
      duration: "85 min",
      subtopics: [
        {
          id: "js-set-timeout",
          title: "setTimeout - Delayed Execution",
          content: {
            explanation: [
              "JavaScript is single-threaded but asynchronous. `setTimeout` schedules a function to run later.",
              "",
              "Syntax: `setTimeout(callback, delayMs)`",
              "",
              "The callback runs AFTER the delay, but other code can run in between (non-blocking)."
            ],
            example: {
              title: "Delayed Execution",
              code: `console.log("Start");

// Schedule a function to run after 2 seconds
setTimeout(() => {
  console.log("Inside timeout (2 seconds later)");
}, 2000);

console.log("End");

// Output order:
// Start
// End
// Inside timeout (2 seconds later)

// With clearTimeout
let timerId = setTimeout(() => {
  console.log("This won't run");
}, 1000);
clearTimeout(timerId);  // Cancels the timeout

// setInterval - repeats every X ms
let count = 0;
let intervalId = setInterval(() => {
  count++;
  console.log("Tick", count);
  if (count === 3) clearInterval(intervalId);
}, 500);`,
              explanation: "Even with 0ms delay, the callback runs AFTER the current code finishes. This is the event loop in action."
            },
            practice: "Use `setTimeout` to print 'Hello' after 1 second, then 'World' after another 0.5 seconds (chained)."
          }
        },
        {
          id: "js-promises",
          title: "Promises - Composing Async Operations",
          content: {
            explanation: [
              "A Promise represents a value that may be available now, later, or never.",
              "",
              "States: pending -> fulfilled OR pending -> rejected",
              "",
              "Use `then()` for success, `catch()` for errors. Multiple `then`s chain.",
              "",
              "Create a promise with `new Promise((resolve, reject) => { ... })`"
            ],
            example: {
              title: "Promise Chaining",
              code: `// Simulate async operation
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Chain promises
delay(1000)
  .then(() => {
    console.log("1 second passed");
    return delay(1000);
  })
  .then(() => {
    console.log("2 seconds passed");
    return Promise.reject("Oops!");
  })
  .then(() => {
    console.log("This won't run");
  })
  .catch(err => {
    console.error("Caught:", err);
  });

// Promise.all - run in parallel, wait for all
let p1 = delay(1000).then(() => "First");
let p2 = delay(500).then(() => "Second");
Promise.all([p1, p2]).then(results => {
  console.log(results);  // ["First", "Second"]
});

// Promise.race - first to settle wins
Promise.race([p1, p2]).then(first => {
  console.log("First completed:", first);  // "Second" (completes faster)
});`,
              explanation: "Promises are EAGER, they start executing when created. Chain promises by returning them from `then`. Errors bubble down the chain."
            },
            practice: "Create a promise that resolves with 'Done!' after a random delay (500-1500ms). Then chain a second promise that resolves with 'Complete!'."
          }
        },
        {
          id: "js-async-await",
          title: "Async/Await - Synchronous-Style Async Code",
          content: {
            explanation: [
              "`async/await` is syntactic sugar over promises, making async code look synchronous.",
              "",
              "• `async function` - returns a promise automatically",
              "• `await expression` - pauses execution until promise settles",
              "• Wrap `await` in `try/catch` for error handling",
              "",
              "`await` only works inside `async` functions."
            ],
            example: {
              title: "Async/Await Patterns",
              code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSequential() {
  console.log("Start");
  await delay(1000);
  console.log("After 1 second");
  await delay(500);
  console.log("After 1.5 seconds total");
}
runSequential();

// Error handling with try/catch
async function fetchData() {
  try {
    let result = await Promise.reject("Network error");
    console.log(result);
  } catch (error) {
    console.error("Caught:", error);  // "Caught: Network error"
  }
}
fetchData();

// Parallel with Promise.all
async function fetchParallel() {
  let [data1, data2] = await Promise.all([
    delay(1000).then(() => "Data 1"),
    delay(500).then(() => "Data 2")
  ]);
  console.log(data1, data2);
}
fetchParallel();`,
              explanation: "`async/await` unwraps promises automatically. The function returns a promise that resolves to the return value. Use `Promise.all` for parallel operations."
            },
            practice: "Write an `async function getMessage()` that awaits `delay(1000)` then returns 'Ready!'. Call it and use `.then()` or another `await` to log the result."
          }
        },
        {
          id: "js-fetch-api",
          title: "Fetch API - Making HTTP Requests",
          content: {
            explanation: [
              "`fetch()` is the modern way to make HTTP requests. It returns a promise that resolves to a `Response` object.",
              "",
              "• Call `.json()` to parse JSON body (returns promise)",
              "• Check `response.ok` (true for 2xx status codes)",
              "• `fetch` only rejects on network failure, NOT on HTTP errors like 404"
            ],
            example: {
              title: "Fetch Complete",
              code: `// GET request
async function getTodo() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    let todo = await response.json();
    console.log(todo.title);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
getTodo();

// POST request
async function createPost() {
  let newPost = {
    title: "My Post",
    body: "Content here",
    userId: 1
  };
  
  let response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPost)
  });
  
  let data = await response.json();
  console.log("Created:", data);
}
createPost();

// Promise version (if not using async/await)
fetch("https://jsonplaceholder.typicode.com/todos/2")
  .then(res => res.json())
  .then(data => console.log(data.title))
  .catch(err => console.error(err));`,
              explanation: "Always check `response.ok`. For POST/PUT, set `Content-Type: application/json` and stringify the body. Use `try/catch` for network errors. This works in the playground!"
            },
            practice: "Use `fetch` to GET 'https://jsonplaceholder.typicode.com/users/1'. Log the user's name and email from the JSON response."
          }
        }
      ]
    },
    {
      id: "js-projects",
      title: "Practical Projects - Pure JavaScript Logic",
      description: "Apply everything you've learned to build functional data-driven applications (no DOM required)",
      duration: "60 min",
      subtopics: [
        {
          id: "js-project-todo-logic",
          title: "Todo List Logic (Data Structure)",
          content: {
            explanation: [
              "Build the backend logic for a todo list application. This project focuses on pure JavaScript data manipulation.",
              "",
              "Features to implement:",
              "• Add new tasks",
              "• Mark tasks as complete",
              "• Delete tasks",
              "• Filter tasks by status",
              "• Calculate statistics"
            ],
            example: {
              title: "Todo List Logic",
              code: `// Pure JavaScript todo list manager
class TodoManager {
  constructor() {
    this.tasks = [];
  }
  
  addTask(text) {
    if (!text.trim()) return false;
    this.tasks.push({
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date()
    });
    return true;
  }
  
  toggleTask(id) {
    let task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      return true;
    }
    return false;
  }
  
  deleteTask(id) {
    let initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length !== initialLength;
  }
  
  getTasks(filter = "all") {
    if (filter === "active") {
      return this.tasks.filter(t => !t.completed);
    } else if (filter === "completed") {
      return this.tasks.filter(t => t.completed);
    }
    return this.tasks;
  }
  
  getStats() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      active: this.tasks.filter(t => !t.completed).length
    };
  }
  
  clearCompleted() {
    this.tasks = this.tasks.filter(t => !t.completed);
  }
}

// Usage
let todo = new TodoManager();
todo.addTask("Learn JavaScript");
todo.addTask("Build a project");
todo.addTask("Master async/await");

console.log("All tasks:", todo.getTasks());
console.log("Stats:", todo.getStats());

todo.toggleTask(todo.tasks[0].id);
console.log("After toggling first task:", todo.getStats());

console.log("Active tasks:", todo.getTasks("active"));

todo.clearCompleted();
console.log("After clearing completed:", todo.getTasks());`,
              explanation: "This demonstrates encapsulation, data management, and filtering logic - all in pure JavaScript without any DOM dependencies."
            },
            practice: "Extend the TodoManager with an `editTask(id, newText)` method and a `getTaskById(id)` method."
          }
        },
        {
          id: "js-project-weather-logic",
          title: "Weather API Integration",
          content: {
            explanation: [
              "Build a weather data fetcher that demonstrates async/await, fetch, error handling, and data transformation.",
              "",
              "Features:",
              "• Fetch weather by city name",
              "• Parse and transform API response",
              "• Handle errors gracefully",
              "• Cache results to avoid duplicate requests"
            ],
            example: {
              title: "Weather API Client",
              code: `class WeatherClient {
  constructor() {
    this.cache = new Map();
  }
  
  async getWeather(city) {
    // Check cache first
    if (this.cache.has(city.toLowerCase())) {
      console.log("Returning cached data for", city);
      return this.cache.get(city.toLowerCase());
    }
    
    try {
      // Using free API (JSONPlaceholder mock - replace with real weather API in production)
      let response = await fetch(\`https://jsonplaceholder.typicode.com/todos/1\`);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      
      let data = await response.json();
      
      // Transform API response to our format
      let weatherData = {
        city: city,
        temperature: Math.floor(Math.random() * 30) + 10, // Mock data
        conditions: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 50) + 30,
        timestamp: new Date()
      };
      
      // Cache the result
      this.cache.set(city.toLowerCase(), weatherData);
      return weatherData;
      
    } catch (error) {
      throw new Error(\`Failed to fetch weather for \${city}: \${error.message}\`);
    }
  }
  
  formatWeatherReport(weather) {
    return \`
      Weather in \${weather.city}:
      Temperature: \${weather.temperature}°C
      Conditions: \${weather.conditions}
      Humidity: \${weather.humidity}%
      Last updated: \${weather.timestamp.toLocaleTimeString()}
    \`;
  }
  
  async displayWeather(city) {
    try {
      let weather = await this.getWeather(city);
      console.log(this.formatWeatherReport(weather));
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  clearCache() {
    this.cache.clear();
    console.log("Cache cleared");
  }
}

// Usage
async function demo() {
  let client = new WeatherClient();
  
  await client.displayWeather("New York");
  await client.displayWeather("London");
  await client.displayWeather("New York"); // Should use cache
  
  console.log("Cache size:", client.cache.size);
}

demo();`,
              explanation: "This demonstrates async/await, error handling, caching strategies, and data transformation - all in pure JavaScript."
            },
            practice: "Add a `getForecast(city, days)` method that fetches multiple days of forecast data."
          }
        },
        {
          id: "js-project-quiz-logic",
          title: "Quiz Engine (Data-Driven)",
          content: {
            explanation: [
              "Build a quiz engine that manages questions, tracks answers, calculates scores, and provides feedback.",
              "",
              "Features:",
              "• Store questions with options and correct answers",
              "• Track user answers",
              "• Calculate score and percentage",
              "• Provide detailed feedback",
              "• Support multiple quiz topics"
            ],
            example: {
              title: "Quiz Engine",
              code: `class QuizEngine {
  constructor(questions) {
    this.questions = questions;
    this.userAnswers = new Array(questions.length).fill(null);
    this.currentIndex = 0;
  }
  
  getCurrentQuestion() {
    return {
      question: this.questions[this.currentIndex],
      index: this.currentIndex,
      total: this.questions.length,
      progress: ((this.currentIndex + 1) / this.questions.length) * 100
    };
  }
  
  answerCurrent(answerIndex) {
    this.userAnswers[this.currentIndex] = answerIndex;
  }
  
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }
  
  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }
  
  isComplete() {
    return this.userAnswers.every(answer => answer !== null);
  }
  
  getScore() {
    let correct = 0;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.userAnswers[i] === this.questions[i].correct) {
        correct++;
      }
    }
    return {
      correct,
      total: this.questions.length,
      percentage: (correct / this.questions.length) * 100
    };
  }
  
  getDetailedResults() {
    let results = [];
    for (let i = 0; i < this.questions.length; i++) {
      let isCorrect = this.userAnswers[i] === this.questions[i].correct;
      results.push({
        questionText: this.questions[i].text,
        userAnswer: this.userAnswers[i] !== null ? 
          this.questions[i].options[this.userAnswers[i]] : "Not answered",
        correctAnswer: this.questions[i].options[this.questions[i].correct],
        isCorrect: isCorrect,
        explanation: this.questions[i].explanation || "No explanation provided"
      });
    }
    return results;
  }
  
  reset() {
    this.userAnswers.fill(null);
    this.currentIndex = 0;
  }
}

// Sample questions
let sampleQuestions = [
  {
    text: "What does 'typeof null' return?",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correct: 2,
    explanation: "This is a known bug in JavaScript - typeof null returns 'object'."
  },
  {
    text: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0,
    explanation: "push() adds elements to the end of an array."
  },
  {
    text: "What does '===' compare?",
    options: ["Only value", "Only type", "Value and type", "Memory address"],
    correct: 2,
    explanation: "=== compares both value and type without type coercion."
  }
];

// Usage
let quiz = new QuizEngine(sampleQuestions);

console.log("Current question:", quiz.getCurrentQuestion().question.text);

quiz.answerCurrent(2); // Answer current question
quiz.nextQuestion();
quiz.answerCurrent(0);
quiz.nextQuestion();
quiz.answerCurrent(2);

console.log("Quiz complete?", quiz.isComplete());
console.log("Score:", quiz.getScore());

let results = quiz.getDetailedResults();
results.forEach((result, i) => {
  console.log(\`Q\${i+1}: \${result.isCorrect ? '✓' : '✗'} - \${result.questionText}\`);
  console.log(\`  Your answer: \${result.userAnswer}\`);
  console.log(\`  Correct: \${result.correctAnswer}\`);
});`,
              explanation: "This demonstrates class design, data structures, state management, and calculation logic - perfect for testing JavaScript fundamentals."
            },
            practice: "Add a `shuffleQuestions()` method that randomizes the question order, and a `getRemainingQuestions()` method that returns unanswered questions."
          }
        }
      ]
    }
  ]
};