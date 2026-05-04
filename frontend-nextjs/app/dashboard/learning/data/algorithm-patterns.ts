import { LearningTrack } from "../data";

export const algorithmPatterns: LearningTrack = {
  id: "algorithms",
  title: "Algorithm Patterns",
  subtitle: "Beginner to Hero",
  description: "Master essential algorithmic patterns from basics to advanced techniques for technical interviews and real-world problem solving",
  type: "additional",
  icon: "Brain",
  color: "pink",
  coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600",
  totalHours: 41,
  language: "multi",
  category: "Algorithms",
  topics: [
    {
      id: "algo-foundations",
      title: "What Is an Algorithm?",
      description: "Understand what algorithms are and why they matter",
      duration: "30 min",
      subtopics: [
        {
          id: "foundations-what",
          title: "What Is an Algorithm?",
          content: {
            explanation: [
              "An algorithm is simply a step-by-step procedure for solving a problem or accomplishing a task. Think of it like a cooking recipe: you follow specific steps in a specific order to get a predictable result.",
              "",
              "Every computer program is built from algorithms, from the simple (finding the largest number in a list) to the complex (recommending videos on YouTube).",
              "",
              "**Key properties of algorithms:**",
              "1. **Input** — receives data to work with",
              "2. **Output** — produces a result",
              "3. **Definiteness** — each step is clear and unambiguous",
              "4. **Finiteness** — completes in a reasonable number of steps",
              "5. **Correctness** — produces the right answer",
              "",
              "Real-world examples you use daily:",
              "- Following directions on Google Maps",
              "- Sorting your email by date",
              "- Searching for a contact in your phone"
            ],
            example: {
              title: "A Simple Algorithm: Finding the Largest Number",
              code: `// Algorithm: Find the maximum number in an array
// Steps:
// 1. Assume the first number is the largest
// 2. Look at each remaining number
// 3. If you find a larger number, update your assumption
// 4. After checking all numbers, return the largest

function findMax(numbers) {
    // Step 1: Start with first number
    let max = numbers[0];
    
    // Step 2: Check each number
    for (let i = 1; i < numbers.length; i++) {
        // Step 3: If we find a larger number, update max
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }
    
    // Step 4: Return the result
    return max;
}

console.log(findMax([3, 7, 2, 9, 1]));  // 9
console.log(findMax([-5, -2, -8]));     // -2`,
              explanation: "This algorithm follows a simple step-by-step process: assume the first element is max, then check each element, updating the max whenever a larger value is found."
            },
            practice: "Write an algorithm that finds the smallest (minimum) number in an array using the same step-by-step thinking."
          }
        },
        {
          id: "foundations-why",
          title: "Why Learn Algorithms?",
          content: {
            explanation: [
              "Learning algorithms transforms how you think about programming. Here's why it matters:",
              "",
              "**1. Write Faster Code**",
              "A good algorithm can be thousands of times faster than a bad one. An algorithm that takes 1 second on 1000 items might take 1000 days on 1,000,000 items if designed poorly!",
              "",
              "**2. Solve Problems Others Can't**",
              "Many real-world problems (scheduling flights, routing deliveries, compressing files) require algorithmic thinking. The difference between 'not possible' and 'solved' is often the right algorithm.",
              "",
              "**3. Pass Technical Interviews**",
              "Almost every software engineering interview tests algorithmic thinking. Understanding patterns makes these interviews approachable.",
              "",
              "**4. Write More Reliable Code**",
              "Algorithms give you predictable, testable approaches. You'll know your code works because you understand WHY it works.",
              "",
              "**5. Think Like a Computer Scientist**",
              "You'll start breaking down problems methodically instead of just 'trying things until something works.'"
            ],
            example: {
              title: "The Power of Good Algorithms",
              code: `// Bad algorithm: Linear search (checks each item one by one)
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}
// For 1 million items, worst case: 1,000,000 checks

// Good algorithm: Binary search (eliminates half each time)
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
// For 1 million items, worst case: only ~20 checks!

const sortedNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(sortedNumbers, 13));`,
              explanation: "Binary search is exponentially faster for large datasets because it eliminates half the possibilities each step."
            },
            practice: "Think of a task you do often. How could you do it faster using a 'divide and conquer' approach?"
          }
        }
      ]
    },
    {
      id: "algo-thinking",
      title: "How to Think Like an Algorithm",
      description: "Develop problem-solving strategies for algorithmic challenges",
      duration: "45 min",
      subtopics: [
        {
          id: "thinking-process",
          title: "The 4-Step Problem Solving Process",
          content: {
            explanation: [
              "When facing any algorithmic problem, follow this proven process:",
              "",
              "**Step 1: Understand the Problem** (2-5 minutes)",
              "- Read the problem twice",
              "- Identify inputs and expected outputs",
              "- Ask: What are the constraints? Edge cases?",
              "",
              "**Step 2: Plan Your Approach** (5-10 minutes)",
              "- Brainstorm possible solutions",
              "- Start with a brute force approach",
              "- Look for patterns or simpler versions",
              "",
              "**Step 3: Implement the Solution** (10-20 minutes)",
              "- Start with the simplest working version",
              "- Test as you go",
              "- Use meaningful variable names",
              "",
              "**Step 4: Review and Optimize** (5 minutes)",
              "- Does it handle all edge cases?",
              "- Can it be faster? Use less memory?",
              "- Is the code readable?"
            ],
            example: {
              title: "Applying the Process: Two Sum",
              code: `// Problem: Given an array and a target sum, find two numbers that add to target
// Return their indices (or null if none exist)

// STEP 1: Understand - Input: [2, 7, 11, 15], target 9 -> Output: [0, 1]

// STEP 2: Plan - Check every pair (slow but works first)

// STEP 3: Implement
function twoSumBruteForce(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return null;
}

// STEP 4: Optimize - Use a hash map
function twoSumOptimized(nums, target) {
    const seen = {};
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (seen[complement] !== undefined) {
            return [seen[complement], i];
        }
        
        seen[nums[i]] = i;
    }
    return null;
}

console.log(twoSumBruteForce([2, 7, 11, 15], 9));
console.log(twoSumOptimized([2, 7, 11, 15], 9));`,
              explanation: "We transformed a brute force solution into an optimized one using a hash map. The first is simple, the second is faster."
            },
            practice: "Use the 4-step process to solve: Given a string, find if it contains the same number of vowels and consonants."
          }
        },
        {
          id: "thinking-debug",
          title: "Debugging Algorithmic Thinking",
          content: {
            explanation: [
              "Even experienced programmers get stuck. Here's how to debug your algorithmic thinking:",
              "",
              "**Trace Through with Small Examples**",
              "Pick a tiny input and manually step through your code. Write down variable values at each step.",
              "",
              "**Use Console Logging Strategically**",
              "Print key variables at important moments. Don't overdo it — log only what matters.",
              "",
              "**Test Edge Cases First**",
              "Most bugs hide at the edges: empty arrays, single elements, duplicate values, negative numbers.",
              "",
              "**Explain It to Someone (or a Rubber Duck)**",
              "Talking through your logic often reveals the flaw.",
              "",
              "**Try a Different Approach**",
              "If stuck for 20+ minutes, step back. Could there be a simpler solution?"
            ],
            example: {
              title: "Debugging Example: Off-by-One Errors",
              code: `// BUGGY CODE: Trying to reverse an array in-place
function reverseArrayBuggy(arr) {
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    return arr;
}
// With [1,2,3,4]: swaps twice, returns original!

// FIXED CODE: Only go halfway
function reverseArrayFixed(arr) {
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
        let temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    return arr;
}

console.log(reverseArrayFixed([1, 2, 3, 4]));  // [4, 3, 2, 1]
console.log(reverseArrayFixed([1, 2, 3]));     // [3, 2, 1]`,
              explanation: "Tracing with a small example revealed the bug: the loop swapped elements twice because it went all the way to the end. The fix is to only go halfway."
            },
            practice: "Find and fix the bug in code that's supposed to find the first non-repeating character in a string."
          }
        }
      ]
    },
    {
      id: "algo-complexity",
      title: "Time and Space Complexity Basics",
      description: "Understand how to measure algorithm efficiency",
      duration: "50 min",
      subtopics: [
        {
          id: "complexity-big-o",
          title: "Introduction to Big O Notation",
          content: {
            explanation: [
              "Big O notation describes how an algorithm's runtime grows as input size increases. It's our language for comparing algorithm efficiency.",
              "",
              "**The Most Common Complexities (from best to worst):**",
              "",
              "**O(1) - Constant Time** - Takes the same time regardless of input size. Example: accessing array[0]",
              "",
              "**O(log n) - Logarithmic Time** - Grows slowly as input grows. Example: Binary search",
              "",
              "**O(n) - Linear Time** - Time grows proportionally with input. Example: Finding max in array",
              "",
              "**O(n log n) - Linearithmic Time** - Slightly worse than linear. Example: Efficient sorting",
              "",
              "**O(n²) - Quadratic Time** - Time grows with the square of input. Example: Nested loops",
              "",
              "**O(2ⁿ) - Exponential Time** - Very fast growth. Usually too slow for large inputs."
            ],
            example: {
              title: "Comparing Time Complexities Visually",
              code: `// O(1) - Constant
function getFirstElement(arr) {
    return arr[0];
}

// O(n) - Linear
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// O(n²) - Quadratic
function findAllPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            pairs.push([arr[i], arr[j]]);
        }
    }
    return pairs;
}

function demonstrateComplexity() {
    const sizes = [10, 100, 500];
    console.log("n\\tO(n)\\tO(n²)\\tDifference");
    for (let n of sizes) {
        console.log(\`\${n}\\t\${n}\\t\${n*n}\\t\${(n*n)/n}x\`);
    }
}
demonstrateComplexity();`,
              explanation: "For 500 items, O(n²) does 250,000 operations while O(n) does only 500 — 500 times more work!"
            },
            practice: "What's the time complexity of finding the intersection of two arrays using nested loops? Can you think of a faster approach?"
          }
        },
        {
          id: "complexity-space",
          title: "Space Complexity",
          content: {
            explanation: [
              "Space complexity measures how much extra memory an algorithm needs. Sometimes faster algorithms use more memory — you trade space for time.",
              "",
              "**Common Space Complexities:**",
              "",
              "**O(1) - Constant Space** - Uses the same amount of memory regardless of input. Modifying the input array in-place is O(1).",
              "",
              "**O(n) - Linear Space** - Creates a copy or data structure that grows with input.",
              "",
              "**O(n²) - Quadratic Space** - Creates a 2D structure like an n×n matrix.",
              "",
              "**When to Care About Space:**",
              "- Working with limited memory (mobile devices, embedded systems)",
              "- Processing huge datasets that might not fit in memory",
              "- When interviewers explicitly ask for in-place solutions"
            ],
            example: {
              title: "Space vs Time Trade-off",
              code: `// Time-efficient, but uses O(n) space
function hasDuplicateTimeOptimized(arr) {
    const seen = {};
    for (let num of arr) {
        if (seen[num]) return true;
        seen[num] = true;
    }
    return false;
}

// Space-efficient, but slower
function hasDuplicateSpaceOptimized(arr) {
    arr.sort();
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i - 1]) return true;
    }
    return false;
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 5];
console.log(hasDuplicateTimeOptimized(data));   // true (faster)
console.log(hasDuplicateSpaceOptimized([...data])); // true (saves memory)`,
              explanation: "The first solution is faster but uses more memory. The second uses less memory but is slower. The 'best' choice depends on your constraints."
            },
            practice: "Write a function that reverses an array in-place (O(1) extra space) instead of creating a new reversed array (O(n) space)."
          }
        }
      ]
    },
    {
      id: "algo-arrays-basics",
      title: "Arrays and Step-by-Step Problem Solving",
      description: "Master array manipulation and systematic problem solving",
      duration: "55 min",
      subtopics: [
        {
          id: "arrays-traversal",
          title: "Array Traversal Patterns",
          content: {
            explanation: [
              "Arrays are the foundation of most algorithm problems. Mastering array traversal is your first big step.",
              "",
              "**Basic Traversal Patterns:**",
              "",
              "**1. Forward Traversal** — Start to end. Use for: finding max, sum, average",
              "",
              "**2. Backward Traversal** — End to start. Use for: reverse operations",
              "",
              "**3. Skipping Elements** — Every k-th element. Use for: sampling",
              "",
              "**4. Alternating Directions** — Left, right, left, right. Use for: zigzag patterns",
              "",
              "**Pro tip:** Always consider if you can solve with ONE traversal before adding nested loops."
            ],
            example: {
              title: "Different Array Traversal Ways",
              code: `const fruits = ["apple", "banana", "cherry", "date", "elderberry"];

// 1. Forward Traversal (most common)
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// 2. Backward Traversal
for (let i = fruits.length - 1; i >= 0; i--) {
    console.log(fruits[i]);
}

// 3. Every 2nd element (skip one)
for (let i = 0; i < fruits.length; i += 2) {
    console.log(fruits[i]);
}

// 4. While loop traversal (more flexible)
let i = 0;
while (i < fruits.length && fruits[i] !== "cherry") {
    console.log(fruits[i]);
    i++;
}

// Real-world example: Finding running total
function runningSum(arr) {
    const result = [];
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        result.push(sum);
    }
    return result;
}

console.log(runningSum([1, 2, 3, 4]));  // [1, 3, 6, 10]`,
              explanation: "Different traversal patterns serve different purposes. Forward for accumulation, backward for reverse operations, while loops for early stopping."
            },
            practice: "Write a function that alternates between taking from the front and back of an array until it's empty. Input: [1,2,3,4,5] → Output: [1,5,2,4,3]"
          }
        },
        {
          id: "arrays-two-pointer",
          title: "Two Pointers on Arrays",
          content: {
            explanation: [
              "Two pointers is your first powerful pattern for array problems. It's like having two fingers pointing at different positions.",
              "",
              "**Why it's powerful:** Many nested loop solutions (O(n²)) become single-pass (O(n)) with two pointers.",
              "",
              "**Common Two Pointer Setups:**",
              "",
              "**1. Opposite Ends** — One at start, one at end, moving toward each other. Great for: palindrome checking, reversing",
              "",
              "**2. Same Direction (Slow & Fast)** — Both start at beginning, one moves faster. Great for: removing duplicates, finding middle",
              "",
              "**3. Window Pointers** — Left and right defining a subarray (preview of sliding window)"
            ],
            example: {
              title: "Two Pointers: Opposite Ends",
              code: `// Check if array is palindrome
function isPalindromeArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        if (arr[left] !== arr[right]) return false;
        left++;
        right--;
    }
    return true;
}

console.log(isPalindromeArray([1, 2, 3, 2, 1]));  // true

// Reverse array in-place
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}

// Find pair with target sum in sorted array
function findPairWithSum(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    
    while (left < right) {
        const sum = sortedArr[left] + sortedArr[right];
        if (sum === target) return [sortedArr[left], sortedArr[right]];
        if (sum < target) left++;
        else right--;
    }
    return null;
}

const numbers = [1, 3, 5, 7, 9, 11];
console.log(findPairWithSum(numbers, 12));  // [5, 7]`,
              explanation: "Two pointers from opposite ends solves problems that would otherwise require nested loops. Each element is processed at most once."
            },
            practice: "Use two pointers to move all zeros to the end of an array while preserving the order of non-zero elements. Input: [0,1,0,3,12] → Output: [1,3,12,0,0]"
          }
        }
      ]
    },
    {
      id: "algo-pattern-recognition",
      title: "Pattern Recognition Basics",
      description: "Learn to recognize which algorithmic pattern fits which problem",
      duration: "40 min",
      subtopics: [
        {
          id: "recognition-signals",
          title: "Problem Signals for Common Patterns",
          content: {
            explanation: [
              "The key skill for algorithmic problem solving is recognizing which pattern to apply. Here are the signals:",
              "",
              "**Two Pointers Signals:**",
              "- Problems about pairs in sorted arrays",
              "- Palindrome checking",
              "",
              "**Sliding Window Signals:**",
              "- 'Contiguous subarray' or 'substring'",
              "- 'Maximum/minimum sum of K elements'",
              "",
              "**Binary Search Signals:**",
              "- Input is sorted (or you can sort it)",
              "- 'Find if element exists'",
              "",
              "**Prefix Sum Signals:**",
              "- 'Sum of subarray queries'",
              "- 'Subarray sum equals K'",
              "",
              "**Recursion/Backtracking Signals:**",
              "- 'All possible combinations/permutations'",
              "- 'Find all paths'"
            ],
            example: {
              title: "Pattern Recognition in Action",
              code: `// Problem 1: "Find the longest subarray with sum <= K"
// Signal: 'subarray' + 'maximum length' + 'condition'
// Pattern: Sliding Window!
function longestSubarrayWithSumLimit(arr, k) {
    let left = 0, sum = 0, maxLen = 0;
    for (let right = 0; right < arr.length; right++) {
        sum += arr[right];
        while (sum > k) sum -= arr[left++];
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

// Problem 2: "Check if a string is a palindrome after removing at most one character"
// Signal: 'palindrome' + 'compare from ends'
// Pattern: Two Pointers with a skip!
function validPalindromeAfterRemoval(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return isPalindromeRange(s, left + 1, right) || 
                   isPalindromeRange(s, left, right - 1);
        }
        left++; right--;
    }
    return true;
}
function isPalindromeRange(s, left, right) {
    while (left < right) if (s[left++] !== s[right--]) return false;
    return true;
}

// Problem 3: "Find number of contiguous subarrays with sum = K"
// Signal: 'subarray sum' + 'equals K' + 'need count'
// Pattern: Prefix Sum + Hash Map!
function subarraySumEqualsK(nums, k) {
    let count = 0, sum = 0;
    const prefixCount = {0: 1};
    for (let num of nums) {
        sum += num;
        if (prefixCount[sum - k]) count += prefixCount[sum - k];
        prefixCount[sum] = (prefixCount[sum] || 0) + 1;
    }
    return count;
}

console.log(subarraySumEqualsK([1, 1, 1], 2));  // 2`,
              explanation: "Each problem's description contains keywords that point to a specific pattern. Learning these signals helps you know which tool to use before writing code."
            },
            practice: "Given a problem, identify which pattern(s) might work: 'Find the smallest subarray that contains all elements from a target set.'"
          }
        }
      ]
    },
    {
      id: "algo-two-pointers",
      title: "Two Pointers",
      description: "Optimize array traversal with two pointers",
      duration: "60 min",
      subtopics: [
        {
          id: "tp-opposite",
          title: "Opposite Ends Pattern",
          content: {
            explanation: [
              "The two pointers pattern uses one pointer at the start and one at the end, moving toward each other. This is very effective for:",
              "",
              "1. **Palindrome checking** — compare characters from both ends",
              "2. **Two sum in sorted array** — find pair that adds to target",
              "3. **Removing duplicates** — from the end of sorted arrays",
              "",
              "Why it works: Each element is visited at most once, giving O(n) instead of O(n²).",
              "",
              "Key insight: When you have sorted data and need to find pairs or check symmetry, two pointers from opposite ends often solves it in a single pass."
            ],
            example: {
              title: "Two Pointers - Palindrome",
              code: `function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;
    
    while (left < right) {
        if (str[left] !== str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

console.log(isPalindrome("racecar"));  // true
console.log(isPalindrome("hello"));    // false
console.log(isPalindrome("a"));        // true
console.log(isPalindrome(""));         // true`,
              explanation: "This JavaScript function uses two pointers starting from opposite ends of the string to check if it's a palindrome in O(n) time and O(1) space."
            },
            practice: "Write a function that finds two numbers in a sorted array that sum to a target using the two pointers approach."
          }
        },
        {
          id: "tp-same-direction",
          title: "Same Direction Pattern",
          content: {
            explanation: [
              "Both pointers start from the beginning, but one moves faster. This is also called 'slow and fast pointers' or 'runner technique'.",
              "",
              "Use cases:",
              "1. **Removing duplicates** — fast finds unique elements, slow builds result",
              "2. **Finding middle of array** — fast moves twice as fast to find middle",
              "3. **Moving zeros** — slow tracks position for next non-zero",
              "",
              "Why it works: The relative speed creates a predictable gap."
            ],
            example: {
              title: "Remove Duplicates from Sorted Array",
              code: `function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    let slow = 0;
    
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}

let nums = [1, 1, 2, 2, 3, 3, 3, 4];
let length = removeDuplicates(nums);
console.log("Length:", length);
console.log("First", length, "elements:", nums.slice(0, length));`,
              explanation: "This function uses two pointers to remove duplicates from a sorted array in-place, maintaining O(n) time and O(1) space."
            },
            practice: "Implement finding the middle element of an array using slow/fast pointers."
          }
        },
        {
          id: "tp-partition",
          title: "Partition Pattern",
          content: {
            explanation: [
              "The partition pattern creates two 'regions' in an array based on a condition. Elements less than pivot go left, greater go right.",
              "",
              "This is the foundation of quicksort and is used for:",
              "1. Partition array around a value",
              "2. Reorder odd/even numbers",
              "3. Separate positive/negative numbers",
              "",
              "Key: Maintain the partition invariant — elements before the partition point satisfy the condition."
            ],
            example: {
              title: "Partition Odd and Even",
              code: `function partitionEvenOdd(nums) {
    let left = 0;
    
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] % 2 === 0) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
        }
    }
    return nums;
}

let nums = [1, 2, 3, 4, 5, 6];
console.log(partitionEvenOdd(nums));`,
              explanation: "This function uses two pointers to partition an array, placing all even numbers before odd numbers."
            },
            practice: "Partition an array so all negative numbers come before positive ones."
          }
        }
      ]
    },
    {
      id: "algo-sliding-window",
      title: "Sliding Window",
      description: "Process subarrays efficiently",
      duration: "65 min",
      subtopics: [
        {
          id: "sw-fixed",
          title: "Fixed Window Size",
          content: {
            explanation: [
              "The fixed sliding window pattern processes consecutive elements of a fixed size k. Instead of recalculating from scratch each time, slide the window by removing the leftmost and adding the new rightmost element.",
              "",
              "Why it matters: Calculating a window sum from scratch is O(k), but sliding is O(1). For n elements, this gives O(n) instead of O(n×k).",
              "",
              "Use cases:",
              "1. Maximum sum of k consecutive elements",
              "2. Average of k consecutive elements",
              "3. Any aggregate of fixed-size windows"
            ],
            example: {
              title: "Maximum Sum Subarray of Size K",
              code: `function maxSumSubarray(arr, k) {
    if (arr.length < k) return 0;
    
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    let maxSum = windowSum;
    
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}

const arr = [2, 1, 5, 1, 3, 2];
console.log(maxSumSubarray(arr, 3));  // 9`,
              explanation: "This function uses a sliding window to find the maximum sum of any k consecutive elements in O(n) time."
            },
            practice: "Find the maximum average of any k consecutive elements in an array."
          }
        },
        {
          id: "sw-variable",
          title: "Variable Window Size",
          content: {
            explanation: [
              "Variable window size expands and shrinks based on conditions. Unlike fixed windows, we don't know the size in advance.",
              "",
              "General algorithm:",
              "1. Expand right pointer until condition is met",
              "2. Shrink left pointer while condition still holds",
              "3. Track the answer at each valid window",
              "",
              "Use cases:",
              "1. Minimum size subarray with given sum",
              "2. Longest substring without repeating",
              "3. String anagrams"
            ],
            example: {
              title: "Minimum Size Subarray Sum",
              code: `function minSubArrayLen(target, nums) {
    let left = 0;
    let sum = 0;
    let minLen = Infinity;
    
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        
        while (sum >= target && left <= right) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    
    return minLen === Infinity ? 0 : minLen;
}

const nums = [2, 3, 1, 2, 4, 3];
console.log(minSubArrayLen(7, nums));  // 2`,
              explanation: "This function finds the minimum length subarray that sums to at least the target using a variable-size sliding window."
            },
            practice: "Find the length of the longest substring without repeating characters."
          }
        },
        {
          id: "sw-substring",
          title: "String Sliding Window",
          content: {
            explanation: [
              "Strings are just arrays in disguise! Use sliding window for string problems like:",
              "",
              "1. **Minimum window substring** — find smallest window containing all characters",
              "2. **Longest substring with k distinct**",
              "3. **String anagrams** — find all anagram groups",
              "",
              "Use a Map or object to track characters in the window."
            ],
            example: {
              title: "Longest Substring with K Distinct Characters",
              code: `function longestSubstringKDistinct(s, k) {
    if (k === 0 || s.length === 0) return 0;
    
    const charCount = {};
    let left = 0;
    let maxLen = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        charCount[rightChar] = (charCount[rightChar] || 0) + 1;
        
        while (Object.keys(charCount).length > k) {
            const leftChar = s[left];
            charCount[leftChar]--;
            if (charCount[leftChar] === 0) {
                delete charCount[leftChar];
            }
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

console.log(longestSubstringKDistinct("abcbdbdbb", 2));`,
              explanation: "This uses a sliding window with a character frequency map to find the longest substring containing at most k distinct characters."
            },
            practice: "Find all anagram starting indices in a string."
          }
        }
      ]
    },
    {
      id: "algo-binary-search",
      title: "Binary Search",
      description: "Search in logarithmic time",
      duration: "75 min",
      subtopics: [
        {
          id: "bs-basics",
          title: "Classic Binary Search",
          content: {
            explanation: [
              "Binary search finds an element in a sorted array by repeatedly dividing the search space in half.",
              "",
              "Algorithm:",
              "1. Look at middle element",
              "2. If target is smaller, search left half",
              "3. If target is larger, search right half",
              "4. Repeat until found or space is empty",
              "",
              "Time: O(log n) — every iteration halves the search space. 1 million items takes only ~20 steps!"
            ],
            example: {
              title: "Basic Binary Search",
              code: `function binarySearch(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

const nums = [1, 3, 5, 7, 9];
console.log(binarySearch(nums, 5));   // 2
console.log(binarySearch(nums, 6));   // -1`,
              explanation: "This classic binary search algorithm finds a target value in a sorted array, returning the index or -1 if not found."
            },
            practice: "Implement binary search that returns true/false instead of index."
          }
        },
        {
          id: "bs-modified",
          title: "Modified Binary Search",
          content: {
            explanation: [
              "Many problems require finding boundaries, not exact matches. The key variation is deciding which half to discard:",
              "",
              "**Find left boundary** (first occurrence): When nums[mid] == target, go LEFT (right = mid - 1)",
              "",
              "**Find right boundary** (last occurrence): When nums[mid] == target, go RIGHT (left = mid + 1)",
              "",
              "**Rotated array**: Determine which half is sorted, then decide based on where target falls."
            ],
            example: {
              title: "Find First and Last Position",
              code: `function searchRange(nums, target) {
    return [findBound(nums, target, true), findBound(nums, target, false)];
}

function findBound(nums, target, isFirst) {
    let left = 0, right = nums.length - 1, bound = -1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) {
            bound = mid;
            if (isFirst) right = mid - 1;
            else left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return bound;
}

console.log(searchRange([5, 7, 7, 7, 7, 8], 7));  // [1, 4]`,
              explanation: "This uses modified binary search to find the first and last positions of a target value in a sorted array."
            },
            practice: "Search in a rotated sorted array."
          }
        },
        {
          id: "bs-floor",
          title: "Finding Boundaries",
          content: {
            explanation: [
              "Binary search isn't just for exact matches. Use it to find:",
              "",
              "1. **Lower bound** — first element >= target",
              "2. **Upper bound** — first element > target",
              "3. **Square root** — floor of sqrt(n)",
              "4. **Peak element** — where arr[i] > arr[i+1]",
              "",
              "The pattern: Use binary search whenever monotonic (sorted) relationships exist."
            ],
            example: {
              title: "Lower Bound and Square Root",
              code: `function lowerBound(nums, target) {
    let left = 0, right = nums.length;
    while (left < right) {
        const mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}

function sqrtFloor(n) {
    if (n < 2) return n;
    let left = 1, right = Math.floor(n / 2);
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        const square = mid * mid;
        if (square === n) return mid;
        if (square < n) left = mid + 1;
        else right = mid - 1;
    }
    return right;
}

console.log(lowerBound([1, 2, 3, 4, 5, 6], 3));  // 2
console.log(sqrtFloor(25));   // 5
console.log(sqrtFloor(26));   // 5`,
              explanation: "Binary search can find insertion positions and compute mathematical functions like square roots."
            },
            practice: "Find the peak element in an array where arr[i] > arr[i+1]."
          }
        }
      ]
    },
    {
      id: "algo-prefix-sum",
      title: "Prefix Sum",
      description: "Precompute sums for fast range queries",
      duration: "50 min",
      subtopics: [
        {
          id: "ps-basics",
          title: "Prefix Sum Pattern",
          content: {
            explanation: [
              "Prefix sum precomputes cumulative sums: prefix[i] = sum of first i elements.",
              "",
              "Then range sum [i, j] = prefix[j+1] - prefix[i]",
              "",
              "Why it matters: Computing range sums naively is O(n), but with prefix sum it's O(1).",
              "",
              "More variations: 2D prefix sum for matrices, hash prefix sum for modulo problems"
            ],
            example: {
              title: "Range Sum Query",
              code: `class NumArray {
    constructor(nums) {
        this.prefix = new Array(nums.length + 1).fill(0);
        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }
    
    sumRange(left, right) {
        return this.prefix[right + 1] - this.prefix[left];
    }
}

const na = new NumArray([-2, 0, 3, -4, 2]);
console.log(na.sumRange(0, 2));  // 1
console.log(na.sumRange(2, 4));  // 1`,
              explanation: "This class precomputes prefix sums so any range sum query can be answered in O(1) time."
            },
            practice: "Given array and many queries, answer each range sum in O(1)."
          }
        },
        {
          id: "ps-modulo",
          title: "Subarray Sum with Modulo",
          content: {
            explanation: [
              "For problems like 'subarray sum equals k' or 'subarray divisible by k', use hash maps with prefix sum:",
              "",
              "Key insight: prefix[j] - prefix[i] = k means prefix[j] = prefix[i] + k",
              "",
              "For modulo: Two prefix sums are congruent (mod k) if their difference is divisible by k."
            ],
            example: {
              title: "Subarray Sum Equals K",
              code: `function subarraySumEqualsK(nums, k) {
    let count = 0, sum = 0;
    const prefixCount = {0: 1};
    
    for (let num of nums) {
        sum += num;
        if (prefixCount[sum - k]) count += prefixCount[sum - k];
        prefixCount[sum] = (prefixCount[sum] || 0) + 1;
    }
    return count;
}

console.log(subarraySumEqualsK([1, 1, 1], 2));      // 2
console.log(subarraySumEqualsK([1, 2, 3], 3));      // 2
console.log(subarraySumEqualsK([1, -1, 0], 0));     // 3`,
              explanation: "This uses a hash map tracking prefix sums to count subarrays that sum to a target value in O(n) time."
            },
            practice: "Count the number of subarrays divisible by k."
          }
        }
      ]
    },
    {
      id: "algo-recursion",
      title: "Recursion Basics",
      description: "Solve problems by breaking them into smaller versions of themselves",
      duration: "55 min",
      subtopics: [
        {
          id: "recursion-intro",
          title: "What Is Recursion?",
          content: {
            explanation: [
              "Recursion is when a function calls itself to solve a smaller version of the same problem. It's like Russian nesting dolls.",
              "",
              "**Every recursive function needs:**",
              "",
              "1. **Base Case** — the stopping condition (when to stop calling itself)",
              "2. **Recursive Case** — the function calling itself with modified parameters",
              "",
              "**Why learn recursion?**",
              "- Many algorithms are naturally recursive (tree traversal, sorting, backtracking)",
              "- It often leads to cleaner, more intuitive code",
              "- It's essential for divide-and-conquer approaches"
            ],
            example: {
              title: "Factorial: The Classic Recursion Example",
              code: `// Factorial: n! = n × (n-1) × ... × 1
function factorial(n) {
    if (n <= 1) return 1;  // Base case
    return n * factorial(n - 1);  // Recursive case
}

console.log(factorial(5));  // 120

// Visualizing:
// factorial(5) = 5 * factorial(4)
// factorial(4) = 4 * factorial(3)
// factorial(3) = 3 * factorial(2)
// factorial(2) = 2 * factorial(1)
// factorial(1) = 1  (base case)
// Then unwinds: 2*1=2, 3*2=6, 4*6=24, 5*24=120

// Sum of array using recursion
function sumArray(arr, index = 0) {
    if (index >= arr.length) return 0;
    return arr[index] + sumArray(arr, index + 1);
}

console.log(sumArray([1, 2, 3, 4, 5]));  // 15`,
              explanation: "Each recursive call solves a smaller instance (n-1) until reaching the base case (n<=1). Then the results bubble back up."
            },
            practice: "Write a recursive function that counts down from n to 1 and then prints 'Blast off!'"
          }
        },
        {
          id: "recursion-stack",
          title: "The Call Stack and Recursion Depth",
          content: {
            explanation: [
              "JavaScript uses a call stack to track function calls. Each recursive call adds a new frame to this stack.",
              "",
              "**⚠️ Important Limit:**",
              "Too many recursive calls can cause a stack overflow. The maximum recursion depth is typically around 10,000.",
              "",
              "**When recursion can be dangerous:**",
              "- Very deep recursion (e.g., 100,000 levels)",
              "- Missing base case (infinite recursion)",
              "- Not making progress toward base case",
              "",
              "**Solution:** Use iteration or convert recursion to iteration for deep recursion."
            ],
            example: {
              title: "Understanding Recursion Depth",
              code: `// Counting recursion depth
let depthCount = 0;

function recursiveDepth(n) {
    depthCount++;
    console.log("Depth:", depthCount);
    
    if (n <= 1) {
        console.log("Base case reached!");
        depthCount--;
        return 1;
    }
    
    const result = n * recursiveDepth(n - 1);
    depthCount--;
    return result;
}

recursiveDepth(5);

// ✅ Better: Use iteration for very deep recursion
function factorialIterative(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function sumArrayIterative(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum;
}

console.log("Iterative factorial:", factorialIterative(10));
console.log("Iterative sum:", sumArrayIterative([1, 2, 3, 4, 5]));`,
              explanation: "Watch the call stack grow and shrink as recursion progresses. For deep recursion, consider iterative solutions."
            },
            practice: "Write both recursive and iterative versions of a function that calculates the nth Fibonacci number."
          }
        }
      ]
    },
    {
      id: "algo-dynamic-programming",
      title: "Dynamic Programming",
      description: "Optimize recursive solutions with memoization",
      duration: "90 min",
      subtopics: [
        {
          id: "dp-intro",
          title: "Introduction to DP",
          content: {
            explanation: [
              "Dynamic Programming (DP) solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation.",
              "",
              "Two approaches:",
              "1. **Top-down** (Memoization): Recursion + cache. Natural but can hit stack limits.",
              "2. **Bottom-up** (Tabulation): Iterative + table. More efficient but less intuitive.",
              "",
              "When to use DP:",
              "- Optimal substructure: solution can be built from sub-solutions",
              "- Overlapping subproblems: same subproblems solved multiple times"
            ],
            example: {
              title: "Fibonacci with and without DP",
              code: `// Naive recursion: O(2^n) - exponential!
function fibNaive(n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}

// Top-down DP (Memoization): O(n) time, O(n) space
function fibMemo(n, memo = {}) {
    if (n <= 1) return n;
    if (memo[n] !== undefined) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Bottom-up DP (Tabulation): O(n) time, O(n) space
function fibTabulation(n) {
    if (n <= 1) return n;
    const dp = new Array(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}

// Space-optimized DP: O(n) time, O(1) space
function fibOptimized(n) {
    if (n <= 1) return n;
    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
    return curr;
}

console.log(fibMemo(40));     // 102334155
console.log(fibOptimized(40)); // 102334155`,
              explanation: "DP transforms exponential runtime into linear. For n=40, naive recursion takes ~2 billion operations while DP takes ~40!"
            },
            practice: "Solve the climbing stairs problem using DP (you can take 1 or 2 steps at a time, find number of ways to reach step n)."
          }
        },
        {
          id: "dp-1d",
          title: "1D DP Problems",
          content: {
            explanation: [
              "Many DP problems use a 1D array. The key is identifying the state:",
              "",
              "Common patterns:",
              "1. **Last position matters**: dp[i] depends on dp[i-1]",
              "2. **Include/exclude**: Max of taking or not taking element",
              "3. **Build up**: dp[i] is solution for first i elements",
              "",
              "Questions to ask:",
              "- What's the state (what does dp[i] represent)?",
              "- What's the base case (dp[0])?",
              "- How do transitions work?"
            ],
            example: {
              title: "House Robber",
              code: `// Can't rob two adjacent houses
function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    const dp = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
    }
    return dp[nums.length - 1];
}

// Space optimized
function robOptimized(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prevPrev = nums[0];
    let prev = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(prev, nums[i] + prevPrev);
        prevPrev = prev;
        prev = current;
    }
    return prev;
}

console.log(rob([1, 2, 3, 1]));        // 4
console.log(rob([2, 7, 9, 3, 1]));    // 12`,
              explanation: "dp[i] represents the maximum amount robbable from first i+1 houses. Each step decides whether to rob the current house or skip it."
            },
            practice: "Solve the coin change problem: minimum number of coins to make a given amount."
          }
        },
        {
          id: "dp-2d",
          title: "2D DP Problems",
          content: {
            explanation: [
              "Some problems need two dimensions:",
              "",
              "1. **Two sequences**: dp[i][j] for first i of one, first j of another",
              "2. **Grid path**: unique paths in matrix",
              "",
              "Common questions: Two strings (Longest Common Subsequence, Edit Distance), matrix problems"
            ],
            example: {
              title: "Longest Common Subsequence",
              code: `function longestCommonSubsequence(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}

function getLCS(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    
    let lcs = "", i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i - 1] === s2[j - 1]) {
            lcs = s1[i - 1] + lcs;
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) i--;
        else j--;
    }
    return lcs;
}

console.log(longestCommonSubsequence("abcde", "ace"));  // 3
console.log(getLCS("abcde", "ace"));  // "ace"`,
              explanation: "2D DP handles problems comparing two sequences. dp[i][j] represents the LCS length using first i chars of s1 and first j chars of s2."
            },
            practice: "Solve the edit distance problem: minimum operations to convert one string to another."
          }
        }
      ]
    },
    {
      id: "algo-backtracking",
      title: "Backtracking",
      description: "Explore all possibilities and undo choices",
      duration: "60 min",
      subtopics: [
        {
          id: "bt-intro",
          title: "Introduction to Backtracking",
          content: {
            explanation: [
              "Backtracking tries all possibilities, undoing each choice after exploring. Use for:",
              "",
              "1. **Permutations/combinations** — all ways to arrange/select",
              "2. **Subset problems** — include/exclude each element",
              "3. **Path finding** — search through state space",
              "",
              "Template: Try each option → Recurse → Undo choice",
              "",
              "Optimization: Prune early if solution is impossible."
            ],
            example: {
              title: "Generate Permutations",
              code: `function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}

console.log(permute([1, 2, 3]));

// Generate combinations (choose k elements)
function combine(n, k) {
    const result = [];
    
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}

console.log(combine(4, 2));`,
              explanation: "Backtracking builds solutions incrementally, trying each possibility and unmaking choices to explore all alternatives."
            },
            practice: "Generate all letter combinations for a phone number."
          }
        },
        {
          id: "bt-subsets",
          title: "Subset Problems",
          content: {
            explanation: [
              "For subsets, at each element you have two choices: include or exclude.",
              "",
              "1. **All subsets** — 2^n possibilities",
              "2. **Subsets with sum** — filter by sum",
              "3. **Subsets matching pattern** — with additional constraints",
              "",
              "Key: Process each element exactly once."
            ],
            example: {
              title: "All Subsets",
              code: `function subsets(nums) {
    const result = [];
    
    function backtrack(index, path) {
        result.push([...path]);
        
        for (let i = index; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

console.log(subsets([1, 2, 3]));

// Subsets that sum to a target
function subsetsWithSum(nums, target) {
    const result = [];
    
    function backtrack(index, currentSum, path) {
        if (currentSum === target) {
            result.push([...path]);
            return;
        }
        
        if (currentSum > target || index >= nums.length) return;
        
        path.push(nums[index]);
        backtrack(index + 1, currentSum + nums[index], path);
        path.pop();
        
        backtrack(index + 1, currentSum, path);
    }
    
    backtrack(0, 0, []);
    return result;
}

console.log(subsetsWithSum([2, 3, 5, 7, 8], 10));`,
              explanation: "This generates all subsets by deciding for each element whether to include it. The target sum version adds pruning."
            },
            practice: "Find all subsets of a set that have no duplicate elements (handling duplicates in the input)."
          }
        },
        {
          id: "bt-nqueens",
          title: "Classic Backtracking: N-Queens",
          content: {
            explanation: [
              "N-Queens is the classic backtracking problem: place n queens on n×n board so none attack each other.",
              "",
              "This shows backtracking's power: try, check, recurse or backtrack.",
              "",
              "Key optimizations: Use sets/arrays for O(1) column/diag checking, prune early."
            ],
            example: {
              title: "N-Queens",
              code: `function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    const cols = new Array(n).fill(false);
    const diag1 = new Array(2 * n - 1).fill(false);
    const diag2 = new Array(2 * n - 1).fill(false);
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(row => row.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            const d1 = row - col + n - 1;
            const d2 = row + col;
            
            if (cols[col] || diag1[d1] || diag2[d2]) continue;
            
            board[row][col] = 'Q';
            cols[col] = diag1[d1] = diag2[d2] = true;
            
            backtrack(row + 1);
            
            board[row][col] = '.';
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }
    
    backtrack(0);
    return result;
}

console.log(solveNQueens(4));`,
              explanation: "This places queens row by row, using backtracking to undo placements that lead to dead ends."
            },
            practice: "Solve the Sudoku puzzle using backtracking."
          }
        }
      ]
    },
    {
      id: "algo-graph-traversal",
      title: "Graph Traversal",
      description: "BFS and DFS for tree/graph problems",
      duration: "75 min",
      subtopics: [
        {
          id: "dfs-recursive",
          title: "Depth-First Search (DFS)",
          content: {
            explanation: [
              "DFS explores as deep as possible before backtracking. Uses recursion (stack) or explicit stack.",
              "",
              "Three traversal orders for trees:",
              "1. **Preorder**: root, left, right — copy tree",
              "2. **Inorder**: left, root, right — sorted BST",
              "3. **Postorder**: left, right, root — delete tree",
              "",
              "Why DFS: Lower memory than BFS for deep trees, natural for recursion."
            ],
            example: {
              title: "Tree Traversals",
              code: `class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

const tree = new TreeNode(1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3)
);

function preorder(root, result = []) {
    if (!root) return result;
    result.push(root.val);
    preorder(root.left, result);
    preorder(root.right, result);
    return result;
}

function inorder(root, result = []) {
    if (!root) return result;
    inorder(root.left, result);
    result.push(root.val);
    inorder(root.right, result);
    return result;
}

function postorder(root, result = []) {
    if (!root) return result;
    postorder(root.left, result);
    postorder(root.right, result);
    result.push(root.val);
    return result;
}

console.log("Preorder:", preorder(tree));
console.log("Inorder:", inorder(tree));
console.log("Postorder:", postorder(tree));`,
              explanation: "The three DFS traversals differ only in when they visit the root node relative to the children."
            },
            practice: "Implement preorder traversal iteratively using an explicit stack."
          }
        },
        {
          id: "bfs-level-order",
          title: "Breadth-First Search (BFS)",
          content: {
            explanation: [
              "BFS explores level by level using a queue. Great for:",
              "",
              "1. **Shortest path** in unweighted graphs",
              "2. **Level-by-level** processing",
              "3. **Finding minimum** steps to target",
              "",
              "Algorithm: Add start to queue, process node, add neighbors, continue until queue empty."
            ],
            example: {
              title: "Level Order Traversal",
              code: `function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

function minDepth(root) {
    if (!root) return 0;
    const queue = [[root, 1]];
    
    while (queue.length > 0) {
        const [node, depth] = queue.shift();
        if (!node.left && !node.right) return depth;
        if (node.left) queue.push([node.left, depth + 1]);
        if (node.right) queue.push([node.right, depth + 1]);
    }
    return 0;
}

const tree = new TreeNode(1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3, null, new TreeNode(6))
);

console.log(levelOrder(tree));
console.log("Min depth:", minDepth(tree));`,
              explanation: "BFS processes nodes level by level using a queue. It's perfect for finding shortest paths."
            },
            practice: "Find the maximum width of a binary tree."
          }
        },
        {
          id: "graph-dfs-bfs",
          title: "Graph DFS and BFS",
          content: {
            explanation: [
              "For graphs (not trees), we need a visited set to avoid cycles.",
              "",
              "Common graph problems:",
              "- Find connected components",
              "- Detect cycles",
              "- Topological sort (DAG)",
              "- Path finding"
            ],
            example: {
              title: "Graph Connected Components",
              code: `function countComponents(n, edges) {
    const graph = Array(n).fill().map(() => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n).fill(false);
    let components = 0;
    
    function dfs(node) {
        visited[node] = true;
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) dfs(neighbor);
        }
    }
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            components++;
        }
    }
    
    return components;
}

function hasCycle(n, edges) {
    const graph = Array(n).fill().map(() => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n).fill(false);
    
    function dfs(node, parent) {
        visited[node] = true;
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                if (dfs(neighbor, node)) return true;
            } else if (neighbor !== parent) {
                return true;
            }
        }
        return false;
    }
    
    for (let i = 0; i < n; i++) {
        if (!visited[i] && dfs(i, -1)) return true;
    }
    return false;
}

const edges = [[0, 1], [1, 2], [3, 4]];
console.log(countComponents(5, edges));  // 2
console.log(hasCycle(3, [[0, 1], [1, 2], [2, 0]]));  // true`,
              explanation: "For graphs, we need to track visited nodes to avoid infinite loops. Both DFS and BFS work for finding connected components."
            },
            practice: "Determine if there's a path between two nodes in a graph using both DFS and BFS."
          }
        }
      ]
    },
    {
      id: "algo-greedy",
      title: "Greedy Algorithms",
      description: "Make locally optimal decisions",
      duration: "60 min",
      subtopics: [
        {
          id: "greedy-intro",
          title: "When to Use Greedy",
          content: {
            explanation: [
              "Greedy makes the locally optimal choice at each step, hoping for global optimum. It works when:",
              "",
              "1. **Greedy choice property**: local optimum leads to global optimum",
              "2. **Optimal substructure**: solution can be built from subsolutions",
              "",
              "When NOT to use: When local optimum doesn't guarantee global (like knapsack).",
              "",
              "Problems greedy works for: Activity selection, coin change (standard denominations), Huffman coding, Dijkstra's algorithm"
            ],
            example: {
              title: "Activity Selection",
              code: `function maxActivities(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return count;
}

console.log(maxActivities([[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10]]));

function coinChangeGreedy(amount) {
    const denominations = [25, 10, 5, 1];
    const coins = [];
    
    for (const coin of denominations) {
        while (amount >= coin) {
            coins.push(coin);
            amount -= coin;
        }
    }
    return coins;
}

console.log(coinChangeGreedy(87));`,
              explanation: "Greedy algorithms make the best immediate choice. For activity selection, picking the earliest-ending activity leaves maximum room for others."
            },
            practice: "Given meeting room times, find the minimum number of rooms needed."
          }
        },
        {
          id: "greedy-interval",
          title: "Interval Problems",
          content: {
            explanation: [
              "Interval problems are very common. Key patterns:",
              "",
              "1. **Merge intervals**: sort by start, merge overlapping",
              "2. **Non-overlapping intervals**: greedy selection (activity selection)",
              "3. **Meeting rooms**: min rooms needed (sweep line)",
              "",
              "Key insight: Sort by what matters — usually the start or end time."
            ],
            example: {
              title: "Merge Intervals",
              code: `function mergeIntervals(intervals) {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const last = result[result.length - 1];
        const current = intervals[i];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            result.push(current);
        }
    }
    return result;
}

function minMeetingRooms(intervals) {
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0, endIdx = 0;
    
    for (let start of starts) {
        if (start < ends[endIdx]) rooms++;
        else endIdx++;
    }
    return rooms;
}

console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]]));`,
              explanation: "Interval merging uses sorting by start time to efficiently combine overlapping intervals in O(n log n) time."
            },
            practice: "Given intervals representing availability, find the longest time when at least one person is available."
          }
        }
      ]
    },
    {
      id: "algo-union-find",
      title: "Union-Find (Disjoint Set Union)",
      description: "Track and merge disjoint sets efficiently",
      duration: "55 min",
      subtopics: [
        {
          id: "uf-dsu-intro",
          title: "Union-Find Basics",
          content: {
            explanation: [
              "Union-Find (Disjoint Set Union) efficiently tracks which elements belong to the same group and merges groups.",
              "",
              "Two operations:",
              "1. **Find**: Which group does element belong to?",
              "2. **Union**: Merge two groups into one",
              "",
              "With path compression + union by rank: Almost O(1) per operation!",
              "",
              "Classic use: Detect cycles in undirected graphs."
            ],
            example: {
              title: "Basic Union-Find",
              code: `class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill().map((_, i) => i);
        this.rank = Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        return true;
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}

const uf = new UnionFind(5);
uf.union(0, 1);
uf.union(2, 3);
console.log(uf.connected(0, 1));  // true
console.log(uf.connected(0, 2));  // false
uf.union(1, 2);
console.log(uf.connected(0, 2));  // true`,
              explanation: "Union-Find with path compression and union by rank achieves nearly O(1) operations. Each element initially points to itself as its own set."
            },
            practice: "Implement Union-Find without union by rank and compare performance."
          }
        },
        {
          id: "uf-applications",
          title: "Cycle Detection & Components",
          content: {
            explanation: [
              "Union-Find shines at:",
              "",
              "1. **Cycle detection**: If union() returns false, adding that edge creates a cycle",
              "2. **Connected components**: Each root is a component",
              "3. **Kruskal's algorithm**: Build MST by adding edges without cycles"
            ],
            example: {
              title: "Detect Cycle and Count Components",
              code: `class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill().map((_, i) => i);
        this.rank = Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false;
        if (this.rank[rootX] < this.rank[rootY]) this.parent[rootX] = rootY;
        else if (this.rank[rootX] > this.rank[rootY]) this.parent[rootY] = rootX;
        else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        return true;
    }
    
    countSets() {
        const roots = new Set();
        for (let i = 0; i < this.parent.length; i++) roots.add(this.find(i));
        return roots.size;
    }
}

function hasCycle(n, edges) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        if (!uf.union(u, v)) return true;
    }
    return false;
}

function countComponents(n, edges) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) uf.union(u, v);
    return uf.countSets();
}

console.log(hasCycle(3, [[0, 1], [1, 2]]));  // false
console.log(hasCycle(3, [[0, 1], [1, 2], [2, 0]]));  // true
console.log(countComponents(5, [[0, 1], [1, 2], [3, 4]]));  // 2`,
              explanation: "Union-Find elegantly detects cycles: if two nodes are already in the same set, adding an edge between them creates a cycle."
            },
            practice: "Use Union-Find to find the number of islands in a 2D grid."
          }
        }
      ]
    }
  ]
};