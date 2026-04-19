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
              code: `func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}

// Test
func main() {
    fmt.Println(isPalindrome("racecar"))  // true
    fmt.Println(isPalindrome("hello"))    // false
}`,
              explanation: "This Go function uses two pointers starting from opposite ends of the string to check if it's a palindrome in O(n) time and O(1) space."
            },
            practice: "Write a function to check if a sorted array has two elements that sum to target."
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
              "1. **Finding middle of linked list** — fast reaches end, slow is at middle",
              "2. **Removing duplicates** — fast finds unique elements, slow builds result",
              "3. **Finding cycle start** — in linked list cycle detection",
              "",
              "Why it works: The relative speed creates a predictable gap. Fast pointer moves twice as fast, so when fast reaches end, slow is exactly at the middle."
            ],
            example: {
              title: "Remove Duplicates from Sorted Array",
              code: `func removeDuplicates(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    slow := 0
    // fast looks for new elements
    for fast := 1; fast < len(nums); fast++ {
        if nums[fast] != nums[slow] {
            slow++
            nums[slow] = nums[fast]
        }
    }
    return slow + 1
}

// Test
func main() {
    nums := []int{1, 1, 2, 2, 3, 3, 3, 4}
    length := removeDuplicates(nums)
    fmt.Println("Length:", length)  // 4
    fmt.Println(nums[:length])      // [1, 2, 3, 4]
}`,
              explanation: "This Go function uses two pointers to remove duplicates from a sorted array in-place, maintaining O(n) time complexity and O(1) space complexity."
            },
            practice: "Implement finding the middle node of a linked list using slow/fast pointers."
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
              code: `func exchange(nums []int) []int {
    // Put all even numbers first, then odd
    left := 0
    for right := 0; right < len(nums); right++ {
        if nums[right]%2 == 0 {
            nums[left], nums[right] = nums[right], nums[left]
            left++
        }
    }
    return nums
}

// Test
func main() {
    nums := []int{1, 2, 3, 4, 5, 6}
    fmt.Println(exchange(nums))  // [2, 4, 6, 1, 3, 5]
}`,
              explanation: "This Go function uses two pointers to partition an array, placing all even numbers before odd numbers while maintaining relative order within each group."
            },
            practice: "Partition an array so all negative numbers come before positive ones."
          }
        },
        {
          id: "tp-sentinel",
          title: "Sentinel Value Pattern",
          content: {
            explanation: [
              "Use a sentinel value to simplify boundary conditions. This avoids extra checks inside loops.",
              "",
              "Common use:",
              "1. Finding the last occurrence — move sentinel to end",
              "2. Two-pointer with special marker",
              "3. Simplifying loop conditions",
              "",
              "The sentinel acts as a guaranteed condition you can always count on."
            ],
            example: {
              title: "Find Last Occurrence",
              code: `// Instead of checking bounds in loop, add sentinel
func findLast(nums []int, target int) int {
    // Add sentinel at end
    nums = append(nums, -1)  
    
    i := 0
    for nums[i] != target {
        i++
    }
    // If not found (sentinel), return -1
    if i == len(nums)-1 {
        return -1
    }
    return i
}

// Test
func main() {
    nums := []int{1, 2, 3, 2, 1}
    fmt.Println(findLast(nums, 2))  // 3
}`,
              explanation: "This Go function uses a sentinel value (-1) to eliminate bounds checking in the loop, making the code simpler and potentially more efficient."
            },
            practice: "Use a sentinel to simplify finding maximum in an array."
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
              code: `func maxSum(arr []int, k int) int {
    if len(arr) < k {
        return 0
    }
    // Calculate first window
    window := 0
    for i := 0; i < k; i++ {
        window += arr[i]
    }
    maxSum := window
    
    // Slide the window
    for i := k; i < len(arr); i++ {
        window += arr[i] - arr[i-k]  // add new, remove old
        if window > maxSum {
            maxSum = window
        }
    }
    return maxSum
}

// Test
func main() {
    arr := []int{2, 1, 5, 1, 3, 2}
    fmt.Println(maxSum(arr, 3))  // 9 (5+1+3)
}`,
              explanation: "This Go function uses a sliding window approach to find the maximum sum of any k consecutive elements in O(n) time complexity."
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
              code: `func minSubArrayLen(target int, nums []int) int {
    left, sum := 0, 0
    minLen := len(nums) + 1
    
    for right := 0; right < len(nums); right++ {
        sum += nums[right]
        
        // Try shrinking while sum >= target
        for sum >= target && left <= right {
            minLen = min(minLen, right-left+1)
            sum -= nums[left]
            left++
        }
    }
    
    if minLen > len(nums) {
        return 0
    }
    return minLen
}

// Test
func main() {
    nums := []int{2, 3, 1, 2, 4, 3}
    fmt.Println(minSubArrayLen(7, nums))  // 2 (3+4)
}`,
              explanation: "This Go function uses a sliding window approach to find the minimum length subarray that sums to at least the target value."
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
              "Use HashMap/HashSet to track characters in the window."
            ],
            example: {
              title: "Longest Substring with K Distinct",
              code: `func lengthOfLongestSubstring(s string, k int) int {
    count := make(map[rune]int)
    left, maxLen := 0, 0
    
    for right, ch := range s {
        count[ch]++
        
        // Shrink if we have more than k distinct
        for len(count) > k {
            leftCh := rune(s[left])
            count[leftCh]--
            if count[leftCh] == 0 {
                delete(count, leftCh)
            }
            left++
        }
        
        maxLen = max(maxLen, right-left+1)
    }
    return maxLen
}

// Test
func main() {
    fmt.Println(lengthOfLongestSubstring("abcbdc", 2))  // 4 ("bcbd")
}`,
              explanation: "This Go function uses a sliding window with a hash map to find the longest substring containing at most k distinct characters."
            },
            practice: "Find all anagram starting indices in a string."
          }
        },
        {
          id: "sw-circular",
          title: "Circular Window",
          content: {
            explanation: [
              "Some problems require wrapping around the end of the array to the beginning. This is common for:",
              "",
              "1. Maximum sum circular subarray",
              "2. Rotated arrays",
              "3. Circular string patterns",
              "",
              "For circular, either:",
              "• Duplicate the array (allow window to cross boundary), or",
              "• Use modulo arithmetic"
            ],
            example: {
              title: "Maximum Sum Circular Subarray",
              code: `func maxCircularSum(arr []int) int {
    // Case 1: Standard max subarray
    maxKadane := arr[0]
    current, total := arr[0], arr[0]
    
    for i := 1; i < len(arr); i++ {
        current = max(arr[i], current+arr[i])
        maxKadane = max(maxKadane, current)
        total += arr[i]
    }
    
    // Case 2: All negative
    if maxKadane < 0 {
        return maxKadane
    }
    
    // Case 3: Use circular (total - minKadane)
    minKadane := arr[0]
    for i := 1; i < len(arr); i++ {
        current = min(arr[i], current+arr[i])
        minKadane = min(minKadane, current)
    }
    
    return max(maxKadane, total-minKadane)
}

// Test
func main() {
    fmt.Println(maxCircularSum([]int{5, -3, 2}))  // 7
}`,
              explanation: "This Go function finds the maximum sum of a subarray in a circular array by considering three cases: standard Kadane's algorithm, all negative numbers, and circular subarrays."
            },
            practice: "Find the maximum sum of k consecutive elements in a circular array."
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
              "Time: O(log n) — every iteration halves the search space. This is incredibly powerful: 1 million items takes only ~20 steps!"
            ],
            example: {
              title: "Basic Binary Search",
              code: `func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2  // avoid overflow
        
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1  // not found
}

// Test
func main() {
    nums := []int{1, 3, 5, 7, 9}
    fmt.Println(binarySearch(nums, 5))   // 2
    fmt.Println(binarySearch(nums, 6))   // -1
}`,
              explanation: "This Go function implements the classic binary search algorithm to find a target value in a sorted array, returning the index or -1 if not found."
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
              "**Find left boundary** (first occurrence):",
              "- When nums[mid] == target, go LEFT (right = mid-1)",
              "",
              "**Find right boundary** (last occurrence):",
              "- When nums[mid] == target, go RIGHT (left = mid+1)",
              "",
              "**Rotated array**: Determine which half is sorted, then decide based on where target falls."
            ],
            example: {
              title: "Find First and Last Position",
              code: `func searchRange(nums []int, target int) []int {
    start := findBound(nums, target, true)
    end := findBound(nums, target, false)
    return []int{start, end}
}

func findBound(nums []int, target int, isFirst bool) int {
    left, right := 0, len(nums)-1
    bound := -1
    
    for left <= right {
        mid := left + (right-left)/2
        
        if nums[mid] == target {
            bound = mid
            if isFirst {
                right = mid - 1  // keep searching left
            } else {
                left = mid + 1  // keep searching right
            }
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return bound
}

// Test
func main() {
    fmt.Println(searchRange([]int{5, 7, 7, 7, 7, 8}, 7))  // [1, 4]
}`,
              explanation: "This Go function uses modified binary search to find the first and last positions of a target value in a sorted array, returning the range of indices."
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
              title: "Lower Bound",
              code: `func lowerBound(nums []int, target int) int {
    left, right := 0, len(nums)
    
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return left
}

// Test
func main() {
    nums := []int{1, 2, 3, 4, 5, 6}
    fmt.Println(lowerBound(nums, 3))  // 2
    fmt.Println(lowerBound(nums, 7))  // 6 (past end)
}`,
              explanation: "This Go function implements lower bound binary search to find the first position where the target could be inserted to maintain sorted order."
            },
            practice: "Find the floor of square root of n using binary search."
          }
        },
        {
          id: "bs-bisect",
          title: "Binary Search on Answer",
          content: {
            explanation: [
              "Sometimes the answer isn't in the array — we need to find it by binary searching on possible answers. This is very powerful:",
              "",
              "1. Transform problem into a predicate",
              "2. Binary search on the valid range",
              "3. Check if mid satisfies the predicate",
              "",
              "Use for:",
              "- Finding optimal value (minimum, maximum)",
              "- Scheduling problems",
              "- Capacity problems"
            ],
            example: {
              title: "Aggressive Cows",
              code: `func minDistance(cows int, positions []int) int {
    sort.Ints(positions)
    
    left, right := 0, positions[len(positions)-1]
    
    for left < right {
        mid := left + (right-left)/2
        
        if canPlace(cows, positions, mid) {
            right = mid  // try smaller distance
        } else {
            left = mid + 1  // need larger distance
        }
    }
    return left
}

func canPlace(cows int, positions []int, dist int) bool {
    count := 1  // place first cow
    lastPos := positions[0]
    
    for i := 1; i < len(positions); i++ {
        if positions[i]-lastPos >= dist {
            count++
            lastPos = positions[i]
            if count >= cows {
                return true
            }
        }
    }
    return false
}

// Test  
func main() {
    positions := []int{1, 2, 4, 8, 9}
    fmt.Println(minDistance(3, positions))  // 3
}`,
              explanation: "This Go function uses binary search on the answer space to find the minimum distance required to place cows in stalls such that no two cows are closer than this distance."
            },
            practice: "Find the minimum time needed to paint n boards if painters work at different speeds."
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
              "1. **Top-down** (Memoization): Recursion + cache. Start big, break into smaller. Natural but can hit stack limits.",
              "2. **Bottom-up** (Tabulation): Iterative + table. Start small, build up. More efficient but less intuitive.",
              "",
              "When to use DP:",
              "- Optimal substructure: solution can be built from sub-solutions",
              "- Overlapping subproblems: same subproblems solved multiple times"
            ],
            example: {
              title: "Fibonacci Comparison",
              code: `// Naive: O(2^n) - exponential!
// func fib(n int) int {
//     if n <= 1 { return n }
//     return fib(n-1) + fib(n-2)
// }


// Memoization: O(n) - top-down
func fibMemo(n int, memo map[int]int) int {
    if n <= 1 { return n }
    if val, ok := memo[n]; ok {
        return val
    }
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo)
    return memo[n]
}

// Bottom-up: O(n) - tabulation
func fibDP(n int) int {
    if n <= 1 { return n }
    dp := make([]int, n+1)
    dp[0], dp[1] = 0, 1
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}

// Space optimized: O(1)
func fibOptimized(n int) int {
    if n <= 1 { return n }
    prev, curr := 0, 1
    for i := 2; i <= n; i++ {
        prev, curr = curr, prev+curr
    }
    return curr
}`,
              explanation: "This Go code demonstrates different approaches to calculating Fibonacci numbers: naive exponential recursion, memoization (top-down DP), tabulation (bottom-up DP), and space-optimized DP."
            },
            practice: "Solve climbing stairs using DP."
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
              "1. **Last position matters**: arr[i] depends on arr[i-1]",
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
func rob(nums []int) int {
    if len(nums) == 0 { return 0 }
    if len(nums) == 1 { return max(0, nums[0]) }
    
    n := len(nums)
    dp := make([]int, n)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i := 2; i < n; i++ {
        // Don't rob (dp[i-1]) or rob (nums[i] + dp[i-2])
        dp[i] = max(dp[i-1], nums[i]+dp[i-2])
    }
    return dp[n-1]
}

// Space optimized
func robOptimized(nums []int) int {
    if len(nums) == 0 { return 0 }
    prev, curr := 0, 0
    
    for i := 0; i < len(nums); i++ {
        prev, curr = curr, max(curr, prev+nums[i])
        prev = nums[i]  // actually need nums[i-1]...
    }
    return curr
}`,
              explanation: "This Go function solves the house robber problem using dynamic programming, where dp[i] represents the maximum amount that can be robbed from the first i houses without robbing adjacent houses."
            },
            practice: "Solve the coin change problem: minimum coins to make amount."
          }
        },
        {
          id: "dp-2d",
          title: "2D DP Problems",
          content: {
            explanation: [
              "Some problems need two dimensions:",
              "",
              "1. **Two sequences**: dp[i][j] for first i of one, first j of other",
              "2. **With change**: before/after decision",
              "3. **Grid path**: unique paths in matrix",
              "",
              "Common questions:",
              "- Two strings (LCS, edit distance)",
              "- Matrix problems",
              "- Multiple states"
            ],
            example: {
              title: "Longest Common Subsequence",
              code: `func longestCommonSubsequence(s1, s2 string) int {
    m, n := len(s1), len(s2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }
    
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if s1[i-1] == s2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }
    return dp[m][n]
}

// Test
func main() {
    fmt.Println(longestCommonSubsequence("abcde", "ace"))  // 3
}`,
              explanation: "This example demonstrates longest common subsequence.",
            },
            practice: "Solve edit distance: minimum operations to convert one string to another."
          }
        },
        {
          id: "dp-knapsack",
          title: "Knapsack Problems",
          content: {
            explanation: [
              "The classic knapsack problem:",
              "Given weights and values, maximize value with weight limit.",
              "",
              "Variations:",
              "1. **0/1 knapsack**: Each item used once",
              "2. **Unbounded**: Each item used multiple times",
              "3. **Subset sum**: Can we achieve target?",
              "",
              "DP approach: dp[i][w] = max value using first i items with weight limit w"
            ],
            example: {
              title: "0/1 Knapsack",
              code: `func knapsack(weights, values []int, capacity int) int {
    n := len(weights)
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, capacity+1)
    }
    
    for i := 1; i <= n; i++ {
        w, v := weights[i-1], values[i-1]
        for cap := 1; cap <= capacity; cap++ {
            if w <= cap {
                dp[i][cap] = max(dp[i-1][cap], dp[i-1][cap-w]+v)
            } else {
                dp[i][cap] = dp[i-1][cap]
            }
        }
    }
    return dp[n][capacity]
}

// Test
func main() {
    weights := []int{2, 3, 4, 5}
    values := []int{3, 4, 5, 6}
    fmt.Println(knapsack(weights, values, 5))  // 7 (2+3)
}`,
              explanation: "This example demonstrates 0 / 1 knapsack.",
            },
            practice: "Solve subset sum: can we achieve target sum using array elements?"
          }
        }
      ]
    },
    {
      id: "algo-bfs-dfs",
      title: "Graph Traversal",
      description: "BFS and DFS for tree/graph problems",
      duration: "75 min",
      subtopics: [
        {
          id: "dfs-recursive",
          title: "Depth-First Search",
          content: {
            explanation: [
              "DFS explores as deep as possible before backtracking. Uses recursion (stack) or explicit stack.",
              "",
              "Three traversal orders:",
              "1. **Preorder**: root, left, right — copy tree",
              "2. **Inorder**: left, root, right — sorted BST",
              "3. **Postorder**: left, right, root — delete tree",
              "",
              "Why DFS: Lower memory than BFS, easier to find paths, natural for recursion."
            ],
            example: {
              title: "All Three Traversals",
              code: `type TreeNode struct {
    Val int
    Left *TreeNode
    Right *TreeNode
}

func preorder(root *TreeNode) []int {
    if root == nil { return nil }
    result := []int{}
    result = append(result, root.Val)
    result = append(result, preorder(root.Left)...)
    result = append(result, preorder(root.Right)...)
    return result
}

func inorder(root *TreeNode) []int {
    if root == nil { return nil }
    result := inorder(root.Left)
    result = append(result, root.Val)
    result = append(result, inorder(root.Right)...)
    return result
}

func postorder(root *TreeNode) []int {
    if root == nil { return nil }
    result := postorder(root.Left)
    result = append(result, postorder(root.Right)...)
    result = append(result, root.Val)
    return result
}`,
              explanation: "This example demonstrates all three traversals.",
            },
            practice: "Implement preorder traversal iteratively using a stack."
          }
        },
        {
          id: "bfs-level-order",
          title: "Breadth-First Search",
          content: {
            explanation: [
              "BFS explores level by level using a queue. Great for:",
              "",
              "1. **Shortest path** in unweighted graphs",
              "2. **Level-by-level** processing",
              "3. **Finding minimum** steps to target",
              "",
              "Algorithm:",
              "1. Add start to queue",
              "2. Process node, add neighbors to queue",
              "3. Continue until queue empty or target found"
            ],
            example: {
              title: "Level Order Traversal",
              code: `func levelOrder(root *TreeNode) [][]int {
    if root == nil { return nil }
    
    result := [][]int{}
    queue := []*TreeNode{root}
    
    for len(queue) > 0 {
        level := []int{}
        size := len(queue)
        
        for i := 0; i < size; i++ {
            node := queue[0]
            queue = queue[1:]
            level = append(level, node.Val)
            
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
        result = append(result, level)
    }
    return result
}

// Test
func main() {
    //     1
    //    / \\
    //   2   3
    root := &TreeNode{Val: 1, Left: &TreeNode{Val: 2}, Right: &TreeNode{Val: 3}}
    fmt.Println(levelOrder(root))  // [[1], [2, 3]]
}`,
              explanation: "This example demonstrates level order traversal.",
            },
            practice: "Find the minimum depth of a binary tree (shortest path to leaf)."
          }
        },
        {
          id: "dfs-graph",
          title: "Graph DFS",
          content: {
            explanation: [
              "For graphs (not trees), we need visited set to avoid cycles. Two approaches:",
              "",
              "1. **Recursive DFS** with visited set",
              "2. **Iterative** with explicit stack",
              "",
              "Common graph problems:",
              "- Find connected components",
              "- Detect cycles",
              "- Topological sort (DAG)",
              "- Path finding"
            ],
            example: {
              title: "Find Connected Components",
              code: `func findComponents(n int, edges [][]int) int {
    // Build adjacency list
    graph := make([][]int, n)
    for _, e := range edges {
        graph[e[0]] = append(graph[e[0]], e[1])
        graph[e[1]] = append(graph[e[1]], e[0])
    }
    
    visited := make([]bool, n)
    count := 0
    
    for i := 0; i < n; i++ {
        if !visited[i] {
            dfs(graph, visited, i)
            count++
        }
    }
    return count
}

func dfs(graph [][]int, visited []bool, node int) {
    visited[node] = true
    for _, neighbor := range graph[node] {
        if !visited[neighbor] {
            dfs(graph, visited, neighbor)
        }
    }
}

// Test
func main() {
    edges := [][]int{{0, 1}, {1, 2}, {3, 4}}
    fmt.Println(findComponents(5, edges))  // 2 components
}`,
              explanation: "This example demonstrates find connected components.",
            },
            practice: "Detect if a graph contains a cycle."
          }
        },
        {
          id: "bfs-shortest",
          title: "Shortest Path with BFS",
          content: {
            explanation: [
              "BFS guarantees shortest path in unweighted graphs because it explores level by level.",
              "",
              "Algorithm variations:",
              "1. Track distance at each node",
              "2. Keep parent to reconstruct path",
              "3. Use with grid (4 directions)",
              "",
              "Key: Process all nodes at distance d before d+1."
            ],
            example: {
              title: "Shortest Path in Grid",
              code: `func shortestPath(grid [][]byte, start, end []int) int {
    n, m := len(grid), len(grid[0])
    visited := make([][]bool, n)
    for i := range visited {
        visited[i] = make([]bool, m)
    }
    
    queue := [][]int{start}
    visited[start[0]][start[1]] = true
    steps := 0
    
    dirs := [][]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
    
    for len(queue) > 0 {
        size := len(queue)
        for i := 0; i < size; i++ {
            cur := queue[0]
            queue = queue[1:]
            
            if cur[0] == end[0] && cur[1] == end[1] {
                return steps
            }
            
            for _, d := range dirs {
                r, c := cur[0]+d[0], cur[1]+d[1]
                if r >= 0 && r < n && c >= 0 && c < m && 
                   grid[r][c] != 'X' && !visited[r][c] {
                    visited[r][c] = true
                    queue = append(queue, []int{r, c})
                }
            }
        }
        steps++
    }
    return -1
}`,
              explanation: "This example demonstrates shortest path in grid.",
            },
            practice: "Find shortest path to all cells in a grid."
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
              "Problems greedy works for:",
              "- Interval scheduling",
              "- Huffman coding",
              "- Fractional knapsack",
              "- Dijkstra's algorithm"
            ],
            example: {
              title: "Activity Selection",
              code: `func maxActivities(intervals [][]int) int {
    // Sort by end time
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]
    })
    
    count := 1
    end := intervals[0][1]
    
    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= end {
            count++
            end = intervals[i][1]
        }
    }
    return count
}

// Test
func main() {
    intervals := [][]int{{1, 4}, {3, 5}, {0, 6}, {5, 7}, {3, 9}, {5, 9}, {6, 10}}
    fmt.Println(maxActivities(intervals))  // 4
}`,
              explanation: "This example demonstrates activity selection.",
            },
            practice: "Given meeting rooms, find minimum needed to hold all meetings."
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
              "2. **Non-overlapping**: greedy selection (activity selection)",
              "3. **Meeting rooms**: min rooms needed",
              "",
              "Key insight: Sort by what matters — usually the end time."
            ],
            example: {
              title: "Merge Intervals",
              code: `func merge(intervals [][]int) [][]int {
    if len(intervals) <= 1 {
        return intervals
    }
    
    // Sort by start
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    
    result := [][]int{intervals[0]}
    
    for i := 1; i < len(intervals); i++ {
        last := result[len(result)-1]
        if intervals[i][0] <= last[1] {
            // Overlap — merge
            last[1] = max(last[1], intervals[i][1])
        } else {
            result = append(result, intervals[i])
        }
    }
    return result
}

// Test
func main() {
    intervals := [][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}
    fmt.Println(merge(intervals))  // [[1,6], [8,10], [15,18]]
}`,
              explanation: "This example demonstrates merge intervals.",
            },
            practice: "Find minimum meeting rooms needed."
          }
        },
        {
          id: "greedy-huffman",
          title: "Huffman Coding",
          content: {
            explanation: [
              "Huffman coding achieves optimal prefix-free encoding using:",
              "",
              "1. Count character frequencies",
              "2. Build min-heap of frequencies",
              "3. Combine two smallest until one remains",
              "4. Assign 0 (left) and 1 (right) along paths",
              "",
              "The character with highest frequency gets shortest code."
            ],
            example: {
              title: "Huffman Encoding",
              code: `// Simplified: Priority queue approach
func huffmanLength(freq map[rune]int) int {
    // Use min-heap (priority queue)
    pq := make(PriorityQueue, len(freq))
    i := 0
    for _, f := range freq {
        pq[i] = &Item{frequency: f}
        i++
    }
    heap.Init(&pq)
    
    total := 0
    for pq.Len() > 1 {
        // Take two smallest
        a := heap.Pop(&pq).(*Item)
        b := heap.Pop(&pq).(*Item)
        
        sum := a.frequency + b.frequency
        total += sum
        
        // Push combined
        heap.Push(&pq, &Item{frequency: sum})
    }
    return total
}`,
              explanation: "This example demonstrates huffman encoding.",
            },
            practice: "Given frequencies, compute total encoding length."
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
              "More variations:",
              "- 2D prefix sum for matrices",
              "- Hash prefix sum for modulo problems"
            ],
            example: {
              title: "Range Sum Query",
              code: `type NumArray struct {
    prefix []int
}

func Constructor(nums []int) NumArray {
    n := len(nums)
    prefix := make([]int, n+1)
    for i := 0; i < n; i++ {
        prefix[i+1] = prefix[i] + nums[i]
    }
    return NumArray{prefix}
}

func (na *NumArray) SumRange(left, right int) int {
    return na.prefix[right+1] - na.prefix[left]
}

// Test
func main() {
    nums := []int{-2, 0, 3, -4, 2}
    na := Constructor(nums)
    fmt.Println(na.SumRange(0, 2))  // 1
    fmt.Println(na.SumRange(2, 4)) // -2
}`,
              explanation: "This example demonstrates range sum query.",
            },
            practice: "Given array and queries, answer each range sum in O(1)."
          }
        },
        {
          id: "ps-modulo",
          title: "Subarray Sum with Modulo",
          content: {
            explanation: [
              "For problems like 'subarray sum equals k with modulo', use hash maps with prefix sum:",
              "",
              "Key insight: Two prefix sums are congruent (mod k) if their difference has sum that's divisible by k.",
              "",
              "Algorithm:",
              "1. Track prefix sum modulo k",
              "2. For each position, count previous same modulo",
              "3. Add to result"
            ],
            example: {
              title: "Subarray Divisible by K",
              code: `func subarraysDivByK(nums []int, k int) int {
    prefix := 0
    count := make([]int, k)
    count[0] = 1  // empty prefix
    
    for _, num := range nums {
        prefix = (prefix + num) % k
        // Python: negative fix for Python mod
        if prefix < 0 {
            prefix += k
        }
        count[prefix]++
    }
    
    result := 0
    for _, c := range count {
        result += c * (c - 1) / 2
    }
    return result
}

// Test  
func main() {
    fmt.Println(subarraysDivByK([]int{4, 5, 0, -5}, 5))  // 4
}`,
              explanation: "This example demonstrates subarray divisible by k.",
            },
            practice: "Find subarrays that sum to a multiple of k."
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
              code: `func permute(nums []int) [][]int {
    result := [][]int{}
    path := []int{}
    used := make([]bool, len(nums))
    
    var backtrack func()
    backtrack = func() {
        if len(path) == len(nums) {
            // Copy path
            temp := make([]int, len(path))
            copy(temp, path)
            result = append(result, temp)
            return
        }
        
        for i := range nums {
            if used[i] {
                continue
            }
            used[i] = true
            path = append(path, nums[i])
            backtrack()
            path = path[:len(path)-1]
            used[i] = false
        }
    }
    
    backtrack()
    return result
}

// Test
func main() {
    fmt.Println(permute([]int{1, 2, 3}))
    // [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
}`,
              explanation: "This example demonstrates generate permutations.",
            },
            practice: "Generate all combinations of size k from array."
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
              title: "Subsets",
              code: `func subsets(nums []int) [][]int {
    result := [][]int{}
    
    var backtrack func(pos int, path []int)
    backtrack = func(pos int, path []int) {
        // Copy current path (it's a subset)
        temp := make([]int, len(path))
        copy(temp, path)
        result = append(result, temp)
        
        for i := pos; i < len(nums); i++ {
            path = append(path, nums[i])
            backtrack(i+1, path)
            path = path[:len(path)-1]
        }
    }
    
    backtrack(0, []int{})
    return result
}

// Test
func main() {
    fmt.Println(subsets([]int{1, 2, 3}))
    // [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
}`,
              explanation: "This example demonstrates subsets.",
            },
            practice: "Find all subsets with sum equal to target."
          }
        },
        {
          id: "bt-nqueens",
          title: "Classic Backtracking",
          content: {
            explanation: [
              "N-Queens is the classic backtracking problem: place n queens on n×n board so none attack each other.",
              "",
              "This shows backtracking's power: try, check, recurse or backtrack.",
              "",
              "Key optimizations:",
              "- Use sets/arrays for O(1) column/diag checking",
              "- Prune early if queen can't be placed"
            ],
            example: {
              title: "N-Queens",
              code: `func solveNQueens(n int) [][]string {
    result := [][]string{}
    cols := make([]bool, n)
    diag1 := make([]bool, 2*n)  // row - col + n
    diag2 := make([]bool, 2*n)  // row + col
    
    board := make([]string, n)
    for i := 0; i < n; i++ {
        board[i] = strings.Repeat(".", n)
    }
    
    var backtrack func(row int)
    backtrack = func(row int) {
        if row == n {
            // Copy
            copy := make([]string, n)
            for i := range board {
                copy[i] = board[i]
            }
            result = append(result, copy)
            return
        }
        
        for col := 0; col < n; col++ {
            d1, d2 := row-col+n, row+col
            if cols[col] || diag1[d1] || diag2[d2] {
                continue
            }
            
            board[row] = board[row][:col] + "Q" + board[row][col+1:]
            cols[col], diag1[d1], diag2[d2] = true, true, true
            
            backtrack(row + 1)
            
            board[row] = board[row][:col] + "." + board[row][col+1:]
            cols[col], diag1[d1], diag2[d2] = false, false, false
        }
    }
    
    backtrack(0)
    return result
}`,
              explanation: "This example demonstrates n-queens.",
            },
            practice: "Solve the sudoku puzzle."
          }
        }
      ]
    },
    {
      id: "algo-union-find",
      title: "Union-Find",
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
              "1. **Find**: Which group does element belong to? → find parent/representative",
              "2. **Union**: Merge two groups into one",
              "",
              "Without optimization: Both are O(n) — too slow.",
              "With path compression + union by rank: Almost O(1) per operation!",
              "",
              "Classic use: Detect cycles in undirected graphs."
            ],
            example: {
              title: "Basic Union-Find",
              code: `type UnionFind struct {
    parent []int
    rank   []int
}

func NewUnionFind(n int) *UnionFind {
    uf := &UnionFind{
        parent: make([]int, n),
        rank:   make([]int, n),
    }
    for i := 0; i < n; i++ {
        uf.parent[i] = i
        uf.rank[i] = 0
    }
    return uf
}

// Find with path compression
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x])  // path compression
    }
    return uf.parent[x]
}

// Union by rank
func (uf *UnionFind) Union(x, y int) bool {
    px, py := uf.Find(x), uf.Find(y)
    if px == py {
        return false  // already in same set
    }
    
    // Attach smaller tree to larger
    if uf.rank[px] < uf.rank[py] {
        uf.parent[px] = py
    } else if uf.rank[px] > uf.rank[py] {
        uf.parent[py] = px
    } else {
        uf.parent[py] = px
        uf.rank[px]++
    }
    return true
}

// Test
func main() {
    uf := NewUnionFind(5)
    uf.Union(0, 1)
    uf.Union(2, 3)
    fmt.Println(uf.Find(0) == uf.Find(1))  // true
    fmt.Println(uf.Find(0) == uf.Find(2))  // false
}`,
              explanation: "This Go implementation shows Union-Find with path compression (in Find) and union by rank optimizations for nearly O(1) operations."
            },
            practice: "Implement union-find without union by rank and compare performance."
          }
        },
        {
          id: "uf-path-compression",
          title: "Path Compression & Optimizations",
          content: {
            explanation: [
              "Path compression flattens the tree structure for faster lookups.",
              "",
              "**Without optimization**: Chain of parents a→b→c→d. Finding 'a' requires following 4 links.",
              "**With path compression**: After one Find, 'a' directly points to 'd'. Next Find is O(1)!",
              "",
              "**Union by rank**: Always attach smaller tree to larger, preventing chains.",
              "",
              "Combined result: Inverse Ackermann function operations — effectively O(1) for all practical purposes."
            ],
            example: {
              title: "Path Compression Visualization",
              code: `// Before path compression:
// 0 → 1 → 2 → 3 → 4
// Each Find(0) takes 5 steps

// After first Find(0) with path compression:
// 0 → 4 ← 1, 2, 3
// All elements point directly to root

func (uf *UnionFind) FindWithCompression(x int) int {
    if uf.parent[x] != x {
        // Path compression: point directly to root
        uf.parent[x] = uf.FindWithCompression(uf.parent[x])
    }
    return uf.parent[x]
}

// Iterative path compression (avoids recursion)
func (uf *UnionFind) FindIterative(x int) int {
    root := x
    // Find root
    for root != uf.parent[root] {
        root = uf.parent[root]
    }
    
    // Compress path: make all nodes point to root
    for x != uf.parent[x] {
        next := uf.parent[x]
        uf.parent[x] = root
        x = next
    }
    return root
}`,
              explanation: "This example demonstrates path compression in both recursive and iterative forms."
            },
            practice: "Implement find with path halving (set each node to point to grandparent)."
          }
        },
        {
          id: "uf-applications",
          title: "Cycle Detection & Components",
          content: {
            explanation: [
              "Union-Find shines at:",
              "",
              "1. **Cycle detection**: If Union returns false, adding that edge creates a cycle",
              "2. **Connected components**: Each root is a component",
              "3. **Kruskal's algorithm**: Build MST by adding edges without cycles",
              "",
              "Why it's fast: No need to traverse whole tree to check connectivity."
            ],
            example: {
              title: "Detect Cycle in Graph",
              code: `func hasCycle(n int, edges [][]int) bool {
    uf := NewUnionFind(n)
    
    for _, edge := range edges {
        u, v := edge[0], edge[1]
        if !uf.Union(u, v) {
            // Union returns false if u and v already connected
            // This means adding edge creates cycle
            return true
        }
    }
    return false
}

// Count connected components
func countComponents(n int, edges [][]int) int {
    uf := NewUnionFind(n)
    
    for _, edge := range edges {
        uf.Union(edge[0], edge[1])
    }
    
    // Count unique roots
    components := 0
    for i := 0; i < n; i++ {
        if uf.Find(i) == i {
            components++
        }
    }
    return components
}

// Test
func main() {
    edges1 := [][]int{{0, 1}, {1, 2}}
    fmt.Println(hasCycle(3, edges1))  // false
    
    edges2 := [][]int{{0, 1}, {1, 2}, {2, 0}}
    fmt.Println(hasCycle(3, edges2))  // true
    
    fmt.Println(countComponents(5, edges1))  // 3
}`,
              explanation: "This example demonstrates cycle detection and counting connected components using Union-Find."
            },
            practice: "Find the number of islands (2D grid version of connected components)."
          }
        },
        {
          id: "uf-advanced",
          title: "Weighted Union-Find",
          content: {
            explanation: [
              "Sometimes you need to track relationships between elements, not just grouping.",
              "",
              "**Weighted Union-Find**: Store weight (distance, relationship) for each element relative to its parent.",
              "",
              "Applications:",
              "1. **Potential problems** — elements with relative values",
              "2. **Relative ordering** — constraints like a > b > c",
              "3. **Graph distance queries** — distance between nodes without explicit edges"
            ],
            example: {
              title: "Weighted Union-Find",
              code: `type WeightedUnionFind struct {
    parent []int
    weight []int  // distance to parent
}

func NewWeightedUF(n int) *WeightedUnionFind {
    uf := &WeightedUnionFind{
        parent: make([]int, n),
        weight: make([]int, n),
    }
    for i := 0; i < n; i++ {
        uf.parent[i] = i
        uf.weight[i] = 0
    }
    return uf
}

// Returns weight of x relative to root
func (uf *WeightedUnionFind) Find(x int) (int, int) {
    if uf.parent[x] == x {
        return x, 0
    }
    
    root, parentWeight := uf.Find(uf.parent[x])
    uf.weight[x] += parentWeight  // path compression
    uf.parent[x] = root
    return root, uf.weight[x]
}

// Union with weight relationship: y = x + weight
func (uf *WeightedUnionFind) Union(x, y int, weight int) {
    rx, wx := uf.Find(x)
    ry, wy := uf.Find(y)
    
    if rx == ry {
        return  // already connected
    }
    
    uf.parent[ry] = rx
    uf.weight[ry] = weight + wx - wy
}

// Query: get relationship between x and y
func (uf *WeightedUnionFind) Query(x, y int) (int, bool) {
    rx, wx := uf.Find(x)
    ry, wy := uf.Find(y)
    
    if rx != ry {
        return 0, false  // not connected
    }
    return wx - wy, true
}`,
              explanation: "This example implements weighted union-find for tracking relationships between connected elements."
            },
            practice: "Solve the accounts merge problem using weighted union-find."
          }
        }
      ]
    }
  ]
};
