import { LearningTrack } from "../data";

export const masterPython: LearningTrack = {
  id: "master-python",
  title: "Master Python",
  subtitle: "Beginner to Advanced",
  description: "Complete Python journey from zero to building real applications",
  type: "master_track",
  icon: "GraduationCap",
  color: "emerald",
  coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600",
  totalHours: 28,
  language: "python",
  category: "Python",
  topics: [
    {
      id: "py-basics",
      title: "Python Basics",
      description: "Get started with Python fundamentals",
      duration: "75 min",
      subtopics: [
        {
          id: "py-variables-intro",
          title: "What is a Variable?",
          content: {
            explanation: [
              "A variable is a named container that holds a value. Think of it like a labeled box — you put something inside and later you can check what's there.",
              "",
              "Python is dynamically typed — you don't need to declare the type of a variable. Python figures it out automatically based on the value you assign.",
              "",
              "Variable names are case-sensitive: `age` and `Age` are different variables. By convention, Python variables use lowercase with underscores: `user_name`, `max_count`.",
              "",
              "You can create multiple variables in one line, which is useful for keeping your code compact:"
            ],
            example: {
              title: "Creating Variables",
              code: `name = "Alice"
age = 25
is_student = True

print(name)        # "Alice"
print(age)         # 25
print(is_student)  # True`,
              explanation: "Python automatically determines the type: string, integer, and boolean. No type declarations needed."
            },
            practice: "Create three variables: your name (string), your age (integer), and whether you like coding (boolean). Print all three."
          }
        },
        {
          id: "py-data-types",
          title: "Python Data Types",
          content: {
            explanation: [
              "Every value in Python has a type. Understanding types helps you avoid bugs and write cleaner code.",
              "",
              "**Primitive types**:",
              "• `int` — whole numbers like 1, 42, -5",
              "• `float` — decimal numbers like 3.14, -0.5",
              "• `str` — text like 'hello' or \"world\"",
              "• `bool` — True or False",
              "",
              "**Collection types** (we'll cover later):",
              "• `list` — ordered, changeable: [1, 2, 3]",
              "• `tuple` — ordered, unchangeable: (1, 2, 3)",
              "• `dict` — key-value pairs: {'name': 'Alice'}",
              "• `set` — unique values: {1, 2, 3}"
            ],
            example: {
              title: "Checking Types",
              code: `# Use type() to check what type a value is
print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type("hello"))     # <class 'str'>
print(type(True))       # <class 'bool'>

# Check before doing operations
num = "10"
print(type(num))  # str — not a number!
print(int(num) + 5)  # 15 — convert first`,
              explanation: "Use `type()` to see what type you're working with. Use `int()`, `float()`, `str()` to convert between types."
            },
            practice: "Create variables of each type: int, float, str, bool. Check their types with type()."
          }
        },
        {
          id: "py-strings",
          title: "Working with Strings",
          content: {
            explanation: [
              "Strings store text. You can use single quotes 'text', double quotes \"text\", or triple quotes for multi-line text.",
              "",
              "String methods let you transform and check text:",
              "• `.upper()` — convert to uppercase",
              "• `.lower()` — convert to lowercase",
              "• `.strip()` — remove whitespace from ends",
              "• `.split()` — split into a list",
              "• `.replace()` — replace text",
              "",
              "Use f-strings (formatted strings) to embed variables inside text:"
            ],
            example: {
              title: "String Operations",
              code: `name = "Alice"
age = 25

# f-strings (Python 3.6+)
print(f"My name is {name}")        # "My name is Alice"
print(f"I am {age} years old")     # "I am 25 years old"

# String methods
message = "  Hello, World!  "
print(message.strip())           # "Hello, World!"
print(message.lower())          # "  hello, world!  "
print(message.replace("World", "Python"))  # "  Hello, Python!  "

# Split and join
words = "apple,banana,orange".split(",")
print(words)  # ['apple', 'banana', 'orange']`,
              explanation: "f-strings use f before the quotes and {variable} inside. They're the modern, readable way to build strings with variables."
            },
            practice: "Create an f-string that says 'Hello [name], you are [age] years old'. Use `.upper()` on the name."
          }
        },
        {
          id: "py-numbers-math",
          title: "Numbers and Math",
          content: {
            explanation: [
              "Python handles numbers natively. Integers are whole numbers, floats have decimal points.",
              "",
              "Basic math operations:",
              "• `+` — addition",
              "• `-` — subtraction",
              "• `*` — multiplication",
              "• `/` — division (always returns float)",
              "• `//` — floor division (rounds down)",
              "• `%` — remainder (modulo)",
              "• `**` — exponent (power)",
              "",
              "The `math` module provides advanced functions like sqrt, sin, cos, and constants like pi."
            ],
            example: {
              title: "Math Operations",
              code: `import math

# Basic operations
print(10 + 5)      # 15
print(10 - 5)      # 5
print(10 * 5)      # 50
print(10 / 5)     # 2.0 (always float!)
print(10 // 3)    # 3 (floor division)
print(10 % 3)     # 1 (remainder)
print(2 ** 3)      # 8 (2 to the power of 3)

# Using math module
print(math.sqrt(16))   # 4.0
print(math.pi)          # 3.141592653589793
print(math.floor(3.7)) # 3
print(math.ceil(3.2))   # 4`,
              explanation: "Use `//` for integer division when you want a whole number. Use `%` to check if a number is even or odd: `n % 2 == 0` means even."
            },
            practice: "Calculate the area of a circle with radius 5 using math.pi. Print both the exact value and the floored value."
          }
        },
        {
          id: "py-input-output",
          title: "Getting User Input",
          content: {
            explanation: [
              "The `input()` function pauses your program and waits for the user to type something. The user can type anything and press Enter.",
              "",
              "Input is always returned as a string. Convert to numbers if needed.",
              "",
              "The `print()` function outputs values. You can print multiple items separated by commas, and Python adds spaces automatically.",
              "",
              "You can use end='' to control what print ends with (default is a new line)."
            ],
            example: {
              title: "Input and Output",
              code: `# Getting input
name = input("What is your name? ")
print(f"Hello, {name}!")

# Input is always a string!
age = input("How old are you? ")
age = int(age)  # Convert to number
print(f"You are {age} years old")

# Multiple prints
print("Line 1", "Line 2", sep=" - ")  # "Line 1 - Line 2"
print("No newline", end="")
print(" here")  # "No newline here"`,
              explanation: "Always convert input() to the type you need. Use int() or float() for numbers. The sep parameter controls what goes between items."
            },
            practice: "Ask the user for their birth year. Calculate and print their age. (Hint: use current year - birth year)"
          }
        },
        {
          id: "py-type-conversion",
          title: "Type Conversion",
          content: {
            explanation: [
              "Sometimes you need to convert between types. Python provides built-in functions for this.",
              "",
              "Common conversions:",
              "• `int(value)` — convert to integer",
              "• `float(value)` — convert to float",
              "• `str(value)` — convert to string",
              "• `bool(value)` — convert to boolean",
              "",
              "⚠️ Not all conversions work! Converting 'hello' to int will crash. Always validate input.",
              "",
              "Falsy values (convert to False): 0, 0.0, '', None, [], False"
            ],
            example: {
              title: "Type Conversion",
              code: `# String to number
num_str = "42"
num = int(num_str)
print(num + 5)  # 47

# Float to int (truncates!)
price = 19.99
print(int(price))  # 19 (not 20!)

# Number to string for concatenation
age = 25
print("I am " + str(age) + " years old")  # "I am 25 years old"

# Safe conversion with checking
def safe_int(value):
    try:
        return int(value)
    except ValueError:
        return None

print(safe_int("100"))   # 100
print(safe_int("hello")) # None`,
              explanation: "Use try/except for safe conversion. If the conversion fails, the except block catches the error and returns None instead of crashing."
            },
            practice: "Create a function that safely converts user input to a float. Return None if invalid."
          }
        }
      ]
    },
    {
      id: "py-conditionals",
      title: "Conditionals",
      description: "Control program flow with conditions",
      duration: "50 min",
      subtopics: [
        {
          id: "py-if-else",
          title: "if/elif/else Statements",
          content: {
            explanation: [
              "Python uses indentation to define code blocks. This is different from other languages — it's part of Python's philosophy of readable code.",
              "",
              "The `if` statement checks a condition: if it's True, the indented block runs. If False, it's skipped.",
              "",
              "Use `elif` (else if) for multiple conditions: Python checks them top to bottom and runs the first True block. If none match, `else` runs.",
              "",
              "⚠️ Remember the colon after each condition and the consistent indentation!"
            ],
            example: {
              title: "If Statements",
              code: `age = 18

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")

# Output: "You are an adult"

# Multiple conditions with and/or
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(f"Grade: {grade}")  # "Grade: B"`,
              explanation: "Only one block runs — the first one where the condition is True. The others are skipped. Use elif for multiple branches."
            },
            practice: "Write a program that prints 'expensive' if price > 100, 'moderate' if > 50, 'cheap' otherwise."
          }
        },
        {
          id: "py-comparison-operators",
          title: "Comparison Operators",
          content: {
            explanation: [
              "Comparison operators compare values and return True or False.",
              "",
              "**Equality**:",
              "• `==` — equal to",
              "• `!=` — not equal to",
              "",
              "**Numerical**:",
              "• `<` — less than",
              "• `>` — greater than",
              "• `<=` — less than or equal",
              "• `>=` — greater than or equal",
              "",
              "These are used in if statements and other places where True/False is needed."
            ],
            example: {
              title: "Comparisons",
              code: `x, y = 5, 10

print(x == y)   # False
print(x != y)   # True
print(x < y)    # True
print(x > y)    # False
print(x <= y)   # True
print(x >= y)   # False

# Chaining comparisons (Python 3.8+)
age = 25
if 18 <= age <= 65:
    print("Working age")  # "Working age"`,
              explanation: "Python lets you chain comparisons: `18 <= age <= 65` is cleaner than `age >= 18 and age <= 65`."
            },
            practice: "Check if a number is between 1 and 10 (inclusive). Print appropriate message."
          }
        },
        {
          id: "py-logical-operators",
          title: "Logical Operators — and, or, not",
          content: {
            explanation: [
              "Logical operators combine boolean values:",
              "",
              "`and` — True if BOTH sides are True",
              "`or` — True if AT LEAST ONE side is True",
              "`not` — flips True to False, False to True",
              "",
              "Python has short-circuit evaluation: it stops as soon as it knows the result. `True or anything` is always True, so Python doesn't check the second part.",
              "",
              "⚠️ Don't confuse `&` and `|` with `and` and `or` — those are bitwise operators."
            ],
            example: {
              title: "Logical Operators",
              code: `is_student = True
has_id = False

# and — both must be True
print(is_student and has_id)   # False

# or — at least one is True
print(is_student or has_id)    # True

# not — flip the value
print(not is_student)          # False

# Practical: check multiple conditions
age = 25
has_license = True
if age >= 18 and has_license:
    print("Can drive")  # "Can drive"

# Short-circuit
name = ""
print(name or "Guest")  # "Guest" — uses fallback`,
              explanation: "Use `or` for default values: `name or 'Guest'` uses 'Guest' if name is empty (falsy)."
            },
            practice: "Write a program that checks if a user can vote: must be citizen AND at least 18 years old."
          }
        },
        {
          id: "py-nested-conditionals",
          title: "Nested Conditionals",
          content: {
            explanation: [
              "You can put if statements inside other if statements. This is called nesting.",
              "",
              "However, deep nesting (3+ levels) makes code hard to read. When possible, use `and` to combine conditions instead.",
              "",
              "A better approach: use guard clauses — check the failure cases first, then handle the main logic. This reduces nesting.",
              "",
              "Pattern: Check invalid cases early → Return or continue → Process valid case"
            ],
            example: {
              title: "Nested vs Flat",
              code: `# Nested (harder to read)
age = 25
if age >= 18:
    if has_id:
        if has_ticket:
            print("Can enter")
        else:
            print("Need ticket")
    else:
        print("Need ID")
else:
    print("Too young")

# Flat (easier to read)
if age < 18:
    print("Too young")
    return
if not has_id:
    print("Need ID")
    return
if not has_ticket:
    print("Need ticket")
    return
print("Can enter")`,
              explanation: "Guard clauses check failure cases first and return early. This keeps the 'happy path' at the least indented level."
            },
            practice: "Refactor a nested if into a flat one with early returns. Start with nested, then improve."
          }
        },
        {
          id: "py-ternary",
          title: "Ternary Operator",
          content: {
            explanation: [
              "The ternary operator is a one-line if/else. Use it for simple conditions where it makes the code clearer.",
              "",
              "Syntax: `value_if_true if condition else value_if_false`",
              "",
              "Use it when:",
              "• The condition is simple",
              "• You're assigning a value (not running code)",
              "• It fits on one line",
              "",
              "Avoid: complex conditions, multiple operations"
            ],
            example: {
              title: "Ternary Operator",
              code: `# Basic ternary
age = 20
status = "Adult" if age >= 18 else "Minor"
print(status)  # "Adult"

# With other operations
temperature = 75
weather = "Hot" if temperature > 80 else "Warm" if temperature > 60 else "Cold"
print(weather)  # "Warm"

# In list comprehensions (later)
numbers = [1, 2, 3, 4, 5]
parity = ["even" if n % 2 == 0 else "odd" for n in numbers]
print(parity)  # ['odd', 'even', 'odd', 'even', 'odd']`,
              explanation: "Ternary is an expression that produces a value. It's perfect for simple conditional assignments."
            },
            practice: "Use ternary to set 'pass' if score >= 60, 'fail' otherwise."
          }
        }
      ]
    },
    {
      id: "py-loops",
      title: "Loops",
      description: "Iterate over data efficiently",
      duration: "60 min",
      subtopics: [
        {
          id: "py-for-range",
          title: "For Loops with range()",
          content: {
            explanation: [
              "The `for` loop iterates over a sequence. The `range()` function generates a sequence of numbers.",
              "",
              "`range(stop)` — 0 to stop-1",
              "`range(start, stop)` — start to stop-1",
              "`range(start, stop, step)` — with step size",
              "",
              "⚠️ range is exclusive of the stop value! range(5) gives 0,1,2,3,4.",
              "",
              "Use `end=''` in print() to stay on one line."
            ],
            example: {
              title: "For Loop Basics",
              code: `# Count 0 to 4
for i in range(5):
    print(i)

# Count 1 to 10
for i in range(1, 11):
    print(i, end=" ")
# Output: 1 2 3 4 5 6 7 8 9 10 

# Even numbers: 0, 2, 4, 6, 8
for i in range(0, 10, 2):
    print(i)

# Reverse: 5, 4, 3, 2, 1
for i in range(5, 0, -1):
    print(i)`,
              explanation: "Use range() when you know how many times to loop. Use step for odd/even or reverse iteration."
            },
            practice: "Print the first 10 multiples of 3: 3, 6, 9, ..., 30"
          }
        },
        {
          id: "py-for-iterating",
          title: "Iterating Over Collections",
          content: {
            explanation: [
              "You can loop directly over lists, strings, and other iterables using `for item in iterable`.",
              "",
              "For lists: get each element",
              "For strings: get each character",
              "For dictionaries: get each key (more later)",
              "",
              "Use `enumerate()` when you need both the index and value."
            ],
            example: {
              title: "Iterating Collections",
              code: `# Loop over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop over a string
for char in "hello":
    print(char, end=" ")  # h e l l o 

# With index using enumerate
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry`,
              explanation: "enumerate() returns (index, value) pairs. It's more Pythonic than using range(len(list))."
            },
            practice: "Given a list of names, print each name with its position number starting from 1."
          }
        },
        {
          id: "py-while",
          title: "While Loops",
          content: {
            explanation: [
              "A `while` loop continues while a condition is True. It checks the condition before each iteration.",
              "",
              "Use while when:",
              "• You don't know how many iterations",
              "• You're waiting for a condition to become false",
              "• You're processing until a value reaches a target",
              "",
              "⚠️ Make sure the condition eventually becomes False, or you'll have an infinite loop!"
            ],
            example: {
              title: "While Loop",
              code: `# Count down from 5
count = 5
while count > 0:
    print(count)
    count -= 1
print("Blast off!")

# Find first number > 100
total = 0
while total <= 100:
    total += 15
print(total)  # 105

# With user input
password = ""
while password != "secret":
    password = input("Enter password: ")
print("Access granted!")`,
              explanation: "while is useful when you don't know iterations ahead of time. Always ensure the loop will end!"
            },
            practice: "Keep asking for a number until the user enters a positive number."
          }
        },
        {
          id: "py-break-continue",
          title: "Break and Continue",
          content: {
            explanation: [
              "`break` — exit the loop immediately, skip the else clause",
              "`continue` — skip to the next iteration",
              "",
              "Use break to search for something and stop when found.",
              "Use continue to skip certain values.",
              "",
              "Both work with for and while loops."
            ],
            example: {
              title: "Break and Continue",
              code: `# break — stop early
for i in range(10):
    if i == 5:
        break
    print(i, end=" ")  # 0 1 2 3 4

# continue — skip values
for i in range(5):
    if i == 2:
        continue
    print(i, end=" ")  # 0 1 3 4

# Find first match
numbers = [1, 3, 5, 0, 7]
for num in numbers:
    if num == 0:
        print("Found zero!")
        break
else:
    print("Not found")`,
              explanation: "The else clause on a for loop runs if the loop completes without breaking. It's useful for 'not found' cases."
            },
            practice: "Use break to find the first even number in a list. Print it and stop."
          }
        },
        {
          id: "py-list-comprehension",
          title: "List Comprehension",
          content: {
            explanation: [
              "List comprehension provides a compact way to create lists. It's more Pythonic than loops for simple transformations.",
              "",
              "Syntax: `[expression for item in iterable if condition]`",
              "",
              "Parts:",
              "• expression — what to do with each item",
              "• for item in iterable — the loop part",
              "• if condition — optional filter",
              "",
              "Read it like: 'create a list of [expression] for each [item] in [iterable] where [condition]'"
            ],
            example: {
              title: "List Comprehension",
              code: `# Create a list of squares
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# With filter: only even numbers
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]

# String to list of chars
chars = [c for c in "hello"]
print(chars)  # ['h', 'e', 'l', 'l', 'o']

# Nested comprehension
matrix = [[i*3+j for j in range(3)] for i in range(3)]
print(matrix)  # [[0,1,2], [3,4,5], [6,7,8]]`,
              explanation: "List comprehension is faster than a loop for simple operations. But use a regular loop for complex logic."
            },
            practice: "Use a list comprehension to create a list of cubes (x**3) for numbers 1-10."
          }
        },
        {
          id: "py-nested-loops",
          title: "Nested Loops",
          content: {
            explanation: [
              "A nested loop is a loop inside another loop. Use it for:",
              "• Processing grids/matrices",
              "• Generating all combinations",
              "• Finding pairs",
              "",
              "Each iteration of the outer loop runs through ALL iterations of the inner loop.",
              "",
              "⚠️ Be careful with nested loops — they grow exponentially! A 10x10 loop runs 100 times."
            ],
            example: {
              title: "Nested Loops",
              code: `# Multiplication table
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end=" ")
    print()
#  1   2   3   4   5 
#  2   4   6   8  10
# ...

# Find all pairs that sum to target
target = 10
numbers = [1, 3, 5, 7, 9]
pairs = []
for i, a in enumerate(numbers):
    for b in numbers[i+1:]:
        if a + b == target:
            pairs.append((a, b))
print(pairs)  # [(1, 9), (3, 7)]`,
              explanation: "Use enumerate in the outer loop and slice in the inner to avoid checking the same pair twice."
            },
            practice: "Print a 5x5 grid of asterisks: five rows with five stars each."
          }
        }
      ]
    },
    {
      id: "py-functions",
      title: "Functions",
      description: "Create reusable code blocks",
      duration: "65 min",
      subtopics: [
        {
          id: "py-func-def",
          title: "Defining Functions",
          content: {
            explanation: [
              "A function is a reusable block of code. Define it once, call it many times with different inputs.",
              "",
              "Use the `def` keyword: `def function_name(parameters):`",
              "",
              "Parameters are variables the function receives. Arguments are the values you pass when calling.",
              "",
              "Functions help you avoid repeating code and make it easier to test."
            ],
            example: {
              title: "Simple Function",
              code: `def greet(name):
    """This function greets a person."""
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # "Hello, Alice!"

# Multiple calls
print(greet("Bob"))   # "Hello, Bob!"
print(greet("Eve"))  # "Hello, Eve!"`,
              explanation: "The docstring (triple quotes) explains what the function does. It's good practice to document your functions."
            },
            practice: "Create a function that takes two numbers and returns their sum. Test it with 3 and 4."
          }
        },
        {
          id: "py-func-parameters",
          title: "Parameters and Arguments",
          content: {
            explanation: [
              "Parameters are defined in the function. Arguments are passed when calling.",
              "",
              "**Default parameters**: `def greet(name='Guest')` — use default if no argument",
              "",
              "**Keyword arguments**: `greet(name='Alice')` — clearer, order doesn't matter",
              "",
              "**Multiple arguments**: Use `*args` for any number of positional arguments.",
              "",
              "⚠️ Default arguments must come AFTER regular parameters!"
            ],
            example: {
              title: "Parameters",
              code: `# Default parameter
def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet())           # "Hello, Guest!"
print(greet("Alice"))   # "Hello, Alice!"

# Multiple args
def sum_all(*numbers):
    total = 0
    for n in numbers:
        total += n
    return total

print(sum_all(1, 2, 3))      # 6
print(sum_all(1, 2, 3, 4))   # 10

# Keyword arguments
def create_user(name, age, city="Unknown"):
    return {"name": name, "age": age, "city": city}

user = create_user("Alice", 25, city="NYC")`,
              explanation: "*args collects extra arguments into a tuple. Use **kwargs for keyword arguments as a dictionary."
            },
            practice: "Create a function with a default parameter. Call it with and without the argument."
          }
        },
        {
          id: "py-func-return",
          title: "Return Values",
          content: {
            explanation: [
              "The `return` statement sends a value back to the caller. A function without return returns None.",
              "",
              "You can return multiple values as a tuple. This is useful for getting multiple results.",
              "",
              "Return ends the function immediately — code after return doesn't run.",
              "",
              "Use early returns (guard clauses) to handle edge cases first."
            ],
            example: {
              title: "Return Values",
              code: `# Simple return
def absolute(x):
    if x >= 0:
        return x
    return -x

print(absolute(-5))  # 5

# Multiple return values
def divide(a, b):
    if b == 0:
        return None, "Cannot divide by zero"
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide(10, 3)
print(q, r)  # 3 1

# Early return (guard clause)
def process(data):
    if not data:
        return None
    # Main logic here...
    return processed`,
              explanation: "Returning a tuple lets you return multiple values. Use tuple unpacking to assign them: `a, b = func()`."
            },
            practice: "Create a function that returns both the square and cube of a number."
          }
        },
        {
          id: "py-func-scope",
          title: "Variable Scope",
          content: {
            explanation: [
              "Variables created inside a function are local to that function. They don't exist outside.",
              "",
              "**Local** — defined inside a function",
              "**Global** — defined at the module level",
              "",
              "Use `global` to modify a global variable (usually not recommended).",
              "",
              "Avoid global variables — pass values as parameters instead."
            ],
            example: {
              title: "Variable Scope",
              code: `x = 10  # global

def modify():
    x = 20  # local, won't change global
    print(x)  # 20

modify()
print(x)  # 10 (unchanged!)

# To modify global
def modify_global():
    global x
    x = 20

modify_global()
print(x)  # 20

# Better: pass as parameter
def modify_value(x):
    return x + 10

result = modify_value(x)
print(result)  # 20
print(x)  # 10`,
              explanation: "Modify global is possible but discouraged. Pass values as parameters and return new values instead."
            },
            practice: "Create a global variable, try to modify it inside a function, and observe the difference."
          }
        },
        {
          id: "py-func-lambda",
          title: "Lambda Functions",
          content: {
            explanation: [
              "A lambda is an anonymous (unnamed) function. Use it for short, simple functions.",
              "",
              "Syntax: `lambda parameters: expression`",
              "",
              "Limitations:",
              "• Only one expression (no statements)",
              "• Implicit return (the expression result)",
              "",
              "Common use: as a key function for sorting, or in map/filter."
            ],
            example: {
              title: "Lambda Functions",
              code: `# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

print(square(5))  # 25

# With sorted
words = ["banana", "pie", "apple"]
print(sorted(words))  # ['apple', 'banana', 'pie']
print(sorted(words, key=lambda w: len(w)))  # ['pie', 'banana', 'apple']

# With map/filter
nums = [1, 2, 3, 4, 5]
doubled = list(map(lambda n: n * 2, nums))
print(doubled)  # [2, 4, 6, 8, 10]`,
              explanation: "Lambda is great for short operations. Use a regular function if it needs multiple lines or complex logic."
            },
            practice: "Use a lambda to sort a list of names by their last letter."
          }
        }
      ]
    },
    {
      id: "py-collections",
      title: "Collections",
      description: "Lists, Dictionaries, Sets",
      duration: "75 min",
      subtopics: [
        {
          id: "py-lists",
          title: "Lists — Ordered Collections",
          content: {
            explanation: [
              "A list is an ordered, mutable collection. It's like an array in other languages.",
              "",
              "Create with square brackets: `[1, 2, 3]` or `list()`",
              "",
              "Access by index (0-based): `list[0]`, `list[-1]` for last item.",
              "",
              "Lists can hold any types, including mixed: `[1, 'hello', True]`"
            ],
            example: {
              title: "Creating and Accessing Lists",
              code: `# Create a list
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# Access elements
print(fruits[0])   # "apple"
print(fruits[-1])  # "cherry" (last item)

# Slice: start:end (exclusive)
print(numbers[1:4])  # [2, 3, 4]
print(numbers[:3])  # [1, 2, 3]
print(numbers[3:])  # [4, 5]

# Modify
fruits[0] = "orange"
print(fruits)  # ['orange', 'banana', 'cherry']`,
              explanation: "Use negative indices to access from the end: -1 is last, -2 is second to last. Slicing returns a new list."
            },
            practice: "Create a list of 5 numbers. Print the first, last, and middle three elements."
          }
        },
        {
          id: "py-list-methods",
          title: "List Methods",
          content: {
            explanation: [
              "Lists have built-in methods that modify them in place:",
              "",
              "• `.append(item)` — add to the end",
              "• `.insert(index, item)` — insert at position",
              "• `.remove(item)` — remove first occurrence",
              "• `.pop()` — remove and return last item",
              "• `.pop(index)` — remove at index",
              "• `.extend([items])` — add multiple items",
              "• `.sort()` — sort in place",
              "• `.reverse()` — reverse in place"
            ],
            example: {
              title: "List Methods",
              code: `nums = [1, 2, 3]

# Add items
nums.append(4)       # [1, 2, 3, 4]
nums.insert(0, 0)    # [0, 1, 2, 3, 4]
nums.extend([5, 6])  # [0, 1, 2, 3, 4, 5, 6]

# Remove items
last = nums.pop()     # removes 6, nums is [0,1,2,3,4,5]
first = nums.pop(0)   # removes 0, nums is [1,2,3,4,5]
nums.remove(3)        # removes first 3, nums is [1,2,4,5]

# Sort
nums.sort()          # [1, 2, 4, 5]
nums.reverse()       # [5, 4, 2, 1]

# Other useful methods
print(len(nums))     # 4
print(nums.index(4))  # 1 (position of 4)
print(nums.count(2)) # 1`,
              explanation: "Most list methods modify the list in place (change the original). They don't return the modified list."
            },
            practice: "Given a list, use append, insert, remove, and pop to transform it. Print the intermediate steps."
          }
        },
        {
          id: "py-tuples",
          title: "Tuples — Immutable Lists",
          content: {
            explanation: [
              "A tuple is like a list but immutable — once created, it cannot be changed.",
              "",
              "Create with parentheses: `(1, 2, 3)` or just comma-separated: `1, 2, 3`",
              "",
              "Why use tuples?",
              "• Slightly faster than lists",
              "• Can be used as dictionary keys",
              "• Signal that data shouldn't change",
              "",
              "Tuples can hold mixed types."
            ],
            example: {
              title: "Tuples",
              code: `# Create tuples
point = (3, 4)
pair = "hello", "world"  # also a tuple

# Access (like lists)
print(point[0])   # 3
print(point[-1])  # 4

# Unpacking (very Pythonic)
x, y = point
print(x, y)  # 3 4

# Return multiple values (tuples!)
def divide(a, b):
    return a // b, a % b

quotient, remainder = divide(10, 3)
print(quotient, remainder)  # 3 1

# As dictionary keys
locations = {
    (40.7, 74.0): "NYC",
    (51.5, 0.1): "London"
}
print(locations[(40.7, 74.0)])  # "NYC"`,
              explanation: "Tuples are faster and can be dictionary keys. Use them when you want to signal 'don't change this'."
            },
            practice: "Create a tuple of your name, age, and city. Unpack it into three variables."
          }
        },
        {
          id: "py-dictionaries",
          title: "Dictionaries — Key-Value Pairs",
          content: {
            explanation: [
              "A dictionary stores key-value pairs. It's like a hash map in other languages.",
              "",
              "Create with curly braces: `{'name': 'Alice', 'age': 25}`",
              "",
              "Keys must be immutable (strings, numbers, tuples). Values can be anything.",
              "",
              "Access: `dict['key']` or `dict.get('key', default)` — get returns default if key missing."
            ],
            example: {
              title: "Dictionaries",
              code: `# Create a dictionary
user = {
    'name': 'Alice',
    'age': 25,
    'city': 'NYC'
}

# Access
print(user['name'])     # "Alice"
print(user.get('email', 'not set'))  # "not set"

# Add/modify
user['age'] = 26          # modify
user['email'] = 'a@b.com'  # add

# Get all keys/values/items
print(user.keys())    # dict_keys(['name', 'age', ...])
print(user.values())  # dict_values(['Alice', 26, ...])
print(user.items())   # dict_items([('name', 'Alice'), ...])

# Iterate
for key, value in user.items():
    print(f"{key}: {value}")`,
              explanation: "Dictionaries are great for looking up values by a key. Use .get() to avoid KeyError when a key might not exist."
            },
            practice: "Create a dictionary mapping color names to hex codes. Access and print the code for 'blue'."
          }
        },
        {
          id: "py-sets",
          title: "Sets — Unique Elements",
          content: {
            explanation: [
              "A set is an unordered collection of unique elements. Duplicates are automatically removed.",
              "",
              "Create with curly braces: `{1, 2, 3}` or `set([values])`",
              "",
              "Use sets for:",
              "• Removing duplicates",
              "• Testing membership (fast!)",
              "• Set operations: union, intersection, difference",
              "",
              "⚠️ Sets are unordered — no index access!"
            ],
            example: {
              title: "Sets",
              code: `# Create a set
fruits = {"apple", "banana", "cherry", "apple"}
print(fruits)  # {'banana', 'cherry', 'apple'} (duplicates removed!)

# Add/remove
fruits.add("orange")
fruits.discard("banana")  # removes without error

# Membership test
print("apple" in fruits)   # True
print("grape" in fruits)  # False

# Set operations
set1 = {1, 2, 3}
set2 = {2, 3, 4}

print(set1 | set2)   # union: {1, 2, 3, 4}
print(set1 & set2)   # intersection: {2, 3}
print(set1 - set2)   # difference: {1}
print(set1 ^ set2)   # symmetric: {1, 4}`,
              explanation: "Set membership test is O(1) — very fast even for large sets. Use sets when you need to check 'is this in there' often."
            },
            practice: "Given a list with duplicates, use a set to find the unique values."
          }
        },
        {
          id: "py-comprehension",
          title: "Dictionary and Set Comprehension",
          content: {
            explanation: [
              "Like list comprehension, but for dictionaries and sets.",
              "",
              "**Dictionary comprehension**: `{key: value for item in iterable}`",
              "",
              "**Set comprehension**: `{item for item in iterable}`",
              "",
              "Can add conditions: `if condition` at the end",
              "",
              "Very useful for transforming data structures."
            ],
            example: {
              title: "Comprehensions",
              code: `# List is converted to dict: number -> square
squares = {n: n**2 for n in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# From list of tuples
pairs = [('a', 1), ('b', 2)]
d = dict(pairs)
print(d)  # {'a': 1, 'b': 2}

# Set comprehension
evens = {n for n in range(10) if n % 2 == 0}
print(evens)  # {0, 2, 4, 6, 8}

# Filter existing dict
user = {'name': 'Alice', 'age': 25, 'city': 'NYC'}
short = {k: v for k, v in user.items() if len(k) > 3}
print(short)  # {'name': 'Alice', 'city': 'NYC'}`,
              explanation: "Comprehensions are efficient and readable. Use them to transform and filter data in one line."
            },
            practice: "Create a dictionary mapping numbers 1-10 to their cubes. Filter to only include those divisible by 4."
          }
        }
      ]
    },
    {
      id: "py-oop",
      title: "Object-Oriented Python",
      description: "Classes and object-oriented programming",
      duration: "80 min",
      subtopics: [
        {
          id: "py-classes",
          title: "Classes and Objects",
          content: {
            explanation: [
              "A class is a blueprint for creating objects. An object is an instance of a class.",
              "",
              "Classes have:",
              "• Attributes (data)",
              "• Methods (functions)",
              "",
              "The `__init__` method is called when creating an instance. Use `self` to refer to the instance.",
              "",
              "Create objects: `obj = ClassName(arguments)`"
            ],
            example: {
              title: "Creating a Class",
              code: `class Person:
    # __init__ is the constructor
    def __init__(self, name, age):
        self.name = name    # instance attribute
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"

# Create instances
alice = Person("Alice", 25)
bob = Person("Bob", 30)

print(alice.name)    # "Alice"
print(alice.greet())  # "Hello, I'm Alice"
print(bob.greet())   # "Hello, I'm Bob"

# Change attributes
alice.age = 26`,
              explanation: "self refers to the instance. Methods always have self as the first parameter. __init__ runs when you create a new object."
            },
            practice: "Create a Car class with make, model, and year attributes. Add a describe method."
          }
        },
        {
          id: "py-class-attributes",
          title: "Class and Instance Attributes",
          content: {
            explanation: [
              "**Instance attributes**: unique to each object, defined in __init__",
              "**Class attributes**: shared by all instances, defined directly in the class",
              "",
              "Use class attributes for:",
              "• Default values shared by all instances",
              "• Constants",
              "• Counting instances",
              "",
              "Access class attributes via instances or the class name."
            ],
            example: {
              title: "Class Attributes",
              code: `class Dog:
    species = "Canis familiaris"  # class attribute
    
    def __init__(self, name):
        self.name = name  # instance attribute

# Both dogs share the same species
buddy = Dog("Buddy")
max_dog = Dog("Max")

print(buddy.species)      # "Canis familiaris"
print(Dog.species)      # "Canis familiaris"
print(buddy.name)        # "Buddy"
print(max_dog.name)     # "Max"

# Modify class attribute
Dog.species = "Wolf"
print(buddy.species)    # "Wolf" (updated for all!)`,
              explanation: "Class attributes are shared. Changing them changes it for all instances. Use instance attributes when values should differ per object."
            },
            practice: "Add a class attribute to count how many Dog instances have been created."
          }
        },
        {
          id: "py-methods",
          title: "Methods",
          content: {
            explanation: [
              "Methods are functions inside a class. They always receive `self` as the first parameter.",
              "",
              "**Instance methods**: work with the instance (self)",
              "**Class methods**: work with the class, use @classmethod",
              "**Static methods**: independent, use @staticmethod",
              "",
              "Class and static methods don't need an instance to call."
            ],
            example: {
              title: "Types of Methods",
              code: `class Math:
    pi = 3.14159
    
    def __init__(self, value):
        self.value = value
    
    def double(self):          # instance method
        return self.value * 2
    
    @classmethod
    def circumference(radius):  # class method
        return 2 * Math.pi * radius
    
    @staticmethod
    def square(x):            # static method
        return x * x

# Instance method needs object
m = Math(5)
print(m.double())  # 10

# Class/static methods don't need object
print(Math.circumference(2))  # 12.56636
print(Math.square(4))       # 16`,
              explanation: "Use @classmethod for factory methods (create instances in different ways). Use @staticmethod for utility functions."
            },
            practice: "Add a class method that creates an instance from a string like 'name-age'."
          }
        },
        {
          id: "py-inheritance",
          title: "Inheritance",
          content: {
            explanation: [
              "Inheritance lets a class (child) inherit from another (parent). The child gets all parent attributes and methods.",
              "",
              "Syntax: `class Child(Parent):`",
              "",
              "Use inheritance for:",
              "• Code reuse",
              "• Specialization",
              "• Polymorphism",
              "",
              "The child can override (replace) parent methods."
            ],
            example: {
              title: "Inheritance",
              code: `# Parent class
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "..."

# Child class
class Dog(Animal):
    def speak(self):  # override
        return "Woof!"

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)  # call parent __init__
        self.color = color

dog = Dog("Buddy")
cat = Cat("Whiskers", "orange")

print(dog.name)     # "Buddy"
print(dog.speak()) # "Woof!"
print(cat.speak()) # "..."
print(cat.color)   # "orange"`,
              explanation: "Use super() to call parent methods. The child can add new attributes and override methods."
            },
            practice: "Create a Student class that inherits from Person. Add a student_id and override a method."
          }
        },
        {
          id: "py-polymorphism",
          title: "Polymorphism",
          content: {
            explanation: [
              "Polymorphism means 'many forms'. The same method call behaves differently depending on the object type.",
              "",
              "Python achieves polymorphism through:",
              "• Duck typing: if it walks like a duck...",
              "• Method overriding",
              "",
              "You can pass any object to a function as long as it has the required method."
            ],
            example: {
              title: "Polymorphism",
              code: `class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

class Cow:
    def speak(self): return "Moo!"

def make_speak(animal):
    print(animal.speak())

# Same function, different behaviors
make_speak(Dog())  # "Woof!"
make_speak(Cat())  # "Meow!"
make_speak(Cow()) # "Moo!"

# List of different types
animals = [Dog(), Cat(), Cow()]
for animal in animals:
    print(animal.speak())`,
              explanation: "Python uses duck typing — if an object has the method, it works. No need for interfaces or explicit type checking."
            },
            practice: "Create different classes with a common method. Use polymorphism to call that method on a list of objects."
          }
        }
      ]
    },
    {
      id: "py-exceptions",
      title: "Exception Handling",
      description: "Handle errors gracefully",
      duration: "45 min",
      subtopics: [
        {
          id: "py-try-except",
          title: "Try and Except",
          content: {
            explanation: [
              "Exceptions handle runtime errors without crashing the program.",
              "",
              "The try block contains code that might fail. The except block handles the error.",
              "",
              "Without exception handling, errors crash the program. With it, you can recover gracefully."
            ],
            example: {
              title: "Basic Exception Handling",
              code: `try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Catch multiple exceptions
try:
    num = int(input("Enter a number: "))
    result = 10 / num
except ValueError:
    print("That's not a number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")`,
              explanation: "Each except catches a specific exception type. You can have multiple except blocks."
            },
            practice: "Write a program that asks for two numbers and divides them. Handle the case where the user enters non-numbers."
          }
        },
        {
          id: "py-exception-types",
          title: "Common Exception Types",
          content: {
            explanation: [
              "Python has many built-in exception types:",
              "",
              "ValueError — wrong value (int('abc'))",
              "TypeError — wrong type (len(5))",
              "IndexError — out of bounds ([][0])",
              "KeyError — missing dict key ({})['x']",
              "FileNotFoundError — file doesn't exist",
              "",
              "Exception is the base class — catches all errors."
            ],
            example: {
              title: "Exception Types",
              code: `# Different exceptions
try:
    int("hello")  # ValueError
except ValueError:
    print("Invalid value")

try:
    [1,2][10]  # IndexError
except IndexError:
    print("Out of bounds")

try:
    {"a":1}["b"]  # KeyError
except KeyError:
    print("Key not found")

# Catch all with Exception
try:
    risky_code()
except Exception as e:
    print(f"Error: {e}")`,
              explanation: "Use Exception as e to get the error message. The 'as e' part captures the exception object."
            },
            practice: "Create a function that tries to access a list, dict, and convert to int. Handle each specific exception."
          }
        },
        {
          id: "py-else-finally",
          title: "Else and Finally",
          content: {
            explanation: [
              "else — runs if NO exception was raised",
              "finally — runs ALWAYS, whether or not an exception occurred",
              "",
              "Use else for code that should run only on success.",
              "Use finally for cleanup (closing files, releasing resources)."
            ],
            example: {
              title: "Else and Finally",
              code: `try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found")
else:
    print("File read successfully!")
    print(f"Content length: {len(content)}")
finally:
    print("This always runs")
    # if file exists, close it
    if 'file' in locals():
        file.close()

# Practical: database connection
try:
    conn = connect()
except ConnectionError:
    print("Failed to connect")
else:
    print("Connected!")
    conn.close()
finally:
    print("Cleanup complete")`,
              explanation: "finally is perfect for cleanup that must happen regardless of success or failure."
            },
            practice: "Write a function that opens a file, reads it, and uses else/finally to handle success and cleanup."
          }
        },
        {
          id: "py-raising",
          title: "Raising Exceptions",
          content: {
            explanation: [
              "Use raise to throw an exception manually.",
              "",
              "Raise built-in exceptions or create custom ones.",
              "",
              "This is useful for:",
              "• Validating input",
              "• Indicating invalid state",
              "• Debugging"
            ],
            example: {
              title: "Raising Exceptions",
              code: `# Raise built-in exception
def divide(a, b):
    if b == 0:
        raise ValueError("Divisor cannot be zero")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print(e)  # "Divisor cannot be zero"

# Custom exception
class InvalidAgeError(Exception):
    pass

def set_age(age):
    if age < 0 or age > 150:
        raise InvalidAgeError("Age must be between 0 and 150")
    return age

try:
    set_age(200)
except InvalidAgeError as e:
    print(f"Error: {e}")`,
              explanation: "raise without arguments re-raises the current exception. Useful in except blocks."
            },
            practice: "Create a function that validates a password (must be at least 8 chars). Raise ValueError if too short."
          }
        }
      ]
    },
    {
      id: "py-files",
      title: "File I/O",
      description: "Read and write files",
      duration: "40 min",
      subtopics: [
        {
          id: "py-reading-files",
          title: "Reading Files",
          content: {
            explanation: [
              "Use open() to open a file. The second parameter specifies mode:",
              "",
              "'r' — read (default)",
              "'w' — write (overwrites)",
              "'a' — append",
              "",
              "Always close files or use 'with' statement for automatic cleanup."
            ],
            example: {
              title: "Reading Files",
              code: `# Basic reading
file = open("data.txt", "r")
content = file.read()
print(content)
file.close()

# With statement (recommended)
with open("data.txt", "r") as f:
    content = f.read()
    print(content)
# File automatically closed!

# Read lines
with open("data.txt", "r") as f:
    lines = f.readlines()
    for line in lines:
        print(line.strip())

# Read line by line
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())`,
              explanation: "The 'with' statement ensures the file is closed even if an error occurs."
            },
            practice: "Create a text file and read it using all three methods: read(), readlines(), and line by line."
          }
        },
        {
          id: "py-writing-files",
          title: "Writing Files",
          content: {
            explanation: [
              "'w' mode creates a new file or overwrites existing.",
              "'a' mode appends to the end.",
              "",
              "Write methods:",
              "• write(string) — writes a string",
              "• writelines(list) — writes a list of strings"
            ],
            example: {
              title: "Writing Files",
              code: `# Write to a new file
with open("output.txt", "w") as f:
    f.write("Hello, World!\\n")
    f.write("Second line\\n")

# Append to file
with open("log.txt", "a") as f:
    f.write("New log entry\\n")

# Write multiple lines
lines = ["Line 1\\n", "Line 2\\n", "Line 3\\n"]
with open("multi.txt", "w") as f:
    f.writelines(lines)

# Practical: save data
data = ["apple", "banana", "cherry"]
with open("fruits.txt", "w") as f:
    for fruit in data:
        f.write(fruit + "\\n")`,
              explanation: "Remember to add \\n for new lines. Without it, everything goes on one line."
            },
            practice: "Write a program that creates a file with the numbers 1-10, each on a new line."
          }
        },
        {
          id: "py-csv-files",
          title: "Working with CSV",
          content: {
            explanation: [
              "CSV (Comma-Separated Values) is a common format for data.",
              "Python has a csv module for easy reading/writing.",
              "",
              "csv.reader() parses CSV rows.",
              "csv.writer() writes CSV rows."
            ],
            example: {
              title: "CSV Files",
              code: `import csv

# Reading CSV
with open("data.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # ['name', 'age']
        print(row[0])  # 'name'

# Writing CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", "25", "NYC"],
    ["Bob", "30", "LA"]
]

with open("output.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

# Reading as dicts
with open("data.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])`,
              explanation: "Use newline='' when writing CSV on Windows to avoid extra blank lines."
            },
            practice: "Create a CSV file with columns: name, score. Write 3 rows, then read and print them."
          }
        }
      ]
    },
    {
      id: "py-advanced",
      title: "Advanced Topics",
      description: "Decorators, Generators, and more",
      duration: "50 min",
      subtopics: [
        {
          id: "py-decorators",
          title: "Decorators",
          content: {
            explanation: [
              "A decorator is a function that wraps another function to add behavior.",
              "",
              "Use @decorator_name above the function definition.",
              "",
              "Common uses:",
              "• Logging",
              "• Timing functions",
              "• Authentication checks"
            ],
            example: {
              title: "Decorators",
              code: `# Basic decorator
def my_decorator(func):
    def wrapper():
        print("Before function")
        func()
        print("After function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()

# Decorator with arguments
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

print(add(3, 5))`,
              explanation: "The wrapper function receives *args and **kwargs to handle any arguments."
            },
            practice: "Create a decorator that measures how long a function takes to execute."
          }
        },
        {
          id: "py-generators",
          title: "Generators",
          content: {
            explanation: [
              "Generators create iterables one item at a time, saving memory.",
              "",
              "Use yield instead of return to create a generator.",
              "",
              "Generators are lazy — they produce values only when requested."
            ],
            example: {
              title: "Generators",
              code: `# Generator function
def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1

# Using the generator
for num in count_up_to(5):
    print(num)  # 1, 2, 3, 4, 5

# Generator expression (like list comprehension)
squares = (x**2 for x in range(5))
print(list(squares))  # [0, 1, 4, 9, 16]

# Lazy evaluation
def get_lines(file):
    for line in open(file):
        yield line.strip()

# Only reads one line at a time
lines = get_lines("bigfile.txt")
print(next(lines))  # first line
print(next(lines))  # second line`,
              explanation: "Generators are great for large datasets or infinite sequences because they don't load everything into memory."
            },
            practice: "Create a generator that yields Fibonacci numbers. Use it to get first 10 numbers."
          }
        },
        {
          id: "py-context-managers",
          title: "Context Managers",
          content: {
            explanation: [
              "Context managers handle setup and teardown (like opening/closing files).",
              "",
              "Use 'with' statement for automatic cleanup.",
              "",
              "You can create custom context managers with a class or generator."
            ],
            example: {
              title: "Context Managers",
              code: `# Built-in: files
with open("file.txt", "r") as f:
    content = f.read()
# File automatically closed here

# Custom context manager (class)
class Timer:
    def __enter__(self):
        self.start = time.time()
    
    def __exit__(self, *args):
        self.end = time.time()
        print(f"Took {self.end - self.start:.2f}s")

with Timer():
    # do something slow
    sum(range(1000000))

# Custom context manager (function)
from contextlib import contextmanager

@contextmanager
def my_context():
    print("Setup")
    yield  # code runs here
    print("Cleanup")

with my_context():
    print("Inside context")`,
              explanation: "__enter__ runs when entering 'with', __exit__ runs when leaving. Use @contextmanager for simpler syntax."
            },
            practice: "Create a context manager that temporarily changes a value and restores it on exit."
          }
        },
        {
          id: "py-dataclasses",
          title: "Dataclasses",
          content: {
            explanation: [
              "Dataclasses are a simple way to create classes that mainly store data.",
              "",
              "Use @dataclass decorator from dataclasses module.",
              "",
              "Automatically generates __init__, __repr__, __eq__."
            ],
            example: {
              title: "Dataclasses",
              code: `from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    city: str = "Unknown"  # default value

# Create instances
p1 = Person("Alice", 25)
p2 = Person("Bob", 30, "NYC")

print(p1)  # Person(name='Alice', age=25, city='Unknown')

# Compare
print(p1 == p2)  # False (if name/age/city differ)

# Mutable default danger
from dataclasses import field

@dataclass
class Team:
    name: str
    members: list = field(default_factory=list)

team = Team("A", ["Alice"])
team.members.append("Bob")
print(team.members)  # ['Alice', 'Bob']`,
              explanation: "Use field(default_factory=list) for mutable defaults like lists and dicts."
            },
            practice: "Create a dataclass for a Product with name, price, and quantity. Add a method to calculate total value."
          }
        }
      ]
    }
  ]
};
