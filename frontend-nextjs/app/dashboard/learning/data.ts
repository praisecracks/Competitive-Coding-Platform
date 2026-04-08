// LocalStorage Key: codemaster_learning_progress_v1

/*
Schema:
{
  "totalXp": 1250,
  "paths": {
    "path-id-1": {
      "completedStepIds": ["step-1", "step-2"],
      "liked": true,
      "rating": 5
    }
  }
}
*/

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  content: {
    overview: string;
    explanation: string[];
    example?: {
      title: string;
      code: string;
      explanation: string;
    };
    commonMistake?: string;
    keyTakeaways: string[];
  };
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "JavaScript" | "Python" | "Go" | "Algorithms" | "Data Structures";
  readTime: string;
  likes: number;
  rating: number;
  totalRatings: number;
  coverImage: string;
  relatedChallengeId?: string;
  prerequisiteIds?: string[];
  steps: LearningStep[];
}

export const LEARNING_PATHS: LearningPath[] = [
  // JAVASCRIPT
  {
    id: "js-functions-basics",
    title: "JavaScript Functions",
    subtitle: "Master the building blocks of reusable JavaScript code.",
    difficulty: "Beginner",
    category: "JavaScript",
    readTime: "25 min",
    likes: 850,
    rating: 4.9,
    totalRatings: 120,
    coverImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800",
    steps: [
      {
        id: "func-declaration",
        title: "Function Declarations",
        description: "How to define and call basic functions.",
        duration: "8 min",
        xp: 50,
        content: {
          overview: "Functions are one of the fundamental building blocks in JavaScript.",
          explanation: [
            "A function declaration consists of the 'function' keyword, followed by a name, a list of parameters, and the function body.",
            "Function declarations are hoisted, meaning they can be called before they are defined in the code."
          ],
          example: {
            title: "Basic Greeting",
            code: "function sayHello(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(sayHello('Dev'));",
            explanation: "The function takes a parameter 'name' and returns a string."
          },
          commonMistake: "Forgetting the 'return' keyword will cause the function to return 'undefined' by default.",
          keyTakeaways: ["Use 'function' keyword", "Parameters are optional", "Hoisting support"]
        }
      },
      {
        id: "arrow-functions",
        title: "Arrow Functions",
        description: "Modern, concise way to write functions in ES6+.",
        duration: "10 min",
        xp: 50,
        content: {
          overview: "Arrow functions provide a shorter syntax for writing functions.",
          explanation: [
            "Arrow functions do not have their own 'this' context, making them ideal for callbacks.",
            "If the function has only one statement, the 'return' keyword and curly braces can be omitted."
          ],
          example: {
            title: "Concise Arrow Function",
            code: "const add = (a, b) => a + b;\nconsole.log(add(5, 3)); // 8",
            explanation: "Implicit return is used here because there is only one expression."
          },
          commonMistake: "Using arrow functions as methods in objects can lead to 'this' being the global object instead of the instance.",
          keyTakeaways: ["Shorter syntax", "No own 'this'", "Implicit returns"]
        }
      }
    ]
  },

  // PYTHON
  {
    id: "python-while-loops",
    title: "Python While Loops",
    subtitle: "Learn how to repeat actions until a condition is met.",
    difficulty: "Beginner",
    category: "Python",
    readTime: "20 min",
    likes: 620,
    rating: 4.8,
    totalRatings: 95,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    steps: [
      {
        id: "while-logic",
        title: "The Logic of While",
        description: "Understanding entry conditions and iteration.",
        duration: "10 min",
        xp: 50,
        content: {
          overview: "A while loop repeats a block of code as long as a specified condition is True.",
          explanation: [
            "The condition is checked before each execution of the loop body.",
            "If the condition is initially False, the loop body will never run."
          ],
          example: {
            title: "Countdown Timer",
            code: "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1\nprint('Lift off!')",
            explanation: "The loop runs as long as 'count' is greater than 0."
          },
          commonMistake: "Infinite loops occur if the condition never becomes False. Always ensure the loop variable is updated.",
          keyTakeaways: ["Check condition first", "Risk of infinite loops", "Update loop variable"]
        }
      }
    ]
  },

  // GO
  {
    id: "go-basics-structs",
    title: "Go Basics & Structs",
    subtitle: "Introduction to Go's way of handling structured data.",
    difficulty: "Beginner",
    category: "Go",
    readTime: "30 min",
    likes: 540,
    rating: 4.7,
    totalRatings: 80,
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    steps: [
      {
        id: "struct-def",
        title: "Defining Structs",
        description: "Grouping different types of data together.",
        duration: "15 min",
        xp: 50,
        content: {
          overview: "Go's structs are typed collections of fields, used to group data into records.",
          explanation: [
            "Structs are the primary way to create complex types in Go.",
            "Fields in a struct can be of any type, including other structs."
          ],
          example: {
            title: "User Profile Struct",
            code: "type User struct {\n    ID    int\n    Name  string\n    Email string\n}\n\nu := User{ID: 1, Name: \"Alice\"}",
            explanation: "We define a User type with three fields and then instantiate it."
          },
          commonMistake: "Forgetting that Go uses capitalization for exported fields (public vs private).",
          keyTakeaways: ["Custom data types", "Field-based grouping", "Export rules"]
        }
      }
    ]
  },

  // DATA STRUCTURES
  {
    id: "arrays-and-strings",
    title: "Mastering Arrays & Strings",
    subtitle: "The foundation of data structures and algorithms.",
    difficulty: "Beginner",
    category: "Data Structures",
    readTime: "45 min",
    likes: 1240,
    rating: 4.8,
    totalRatings: 156,
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800",
    relatedChallengeId: "1",
    steps: [
      {
        id: "array-basics",
        title: "Array Fundamentals",
        description: "Understanding memory layout and basic operations.",
        duration: "10 min",
        xp: 50,
        content: {
          overview: "Arrays are contiguous blocks of memory that store elements of the same type.",
          explanation: [
            "At its core, an array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.",
            "This makes it easier to calculate the position of each element by simply adding an offset to a base value, i.e., the memory location of the first element of the array."
          ],
          example: {
            title: "Accessing Elements",
            code: "const arr = [10, 20, 30];\nconsole.log(arr[0]); // 10",
            explanation: "Indexing starts at 0. Accessing an element is O(1) time complexity."
          },
          commonMistake: "Off-by-one errors are the most common issue when iterating through arrays.",
          keyTakeaways: ["Contiguous memory", "O(1) access", "Fixed size in many languages"]
        }
      },
      {
        id: "string-manipulation",
        title: "String Manipulation",
        description: "Techniques for efficient string handling.",
        duration: "15 min",
        xp: 50,
        content: {
          overview: "Strings are often implemented as arrays of characters.",
          explanation: [
            "In many languages, strings are immutable, meaning you cannot change a character in place. You must create a new string.",
            "Using a StringBuilder or an array of characters can be more efficient for frequent modifications."
          ],
          example: {
            title: "Reversing a String",
            code: "function reverse(s) {\n  return s.split('').reverse().join('');\n}",
            explanation: "Converting to an array allows using built-in array methods."
          },
          commonMistake: "Creating too many intermediate strings in a loop can lead to O(N^2) complexity.",
          keyTakeaways: ["Immutability", "Character encoding", "Efficiency with arrays"]
        }
      }
    ]
  },

  {
    id: "string-patterns-basics",
    title: "String Patterns",
    subtitle: "Learn common string searching and matching techniques.",
    difficulty: "Beginner",
    category: "Data Structures",
    readTime: "25 min",
    likes: 410,
    rating: 4.6,
    totalRatings: 50,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    prerequisiteIds: ["arrays-and-strings"],
    steps: [
      {
        id: "pattern-matching",
        title: "Naive Pattern Matching",
        description: "The simplest way to find a substring.",
        duration: "12 min",
        xp: 50,
        content: {
          overview: "Checking every possible position for a match.",
          explanation: [
            "We slide the pattern one by one over the text.",
            "For every position, we check if the pattern matches the current window of text."
          ],
          example: {
            title: "Brute Force Search",
            code: "for (let i = 0; i <= text.length - pattern.length; i++) {\n  let j;\n  for (j = 0; j < pattern.length; j++) {\n    if (text[i + j] !== pattern[j]) break;\n  }\n  if (j === pattern.length) return i;\n}",
            explanation: "A nested loop approach with O(N*M) complexity."
          },
          commonMistake: "Not handling cases where the pattern is longer than the text.",
          keyTakeaways: ["Simple implementation", "O(N*M) worst case", "Baseline technique"]
        }
      }
    ]
  },

  // ALGORITHMS
  {
    id: "binary-search-mastery",
    title: "Binary Search Mastery",
    subtitle: "Divide and conquer your way through sorted data.",
    difficulty: "Intermediate",
    category: "Algorithms",
    readTime: "30 min",
    likes: 850,
    rating: 4.9,
    totalRatings: 92,
    coverImage: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800",
    prerequisiteIds: ["arrays-and-strings"],
    relatedChallengeId: "2",
    steps: [
      {
        id: "binary-search-logic",
        title: "The Logic of Binary Search",
        description: "How to halve your search space efficiently.",
        duration: "15 min",
        xp: 100,
        content: {
          overview: "Binary search works on sorted arrays by repeatedly dividing the search interval in half.",
          explanation: [
            "Begin with an interval covering the whole array.",
            "If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half.",
            "Repeatedly check until the value is found or the interval is empty."
          ],
          example: {
            title: "Standard Implementation",
            code: "let low = 0, high = arr.length - 1;\nwhile (low <= high) {\n  let mid = Math.floor((low + high) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}",
            explanation: "The search space is reduced by half each iteration."
          },
          commonMistake: "Not handling the 'low <= high' condition correctly, leading to infinite loops or missing elements.",
          keyTakeaways: ["O(log N) complexity", "Requires sorted data", "Divide and conquer"]
        }
      }
    ]
  },

  {
    id: "sliding-window-tech",
    title: "Sliding Window",
    subtitle: "Master the art of tracking windows across data.",
    difficulty: "Intermediate",
    category: "Algorithms",
    readTime: "35 min",
    likes: 720,
    rating: 4.8,
    totalRatings: 85,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
    prerequisiteIds: ["arrays-and-strings"],
    steps: [
      {
        id: "fixed-window",
        title: "Fixed-Size Windows",
        description: "Calculating sums or averages over fixed intervals.",
        duration: "15 min",
        xp: 100,
        content: {
          overview: "Sliding window reduces nested loops to a single pass.",
          explanation: [
            "We maintain a 'window' of size K.",
            "As we slide the window, we add the new element and remove the old one.",
            "This turns O(N*K) problems into O(N)."
          ],
          example: {
            title: "Max Sum Subarray of Size K",
            code: "let maxSum = 0, windowSum = 0;\nfor (let i = 0; i < n; i++) {\n  windowSum += arr[i];\n  if (i >= k - 1) {\n    maxSum = Math.max(maxSum, windowSum);\n    windowSum -= arr[i - (k - 1)];\n  }\n}",
            explanation: "We subtract the outgoing element to keep the sum updated."
          },
          commonMistake: "Incorrect window initialization or off-by-one window boundaries.",
          keyTakeaways: ["O(N) efficiency", "Avoid redundant calculations", "Ideal for subarrays"]
        }
      }
    ]
  },

  {
    id: "two-pointers-pattern",
    title: "Two Pointers Technique",
    subtitle: "Efficiently solve problems using two indices simultaneously.",
    difficulty: "Intermediate",
    category: "Algorithms",
    readTime: "30 min",
    likes: 680,
    rating: 4.7,
    totalRatings: 75,
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    prerequisiteIds: ["arrays-and-strings"],
    steps: [
      {
        id: "opposite-ends",
        title: "Pointers from Opposite Ends",
        description: "Working from start and end towards the middle.",
        duration: "15 min",
        xp: 100,
        content: {
          overview: "Using two markers to narrow down a search range.",
          explanation: [
            "Start one pointer at index 0 and another at the end.",
            "Move them based on a condition (e.g., target sum in a sorted array).",
            "This is highly efficient for sorted datasets."
          ],
          example: {
            title: "Two Sum in Sorted Array",
            code: "let left = 0, right = arr.length - 1;\nwhile (left < right) {\n  let sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  if (sum < target) left++;\n  else right--;\n}",
            explanation: "Moving left increases the sum, moving right decreases it."
          },
          commonMistake: "Using it on unsorted arrays without sorting first.",
          keyTakeaways: ["O(N) time", "O(1) space", "Requires sorting usually"]
        }
      }
    ]
  },

  {
    id: "recursion-intro",
    title: "Recursion Foundations",
    subtitle: "Understanding functions that call themselves.",
    difficulty: "Intermediate",
    category: "Algorithms",
    readTime: "40 min",
    likes: 910,
    rating: 4.8,
    totalRatings: 110,
    coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800",
    steps: [
      {
        id: "base-case-logic",
        title: "Base Case & Recursive Step",
        description: "The two essential parts of any recursive function.",
        duration: "15 min",
        xp: 100,
        content: {
          overview: "Recursion is a method where the solution depends on solutions to smaller instances of the same problem.",
          explanation: [
            "The Base Case tells the function when to stop calling itself.",
            "The Recursive Step reduces the problem toward the base case."
          ],
          example: {
            title: "Factorial Calculation",
            code: "function factorial(n) {\n  if (n <= 1) return 1; // Base case\n  return n * factorial(n - 1); // Recursive step\n}",
            explanation: "Each call reduces n by 1 until it hits the base case of 1."
          },
          commonMistake: "Missing base case leads to Stack Overflow errors.",
          keyTakeaways: ["Think in subproblems", "Always have a base case", "Watch memory usage"]
        }
      }
    ]
  },

  {
    id: "dynamic-programming-intro",
    title: "Dynamic Programming",
    subtitle: "Solving complex problems by breaking them into overlapping subproblems.",
    difficulty: "Advanced",
    category: "Algorithms",
    readTime: "60 min",
    likes: 1120,
    rating: 4.9,
    totalRatings: 140,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    prerequisiteIds: ["recursion-intro"],
    steps: [
      {
        id: "memoization-basics",
        title: "Memoization (Top-Down)",
        description: "Caching results of expensive function calls.",
        duration: "25 min",
        xp: 200,
        content: {
          overview: "DP = Recursion + Memoization.",
          explanation: [
            "We use an object or array to store results of recursive calls.",
            "If we see the same subproblem again, we return the cached result instead of re-calculating."
          ],
          example: {
            title: "Fibonacci with Memo",
            code: "const memo = {};\nfunction fib(n) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  memo[n] = fib(n - 1) + fib(n - 2);\n  return memo[n];\n}",
            explanation: "Turns O(2^N) exponential time into O(N) linear time."
          },
          commonMistake: "Forgetting to check the cache before making the recursive call.",
          keyTakeaways: ["Avoid re-computation", "Trade space for time", "Significant speedup"]
        }
      }
    ]
  }
];
