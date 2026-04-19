import { LearningTrack } from "../data";

export const dataStructures: LearningTrack = {
  id: "data-structures",
  title: "Data Structures",
  subtitle: "Beginner to Hero",
  description: "Build a strong foundation in essential data structures from arrays to trees for efficient problem solving",
  type: "additional",
  icon: "Database",
  color: "purple",
  coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600",
  totalHours: 40,
  language: "multi",
  category: "Data Structures",
  topics: [
    {
      id: "ds-hashing",
      title: "Hashing Fundamentals",
      description: "Hash maps, sets, and collision handling",
      duration: "60 min",
      subtopics: [
        {
          id: "hash-intro",
          title: "Hash Maps Deep Dive",
          content: {
            explanation: [
              "Hash maps provide O(1) average lookup time by using a hash function to map keys to array indices.",
              "",
              "Components:",
              "1. **Hash function**: converts key to index",
              "2. **Array**: stores key-value pairs",
              "3. **Collision resolution**: handles different keys mapping to same index",
              "",
              "Python dict, Java HashMap, Go map all use hash maps under the hood."
            ],
            example: {
              title: "Hash Map Operations",
              code: `# Create
m = {}
m = dict()

# Insert/Update
m["apple"] = 5
m["banana"] = 3

# Access
print(m["apple"])  # 5 (raises KeyError if missing)

# Safe access
print(m.get("apple"))      # 5 (returns None)
print(m.get("grape", 0))  # 0 (default)

# Check existence
if "apple" in m:
    print("Found")

# Delete
del m["banana"]
m.pop("banana", None)

# Iterate
for key, value in m.items():
    print(key, value)
    
for key in m.keys():
    print(key)
    
for value in m.values():
    print(value)`,
              explanation: ".get() returns default if key missing. items() returns key-value pairs. .values() returns values only."
            },
            practice: "Count the frequency of each word in a list using a hash map."
          }
        },
        {
          id: "hash-sets",
          title: "Hash Sets",
          content: {
            explanation: [
              "A hash set maintains unique elements, no duplicates. It's perfect for:",
              "",
              "1. **Deduplication** — remove duplicates",
              "2. **Membership testing** — O(1) to check exists",
              "3. **Set operations** — union, intersection, difference",
              "",
              "Python uses built-in set. Java has HashSet. Go has map[T]bool or map[T]struct{}."
            ],
            example: {
              title: "Hash Set Operations",
              code: `# Create set
s = set()
s = {1, 2, 3}

# Add elements
s.add(4)
s.update([5, 6])  # add multiple

# Remove
s.remove(3)  # raises KeyError if missing
s.discard(3)  # no error if missing

# Membership
print(1 in s)  # True

# Set operations
a = {1, 2, 3}
b = {2, 3, 4}

print(a | b)   # union: {1, 2, 3, 4}
print(a & b)   # intersection: {2, 3}
print(a - b)   # difference: {1}
print(a ^ b)   # symmetric: {1, 4}

# Subset check
print({1, 2}.issubset(a))  # True`,
              explanation: "Use set for membership and deduplication. Remove duplicates from list by converting to set."
            },
            practice: "Find all unique elements from a list with duplicates."
          }
        },
        {
          id: "hash-collision",
          title: "Collision Handling",
          content: {
            explanation: [
              "Collisions occur when multiple keys hash to the same index. There are two main approaches:",
              "",
              "1. **Chaining**: linked list at each bucket (like Python dict)",
              "   - Store all collisions in a list",
              "   -查找 O(n/k) average where n=elements, k=buckets",
              "",
              "2. **Open addressing**: probe for next empty slot",
              "   - Linear probing: check next slot",
              "   - Quadratic probing: skip 1, 4, 9...",
              "",
              "Python uses open addressing with randomized hash to avoid collisions."
            ],
            example: {
              title: "Collision Performance",
              code: `# Load factor affects performance
# load_factor = n_elements / n_buckets
# Python keeps load factor ~ 2/3

# Too many collisions = slower
# Resize when load factor gets high

# Good hash function distributes evenly
# dict resizes automatically when needed

# Simulate resize
import sys
d = {}
for i in range(100):
    d[i] = i
    if i % 20 == 0:
        print(f"Size {i}:", sys.getsizeof(d))`,
              explanation: "Hash map automatically resizes when load factor gets too high. Keep load factor low for O(1) performance."
            },
            practice: "Explain the difference between chaining and open addressing."
          }
        },
        {
          id: "hash-custom",
          title: "Custom Keys",
          content: {
            explanation: [
              "For custom objects as keys:",
              "",
              "1. **Hash function**: must be consistent",
              "2. **Equality**: hash(a) == hash(b) doesn't guarantee a == b",
              "",
              "Important:",
              "- If a == b, their hashes must be equal",
              "- Hash should use immutable fields only",
              "",
              "In Python: implement __hash__ and __eq__"
            ],
            example: {
              title: "Custom Hash Key",
              code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __hash__(self):
        # Use immutable fields only!
        return hash((self.name, self.age))
    
    def __eq__(self, other):
        return self.name == other.name and self.age == other.age

# Usage
p1 = Person("Alice", 25)
p2 = Person("Alice", 25)
d = {p1: "developer"}

print(d[p2])  # "developer" (same content = same hash)
print(p1 is p2)  # False - different objects`,
              explanation: "Hash must use immutable fields only. __eq__ defines equality for hash map lookup."
            },
            practice: "Create a custom class with name and age fields, implement __hash__ and __eq__."
          }
        }
      ]
    },
    {
      id: "ds-arrays-strings",
      title: "Arrays & Strings",
      description: "Master array and string manipulation",
      duration: "65 min",
      subtopics: [
        {
          id: "arr-operations",
          title: "Array Operations",
          content: {
            explanation: [
              "Arrays are the simplest data structure: contiguous memory with O(1) random access by index.",
              "",
              "Operations:",
              "- **Access**: O(1) — direct indexing",
              "- **Search**: O(n) — must check all",
              "- **Insert**: O(n) — shift elements",
              "- **Delete**: O(n) — shift elements",
              "",
              "Use arrays when:",
              "- You need random access",
              "- Iterating sequentially is common"
            ],
            example: {
              title: "Array Manipulation",
              code: `# Find max
def find_max(arr):
    max_val = arr[0]
    for x in arr:
        if x > max_val:
            max_val = x
    return max_val

# Reverse in place (two pointers)
def reverse(arr):
    left, right = 0, len(arr)-1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

# Remove element at index
def remove_at(arr, idx):
    for i in range(idx, len(arr)-1):
        arr[i] = arr[i+1]
    arr.pop()

# Merge sorted arrays
def merge_sorted(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] < b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:] or b[j:])
    return result`,
              explanation: "Two-pointer pattern for reversing. Sliding window for subarray problems."
            },
            practice: "Find the median of two sorted arrays."
          }
        },
        {
          id: "str-manipulation",
          title: "String Manipulation",
          content: {
            explanation: [
              "Strings are immutable in most languages — operations create new strings.",
              "",
              "Common string operations:",
              "1. **Reverse** — two pointers or built-in",
              "2. **Palindrome** — compare from both ends",
              "3. **Anagram** — sort or count characters",
              "4. **Substring** — sliding window",
              "",
              "For Unicode, treat as runes in Go, characters in other languages."
            ],
            example: {
              title: "String Problems",
              code: `# Reverse string
def reverse(s):
    chars = list(s)  # string is immutable
    left, right = 0, len(chars)-1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return ''.join(chars)

# Palindrome
def is_palindrome(s):
    s = s.lower().replace("", "")
    return s == s[::-1]

# Anagram
def is_anagram(s1, s2):
    return sorted(s1) == sorted(s2)

# Or with counter
from collections import Counter
def is_anagram_counter(s1, s2):
    return Counter(s1.lower()) == Counter(s2.lower())

# Substring search
def contains(sub, s):
    for i in range(len(s) - len(sub) + 1):
        if s[i:i+len(sub)] == sub:
            return True
    return False`,
              explanation: "Strings are immutable, so convert to list first for in-place changes."
            },
            practice: "Find the longest palindromic substring in a string."
          }
        },
        {
          id: "arr-subarray",
          title: "Subarray Problems",
          content: {
            explanation: [
              "Many problems involve subarrays. Key patterns:",
              "",
              "1. **Kadane's algorithm**: max subarray sum",
              "2. **Prefix sum**: subarray sum using precomputation",
              "3. **Sliding window**: fixed/variable size",
              "",
              "Kadane's insight: if current sum is negative, start fresh."
            ],
            example: {
              title: "Max Subarray Sum (Kadane)",
              code: `# Kadane's algorithm
def max_subarray(arr):
    max_sum = curr_sum = arr[0]
    
    for i in range(1, len(arr)):
        # Either extend or start fresh
        curr_sum = max(arr[i], curr_sum + arr[i])
        max_sum = max(max_sum, curr_sum)
    
    return max_sum

# With indices
def max_subarray_indices(arr):
    start = end = 0
    temp_start = max_sum = curr_sum = arr[0]
    
    for i in range(1, len(arr)):
        if arr[i] > curr_sum + arr[i]:
            temp_start = i
            curr_sum = arr[i]
        else:
            curr_sum += arr[i]
        
        if curr_sum > max_sum:
            max_sum = curr_sum
            start = temp_start
            end = i
    
    return max_sum, start, end + 1`,
              explanation: "At each element, decide: extend previous subarray or start new. Track current and max sums."
            },
            practice: "Find subarray with the largest product (including negatives)."
          }
        },
        {
          id: "arr-rotate",
          title: "Array Rotation",
          content: {
            explanation: [
              "Array rotation is common in problems:",
              "",
              "1. **Rotate by k positions** (in-place)",
              "2. **Find rotation point** (binary search)",
              "3. **Rotate array of arrays** (90 degrees)",
              "",
              "For rotating by k: reverse three parts."
            ],
            example: {
              title: "Rotate Array",
              code: `# Rotate left by k (reverse three times)
def rotate_left(arr, k):
    k = k % len(arr)  # handle k > length
    
    def reverse(l, r):
        while l < r:
            arr[l], arr[r] = arr[r], arr[l]
            l += 1
            r -= 1
    
    reverse(0, k-1)      # first k
    reverse(k, len(arr)-1) # rest
    reverse(0, len(arr)-1) # all
    
    return arr

# Rotate right is just rotate left by n-k
def rotate_right(arr, k):
    return rotate_left(arr, len(arr) - k)

# Find rotation point
def find_rotation(arr):
    left, right = 0, len(arr)-1
    while left < right:
        mid = (left + right) // 2
        if arr[mid] > arr[right]:
            left = mid + 1
        else:
            right = mid
    return left  # or right`,
              explanation: "Reverse-based rotation. Find minimum with binary search (array is partially sorted)."
            },
            practice: "Find the minimum element in a rotated sorted array."
          }
        }
      ]
    },
    {
      id: "ds-linked-lists",
      title: "Linked Lists",
      description: "Single and doubly linked lists",
      duration: "75 min",
      subtopics: [
        {
          id: "ll-basics",
          title: "Linked List Fundamentals",
          content: {
            explanation: [
              "A linked list stores elements in nodes, each pointing to the next. Unlike arrays:",
              "",
              "- **No random access** — must traverse from head",
              "- **O(1) insert/delete** at head (no shifting)",
              "- **Uses more memory** (stores pointers)",
              "",
              "Types:",
              "1. **Singly** — next pointer only",
              "2. **Doubly** — next and prev"
            ],
            example: {
              title: "Linked List Implementation",
              code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, val):
        if not self.head:
            self.head = ListNode(val)
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = ListNode(val)
    
    def prepend(self, val):
        self.head = ListNode(val, self.head)
    
    def delete(self, val):
        if self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next and curr.next.val != val:
            curr = curr.next
        if curr.next:
            curr.next = curr.next.next
    
    def find_middle(self):
        slow = fast = self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow.val`,
              explanation: "slow/fast pointers find middle in one pass. fast moves 2x speed, so when fast reaches end, slow is at middle."
            },
            practice: "Implement finding the middle node of a linked list."
          }
        },
        {
          id: "ll-reversal",
          title: "Reversing Linked List",
          content: {
            explanation: [
              "Reversing a linked list is fundamental:",
              "",
              "Algorithm (iterative):",
              "1. Save next node before we change it",
              "2. Point current.next to previous",

              "3. Move previous and current forward",
              "",
              "This pattern applies to many problems: partially reverse, reverse in groups of k."
            ],
            example: {
              title: "Reverse Linked List",
              code: `# Iterative reverse
def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next  # save
        curr.next = prev       # reverse
        prev = curr          # move forward
        curr = next_node
    
    return prev

# Reverse in groups of k
def reverse_k_group(head, k):
    # Find kth node
    dummy = ListNode(0, head)
    group_prev = dummy
    
    while True:
        kth = get_kth(group_prev, k)
        if not kth:
            break
        
        group_next = kth.next
        
        # Reverse this group
        prev = group_next
        curr = group_prev.next
        while curr != group_next:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        
        first = group_prev.next
        group_prev.next = kth
        group_prev = first
    
    return dummy.next

def get_kth(node, k):
    while node and k > 0:
        node = node.next
        k -= 1
    return node`,
              explanation: "Save next, reverse, move forward. For groups: find kth, reverse, reconnect."
            },
            practice: "Reverse a singly linked list recursively."
          }
        },
        {
          id: "ll-cycle",
          title: "Cycle Detection",
          content: {
            explanation: [
              "Detect cycles in linked list:",
              "",
              "**Floyd's algorithm** (tortoise and hare):",
              "- Slow pointer: 1 step",
              "- Fast pointer: 2 steps",
              "- They will meet if cycle exists",
              "",
              "To find cycle start: when they meet, move one to head, advance both by 1."
            ],
            example: {
              title: "Detect and Find Cycle Start",
              code: `def has_cycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False

def cycle_start(head):
    slow = fast = head
    
    # Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    if not fast or not fast.next:
        return None
    
    # Move one to head
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # cycle starts here`,
              explanation: "When slow and fast meet, move slow to head. Both move at same speed now — they meet at cycle start."
            },
            practice: "Find the length of the cycle."
          }
        },
        {
          id: "ll-merge",
          title: "Merging Lists",
          content: {
            explanation: [
              "Merging sorted lists is a fundamental operation:",
              "",
              "Algorithm: compare heads, pick smaller, advance",
              "",
              "Use dummy node to simplify edge cases (empty head handling).",
              "",
              "This is the merge step in merge sort."
            ],
            example: {
              title: "Merge Two Sorted Lists",
              code: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    
    # Attach remaining
    tail.next = l1 or l2
    
    return dummy.next

# Merge sort on linked list
def merge_sort(head):
    if not head or not head.next:
        return head
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None
    
    # Recursively sort
    left = merge_sort(head)
    right = merge_sort(mid)
    
    return merge_two_lists(left, right)`,
              explanation: "Compare and merge. For sorting: split at middle, recursively sort, merge."
            },
            practice: "Merge k sorted linked lists."
          }
        }
      ]
    },
    {
      id: "ds-stacks-queues",
      title: "Stacks & Queues",
      description: "LIFO and FIFO data structures",
      duration: "55 min",
      subtopics: [
        {
          id: "stack-basic",
          title: "Stack Implementation",
          content: {
            explanation: [
              "Stack: Last In First Out (LIFO). Operations:",
              "",
              "- **push** — add to top",
              "- **pop** — remove from top (O(1))",
              "- **peek** — view top without removing",
              "- **isEmpty** — check if empty",
              "",
              "Use for: balancing symbols, expression evaluation, function call stack simulation."
            ],
            example: {
              title: "Valid Parentheses",
              code: `# Stack implementation
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        return self.items.pop()
    
    def peek(self):
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0

# Valid parentheses
def is_valid(s):
    stack = Stack()
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if stack.is_empty() or stack.pop() != mapping[char]:
                return False
        else:
            stack.push(char)
    
    return stack.is_empty()

# Test
print(is_valid("()[]{}"))  # True
print(is_valid("([)]"))  # False`,
              explanation: "Push opening brackets, pop and match for closing. Empty stack = valid at end."
            },
            practice: "Evaluate a reverse Polish notation expression."
          }
        },
        {
          id: "queue-basics",
          title: "Queue Implementation",
          content: {
            explanation: [
              "Queue: First In First Out (FIFO). Operations:",
              "",
              "- **enqueue** (or push) — add to back",
              "- **dequeue** (or pop) — remove from front O(1)",
              "- **peek** — view front",
              "- **isEmpty** — check if empty",
              "",
              "Use for: BFS, level-order traversal, task scheduling."
            ],
            example: {
              title: "BFS with Queue",
              code: `from collections import deque

# Queue implementation
class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        return self.items.popleft()
    
    def peek(self):
        return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0

# BFS traversal
def bfs(graph, start):
    visited = set([start])
    queue = Queue()
    queue.enqueue(start)
    result = []
    
    while not queue.is_empty():
        node = queue.dequeue()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
    
    return result`,
              explanation: "Use collections.deque for O(1) operations on both ends."
            },
            practice: "Implement level-order tree traversal."
          }
        },
        {
          id: "stack-queues",
          title: "Stack using Queue",
          content: {
            explanation: [
              "Implement one structure using another:",
              "",
              "**Stack using two queues**: push O(1), pop O(n)",
              "- Enqueue new to q1",
              "- Move all from q1 to q2 when popping",
              "- Swap queues",
              "",
              "**Queue using two stacks**: enqueue O(1), dequeue O(n)"
            ],
            example: {
              title: "Implement Stack with Two Queues",
              code: `class MyStack:
    def __init__(self):
        self.q1 = deque()
        self.q2 = deque()
    
    def push(self, x):
        self.q1.append(x)
    
    def pop(self):
        # Move n-1 elements to q2
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        
        # Swap queues
        self.q1, self.q2 = self.q2, self.q1
        return self.q2.popleft()
    
    def top(self):
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())
        
        # Get last element then swap
        top = self.q1[0]
        self.q2.append(self.q1.popleft())
        self.q1, self.q2 = self.q2, self.q1
        return top
    
    def empty(self):
        return len(self.q1) == 0`,
              explanation: "Move n-1 elements to transfer the bottom element to the top position for pop."
            },
            practice: "Implement a queue using two stacks."
          }
        },
        {
          id: "monotonic",
          title: "Monotonic Stack",
          content: {
            explanation: [
              "Monotonic stack maintains increasing/decreasing order. Great for:",
              "",
              "1. **Next greater element** — find what's next larger",
              "2. **Stock span** — consecutive smaller days",
              "3. **Histogram** — largest rectangle",
              "",
              "The stack keeps candidate indices, monotonically decreasing values."
            ],
            example: {
              title: "Next Greater Element",
              code: `# Next greater element for each position
def next_greater(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices
    
    for i in range(n):
        # While current is greater than stack top
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    
    # Remaining don't have greater
    return result

# Test
print(next_greater([2, 1, 2, 4, 3]))  # [4, 4, 4, -1, -1]`,
              explanation: "When current > stack top, current is the next greater for those indices. Stack maintains decreasing values."
            },
            practice: "Find the largest rectangle in a histogram."
          }
        }
      ]
    },
    {
      id: "ds-trees",
      title: "Binary Trees",
      description: "Tree traversal and common patterns",
      duration: "85 min",
      subtopics: [
        {
          id: "tree-traversal",
          title: "Tree Traversals",
          content: {
            explanation: [
              "Tree traversals visit every node exactly once. Four main types:",
              "",
              "1. **Preorder**: visit, then children — copy/serialize tree",
              "2. **Inorder**: left, visit, right — get sorted BST",
              "3. **Postorder**: children first, then visit — delete tree",
              "4. **Level-order**: BFS, level by level",
              "",
              "All are O(n) — each node visited once."
            ],
            example: {
              title: "All Tree Traversals",
              code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# Iterative with stack
def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return result`,
              explanation: "Preorder = root-left-right. Inorder gives sorted order for BSTs."
            },
            practice: "Implement inorder traversal iteratively using a stack."
          }
        },
        {
          id: "tree-patterns",
          title: "Common Tree Patterns",
          content: {
            explanation: [
              "Many tree problems follow common patterns:",
              "",
              "1. **Maximum depth** — postorder (process children first)",
              "2. **Validate BST** — inorder should be increasing",
              "3. **Lowest common ancestor** — find both nodes",
              "",
              "Tip: Use recursion, subtrees are independent."
            ],
            example: {
              title: "Tree Problems",
              code: `# Maximum depth
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Validate BST
def is_validBST(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return is_validBST(root.left, min_val, root.val) and \
           is_validBST(root.right, root.val, max_val)

# Lowest common ancestor
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root
    return left or right`,
              explanation: "DFS traversal. BST: left subtree values < node < right subtree values."
            },
            practice: "Find the diameter of a binary tree (longest path)."
          }
        },
        {
          id: "tree-construct",
          title: "Constructing Trees",
          content: {
            explanation: [
              "Construct tree from traversals:",
              "",
              "1. **Pre + Inorder** — unique tree",
              "2. **Post + Inorder** — unique tree",
              "3. **Pre + Post** ❌ — not unique",
              "",
              "From preorder: first element is root. Find in inorder - split left/right."
            ],
            example: {
              title: "Construct from Preorder",
              code: `# Using preorder + inorder to build tree
def build_tree(preorder, inorder):
    if not preorder:
        return None
    
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    # Find root in inorder
    mid = inorder.index(root_val)
    
    # Build left and right
    root.left = build_tree(preorder[1:mid+1], inorder[:mid])
    root.right = build_tree(preorder[mid+1:], inorder[mid+1:])
    
    return root

# Or using index (no index() searches)
def build_tree_idx(preorder, inorder, post_pre, post_in):
    if post_in >= post_pre:
        return None
    
    root_val = preorder[post_pre]
    root = TreeNode(root_val)
    
    mid = inorder_index[root_val][post_in:post_pre+1]  # map of value -> index
    
    root.left = build_tree_idx(preorder, inorder, post_pre + 1, post_in)
    root.right = build_tree_idx(preorder, inorder, post_pre + mid + 1, mid + 1)
    
    return root`,
              explanation: "Use preorder[0] as root, find in inorder, recursive split left and right subtree indices."
            },
            practice: "Construct a binary tree given its preorder and inorder traversals."
          }
        },
        {
          id: "tree-bst",
          title: "BST Operations",
          content: {
            explanation: [
              "Binary Search Tree: left < root < right. Operations:",
              "",
              "1. **Search** — O(h) where h is height",
              "2. **Insert** — follow search path, add leaf",
              "3. **Delete** — replace with successor",
              "",
              "Self-balancing trees keep height O(log n)."
            ],
            example: {
              title: "BST Search and Insert",
              code: `# Search in BST
def search(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

# Insert in BST
def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

# Delete from BST
def delete(root, val):
    if not root:
        return None
    
    if val < root.val:
        root.left = delete(root.left, val)
    elif val > root.val:
        root.right = delete(root.right, val)
    else:
        # Found node to delete
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        
        # Find inorder successor (smallest in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = delete(root.right, successor.val)
    
    return root`,
              explanation: "For delete with two children: replace with inorder successor (smallest in right subtree)."
            },
            practice: "Find the kth smallest element in a BST."
          }
        }
      ]
    },
    {
      id: "ds-heaps",
      title: "Heaps & Priority Queues",
      description: "Min/max heaps for efficient ordering",
      duration: "55 min",
      subtopics: [
        {
          id: "heap-intro",
          title: "Heap Fundamentals",
          content: {
            explanation: [
              "A heap is a complete binary tree where parent is always smaller (min-heap) or larger (max-heap) than children.",
              "",
              "Properties:",
              "- **Insert**: O(log n) — add to end, bubble up",
              "- **Extract min/max**: O(log n) — remove root, replace with last, bubble down",
              "- **Peek**: O(1) — view root without removing",
              "",
              "Used for: priority queues, top-k problems, merging sorted streams."
            ],
            example: {
              title: "Heap Operations (Python)",
              code: `import heapq

# Min-heap (negate for max-heap)
min_heap = []

# Insert
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 2)
heapq.heappush(min_heap, 8)

# Extract
min_val = heapq.heappop(min_heap)
print(min_val)  # 2

# Peek (at index 0)
print(min_heap[0])  # smallest without removing

# Create from list
heap = [3, 1, 4, 1, 5, 9]
heapq.heapify(heap)  # in-place
print(heap[0])  # 1 (smallest)

# Max heap: negate values
max_heap = []
for x in [3, 1, 4]:
    heapq.heappush(max_heap, -x)
print(-max_heap[0])  # 4`,
              explanation: "Python's heapq is min-heap. Negate for max-heap. heapify converts list to heap."
            },
            practice: "Implement a max-heap using heapq."
          }
        },
        {
          id: "heap-kth",
          title: "Kth Largest/Smallest",
          content: {
            explanation: [
              "Find kth largest/smallest:",
              "",
              "1. **Sort**: O(n log n)",
              "2. **Heap**: O(n log k) — better for streaming",
              "3. **Quickselect**: O(n) average",
              "",
              "Heap approach: keep k elements, compare each new element."
            ],
            example: {
              title: "Kth Largest Element",
              code: `import heapq

# Kth largest using heap
def find_kth_largest(nums, k):
    # Use min-heap of size k
    heap = []
    
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]

# More efficient: one pass
def kth_largest(nums, k):
    # Keep k elements in heap
    heap = nums[:k]
    heapq.heapify(heap)
    
    for num in heapq:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    
    return heap[0]

# Kth smallest: use max-heap (negate)
def kth_smallest(nums, k):
    max_heap = []
    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return -max_heap[0]`,
              explanation: "Keep heap of k elements. For kth largest, keep min-heap of size k. heapreplace replaces in O(log k)."
            },
            practice: "Find median of a data stream."
          }
        },
        {
          id: "heap-merge",
          title: "Merge Sorted Streams",
          content: {
            explanation: [
              "Merge multiple sorted streams efficiently using a heap:",
              "",
              "Algorithm:",
              "1. Push first element from each stream to heap",
              "2. Extract min, push next from that stream",
              "3. Continue until all exhausted",
              "",
              "This is how external sorting works, k-way merge."
            ],
            example: {
              title: "Merge Sorted Arrays",
              code: `import heapq

def merge_sorted(*streams):
    result = []
    heap = []
    iterators = [iter(s) for s in streams]
    
    # Initialize: push first from each
    for i, it in enumerate(iterators):
        val = next(it, None)
        if val is not None:
            heapq.heappush(heap, (val, i))
    
    # Extract and add next
    while heap:
        val, i = heapq.heappop(heap)
        result.append(val)
        
        val = next(iterators[i], None)
        if val is not None:
            heapq.heappush(heap, (val, i))
    
    return result

# Test
a = [1, 4, 7]
b = [2, 5, 8]
c = [3, 6, 9]
print(merge_sorted(a, b, c))  # [1,2,3,4,5,6,7,8,9]`,
              explanation: "Use (value, stream_index) to track which stream to pull from next."
            },
            practice: "Given k sorted arrays, find the smallest range covering at least one element from each."
          }
        }
      ]
    },
    {
      id: "ds-tries",
      title: "Tries (Prefix Trees)",
      description: "Efficient string operations and prefix matching",
      duration: "50 min",
      subtopics: [
        {
          id: "tries-intro",
          title: "Introduction to Tries",
          content: {
            explanation: [
              "A trie is a tree data structure optimized for string operations.",
              "",
              "**Why tries?**",
              "- Fast prefix searches (O(m) where m is prefix length)",
              "- Efficient autocomplete suggestions",
              "- Dictionary lookups",
              "",
              "**Structure**:",
              "- Each node represents a character",
              "Root is empty string",
              "Path from root = word/prefix",
              "Nodes may have end-of-word marker"
            ],
            example: {
              title: "Trie Structure",
              code: `# Insert: "cat", "cap", "car", "dog"
#
#                    (root)
#                   /  |  \\
#                  c   d   ...
#                 /\\
#                a a
#               / \\ 
#              p   t
#             /     \\
#            r       r (end markers)
#
# "cat": root -> c -> a -> t
# "cap": root -> c -> a -> p
# "car": root -> c -> a -> r

# Search: O(m) where m = word length
# Prefix search: find all words starting with "ca"`,
              explanation: "Tries excel at prefix operations because all words with the same prefix share nodes."
            },
            practice: "Build a trie and insert: 'apple', 'app', 'apply', 'apt'. Show the structure."
          }
        },
        {
          id: "tries-implementation",
          title: "Implementing a Trie",
          content: {
            explanation: [
              "Each node needs:",
              "- children: dict mapping char to node",
              "- is_end: boolean for word end",
              "- count: how many words pass through (for prefix count)",
              "",
              "Operations:",
              "- insert: O(m) - traverse/create nodes",
              "- search: O(m) - traverse and check is_end",
              "- startsWith: O(m) - just traverse"
            ],
            example: {
              title: "Trie Implementation",
              code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0  # words passing through

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.count += 1
        node.is_end = True
    
    def search(self, word):
        node = self._find_node(word)
        return node and node.is_end
    
    def startsWith(self, prefix):
        return self._find_node(prefix) is not None
    
    def _find_node(self, s):
        node = self.root
        for char in s:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

# Test
t = Trie()
t.insert("apple")
t.insert("app")
print(t.search("apple"))  # True
print(t.search("app"))   # True
print(t.search("appl"))  # False
print(t.startsWith("app"))  # True`,
              explanation: "The count field tracks how many words pass through each node - useful for finding most common prefixes."
            },
            practice: "Add a method to count how many words start with a given prefix."
          }
        },
        {
          id: "tries-autocomplete",
          title: "Autocomplete with Tries",
          content: {
            explanation: [
              "Use tries for efficient autocomplete:",
              "",
              "**Algorithm**:",
              "1. Navigate to prefix node",
              "2. DFS/BFS to collect all words from there",
              "3. Optionally sort by frequency",
              "",
              "**Optimization**:",
              "- Store frequency/count for ranking",
              "- Limit results for large trees",
              "- Prune uncommon branches"
            ],
            example: {
              title: "Autocomplete Implementation",
              code: `class Trie:
    # ... previous methods ...
    
    def autocomplete(self, prefix, limit=5):
        node = self._find_node(prefix)
        if not node:
            return []
        
        results = []
        self._collect_words(node, prefix, results)
        return results[:limit]
    
    def _collect_words(self, node, prefix, results):
        if node.is_end:
            results.append(prefix)
        for char, child in node.children.items():
            self._collect_words(child, prefix + char, results)

# With frequency ranking
class TrieWithFreq(Trie):
    def __init__(self):
        super().__init__()
        self.popular = {}
    
    def insert(self, word):
        super().insert(word)
        self.popular[word] = self.popular.get(word, 0) + 1
    
    def autocomplete(self, prefix, limit=5):
        # Get all candidates
        candidates = super().autocomplete(prefix, limit=100)
        # Sort by frequency
        return sorted(candidates, key=lambda w: -self.popular.get(w, 0))[:limit]`,
              explanation: "For real autocomplete, you'll want to limit results and potentially store usage statistics for ranking."
            },
            practice: "Implement autocomplete that returns the top 3 most frequently used words starting with a prefix."
          }
        },
        {
          id: "tries-problems",
          title: "Common Trie Problems",
          content: {
            explanation: [
              "**LeetCode-style problems**:",
              "",
              "1. **Longest Common Prefix**: Find longest prefix shared by all strings",
              "",
              "2. **Word Search II**: Find all words in a grid using trie",
              "",
              "3. **Replace Words**: Replace words with shortest root from dictionary",
              "",
              "4. **Design Add and Search Words**: Dictionary with wildcard search",
              "",
              "Key insight: Many string problems become easier with tries!"
            ],
            example: {
              title: "Longest Common Prefix",
              code: `def longest_common_prefix(strs):
        if not strs:
            return ""
        
        # Find minimum length
        min_len = min(len(s) for s in strs)
        
        # Binary search on length
        low, high = 0, min_len
        while low < high:
            mid = (low + high + 1) // 2
            if all(s[:mid] == strs[0][:mid] for s in strs):
                low = mid
            else:
                high = mid - 1
        
        return strs[0][:low]
    
    # Alternative: trie approach
    def lcp_with_trie(words):
        if not words:
            return ""
        
        root = TrieNode()
        for word in words:
            insert_into_trie(root, word)
        
        prefix = ""
        node = root
        while len(node.children) == 1 and not node.is_end:
            char = list(node.children.keys())[0]
            prefix += char
            node = node.children[char]
        
        return prefix`,
              explanation: "Binary search + checking is O(n * log(m)). Trie approach is O(m) where m is length of shortest string."
            },
            practice: "Solve: Given a dictionary, replace each word with its shortest root (e.g., 'cat', 'catalog' -> 'cat')."
          }
        }
      ]
    }
  ]
};