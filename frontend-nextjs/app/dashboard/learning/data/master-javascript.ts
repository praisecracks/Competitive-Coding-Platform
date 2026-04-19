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
  totalHours: 28,
  language: "javascript",
  category: "JavaScript",
  topics: [
    {
      id: "js-variables",
      title: "Variables & Data Types",
      description: "Learn how to store and work with data in JavaScript — from numbers and text to true/false values.",
      duration: "75 min",
      subtopics: [
        {
          id: "js-var-intro",
          title: "What is a Variable?",
          content: {
            explanation: [
              "A variable is a named container that holds a value. Think of it like a labeled box — you put something inside and later you can check what's there.",
              "",
              "Variables let you reuse values without typing them repeatedly. If you need to change a value, you only update it once — everywhere it's used updates automatically.",
              "",
              "JavaScript gives you three keywords to create variables: `let`, `const`, and the older `var`. We'll start with `let` and `const` because they are safer and less confusing.",
              "",
              "Here's a simple variable in action:"
            ],
            example: {
              title: "Create Your First Variables",
              code: `let userName = "Alice";
let userAge = 25;
let isSubscribed = true;

console.log(userName);      // "Alice"
console.log(userAge);       // 25
console.log(isSubscribed);  // true`,
              explanation: "We created three variables: a string (text), a number, and a boolean (true/false). Each variable stores a different type of data. You can print any variable with console.log()."
            },
            practice: "Create a variable called `score` with value 100, then log it to the console."
          }
        },
        {
          id: "js-var-let",
          title: "Using `let` — Reassignable Variables",
          content: {
            explanation: [
              "The `let` keyword declares a variable that can be changed later. This is perfect for values that will update during your program — like a score that increases, a counter that increments, or a user's selected option.",
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
          title: "Using `const` — Immutable Values",
          content: {
            explanation: [
              "`const` creates a variable that cannot be reassigned. Use it for values that should never change — like configuration settings, mathematical constants (PI), or references to functions and objects you want to keep intact.",
              "",
              "Like `let`, `const` also has block scope. The key difference: you must provide an initial value when you declare a `const`, and you cannot assign a new value later.",
              "",
              "⚠️ Important: `const` only prevents reassignment. If the value is an object or array, you can still modify its contents (this is called mutation)."
            ],
            example: {
              title: "Constant Values",
              code: `const APP_NAME = "CodeMaster";
const MAX_USERS = 1000;

console.log(APP_NAME);   // "CodeMaster"
console.log(MAX_USERS);  // 1000

// This would cause an error:
// MAX_USERS = 2000;  // ❌ TypeError: Assignment to constant variable`,
              explanation: "Notice we use UPPER_CASE naming for constants by convention — this signals to other developers that this value should not change. Trying to reassign a `const` crashes your code."
            },
            practice: "Create a constant `TAX_RATE` with value 0.08 and log it. Try reassigning it to see the error."
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
              "• It has function scope (not block scope) — it 'leaks' outside of loops and if-blocks",
              "• It gets hoisted (moved to the top of its scope) before code runs, which can be confusing",
              "• You can redeclare the same `var` variable multiple times — which can accidentally overwrite values"
            ],
            example: {
              title: "Why `var` Is Problematic",
              code: `// Block scope issue with var
for (var i = 0; i < 3; i++) {
  console.log("Inside loop:", i);  // 0, 1, 2
}
console.log("Outside loop:", i);  // 3 — i 'leaked' out! 🚨

// With let (correct behavior):
for (let j = 0; j < 3; j++) {
  console.log("Inside loop:", j);  // 0, 1, 2
}
// console.log(j);  // ❌ ReferenceError — j doesn't exist here`,
              explanation: "The `var` variable `i` survives after the loop finishes — this can cause unexpected bugs. `let` correctly limits the variable to the block where it was created."
            },
            practice: "Try the same example with `var` and `let` to see the difference yourself."
          }
        },
        {
          id: "js-types-overview",
          title: "JavaScript Data Types — Overview",
          content: {
            explanation: [
              "JavaScript values belong to different types. Understanding types helps you avoid bugs and write cleaner code.",
              "",
              "There are two main categories:",
              "",
              "**Primitive Types** — simple, immutable values stored directly:",
              "• `String` — text, like `'Hello'` or `'CodeMaster'`",
              "• `Number` — integers and decimals, like `42` or `3.14`",
              "• `Boolean` — `true` or `false`",
              "• `null` — intentional absence of value",
              "• `undefined` — value not yet assigned",
              "• `BigInt` — very large numbers",
              "• `Symbol` — unique identifiers (advanced)",
              "",
              "**Reference Types** — complex values stored as objects:",
              "• `Object` — collections of key-value pairs `{ name: 'John' }`",
              "• `Array` — ordered lists `[1, 2, 3]`",
              "• `Function` — callable code blocks"
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
              explanation: "The `typeof` operator tells you the type of any value. Notice `null` incorrectly reports as 'object' — this is a long-standing JavaScript bug you should be aware of."
            },
            practice: "Create one variable of each primitive type and log their types."
          }
        },
        {
          id: "js-types-string",
          title: "Strings — Working with Text",
          content: {
            explanation: [
              "Strings store text data. They can contain letters, numbers, spaces, and symbols. JavaScript strings are immutable — methods on a string return a new string; they don't modify the original.",
              "",
              "You can create strings with single quotes `'` or double quotes `'`. Backticks \` allow template literals — strings that can embed variables inside `${expression}`.",
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
console.log(name.length);           // 5 — length of string
console.log(name.toUpperCase());    // "ALICE"
console.log(name.toLowerCase());    // "alice"
console.log(name.includes("li"));   // true — contains "li"?
console.log(name.split(""));        // ["A","l","i","c","e"] — split into array

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
          title: "Numbers — Integers, Floats, and Math",
          content: {
            explanation: [
              "JavaScript has only one number type: `number` (IEEE 754 double-precision floating point). This means it can represent both integers like `42` and decimals like `3.14`.",
              "",
              "Special numeric values:",
              "• `Infinity` — positive infinity (larger than any number)",
              "• `-Infinity` — negative infinity",
              "• `NaN` — 'Not a Number' (result of invalid math like 0/0 or parseInt('abc'))",
              "",
              "⚠️ Floating point precision: 0.1 + 0.2 equals 0.30000000000000004 — not exactly 0.3. This is a known IEEE 754 behavior; for money use integer cents or a library."
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
console.log(10 % 3);     // 1 — remainder

// Special values
console.log(1 / 0);      // Infinity
console.log(-1 / 0);     // -Infinity
console.log(0 / 0);      // NaN
console.log(Number("abc")); // NaN

// Math object
console.log(Math.PI);            // 3.14159...
console.log(Math.floor(3.9));    // 3 — round down
console.log(Math.ceil(3.1));     // 4 — round up
console.log(Math.random());      // 0-1 random number`,
              explanation: "JavaScript's `Math` object provides constants and functions for common math operations. Use `Math.floor()` to drop decimals, `Math.ceil()` to round up, and `Math.random()` for random numbers."
            },
            practice: "Calculate the area of a circle with radius 5 using Math.PI and radius squared. Print the result."
          }
        },
        {
          id: "js-types-boolean",
          title: "Booleans — true & false",
          content: {
            explanation: [
              "Booleans represent truth values: `true` or `false`. They are the foundation of all conditional logic — `if` statements, loops, and comparisons all produce or use booleans.",
              "",
              "JavaScript also treats other values as 'truthy' or 'falsy' when used in a boolean context:",
              "",
              "**Falsy values** (act like false): `false`, `0`, `-0`, `0n` (BigInt zero), `\"\"` (empty string), `null`, `undefined`, `NaN`",
              "**Truthy values** (act like true): everything else — `\"0\"`, `\"false\"`, `[]`, `{}`, functions, non-zero numbers, non-empty strings"
            ],
            example: {
              title: "Truthy vs Falsy",
              code: `// Explicit booleans
let isActive = true;
let isCompleted = false;

// Testing truthiness
if ("hello") { console.log("String is truthy"); }
if (0) { console.log("Zero is falsy"); } else { console.log("Zero is falsy"); }
if ("") { console.log("Empty string is truthy"); } else { console.log("Empty string is falsy"); }
if ([]) { console.log("Empty array is truthy"); }
if ({}) { console.log("Empty object is truthy"); }

// Comparison operators return booleans
console.log(5 > 3);     // true
console.log(5 === 5);   // true (strict equality)
console.log(5 == "5");  // true (loose equality — avoid!)
console.log(5 !== 3);   // true`,
              explanation: "Any value can be used where a boolean is expected. JavaScript automatically converts to true or false. For clarity, use strict equality `===` instead of loose `==` to avoid unexpected type conversions."
            },
            practice: "Write an if-statement that checks if a variable `score` is greater than 50, and print 'Pass' if true, 'Fail' if false."
          }
        },
        {
          id: "js-types-null-undefined",
          title: "`null` and `undefined` — Absence of Value",
          content: {
            explanation: [
              "`undefined` means a variable has been declared but not assigned a value yet. It's the default state of newly declared variables (without `let`/`const`).",
              "",
              "`null` means 'no value' — an intentional absence. You assign `null` to say 'this variable exists but currently has nothing.' Think of `undefined` as 'not yet set' and `null` as 'explicitly empty.'",
              "",
              "Key difference: `undefined` is the system's default; `null` is programmer-chosen."
            ],
            example: {
              title: "undefined vs null",
              code: `let notAssigned;
console.log(notAssigned);        // undefined — never given a value
console.log(typeof notAssigned); // "undefined"

let empty = null;
console.log(empty);              // null — we set it to nothing on purpose
console.log(typeof empty);       // "object" — another JavaScript quirk!

// Checking for absence
if (notAssigned === undefined) {
  console.log("Variable was never set");
}
if (empty === null) {
  console.log("We intentionally set this to empty");
}

// Common pattern: reset a variable
let userName = "Alice";
userName = null;  // Clear it — user logged out or removed`,
              explanation: "Use `null` to clear a variable's value (like logging out a user). Checking `=== null` tells you the variable was deliberately emptied. `undefined` just means you never gave it anything."
            },
            practice: "Create a variable `middleName` but don't assign anything. Log its value. Then assign it to null and log again."
          }
        }
      ]
    },
    {
      id: "js-conditionals",
      title: "Conditionals",
      description: "Make decisions in your code — run different code based on conditions",
      duration: "50 min",
      subtopics: [
        {
          id: "js-if-else",
          title: "If / Else Statements",
          content: {
            explanation: [
              "Conditional statements let your program make decisions. The `if` statement checks a condition — if it's true, a block of code runs; if false, that block is skipped.",
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

// Output: "It's cold outside!" (32 is not > 10? Actually 32 > 10, so it would be "It's cool outside." — let me fix the example)
// Corrected example:
let temp = 32;
if (temp > 30) {
  console.log("Hot");
} else if (temp > 20) {
  console.log("Warm");
} else if (temp > 10) {
  console.log("Cool");
} else {
  console.log("Cold");
}
// Output: "Warm" (32 > 20)`,
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

// Output: "Good job!"`,
              explanation: "Switch compares using strict equality (`===`). Always include `break` unless you intentionally want multiple cases to execute. The `default` case handles unexpected values."
            },
            practice: "Create a switch that prints the full name of a day given `day = 'Mon'` → 'Monday'."
          }
        },
        {
          id: "js-ternary",
          title: "Ternary Operator — Quick Conditionals",
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
let grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";`,
              explanation: "The ternary returns one of two values based on a condition. It's an expression (produces a value), unlike `if` which is a statement. Use it for simple, readable decisions."
            },
            practice: "Use a ternary to set `message = isLoggedIn ? 'Welcome back!' : 'Please log in.'`"
          }
        },
        {
          id: "js-logical-operators",
          title: "Logical Operators — &&, ||, !",
          content: {
            explanation: [
              "Logical operators combine or invert boolean values. They're essential for building complex conditions.",
              "",
              "`&&` (AND): true if both sides are true",
              "`||` (OR): true if at least one side is true",
              "`!` (NOT): flips true ↔ false",
              "",
              "These operators also perform short-circuit evaluation and can return non-boolean values (the actual value, not just true/false) — a unique JavaScript feature."
            ],
            example: {
              title: "And, Or, Not",
              code: `// AND (&&) — both must be true
console.log(true && true);   // true
console.log(true && false);  // false
console.log(false && false); // false

// OR (||) — at least one true
console.log(true || false);  // true
console.log(false || false); // false

// NOT (!)
console.log(!true);          // false
console.log(!false);         // true

// Short-circuit return values
console.log(0 || "default");      // "default" — 0 is falsy, returns right side
console.log("Hello" || "fallback"); // "Hello" — truthy, returns left side
console.log(null && "nope");       // null — left falsy, returns left side

// Practical use
let userName = null;
let displayName = userName || "Guest";
console.log(displayName);  // "Guest" — fallback value`,
              explanation: "Logical operators short-circuit: `&&` returns left if falsy (no need to check right); `||` returns left if truthy. This makes them perfect for default values."
            },
            practice: "Write a condition that requires `isLoggedIn` AND `hasPermission` to be true to allow access."
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
              "• Share code with others (built-in functions like `console.log`)",
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
              "• You can pass fewer arguments than parameters — missing ones become `undefined`",
              "• You can pass more arguments than parameters — extra ones are ignored",
              "• Default parameters (`function greet(name = 'Guest')`) provide fallback values",
              "",
              "Always validate inputs if your function depends on them."
            ],
            example: {
              title: "Parameters in Action",
              code: `function introduce(name, age, city) {
  console.log(\`I'm \${name}, \${age} years old from \${city}\`);
}

// Provide all three arguments
introduce("Sarah", 28, "Lagos");  // Works

// Missing arguments become undefined
introduce("John", 25);  // city is undefined -> "I'm John, 25 years old from undefined"

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
              "You can have multiple `return` statements, often used for early exit — handling edge cases first before the main logic. This keeps your code cleaner by avoiding deep nesting.",
              "",
              "`return` also works without a value (`return;`) which returns `undefined` explicitly."
            ],
            example: {
              title: "Early Returns",
              code: `function divide(a, b) {
  // Guard clause — handle error early
  if (b === 0) {
    console.error("Cannot divide by zero");
    return null;  // Exit early
  }
  
  // Main logic only runs if b != 0
  return a / b;
}

let result1 = divide(10, 2);
console.log(result1);  // 5

let result2 = divide(10, 0);
console.log(result2);  // null`,
              explanation: "Early returns (guard clauses) handle edge cases upfront, making the happy path less indented and easier to read. This pattern is common in professional codebases."
            },
            practice: "Write a function `getDayName(dayNumber)` that returns 'Mon' for 1, 'Tue' for 2, etc. Use 0-6 mapping. Return 'Invalid' for out-of-range numbers."
          }
        },
        {
          id: "js-arrow-func",
          title: "Arrow Functions — Modern Syntax",
          content: {
            explanation: [
              "Arrow functions provide a shorter, cleaner syntax. They were introduced in ES6 and are now the standard for most use cases, especially callbacks and array methods.",
              "",
              "Key differences from regular functions:",
              "• No `function` keyword — use `=>` after parameters",
              "• Implicit `return` when body is a single expression (no curly braces)",
              "• No own `this` binding — `this` comes from the surrounding scope (important for methods and event handlers)",
              "• Cannot be used as constructors (no `new`)",
              "",
              "Use arrow functions for callbacks and short utilities. Use regular functions when you need `this` binding or a constructor."
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
              explanation: "Arrow functions with implicit return are concise for one-liners. For longer functions, use curly braces and explicit `return`. Remember: `this` in an arrow function is taken from the outer context — it does NOT create its own `this`."
            },
            practice: "Rewrite a regular function as an arrow: `function square(x) { return x * x; }`"
          }
        },
        {
          id: "js-func-callbacks",
          title: "Callbacks — Functions as Arguments",
          content: {
            explanation: [
              "In JavaScript, functions are 'first-class citizens' — you can pass them as arguments to other functions, return them from functions, and store them in variables.",
              "",
              "A callback is a function passed as an argument to another function. The receiving function calls the callback at the appropriate time. This pattern is everywhere: array methods (`map`, `filter`), event handlers, timers (`setTimeout`), and async operations.",
              "",
              "Callbacks enable asynchronous programming and code reuse."
            ],
            example: {
              title: "Passing Functions Around",
              code: `// Higher-order function — takes a function as argument
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
              explanation: "The `calculate` function is a higher-order function — it accepts another function (`operation`) and calls it. This decouples the 'what' (arithmetic) from the 'how' (the operation itself)."
            },
            practice: "Write a function `processNumbers(arr, callback)` that applies the callback to every element and returns a new array. Test with `n => n * 2`."
          }
        }
      ]
    },
    {
      id: "js-arrays",
      title: "Arrays & Array Methods",
      description: "Master arrays — ordered lists with powerful built-in methods for transformation and manipulation",
      duration: "75 min",
      subtopics: [
        {
          id: "js-array-intro",
          title: "What Is an Array?",
          content: {
            explanation: [
              "An array is an ordered collection of values. Think of it like a numbered shelf — each item has a position (index) starting at 0.",
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
              explanation: "Arrays use zero-based indexing. The first element is at line 0, not 1. Always check bounds to avoid `undefined`."
            },
            practice: "Create an array `colors` with three color names. Print the first and last elements and the array length."
          }
        },
        {
          id: "js-array-methods-basics",
          title: "Essential Array Methods — push, pop, shift, unshift",
          content: {
            explanation: [
                "These four methods let you add and remove elements from the beginning or end of an array. They modify the array in place (mutate it) and often return a value.",
                "",
                "• `push(...items)` — add one or more items to the END, returns new length",
                "• `pop()` — remove and return the LAST item",
                "• `unshift(...items)` — add items to the BEGINNING, returns new length",
                "• `shift()` — remove and return the FIRST item"
              ],
              example: {
                title: "Adding and Removing Elements",
                code: `let stack = [1, 2, 3];

// push — add to end
stack.push(4);
console.log(stack);  // [1, 2, 3, 4]
console.log(stack.length);  // 4

// pop — remove from end
let last = stack.pop();
console.log(last);   // 4
console.log(stack);  // [1, 2, 3]

// unshift — add to front
stack.unshift(0);
console.log(stack);  // [0, 1, 2, 3]

// shift — remove from front
let first = stack.shift();
console.log(first);  // 0
console.log(stack);  // [1, 2, 3]`,
                explanation: "`push` and `pop` make an array work like a stack (LIFO). `shift` and `unshift` are slower because they must move all other elements."
              },
              practice: "Start with `let line = ['a', 'b', 'c']`. Use `push` to add 'd', then `shift` to remove 'a'. Print the final array."
            }
          },
          {
            id: "js-array-slice-splice",
            title: "slice() vs splice() — Extracting and Removing",
            content: {
              explanation: [
                "These two methods sound similar but behave very differently:",
                "",
                "• `slice(start, end)` — NON-DESTRUCTIVE. Returns a shallow copy from `start` up to (but not including) `end`. If you omit `end`, it goes to the end. Negative indices count from the end.",
                "• `splice(start, deleteCount, ...items)` — DESTRUCTIVE. Removes items from the array starting at `start` and optionally inserts new items in their place. Returns the removed items."
              ],
              example: {
                title: "slice vs splice",
                code: `let nums = [1, 2, 3, 4, 5];

// slice — extracts, original unchanged
let firstThree = nums.slice(0, 3);
console.log(firstThree);  // [1, 2, 3]
console.log(nums);        // [1, 2, 3, 4, 5] — intact

// slice with negative index
let lastTwo = nums.slice(-2);
console.log(lastTwo);  // [4, 5]

// splice — modifies original
let removed = nums.splice(2, 2, 99);
console.log(removed);  // [3, 4] — what was removed
console.log(nums);     // [1, 2, 99, 5] — array changed

// splice to insert without removing
nums.splice(1, 0, 1.5);
console.log(nums);  // [1, 1.5, 2, 99, 5]`,
                explanation: "Use `slice` when you need a copy. Use `splice` when you need to edit the array in place. Memorize the parameter order: `splice(start, deleteCount, ...items)`."
              },
              practice: "Given `let arr = ['a', 'b', 'c', 'd']`, use `slice` to get `['b', 'c']` without modifying `arr`. Then use `splice` on a copy to remove 'c' and insert 'X' in its place."
            }
          },
          {
            id: "js-array-find-includes",
            title: "Finding Elements — find, findIndex, includes, indexOf",
            content: {
              explanation: [
                "When you need to locate something in an array, use these methods:",
                "",
                "• `includes(value)` — returns `true` if value exists (uses `===` comparison)",
                "• `indexOf(value)` — returns first index or -1 if not found (`===` comparison)",
                "• `find(callback)` — returns first element that matches the callback, or `undefined`",
                "• `findIndex(callback)` — returns index of first match, or -1"
              ],
              example: {
                title: "Searching Arrays",
                code: `let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

// includes / indexOf — works with primitives
let nums = [1, 2, 3, 2, 1];
console.log(nums.includes(2));      // true
console.log(nums.indexOf(2));       // 1 (first occurrence)
console.log(nums.lastIndexOf(2));   // 3 (last occurrence)

// find — search objects with a condition
let user = users.find(u => u.id === 2);
console.log(user);  // { id: 2, name: "Bob" }

// findIndex — get position
let idx = users.findIndex(u => u.name === "Charlie");
console.log(idx);  // 2`,
                explanation: "`includes` and `indexOf` are for simple equality checks. `find` and `findIndex` accept a callback function for complex conditions like searching objects."
              },
              practice: "Create an array of numbers. Use `find` to locate the first number greater than 10. Use `findIndex` to get its position."
            }
          },
          {
            id: "js-array-transform",
            title: "Transforming Arrays — map, flatMap, and toSorted",
            content: {
              explanation: [
                "Transformation methods create new arrays by applying a function to each element:",
                "",
                "• `map(callback)` — transforms each element, returns same-length array",
                "• `flatMap(callback)` — like `map` but flattens one level of nested arrays",
                "• `toSorted()` (ES2023) — returns a sorted copy without mutating original",
                "",
                "All three are NON-DESTRUCTIVE — they don't change the original array."
              ],
              example: {
                title: "Mapping and Flattening",
                code: `let nums = [1, 2, 3];

// map — transform each element
let doubled = nums.map(n => n * 2);
console.log(doubled);  // [2, 4, 6]
console.log(nums);     // [1, 2, 3] — unchanged

// map with objects
let users = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 92 }
];
let names = users.map(u => u.name);
console.log(names);  // ["Alice", "Bob"]

// flatMap — map + flatten one level
let sentences = ["Hello world", "good morning"];
let words = sentences.flatMap(s => s.split(" "));
console.log(words);  // ["Hello", "world", "good", "morning"]

// toSorted — non-destructive sort
let nums2 = [3, 1, 4, 2];
let sorted = nums2.toSorted();
console.log(sorted);  // [1, 2, 3, 4]
console.log(nums2);   // [3, 1, 4, 2] — unchanged`,
                explanation: "`map` is one of the most powerful array methods. Use it whenever you need to convert one array into another. `flatMap` is perfect for splitting and flattening in one step."
              },
              practice: "Given an array of prices [10, 20, 30], use `map` to create a new array of prices with 10% tax added. Then use `flatMap` to split a sentence into words."
            }
          },
          {
            id: "js-array-filter-reduce",
            title: "Filter & Reduce — Selection and Aggregation",
            content: {
              explanation: [
                "`filter` and `reduce` are the dynamic duo of array processing:",
                "",
                "• `filter(callback)` — keeps only elements that return `true`, returns smaller array",
                "• `reduce(callback, initialValue)` — combines all elements into a single value (sum, product, object, etc.)",
                "",
                "Both are NON-DESTRUCTIVE and fundamental to functional programming in JavaScript."
              ],
              example: {
                title: "Filtering and Reducing",
                code: `let scores = [65, 82, 90, 58, 77, 94];

// filter — select passing scores
let passing = scores.filter(s => s >= 70);
console.log(passing);  // [82, 90, 77, 94]

// reduce — sum all scores
let total = scores.reduce((sum, s) => sum + s, 0);
console.log(total);  // 466

// reduce — find max
let max = scores.reduce((max, s) => s > max ? s : max, scores[0]);
console.log(max);  // 94

// reduce — group by grade
let grades = scores.reduce((acc, s) => {
  let grade = s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "F";
  if (!acc[grade]) acc[grade] = [];
  acc[grade].push(s);
  return acc;
}, {});
console.log(grades);
// { C: [82, 77], A: [90, 94], F: [65, 58] }`,
                explanation: "`filter` answers 'which items match?'. `reduce` answers 'what single value summarizes this array?'. The reduce accumulator builds up state on each iteration."
              },
              practice: "Given `students = [{name:'A', grade:85}, {name:'B', grade:92}, {name:'C', grade:68}]`, filter to passing students (≥70) and then use reduce to count how many passed."
            }
          },
          {
            id: "js-array-multidimensional",
            title: "Multidimensional Arrays — Matrices and Grids",
            content: {
              explanation: [
                "Arrays can contain other arrays. A 2D array (matrix) is an array of arrays, perfect for grids, game boards, or tabular data.",
                "",
                "Access: `matrix[row][col]`. Iterate with nested loops or `flat()` to flatten.",
                "",
                "Common patterns:",
                "• Transpose rows ↔ columns",
                "• Spiral traversal",
                "• Diagonal sums"
              ],
              example: {
                title: "2D Array Operations",
                code: `// Create a 3x3 matrix
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(matrix[1][2]);  // 6 — row 1, col 2

// Iterate all elements
for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[0].length; col++) {
    console.log(matrix[row][col]);
  }
}

// Sum all elements
let sum = matrix.flat().reduce((a, b) => a + b, 0);
console.log(sum);  // 45

// Transpose (swap rows and columns)
let rows = matrix.length, cols = matrix[0].length;
let transposed = [];
for (let c = 0; c < cols; c++) {
  let newRow = [];
  for (let r = 0; r < rows; r++) {
    newRow.push(matrix[r][c]);
  }
  transposed.push(newRow);
}
console.log(transposed);
// [[1,4,7], [2,5,8], [3,6,9]]`,
                explanation: "2D arrays use `matrix[row][col]` notation. `flat()` collapses nested arrays into a single dimension. Transposition swaps rows and columns."
              },
              practice: "Create a 2x3 matrix `[[1,2,3],[4,5,6]]`. Write code to calculate the sum of each row (hint: use `map` on the outer array, then `reduce` on each inner)."
            }
          }
        ]
      },
      {
        id: "js-objects",
        title: "Objects & Properties",
        description: "Work with key-value pairs, object methods, and the prototype chain",
        duration: "80 min",
        subtopics: [
          {
            id: "js-obj-basics",
            title: "Object Fundamentals",
            content: {
              explanation: [
                "Objects are collections of key-value pairs (properties). Keys are strings (or symbols), values can be any type. Objects are reference types — copying an object copies the reference, not the data.",
                "",
                "Create objects with object literals `{}`, `new Object()`, or with classes. Literals are most common."
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
console.log(user["name"]);     // bracket also works

// Dynamic access
let key = "isAdmin";
console.log(user[key]);        // false

// Update properties
user.age = 26;
user.city = "NYC";  // adds new property

// Check if property exists
console.log("age" in user);           // true
console.log(user.hasOwnProperty("name"));  // true`,
                explanation: "Dot notation is cleaner but requires a valid identifier name. Bracket notation allows dynamic keys and keys with special characters. Objects are mutable — you can add/remove properties anytime."
              },
              practice: "Create a `book` object with title, author, year, and a boolean `available`. Access each property both ways (dot and bracket)."
            }
          },
          {
            id: "js-obj-methods",
            title: "Object Methods — keys, values, entries, assign",
            content: {
              explanation: [
                "JavaScript provides built-in methods to inspect and manipulate objects:",
                "",
                "• `Object.keys(obj)` — array of own enumerable property names",
                "• `Object.values(obj)` — array of values",
                "• `Object.entries(obj)` — array of `[key, value]` pairs",
                "• `Object.assign(target, source)` — shallow merge objects",
                "• `Object.freeze(obj)` — prevent all modifications",
                "• `Object.seal(obj)` — prevent new properties but allow value changes"
              ],
              example: {
                title: "Inspecting and Merging Objects",
                code: `let user = { name: "Alice", age: 25, role: "admin" };

// Get keys, values, entries
console.log(Object.keys(user));    // ["name", "age", "role"]
console.log(Object.values(user));  // ["Alice", 25, "admin"]
console.log(Object.entries(user));
// [["name","Alice"], ["age",25], ["role","admin"]]

// Iterate
for (let key of Object.keys(user)) {
  console.log(\`\${key}: \${user[key]}\`);
}

// Merge objects
let defaults = { theme: "dark", notifications: true };
let settings = { theme: "light" };
let final = Object.assign({}, defaults, settings);
console.log(final);  // { theme: "light", notifications: true } — settings overrides defaults

// Freeze prevents changes
let config = Object.freeze({ api: "/v1" });
config.api = "/v2";  // silently fails in non-strict mode, throws in strict mode`,
                explanation: "`Object.assign` performs a SHALLOW copy — nested objects are still shared by reference. Use it for merging flat configuration objects. `freeze` is shallow too; nested objects remain mutable."
              },
              practice: "Given two objects `user = {name:'A'}` and `permissions = {canEdit:true}`, merge them into a new object without modifying the originals."
            }
          },
          {
            id: "js-obj-destructuring",
            title: "Object Destructuring — Extract Properties Elegantly",
            content: {
              explanation: [
                "Destructuring lets you unpack object properties into variables in a single line. It's cleaner than assigning each property separately.",
                "",
                "Basic pattern: `let { prop1, prop2 } = obj`. Rename with `as`: `let { prop: newName }`.",
                "",
                "You can provide defaults for missing properties: `let { a = 1, b = 2 } = obj`."
              ],
               example: {
                 title: "Destructuring in Action",
                 code: `let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  address: { city: "NYC", country: "USA" }
};

// Destructure basic properties
let { name, age } = user;
console.log(name, age);  // Alice 25

// Rename during destructuring
let { name: userName, email: userEmail } = user;
console.log(userName);  // Alice
console.log(userEmail); // "alice@example.com"

// Nested destructuring
let { address: { city, country } } = user;
console.log(city);    // "NYC"
console.log(country); // "USA"

// Default values for missing properties
let { phone = "N/A", status = "active" } = user;
console.log(phone);   // "N/A" (user has no phone)
`,
                 explanation: "Destructuring works in function parameters too: `function greet({name}) { … }`. Use it to make code more declarative and reduce boilerplate."
               },
              practice: "Destructure a `product` object to extract `title` and `price` into variables, renaming `title` to `productName`."
            }
          },
          {
            id: "js-obj-this",
            title: "The `this` Keyword — Context Matters",
            content: {
              explanation: [
                "`this` refers to the object that 'owns' the currently executing code. Its value depends on HOW a function is called, not where it's defined.",
                "",
                "Rules:",
                "• Method call (`obj.method()`): `this` = the object before the dot",
                "• Simple call (`func()`): `this` = `undefined` in strict mode, `window` in sloppy mode",
                "• Constructor (`new Func()`): `this` = newly created object",
                "• Arrow functions: `this` is lexically inherited from surrounding scope (no own `this`)",
                "",
                "Common fixes: `.bind()`, arrow functions, or storing `const self = this`."
              ],
              example: {
                title: "Understanding this",
                code: `let user = {
  name: "Alice",
  sayHi() {
    console.log("Hi from", this.name);  // this = user
  },
  delayedHi() {
    setTimeout(function() {
      console.log("Hi from", this.name);  // this = window/undefined — lost context!
    }, 100);
  },
  arrowHi() {
    setTimeout(() => {
      console.log("Hi from", this.name);  // this = user — inherited!
    }, 100);
  }
};

user.sayHi();        // "Hi from Alice"
user.delayedHi();    // "Hi from undefined" (or window.name)
user.arrowHi();      // "Hi from Alice"

// Bind fixes context
let boundHi = user.sayHi.bind(user);
boundHi();  // "Hi from Alice"`,
                explanation: "The `delayedHi` method loses `this` because the regular function inside `setTimeout` gets its own `this` binding. Arrow functions don't have their own `this`, so they inherit it from `arrowHi`'s scope."
              },
              practice: "Create an object `counter` with `value` and `increment` method. Inside `setTimeout`, use an arrow function to correctly increment and log `value` after 1 second."
            }
          },
          {
            id: "js-obj-prototype",
            title: "Prototypes & Inheritance",
            content: {
              explanation: [
                "JavaScript uses prototypal inheritance — objects can inherit properties from other objects. Every object has an internal `[[Prototype]]` (accessible via `__proto__` or `Object.getPrototypeOf()`).",
                "",
                "When you access a property, JavaScript looks on the object itself, then walks up the prototype chain until found or reaches `null`.",
                "",
                "Functions have a `prototype` property used when called with `new` — new objects inherit from that prototype."
              ],
              example: {
                title: "Prototype Chain",
                code: `// Constructor function
function User(name) {
  this.name = name;
}

// Add method to prototype (shared by all instances)
User.prototype.greet = function() {
  console.log("Hello, " + this.name);
};

let alice = new User("Alice");
let bob = new User("Bob");

alice.greet();  // "Hello, Alice"
bob.greet();    // "Hello, Bob"

// Prototype chain
console.log(alice.__proto__ === User.prototype);  // true
console.log(User.prototype.__proto__ === Object.prototype);  // true

// Check inheritance
console.log(alice instanceof User);     // true
console.log(alice.hasOwnProperty("name"));  // true — own property
console.log(alice.hasOwnProperty("greet")); // false — inherited`,
                explanation: "Putting methods on the prototype saves memory — all instances share one copy. Modern JavaScript uses `class` syntax, but under the hood it still uses prototypes."
              },
              practice: "Define a `Vehicle` constructor with `make` and `model`. Add a `describe()` method to its prototype that prints 'This is a [make] [model]'. Create two vehicles and call `describe()` on both."
            }
          }
        ]
      },
      {
        id: "js-loops",
        title: "Loops & Iteration",
        description: "Master all loop types — for, while, forEach, and iterators",
        duration: "70 min",
        subtopics: [
          {
            id: "js-loop-for",
            title: "For Loops — Classic Counter-Based Iteration",
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
}

// Infinite loop (avoid!)
// for (;;) { console.log("stuck"); }`,
                explanation: "For loops are explicit and readable for counting. Use `i < array.length` not `i <= array.length` — the latter goes out of bounds."
              },
              practice: "Use a for loop to calculate the sum of numbers from 1 to 100. Print the sum after the loop."
            }
          },
          {
            id: "js-loop-forof",
            title: "for...of — Iterate Any Iterable",
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
                explanation: "`for...of` works with anything that has a `[Symbol.iterator]` method. Arrays, strings, Maps, Sets, NodeLists, arguments object, generators. Use `for...in` for object keys ONLY."
              },
              practice: "Given an array of numbers, use `for...of` to count how many are even."
            }
          },
          {
            id: "js-loop-while",
            title: "while and do...while — Condition-Based Loops",
            content: {
              explanation: [
                "`while` loops run WHILE a condition is true. The condition is checked BEFORE each iteration.",
                "",
                "`do...while` runs the body AT LEAST ONCE, then checks the condition. Use when you need the body to execute at least once regardless."
              ],
              example: {
                title: "While Loops",
                code: `// while — check before
let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}
// 0, 1, 2

// do...while — runs at least once
let j = 0;
do {
  console.log(j);  // prints 0 even though condition is false!
  j++;
} while (j < 0);

// Practical example: wait for condition
let attempts = 0;
while (!isLoggedIn && attempts < 5) {
  tryLogin();
  attempts++;
}

// Infinite loop with break
let k = 0;
while (true) {
  if (k >= 5) break;
  console.log(k);
  k++;
}`,
                explanation: "Beware infinite loops — ensure the condition eventually becomes false. `do...while` is rare but useful for menus or retry logic where you want the body to run at least once."
              },
              practice: "Write a `while` loop that adds random numbers (1–10) to a sum until the sum exceeds 100, then print the sum and count of numbers added."
            }
          },
          {
            id: "js-loop-break-continue",
            title: "Control Flow — break, continue, and Labels",
            content: {
              explanation: [
                "Inside any loop:",
                "• `break` — exits the loop immediately",
                "• `continue` — skips to the next iteration",
                "",
                "Labels (rarely used): `labelName: for(...) { … continue labelName; }` allow breaking/continuing outer loops from nested loops."
              ],
              example: {
                title: "break and continue",
                code: `// break — stop early
for (let i = 0; i < 10; i++) {
  if (i === 5) break;  // stop at 5
  console.log(i);
}
// 0, 1, 2, 3, 4

// continue — skip this iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;  // skip 2
  console.log(i);
}
// 0, 1, 3, 4

// Find first divisible by 7
for (let n = 1; ; n++) {
  if (n % 7 === 0) {
    console.log("Found:", n);  // 7
    break;
  }
}

// Labels — break outer from inner
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === j) break outer;  // breaks both loops
    console.log(i, j);
  }
}`,
                explanation: "`break` exits the loop entirely. `continue` jumps to the next iteration. Labels are rarely needed — refactor nested loops into functions instead."
              },
              practice: "Loop from 1 to 50. Print only odd numbers using `continue`. Stop completely when you encounter 33 using `break`."
            }
          }
        ]
      },
      {
        id: "js-es6",
        title: "Modern JavaScript (ES6+)",
        description: "Essential ES6+ features that every developer uses daily",
        duration: "90 min",
        subtopics: [
          {
            id: "es6-arrow",
            title: "Arrow Functions — Concise Syntax",
            content: {
              explanation: [
                "Arrow functions provide a shorter function syntax and have no own `this` binding. They're perfect for callbacks and short inline functions.",
                "",
                "Key differences from regular functions:",
                "• No `function` keyword — use `=>`",
                "• Implicit return for single-expression bodies (no `{}` or `return`)",
                "• No `this`, `arguments`, `super`, `new.target` — these are inherited from outer scope",
                "• Cannot be used as constructors (`new` fails)"
              ],
              example: {
                title: "Arrow Function Variants",
                code: `// Long form (block body) — explicit return
const add = (a, b) => {
  return a + b;
};

// Short form (concise body) — implicit return
const multiply = (a, b) => a * b;

// No parentheses for single parameter
const double = n => n * 2;

// No parameters need parentheses
const sayHello = () => "Hello!";

// Multi-line expression with implicit return
const formatUser = user => (\`\n  Name: \${user.name}\n  Age: \${user.age}\`);

// No own this (inherits from surrounding scope)
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;  // this refers to Timer instance, not interval
  }, 1000);
}`,
                explanation: "Arrow functions shine as callbacks (`arr.map(x => x*2)`). Avoid them for methods that need their own `this` or for constructors. Parentheses around the parameter are optional for one parameter, required for zero or multiple."
              },
              practice: "Rewrite `function square(x) { return x * x; }` as an arrow function with implicit return. Then create an arrow function that takes a name and returns 'Hello, [name]'."
            }
          },
          {
            id: "es6-templates",
            title: "Template Literals — Embed Expressions in Strings",
            content: {
              explanation: [
                "Backticks `` ` `` create template literals — strings that can embed JavaScript expressions inside `${expression}`. They support multi-line strings WITHOUT `\\n`.",
                "",
                "Features:",
                "• Expression interpolation: `\\`Hello, \${name}!\``",
                "• Multi-line: spans across lines naturally",
                "• Tagged templates: advanced feature for custom processing"
              ],
              example: {
                title: "Template Literals",
                code: `let name = "Alice";
let age = 25;

// Interpolation
console.log(\`Hello, \${name}! You are \${age} years old.\`);
// "Hello, Alice! You are 25 years old."

// Expressions inside \${}
console.log(\`5 + 5 = \${5 + 5}\`);  // "5 + 5 = 10"
console.log(\`You are \${age >= 18 ? "an adult" : "a minor"}\`);

// Multi-line without \\n
let html = \`
  <div class="card">
    <h1>\${name}</h1>
    <p>Age: \${age}</p>
  </div>
\`;
console.log(html);

// Nested templates
let user = { first: "Alice", last: "Smith" };
console.log(\`Full name: \${user.first} \${user.last}\`);`,
                explanation: "Template literals eliminate the need for `+` concatenation and make code more readable. They're the standard for building strings in modern JavaScript, especially HTML templates."
              },
              practice: "Create a `product` object with name and price. Use a template literal to print: 'Product: [name], Cost: $[price]'. Also include a conditional: 'In stock' if quantity > 0, else 'Out of stock'."
            }
          },
          {
            id: "es6-destructuring",
            title: "Destructuring — Unpack Arrays and Objects",
            content: {
              explanation: [
                "Destructuring extracts values from arrays or objects into variables in a single line. It's concise and expressive.",
                "",
                "Array destructuring: `let [first, second] = arr`",
                "Object destructuring: `let { name, age } = obj`",
                "",
                "You can:",
                "• Skip elements with commas: `[first, , third]`",
                "• Provide defaults: `{ a = 1, b = 2 } = obj`",
                "• Rename: `{ name: userName }`",
                "• Destructure nested structures: `{ a: { b } }`",
                "• Use rest: `let [head, ...tail] = arr`"
              ],
              example: {
                title: "Destructuring Everywhere",
                code: `// Array destructuring
let arr = [1, 2, 3, 4, 5];
let [first, second, ...rest] = arr;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Swap variables without temp
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);  // 2 1

// Object destructuring
let user = { name: "Alice", age: 25, role: "admin" };
let { name, age } = user;
console.log(name, age);  // Alice 25

// Rename and default
let { name: userName, email = "no-email", city = "Unknown" } = user;
console.log(userName);     // Alice
console.log(email);        // "no-email" (user has no email)

// Nested destructuring
let data = { user: { profile: { name: "Bob", avatar: "url" } } };
let { user: { profile: { name, avatar } } } = data;

// Function parameters destructuring
function greet({ name, greeting = "Hello" }) {
  console.log(\`\${greeting}, \${name}!\`);
}
greet({ name: "Alice" });  // "Hello, Alice!"`,
                explanation: "Destructuring is everywhere in modern code — function parameters, React props, config extraction. Master it to write cleaner, more expressive code."
              },
              practice: "Given `points = [[0,0], [1,2], [3,4]]`, destructure to get `firstPoint = [x1, y1]` and `restPoints` array of remaining points."
            }
          },
          {
            id: "es6-spread-rest",
            title: "Spread & Rest Operators — Merge and Collect",
            content: {
              explanation: [
                "Spread `...` and Rest `...` look identical but do opposite things:",
                "",
                "**Spread** — expands an iterable into individual elements",
                "• `[...arr]` — shallow copy array",
                "• `[...arr1, ...arr2]` — concatenate",
                "• `{...obj}` — shallow clone object",
                "• `{...obj1, ...obj2}` — merge (later properties override)",
                "• `func(...args)` — pass array as separate arguments",
                "",
                "**Rest** — collects remaining elements into an array",
                "• `function sum(...nums) {}` — collect all arguments",
                "• `let [first, ...rest] = arr` — collect tail"
              ],
              example: {
                title: "Spread vs Rest",
                code: `// SPREAD — expand
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2];
console.log(combined);  // [1,2,3,4,5,6]

// Clone array (shallow)
let copy = [...arr1];
copy.push(4);
console.log(arr1);  // [1,2,3] — original unchanged

// Clone and merge objects
let defaults = { theme: "dark", lang: "en" };
let userSettings = { theme: "light" };
let final = { ...defaults, ...userSettings };
console.log(final);  // { theme: "light", lang: "en" }

// REST — collect function arguments
function average(...nums) {
  let sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}
console.log(average(1, 2, 3));  // 2

// Destructure with rest
let numbers = [1, 2, 3, 4, 5];
let [first, second, ...others] = numbers;
console.log(others);  // [3, 4, 5]`,
                explanation: "Spread is used in array literals, object literals, and function calls. Rest is used in function parameters and destructuring. Same syntax, different positions."
              },
              practice: "Write a function `mergeObjects(...objs)` that merges any number of objects into one (later properties override). Test with `mergeObjects({a:1}, {b:2}, {a:3})` → `{a:3, b:2}`."
            }
          },
          {
            id: "es6-default-params",
            title: "Default Parameters — Safer Function Arguments",
            content: {
              explanation: [
                "Default parameters let you specify fallback values if an argument is `undefined`. They're evaluated at call time, so you can use dynamic defaults like `new Date()`.",
                "",
                "Syntax: `function greet(name = 'Guest') { … }`. Defaults only apply when the argument is `undefined` — `null` is treated as a value."
              ],
              example: {
                title: "Defaults in Practice",
                code: `function greet(name = "Guest", time = "day") {
  console.log(\`Good \${time}, \${name}!\`);
}

greet();                    // "Good day, Guest!"
greet("Alice");             // "Good day, Alice!"
greet("Bob", "morning");    // "Good morning, Bob!"
greet(undefined, "evening"); // "Good evening, Guest!" — undefined triggers default
greet(null);                // "Good day, null" — null is a value, not undefined

// Dynamic default
function createUser(opts = {}) {
  let { name = "Unknown", role = "user", createdAt = new Date() } = opts;
  console.log({ name, role, createdAt });
}
createUser({ name: "Alice" });  // { name: 'Alice', role: 'user', createdAt: ... }`,
                explanation: "Default parameters prevent `undefined` bugs and make functions more robust. Place required parameters first, optional/defaulted ones after. Destructure with defaults for flexible options objects."
              },
              practice: "Create a function `makeUrl(base = 'https://api.example.com', path = '')` that returns the full URL. Combine with template literals. Call it with no args, with just path, and with both args."
            }
          },
          {
            id: "es6-classes",
            title: "Classes — Syntactic Sugar for Prototypes",
            content: {
              explanation: [
                "ES6 classes provide a cleaner syntax for creating constructor functions and managing prototypes. UNDER THE HOOD they still use prototypes — classes are syntactic sugar.",
                "",
                "Class features:",
                "• `constructor()` — initializes new instances",
                "• `methods` — added to the prototype automatically",
                "• `static` methods — belong to the class itself",
                "• `extends` — inheritance",
                "• `super` — call parent constructor or methods"
              ],
              example: {
                title: "Classes and Inheritance",
                code: `// Simple class
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // Prototype method
  greet() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
  
  // Static method (called on class, not instance)
  static describe() {
    console.log("User class represents an account");
  }
}

let alice = new User("Alice", "alice@example.com");
alice.greet();  // "Hello, I'm Alice"
User.describe(); // "User class represents an account"

// Inheritance
class Admin extends User {
  constructor(name, email, level) {
    super(name, email);  // call parent constructor
    this.level = level;
  }
  
  // Override parent method
  greet() {
    console.log(\`Admin \${this.name} (level \${this.level})\`);
  }
}

let admin = new Admin("Bob", "bob@admin.com", 5);
admin.greet();  // "Admin Bob (level 5)"
console.log(admin instanceof Admin);   // true
console.log(admin instanceof User);    // true`,
                explanation: "Classes make inheritance clearer than raw prototypes. `super` must be called before `this` in a child constructor. Static methods are utility functions attached to the class (like `Array.isArray()`)."
              },
              practice: "Create a `Shape` class with `width` and `height` in constructor and an `area()` method returning 0. Then create a `Rectangle` class extending `Shape` that overrides `area()` to return `width * height`."
            }
          },
          {
            id: "es6-modules",
            title: "Modules — Import and Export",
            content: {
              explanation: [
                "ES6 modules are the standard for organizing code across files. Each file is its own module with its own scope.",
                "",
                "**Exports:**",
                "• Named export: `export function foo() {}` or `export const x = 1`",
                "• Default export: `export default function() {}` (one per module)",
                "",
                "**Imports:**",
                "• Named import: `import { foo, bar } from './module.js'`",
                "• Default import: `import myFunc from './module.js'`",
                "• Rename: `import { foo as bar }`",
                "• Namespace: `import * as mod from './module.js'`"
              ],
              example: {
                title: "Module Patterns",
                code: `// math.js — named exports
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }
export const PI = 3.14159;

// utils.js — default export
export default function format(text) {
  return text.trim().toLowerCase();
}

// main.js — importing
import fmt, { add, multiply } from './utils.js';
// Inconsistency: if utils.js has default, must import default separately

// Better: separate
import formatter from './formatter.js';
import { add, multiply } from './math.js';

import * as math from './math.js';
console.log(math.PI);  // 3.14159

import { add as sum } from './math.js';
console.log(sum(2, 3));  // 5`,
                explanation: "Named exports are tree-shakeable (unused exports removed by bundlers). Default exports are convenient but can be ambiguous. Use consistent style across your project — either all named or one default per module, not both mixed."
              },
              practice: "Create two files: `math.js` exports `square` and `cube` (named), and `greet.js` exports a default function. Import both correctly in a main file and use them."
            }
          }
        ]
      },
      {
        id: "js-async",
        title: "Asynchronous JavaScript",
        description: "Promises, async/await, fetch, and handling async errors",
        duration: "85 min",
        subtopics: [
          {
            id: "js-async-intro",
            title: "The Event Loop — Sync vs Async",
            content: {
              explanation: [
                "JavaScript is single-threaded but asynchronous. The event loop handles this:",
                "",
                "1. Call Stack — running functions",
                "2. Web APIs — setTimeout, fetch, etc. run in background",
                "3. Callback Queue — completed callbacks wait here",
                "4. Event Loop — moves callbacks to call stack when stack is empty",
                "",
                "Synchronous code blocks execution. Asynchronous code schedules work and continues, notifying you via callbacks/promises when done."
              ],
              example: {
                title: "Sync vs Async",
                code: `console.log("Start");

// Synchronous — blocks
for (let i = 0; i < 1e9; i++) {}  // 1 billion iterations — freezes
console.log("After loop");  // Runs only after loop finishes

console.log("--- Async ---");

console.log("Before setTimeout");
setTimeout(() => console.log("Inside setTimeout"), 0);
console.log("After setTimeout");
// Output:
// Before setTimeout
// After setTimeout
// Inside setTimeout  (even with 0ms delay!)`,
                explanation: "Even `setTimeout(fn, 0)` doesn't run immediately — it queues the callback. This is the foundation of async JavaScript: you schedule work, and it runs later when the stack is free."
              },
              practice: "Predict the output order of `console.log('A'); setTimeout(()=>console.log('B'), 0); console.log('C');` and verify in the playground."
            }
          },
          {
            id: "js-promises",
            title: "Promises — Composing Async Operations",
            content: {
              explanation: [
                "A Promise represents a value that may be available now, later, or never. It's a container for a future result.",
                "",
                "States: pending → fulfilled OR pending → rejected",
                "",
                "Use `then()` for success, `catch()` for errors, `finally()` for cleanup. Multiple `then`s chain. Promises solve 'callback hell' by enabling flat chaining.",
                "",
                "Create with `new Promise((resolve, reject) => { … })` or use built-in promise-returning APIs (fetch, fs.promises)."
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
    console.error("Caught:", err);  // "Caught: Oops!"
  })
  .finally(() => {
    console.log(" cleanup always runs");
  });

// Promise.all — run in parallel, wait for all
let p1 = fetch("/api/user");
let p2 = fetch("/api/posts");
Promise.all([p1, p2])
  .then(([userRes, postsRes]) => {
    console.log("Both done");
  });

// Promise.race — first to settle wins
let fast = Promise.resolve("fast");
let slow = new Promise(r => setTimeout(() => r("slow"), 1000));
Promise.race([slow, fast]).then(console.log);  // "fast"`,
                explanation: "Promises are EAGER — they start executing when created, not when `then` is called. Return a promise from `then` to chain. Errors bubble down the chain until caught."
              },
              practice: "Create a promise that resolves after a random delay (500-1500ms) with a message 'Done!'. Chain two such promises sequentially. Add a catch to log any error."
            }
          },
          {
            id: "js-async-await",
            title: "Async/Await — Synchronous-Style Async Code",
            content: {
              explanation: [
                "`async/await` is syntactic sugar over promises, making async code look synchronous and easier to reason about.",
                "",
                "• `async function` — returns a promise automatically",
                "• `await expression` — pauses execution until promise settles, then returns the resolved value",
                "• `await` only works inside `async` functions or modules",
                "",
                "Wrap `await` in `try/catch` for error handling. Multiple `await`s run SEQUENTIALLY by default. Use `Promise.all()` for parallel."
              ],
              example: {
                title: "Async/Await Patterns",
                code: `async function getUser(id) {
  try {
    let res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    let user = await res.json();
    return user;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;  // re-throw if caller should handle
  }
}

// Sequential awaits (slow — one after another)
async function sequential() {
  let user = await getUser(1);
  let posts = await fetch(\`/api/posts?userId=\${user.id}\`).then(r => r.json());
  console.log(user, posts);
}

// Parallel awaits (fast — start both, then wait)
async function parallel() {
  let [userRes, postsRes] = await Promise.all([
    fetch("/api/user/1"),
    fetch("/api/posts?userId=1")
  ]);
  let user = await userRes.json();
  let posts = await postsRes.json();
  console.log(user, posts);
}

// Top-level await (in modules)
// You can use await at module top-level (no async function wrapper)
let config = await import('./config.js');`,
                explanation: "`async/await` unwraps promises automatically. The function returns a promise that resolves to the return value or rejects with thrown errors. Always handle errors with `try/catch` around `await`."
              },
              practice: "Write an `async function loadData()` that awaits two fetches (use dummy URLs like 'https://jsonplaceholder.typicode.com/todos/1' and '.../users/1'), then logs both results. Use `Promise.all` to run them in parallel inside the async function."
            }
          },
          {
            id: "js-fetch-api",
            title: "Fetch API — Making HTTP Requests",
            content: {
              explanation: [
                "`fetch()` is the modern way to make HTTP requests. It returns a promise that resolves to a `Response` object. You call `.json()` on the response to parse the body as JSON.",
                "",
                "Features:",
                "• Method: GET (default), POST, PUT, DELETE, etc.",
                "• Headers: set request headers as object",
                "• Body: send JSON via `JSON.stringify(data)`",
                "• `response.ok` — true for 2xx status codes",
                "• No automatic error on 404/500 — you must check `ok` or `status`"
              ],
              example: {
                title: "Fetch Complete",
                code: `// GET request
fetch("https://api.example.com/data")
  .then(res => {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));

// POST with JSON
fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "secret123"
  })
})
  .then(res => res.json())
  .then(result => console.log("Logged in:", result));

// Async/await version
async function getUsers() {
  let res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed");
  let users = await res.json();
  return users;
}`,
                explanation: "`fetch` does NOT reject on HTTP errors (404, 500) — only on network failure. Always check `response.ok` or `response.status`. For POST, remember to set `Content-Type: application/json` and `JSON.stringify` the body."
              },
              practice: "Use fetch to GET 'https://jsonplaceholder.typicode.com/posts/1' in an async function. Log the title property from the JSON response. Add a try-catch to handle errors."
            }
          }
        ]
      }
    ]
  }