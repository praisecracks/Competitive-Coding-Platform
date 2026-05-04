import { LearningTrack } from "../data";

export const masterGo: LearningTrack = {
  id: "master-go",
  title: "Master Go",
  subtitle: "Beginner to Advanced",
  description: "Build efficient backend systems with Go",
  type: "master_track",
  icon: "Code2",
  color: "cyan",
  coverImage:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
  totalHours: 33,
  language: "go",
  category: "Go",
  topics: [
    {
      id: "go-intro",
      title: "Introduction to Go",
      description: "What is Go and why it matters",
      duration: "30 min",
      subtopics: [
        {
          id: "go-what-is",
          title: "What is Go?",
          content: {
            explanation: [
              "Go (also called Golang) is a statically typed, compiled programming language designed at Google.",
              "It combines the efficiency and safety of a statically typed language with the ease of programming of a dynamic language.",
              "Go was created to solve problems at Google: slow builds, uncontrolled dependencies, and difficulty deploying large systems.",
              "Key features: built-in concurrency (goroutines & channels), fast compilation, garbage collection, and a rich standard library."
            ],
            example: {
              title: "Hello, World!",
              code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}`,
              explanation:
                "Every Go program starts with a package declaration. 'package main' creates an executable. 'import' brings in packages. 'func main()' is the entry point."
            },
            practice:
              "Create a simple Hello World program and run it using 'go run'."
          },
        },
        {
          id: "go-why",
          title: "Why Go for Backend & Cloud?",
          content: {
            explanation: [
              "Go is widely used for backend services, cloud infrastructure, and CLI tools.",
              "Companies using Go: Google, Uber, Dropbox, Docker, Kubernetes, and many more.",
              "Advantages:",
              "- Concurrency built-in (goroutines are lightweight)",
              "- Fast execution (compiles to machine code)",
              "- Excellent standard library (HTTP server, crypto, JSON, etc.)",
              "- Simple deployment (single binary)",
              "- Fast compilation",
              "- Garbage collected"
            ],
            example: {
              title: "Simple HTTP Server",
              code: `package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, Go backend!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`,
              explanation:
                "This shows a minimal HTTP server using only the standard library – no external dependencies needed."
            },
            practice:
              "Run the HTTP server and test it with curl or your browser."
          },
        },
        {
          id: "go-setup",
          title: "Installing Go and Setting Up",
          content: {
            explanation: [
              "Install Go from https://go.dev/dl/ for your operating system.",
              "After installation, verify it works by running: go version",
              "Set up your workspace: Go uses a workspace (GOPATH) or modules. Modern Go uses modules.",
              "Create a new module: go mod init <module-name>",
              "Run a Go file: go run filename.go",
              "Build a binary: go build -o myprogram"
            ],
            example: {
              title: "Go Commands",
              code: `# Initialize a new module
mkdir myproject
cd myproject
go mod init github.com/yourname/myproject

# Run a file
go run main.go

# Build an executable
go build -o myapp main.go

# Run tests
go test ./...

# Format code
go fmt ./...`,
              explanation:
                "These are the essential Go commands you'll use daily."
            },
            practice:
              "Install Go, create a new module, and run a Hello World program."
          },
        },
      ],
    },
    {
      id: "go-basics",
      title: "Go Fundamentals",
      description: "Variables, types, and control flow",
      duration: "90 min",
      subtopics: [
        {
          id: "go-variables",
          title: "Variables and Constants",
          content: {
            explanation: [
              "Go has several ways to create variables:",
              "1. var name type = value (full form)",
              "2. var name = value (type inference)",
              "3. name := value (short declaration, only inside functions)",
              "Constants use the 'const' keyword and cannot change.",
              "Multiple variables can be declared in a block."
            ],
            example: {
              title: "Variable Declarations",
              code: `package main

import "fmt"

func main() {
    // Explicit type
    var age int = 30
    
    // Type inference
    var name = "Alice"
    
    // Short declaration (most common)
    city := "New York"
    score := 95.5
    
    // Multiple variables
    var x, y int = 10, 20
    a, b := "hello", true
    
    // Constants
    const pi = 3.14159
    const (
        statusOK = 200
        statusNotFound = 404
    )
    
    fmt.Println(name, age, city, score)
    fmt.Println(x, y, a, b)
    fmt.Println(pi, statusOK)
}`,
              explanation:
                "This demonstrates all the ways to declare variables in Go. The short declaration ':=' is used most often inside functions."
            },
            practice:
              "Declare variables for your name, age, and city using different forms. Print them all."
          },
        },
        {
          id: "go-types",
          title: "Basic Data Types",
          content: {
            explanation: [
              "Go is statically typed – each variable has a fixed type.",
              "Basic types include:",
              "- bool: true or false",
              "- string: sequence of characters",
              "- int, int8, int16, int32, int64: signed integers",
              "- uint, uint8, uint16, uint32, uint64: unsigned integers",
              "- float32, float64: floating-point numbers",
              "- byte (alias for uint8)",
              "- rune (alias for int32, represents a Unicode code point)"
            ],
            example: {
              title: "Working with Types",
              code: `package main

import "fmt"

func main() {
    var flag bool = true
    var name string = "Go"
    var count int = 42
    var price float64 = 19.99
    var letter byte = 'A'
    var symbol rune = 'π'
    
    fmt.Printf("bool: %t\\n", flag)
    fmt.Printf("string: %s\\n", name)
    fmt.Printf("int: %d\\n", count)
    fmt.Printf("float: %.2f\\n", price)
    fmt.Printf("byte: %c\\n", letter)
    fmt.Printf("rune: %c\\n", symbol)
}`,
              explanation:
                "Go has explicit types. Use fmt.Printf with format verbs (%s for string, %d for int, etc.) to print values."
            },
            practice:
              "Create variables of each basic type and print them with their types using %T."
          },
        },
        {
          id: "go-control-flow",
          title: "Control Flow: if, for, switch",
          content: {
            explanation: [
              "Go has a clean control flow syntax:",
              "- if statements: no parentheses needed, braces are mandatory",
              "- for loops: Go has only 'for' (no while or do-while)",
              "- switch: more powerful than C-style switches",
              "Note: There is no ternary operator in Go."
            ],
            example: {
              title: "Control Flow Examples",
              code: `package main

import "fmt"

func main() {
    // If statement
    age := 18
    if age >= 18 {
        fmt.Println("Adult")
    } else {
        fmt.Println("Minor")
    }
    
    // If with short statement
    if score := 85; score >= 90 {
        fmt.Println("A")
    } else if score >= 80 {
        fmt.Println("B")
    }
    
    // For loop (traditional)
    for i := 0; i < 5; i++ {
        fmt.Print(i, " ")
    }
    fmt.Println()
    
    // For as while
    count := 0
    for count < 3 {
        fmt.Print(count, " ")
        count++
    }
    fmt.Println()
    
    // Infinite loop with break
    x := 0
    for {
        if x >= 3 {
            break
        }
        fmt.Print(x, " ")
        x++
    }
    fmt.Println()
    
    // Switch
    day := "Monday"
    switch day {
    case "Monday", "Tuesday":
        fmt.Println("Start of week")
    case "Friday":
        fmt.Println("TGIF")
    default:
        fmt.Println("Midweek")
    }
}`,
              explanation:
                "Go's control flow is straightforward. Note that switch cases don't fall through by default."
            },
            practice:
              "Write a for loop that sums numbers from 1 to 10. Write an if statement that checks if a number is even."
          },
        },
      ],
    },
    {
      id: "go-functions",
      title: "Functions",
      description: "Create reusable functions",
      duration: "80 min",
      subtopics: [
        {
          id: "go-func-basics",
          title: "Function Basics",
          content: {
            explanation: [
              "Functions are declared with 'func', followed by parameters, return type, and body.",
              "Parameters are passed by value (copy).",
              "Multiple parameters of the same type can share a type declaration.",
              "Go supports named return values."
            ],
            example: {
              title: "Basic Functions",
              code: `package main

import "fmt"

// Simple function
func greet(name string) string {
    return "Hello, " + name
}

// Multiple parameters
func add(a, b int) int {
    return a + b
}

// Named return value
func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = fmt.Errorf("division by zero")
        return
    }
    result = a / b
    return
}

func main() {
    fmt.Println(greet("Alice"))
    fmt.Println(add(5, 3))
    
    res, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", res)
    }
}`,
              explanation:
                "Functions can have named return values, which are initialized to zero values and can be returned without explicitly mentioning them."
            },
            practice:
              "Create a function that takes a temperature in Celsius and returns Fahrenheit."
          },
        },
        {
          id: "go-func-multiple",
          title: "Multiple Return Values",
          content: {
            explanation: [
              "Go functions can return any number of values.",
              "This is commonly used to return a result and an error.",
              "Use underscore '_' to ignore a return value you don't need.",
              "Multiple returns eliminate the need for out parameters."
            ],
            example: {
              title: "Multiple Returns",
              code: `package main

import "fmt"

// Return quotient and remainder
func divideWithRemainder(a, b int) (int, int, error) {
    if b == 0 {
        return 0, 0, fmt.Errorf("division by zero")
    }
    return a / b, a % b, nil
}

// Function returning multiple values
func getStats(scores []int) (min, max, sum int) {
    if len(scores) == 0 {
        return 0, 0, 0
    }
    min = scores[0]
    max = scores[0]
    for _, v := range scores {
        if v < min {
            min = v
        }
        if v > max {
            max = v
        }
        sum += v
    }
    return
}

func main() {
    // Using multiple return values
    quotient, remainder, err := divideWithRemainder(17, 5)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Printf("17/5 = %d remainder %d\\n", quotient, remainder)
    }
    
    // Ignoring a return value
    _, max, _ := getStats([]int{5, 2, 8, 1, 9})
    fmt.Println("Max:", max)
}`,
              explanation:
                "Multiple return values are idiomatic in Go. Use them to return both computed values and errors."
            },
            practice:
              "Create a function that returns both the minimum and maximum of a slice of integers."
          },
        },
        {
          id: "go-func-variadic",
          title: "Variadic Functions",
          content: {
            explanation: [
              "A variadic function accepts an indefinite number of arguments.",
              "Use '...Type' as the last parameter.",
              "Inside the function, the parameter becomes a slice.",
              "You can also pass a slice with the ... suffix."
            ],
            example: {
              title: "Variadic Functions",
              code: `package main

import "fmt"

// Variadic sum function
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

// Mixed parameters: regular before variadic
func printWithPrefix(prefix string, values ...string) {
    for _, v := range values {
        fmt.Println(prefix, v)
    }
}

func main() {
    fmt.Println(sum(1, 2, 3))       // 6
    fmt.Println(sum(1, 2, 3, 4, 5)) // 15
    
    // Passing a slice as variadic arguments
    numbers := []int{10, 20, 30}
    fmt.Println(sum(numbers...)) // Spread the slice
    
    printWithPrefix("Item:", "apple", "banana", "cherry")
}`,
              explanation:
                "Variadic functions are great when you don't know how many arguments you'll receive. The ... unpacks a slice."
            },
            practice:
              "Create a variadic function that finds the maximum number from its arguments."
          },
        },
        {
          id: "go-func-defer",
          title: "Defer Statements",
          content: {
            explanation: [
              "'defer' postpones a function call until the surrounding function returns.",
              "Deferred calls are executed in LIFO (last-in-first-out) order.",
              "Useful for cleanup operations (closing files, unlocking mutexes).",
              "Arguments to deferred functions are evaluated immediately, but the call is delayed."
            ],
            example: {
              title: "Using Defer",
              code: `package main

import "fmt"

func cleanup() {
    fmt.Println("Cleanup done")
}

func process() {
    defer cleanup()
    fmt.Println("Processing...")
    // cleanup will run even if this function panics
}

func main() {
    process()
    
    // Multiple defers (LIFO order)
    defer fmt.Println("First defer")
    defer fmt.Println("Second defer")
    defer fmt.Println("Third defer")
    fmt.Println("Main function")
    
    // Practical: using defer with a file
    simulateFileOperation()
}

func simulateFileOperation() {
    // In real code you'd open a file
    fmt.Println("Opening file")
    defer fmt.Println("Closing file") // Will run at function end
    fmt.Println("Reading file content")
}`,
              explanation:
                "Defer is perfect for ensuring resources are released, even if errors occur."
            },
            practice:
              "Write a function that uses defer to print 'Entering' and 'Exiting' around its logic."
          },
        },
      ],
    },
    {
      id: "go-collections",
      title: "Arrays, Slices, and Maps",
      description: "Working with collections",
      duration: "90 min",
      subtopics: [
        {
          id: "go-arrays",
          title: "Arrays",
          content: {
            explanation: [
              "An array has a fixed size that is part of its type: [5]int and [10]int are different types.",
              "Arrays are value types – copying an array copies all elements.",
              "Arrays are rarely used directly; slices are more common.",
              "Access elements with index (0-based)."
            ],
            example: {
              title: "Working with Arrays",
              code: `package main

import "fmt"

func main() {
    // Declare and initialize
    var numbers [5]int
    numbers[0] = 10
    numbers[1] = 20
    
    // Array literal
    fruits := [3]string{"apple", "banana", "cherry"}
    
    // Let compiler count elements
    primes := [...]int{2, 3, 5, 7, 11}
    
    fmt.Println(numbers) // [10 20 0 0 0]
    fmt.Println(fruits[1]) // banana
    fmt.Println(primes) // [2 3 5 7 11]
    fmt.Println("Length:", len(primes))
    
    // Iterating
    for i, v := range primes {
        fmt.Printf("primes[%d] = %d\\n", i, v)
    }
}`,
              explanation:
                "Arrays have fixed length. Use the index or range to iterate. [3]string is a different type from [4]string."
            },
            practice:
              "Create an array of 5 integers, set each value to its index squared, and print the array."
          },
        },
        {
          id: "go-slices",
          title: "Slices",
          content: {
            explanation: [
              "Slices are dynamically-sized, flexible views into arrays.",
              "A slice has three components: pointer to underlying array, length, and capacity.",
              "Create slices with make() or slice literals.",
              "Appending beyond capacity creates a new underlying array."
            ],
            example: {
              title: "Slice Operations",
              code: `package main

import "fmt"

func main() {
    // Slice literal
    fruits := []string{"apple", "banana", "cherry"}
    
    // Make with length and capacity
    numbers := make([]int, 3, 5) // len=3, cap=5
    numbers[0] = 1
    numbers[1] = 2
    numbers[2] = 3
    
    // Append
    fruits = append(fruits, "date", "elderberry")
    numbers = append(numbers, 4, 5, 6) // May reallocate
    
    // Slicing
    slice1 := fruits[1:3]    // ["banana", "cherry"]
    slice2 := fruits[:2]     // ["apple", "banana"]
    slice3 := fruits[2:]     // ["cherry", "date", "elderberry"]
    
    fmt.Println("Fruits:", fruits)
    fmt.Println("Numbers:", numbers)
    fmt.Println("Slice1:", slice1)
    fmt.Println("Length:", len(numbers), "Capacity:", cap(numbers))
    
    // Copy slices
    dest := make([]string, 2)
    copy(dest, fruits)
    fmt.Println("Copied:", dest)
}`,
              explanation:
                "Slices are used far more often than arrays. Append returns a new slice, so always assign the result."
            },
            practice:
              "Create a slice of integers, append 5 numbers, then create a subslice and modify it. Observe how it affects the original."
          },
        },
        {
          id: "go-maps",
          title: "Maps",
          content: {
            explanation: [
              "A map is an unordered collection of key-value pairs.",
              "Keys must be comparable types (not slices, maps, or functions).",
              "Create maps with make() or map literals.",
              "Accessing a missing key returns the zero value, not an error."
            ],
            example: {
              title: "Map Operations",
              code: `package main

import "fmt"

func main() {
    // Map literal
    ages := map[string]int{
        "Alice": 30,
        "Bob":   25,
    }
    
    // Make
    scores := make(map[string]int)
    scores["Alice"] = 95
    scores["Bob"] = 87
    
    // Add/update
    ages["Charlie"] = 35
    
    // Check if key exists
    value, exists := ages["Alice"]
    if exists {
        fmt.Println("Alice's age:", value)
    }
    
    // Delete
    delete(ages, "Bob")
    
    // Iterate
    for name, age := range ages {
        fmt.Printf("%s is %d years old\\n", name, age)
    }
    
    // Length
    fmt.Println("Number of entries:", len(ages))
}`,
              explanation:
                "Maps are reference types. Use the comma-ok idiom to check if a key exists before using its value."
            },
            practice:
              "Create a map of string to int for stock prices. Add, update, delete, and iterate over the map."
          },
        },
        {
          id: "go-range",
          title: "Range Keyword",
          content: {
            explanation: [
              "The 'range' keyword iterates over slices, arrays, maps, strings, and channels.",
              "For slices/arrays: returns index and value.",
              "For maps: returns key and value.",
              "For strings: returns index and rune (Unicode code point).",
              "Use underscore '_' to ignore the index or key."
            ],
            example: {
              title: "Using Range",
              code: `package main

import "fmt"

func main() {
    // Slice
    nums := []int{10, 20, 30}
    for i, v := range nums {
        fmt.Printf("Index %d: %d\\n", i, v)
    }
    
    // Map
    ages := map[string]int{"Alice": 30, "Bob": 25}
    for name, age := range ages {
        fmt.Printf("%s is %d\\n", name, age)
    }
    
    // String (iterates over runes)
    text := "Hello, 世界"
    for i, r := range text {
        fmt.Printf("Position %d: %c (U+%X)\\n", i, r, r)
    }
    
    // Ignoring index
    for _, v := range nums {
        fmt.Println("Value:", v)
    }
}`,
              explanation:
                "Range works on many types. For strings, it correctly handles Unicode characters (runes), not just bytes."
            },
            practice:
              "Use range to sum all numbers in a slice and to print all keys and values in a map."
          },
        },
      ],
    },
    {
      id: "go-structs",
      title: "Structs and Methods",
      description: "Creating custom types",
      duration: "75 min",
      subtopics: [
        {
          id: "go-structs-basics",
          title: "Structs",
          content: {
            explanation: [
              "Structs are collections of fields, similar to classes in OOP languages.",
              "Fields have names and types.",
              "Structs are value types (copied when assigned or passed).",
              "Use pointers when you need to modify the original."
            ],
            example: {
              title: "Defining Structs",
              code: `package main

import "fmt"

// Define a struct
type Person struct {
    Name string
    Age  int
    Email string
}

// Struct with fields of different types
type Rectangle struct {
    Width, Height float64
}

func main() {
    // Create instances
    alice := Person{
        Name:  "Alice",
        Age:   30,
        Email: "alice@example.com",
    }
    
    // Positional (order matters, not recommended)
    bob := Person{"Bob", 25, "bob@example.com"}
    
    // Zero value initialization
    var charlie Person
    charlie.Name = "Charlie"
    charlie.Age = 35
    
    // Access fields
    fmt.Println(alice.Name)
    fmt.Println(bob.Email)
    
    // Anonymous struct
    point := struct {
        X, Y int
    }{10, 20}
    fmt.Println(point)
    
    // Struct copy
    aliceCopy := alice
    aliceCopy.Age = 31
    fmt.Println(alice.Age) // Still 30 (different copy)
}`,
              explanation:
                "Structs group related data. Use field names for clarity. Structs are copied by default, not referenced."
            },
            practice:
              "Define a Book struct with title, author, and year. Create and print instances."
          },
        },
        {
          id: "go-methods",
          title: "Methods",
          content: {
            explanation: [
              "Methods are functions attached to structs (or any type).",
              "A method has a receiver parameter between 'func' and the method name.",
              "Use pointer receivers to modify the struct.",
              "Value receivers work on a copy (cannot modify original).",
              "Go automatically takes address or dereferences when calling methods."
            ],
            example: {
              title: "Methods with Receivers",
              code: `package main

import "fmt"

type Counter struct {
    value int
}

// Value receiver (cannot modify)
func (c Counter) Value() int {
    return c.value
}

// Pointer receiver (can modify)
func (c *Counter) Increment(amount int) {
    c.value += amount
}

func (c *Counter) Reset() {
    c.value = 0
}

type Rectangle struct {
    Width, Height float64
}

// Value receiver for read-only
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Pointer receiver for modification
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

func main() {
    counter := Counter{}
    counter.Increment(5)
    counter.Increment(3)
    fmt.Println("Count:", counter.Value())
    
    rect := Rectangle{Width: 10, Height: 5}
    fmt.Println("Area:", rect.Area())
    rect.Scale(2)
    fmt.Printf("Scaled: %.1f x %.1f\\n", rect.Width, rect.Height)
}`,
              explanation:
                "Choose pointer receivers when the method needs to modify the receiver or for large structs to avoid copying."
            },
            practice:
              "Create a BankAccount struct with methods to deposit, withdraw, and check balance."
          },
        },
        {
          id: "go-embedding",
          title: "Composition (Embedding)",
          content: {
            explanation: [
              "Go uses composition instead of inheritance.",
              "Embed a struct by including it as a field without a name.",
              "The embedded type's fields and methods are promoted to the outer struct.",
              "You can override promoted methods."
            ],
            example: {
              title: "Struct Embedding",
              code: `package main

import "fmt"

type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return "?"
}

type Dog struct {
    Animal  // Embedding
    Breed string
}

func (d Dog) Speak() string {
    return "Woof!"
}

type Car struct {
    Make  string
    Model string
}

type ElectricCar struct {
    Car           // Embedding
    BatteryRange int
}

func main() {
    dog := Dog{
        Animal: Animal{Name: "Buddy"},
        Breed:  "Golden Retriever",
    }
    
    // Access promoted field
    fmt.Println(dog.Name)  // From Animal
    
    // Overridden method
    fmt.Println(dog.Speak())
    
    // Access embedded field explicitly
    fmt.Println(dog.Animal.Speak()) // Original method
    
    ec := ElectricCar{
        Car: Car{Make: "Tesla", Model: "Model 3"},
        BatteryRange: 350,
    }
    
    fmt.Printf("%s %s, Range: %d miles\\n", ec.Make, ec.Model, ec.BatteryRange)
}`,
              explanation:
                "Embedding provides a way to reuse structs without inheritance. The outer struct can override methods of the embedded type."
            },
            practice:
              "Create a base User struct and embed it in AdminUser and RegularUser structs."
          },
        },
      ],
    },
    {
      id: "go-interfaces",
      title: "Interfaces",
      description: "Defining behavior",
      duration: "60 min",
      subtopics: [
        {
          id: "go-interfaces-basics",
          title: "Interfaces",
          content: {
            explanation: [
              "An interface defines a set of method signatures.",
              "Types implicitly implement an interface by implementing all its methods.",
              "This is duck typing: 'If it walks like a duck and quacks like a duck, it's a duck.'",
              "Interfaces are satisfied implicitly – no 'implements' keyword needed."
            ],
            example: {
              title: "Interface Basics",
              code: `package main

import "fmt"

type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof! I'm " + d.Name
}

type Cat struct {
    Name string
}

func (c Cat) Speak() string {
    return "Meow! I'm " + c.Name
}

type Robot struct {
    Model string
}

func (r Robot) Speak() string {
    return "Beep boop. I'm " + r.Model
}

func MakeSound(s Speaker) {
    fmt.Println(s.Speak())
}

func main() {
    dog := Dog{Name: "Buddy"}
    cat := Cat{Name: "Whiskers"}
    robot := Robot{Model: "R2D2"}
    
    // All implement Speaker automatically
    MakeSound(dog)
    MakeSound(cat)
    MakeSound(robot)
    
    // Interface as a value
    var speaker Speaker
    speaker = dog
    fmt.Println(speaker.Speak())
}`,
              explanation:
                "Any type with a Speak() method automatically satisfies the Speaker interface. No explicit declaration needed."
            },
            practice:
              "Define an interface Shape with Area() method. Make Circle and Rectangle structs implement it."
          },
        },
        {
          id: "go-empty-interface",
          title: "Empty Interface",
          content: {
            explanation: [
              "The empty interface 'interface{}' (or 'any' in Go 1.18+) can hold values of any type.",
              "Useful when you need to handle unknown types (like JSON unmarshaling).",
              "To use a value from an empty interface, you need a type assertion or type switch.",
              "Avoid overusing empty interfaces – they bypass type safety."
            ],
            example: {
              title: "Empty Interface and Type Assertions",
              code: `package main

import "fmt"

func PrintAnything(v interface{}) {
    fmt.Printf("Value: %v, Type: %T\\n", v, v)
}

func main() {
    PrintAnything(42)
    PrintAnything("hello")
    PrintAnything(3.14)
    PrintAnything(true)
    
    // Type assertion
    var value interface{} = "Go Programming"
    
    // Safe type assertion
    s, ok := value.(string)
    if ok {
        fmt.Println("String length:", len(s))
    }
    
    // Type switch
    func(i interface{}) {
        switch v := i.(type) {
        case int:
            fmt.Println("Integer:", v)
        case string:
            fmt.Println("String:", v)
        case bool:
            fmt.Println("Boolean:", v)
        default:
            fmt.Println("Unknown type")
        }
    }(42)
}`,
              explanation:
                "Empty interface allows any type. Use type assertions or type switches to extract the underlying value."
            },
            practice:
              "Write a function that accepts an empty interface and prints whether it's an int, string, or bool."
          },
        },
      ],
    },
    {
      id: "go-pointers",
      title: "Pointers",
      description: "Working with memory addresses",
      duration: "60 min",
      subtopics: [
        {
          id: "go-pointers-basics",
          title: "Pointer Basics",
          content: {
            explanation: [
              "A pointer holds the memory address of a variable.",
              "Use '&' to get the address of a variable.",
              "Use '*' to dereference a pointer (get the value at the address).",
              "The zero value of a pointer is nil.",
              "Pointers allow functions to modify variables outside their scope."
            ],
            example: {
              title: "Pointer Fundamentals",
              code: `package main

import "fmt"

func main() {
    x := 42
    
    // Get pointer to x
    p := &x
    
    fmt.Println("Value of x:", x)
    fmt.Println("Address of x:", p)
    fmt.Println("Value at address p:", *p)
    
    // Modify through pointer
    *p = 100
    fmt.Println("x after modification:", x)
    
    // Pointer to nil
    var ptr *int
    if ptr == nil {
        fmt.Println("ptr is nil")
    }
    
    // New function creates a pointer to zero value
    q := new(int)
    *q = 50
    fmt.Println("new int:", *q)
}`,
              explanation:
                "Pointers let you indirectly access and modify variables. Always check for nil before dereferencing."
            },
            practice:
              "Create a variable, a pointer to it, then change the original value through the pointer."
          },
        },
        {
          id: "go-pointers-functions",
          title: "Pointers with Functions",
          content: {
            explanation: [
              "Pass pointers to functions to modify the original value.",
              "Without pointers, the function gets a copy (pass by value).",
              "Use pointers for large structs to avoid copying overhead.",
              "Slices and maps are reference types – they already point to underlying data."
            ],
            example: {
              title: "Pointer Parameters",
              code: `package main

import "fmt"

// Value parameter – gets a copy
func updateValue(x int) {
    x = 100
}

// Pointer parameter – can modify original
func updatePointer(x *int) {
    *x = 100
}

type Person struct {
    Name string
    Age  int
}

// Value receiver – modifies a copy
func (p Person) birthday() {
    p.Age++
}

// Pointer receiver – modifies original
func (p *Person) birthdayPtr() {
    p.Age++
}

func main() {
    num := 10
    updateValue(num)
    fmt.Println("After updateValue:", num) // Still 10
    
    updatePointer(&num)
    fmt.Println("After updatePointer:", num) // Now 100
    
    alice := Person{Name: "Alice", Age: 30}
    alice.birthday()
    fmt.Println("After birthday:", alice.Age) // Still 30
    
    (&alice).birthdayPtr()
    fmt.Println("After birthdayPtr:", alice.Age) // Now 31
}`,
              explanation:
                "Use pointers when you need to modify the original value or avoid copying large data structures."
            },
            practice:
              "Write a function that swaps two integers using pointers."
          },
        },
      ],
    },
    {
      id: "go-error-handling",
      title: "Error Handling",
      description: "Idiomatic error management",
      duration: "60 min",
      subtopics: [
        {
          id: "go-errors-basics",
          title: "Error Basics",
          content: {
            explanation: [
              "Go uses explicit error returns instead of exceptions.",
              "The error type is a built-in interface with one method: Error() string.",
              "Convention: return error as the last return value.",
              "Always check errors – don't ignore them.",
              "Use nil to indicate no error."
            ],
            example: {
              title: "Basic Error Handling",
              code: `package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func sqrt(x float64) (float64, error) {
    if x < 0 {
        return 0, fmt.Errorf("cannot take sqrt of negative number: %f", x)
    }
    // Simplified sqrt calculation
    return x * x, nil
}

func main() {
    // Always check errors
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
    
    // Handle error case
    result, err = divide(10, 0)
    if err != nil {
        fmt.Println("Error occurred:", err)
        // Handle gracefully
        result = 0
    }
    fmt.Println("Safe result:", result)
    
    // Multiple operations
    val, err := sqrt(-5)
    if err != nil {
        fmt.Println("Failed:", err)
        return
    }
    fmt.Println(val)
}`,
              explanation:
                "Check errors immediately after function calls. This creates clear, linear error handling paths."
            },
            practice:
              "Create a function that validates an email address and returns an error if invalid."
          },
        },
        {
          id: "go-custom-errors",
          title: "Custom Error Types",
          content: {
            explanation: [
              "Create custom error types for more context and better error handling.",
              "Implement the error interface (Error() string method).",
              "Use errors.Is() and errors.As() to check error types.",
              "Wrap errors with fmt.Errorf and %w to preserve error chains."
            ],
            example: {
              title: "Custom Errors",
              code: `package main

import (
    "errors"
    "fmt"
)

// Custom error type
type ValidationError struct {
    Field   string
    Value   interface{}
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation failed for %s (value: %v): %s", e.Field, e.Value, e.Message)
}

// Another custom error
type NotFoundError struct {
    Resource string
    ID       int
}

func (e NotFoundError) Error() string {
    return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}

// Function that returns custom errors
func findUser(id int) (string, error) {
    if id <= 0 {
        return "", ValidationError{
            Field:   "id",
            Value:   id,
            Message: "ID must be positive",
        }
    }
    
    if id != 42 {
        return "", NotFoundError{
            Resource: "User",
            ID:       id,
        }
    }
    
    return "Alice", nil
}

func main() {
    _, err := findUser(-1)
    if err != nil {
        // Type assertion to check custom error
        if valErr, ok := err.(ValidationError); ok {
            fmt.Printf("Validation error in field '%s': %s\\n", valErr.Field, valErr.Message)
        }
        fmt.Println(err)
    }
    
    _, err = findUser(100)
    if errors.Is(err, NotFoundError{}) {
        fmt.Println("Resource not found")
    }
    
    // Wrapping errors
    func() {
        err := fmt.Errorf("operation failed: %w", ValidationError{Field: "email", Message: "invalid format"})
        if errors.Is(err, ValidationError{}) {
            fmt.Println("Contains validation error")
        }
    }()
}`,
              explanation:
                "Custom errors provide structured information. Use errors.Is and errors.As for proper error inspection."
            },
            practice:
              "Create a custom error type for authentication failures and use it in a login function."
          },
        },
      ],
    },
    {
      id: "go-packages",
      title: "Packages and Modules",
      description: "Organizing Go code",
      duration: "50 min",
      subtopics: [
        {
          id: "go-packages-basics",
          title: "Packages",
          content: {
            explanation: [
              "Every Go file belongs to a package.",
              "Package 'main' creates an executable. Other packages are reusable libraries.",
              "Imported packages are accessed with dot notation: package.Function().",
              "Unexported names (lowercase) are private to the package.",
              "Exported names (uppercase) are public and visible to other packages."
            ],
            example: {
              title: "Package Structure",
              code: `// File: main.go
package main

import (
    "fmt"
    "github.com/yourname/mymath"
)

func main() {
    // Exported function from mymath package
    sum := mymath.Add(10, 20)
    fmt.Println("Sum:", sum)
    
    // exported constant
    fmt.Println("PI:", mymath.Pi)
    
    // Cannot access unexported functions
    // mymath.privateHelper() // This would cause compilation error
}

// File: mymath/math.go
package mymath

// Exported constant
const Pi = 3.14159

// Exported function
func Add(a, b int) int {
    return a + b
}

// Unexported function (private to package)
func privateHelper() {
    // internal logic
}`,
              explanation:
                "Capitalize names to export them. Keep packages focused and reusable."
            },
            practice:
              "Create a new package called 'stringsutil' with an exported function Reverse(s string) string."
          },
        },
        {
          id: "go-modules",
          title: "Go Modules",
          content: {
            explanation: [
              "Go modules are the official dependency management system.",
              "Initialize a module with 'go mod init <module-name>'.",
              "Add dependencies with 'go get <package>'.",
              "Update dependencies with 'go get -u'.",
              "'go mod tidy' removes unused dependencies and adds missing ones.",
              "The go.mod file tracks module requirements, go.sum verifies integrity."
            ],
            example: {
              title: "Module Commands",
              code: `# Create a new module
go mod init github.com/username/myproject

# Add a dependency
go get github.com/gorilla/mux

# Upgrade all dependencies
go get -u ./...

# Remove unused dependencies
go mod tidy

# Download all dependencies
go mod download

# Verify dependencies
go mod verify

# Example go.mod file after commands:
module github.com/username/myproject

go 1.21

require (
    github.com/gorilla/mux v1.8.0
    github.com/stretchr/testify v1.8.4
)

// Using a dependency in code:
import "github.com/gorilla/mux"

func setupRouter() *mux.Router {
    r := mux.NewRouter()
    r.HandleFunc("/", homeHandler)
    return r
}`,
              explanation:
                "Always use modules for new Go projects. They are the standard way to manage dependencies."
            },
            practice:
              "Initialize a new module, add a third-party dependency, and use it in a simple program."
          },
        },
      ],
    },
    {
      id: "go-testing",
      title: "Testing",
      description: "Writing and running tests",
      duration: "55 min",
      subtopics: [
        {
          id: "go-test-basics",
          title: "Basic Testing",
          content: {
            explanation: [
              "Test files end with '_test.go' and are in the same package.",
              "Test functions start with 'Test' and take a single *testing.T parameter.",
              "Use t.Error or t.Errorf to report failures, t.Fatal to stop the test immediately.",
              "Run tests with 'go test', get verbose output with 'go test -v'."
            ],
            example: {
              title: "Writing Tests",
              code: `// File: math.go
package math

func Add(a, b int) int {
    return a + b
}

func Divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// File: math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2,3) = %d, want 5", result)
    }
}

func TestDivide(t *testing.T) {
    result, err := Divide(10, 2)
    if err != nil {
        t.Fatal("Unexpected error:", err)
    }
    if result != 5 {
        t.Errorf("Divide(10,2) = %d, want 5", result)
    }
    
    // Test error case
    _, err = Divide(10, 0)
    if err == nil {
        t.Error("Expected error for division by zero")
    }
}

// Run with:
// go test
// go test -v
// go test -run TestAdd  (run specific test)`,
              explanation:
                "Test files are compiled only during testing. Place them alongside the code they test."
            },
            practice:
              "Write tests for a function that reverses a string. Include edge cases."
          },
        },
        {
          id: "go-table-tests",
          title: "Table-Driven Tests",
          content: {
            explanation: [
              "Table-driven tests use a slice of test cases.",
              "Each test case defines inputs and expected outputs.",
              "Loop through cases and run the test logic.",
              "This pattern makes it easy to add new test cases.",
              "Use subtests with t.Run for better isolation and reporting."
            ],
            example: {
              title: "Table-Driven Tests",
              code: `package math

import "testing"

func Add(a, b int) int {
    return a + b
}

func TestAddTable(t *testing.T) {
    // Define test cases
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"zero values", 0, 5, 5},
        {"negative numbers", -2, -3, -5},
        {"mixed signs", -5, 3, -2},
        {"large numbers", 1000, 2000, 3000},
    }
    
    for _, tt := range tests {
        // Run subtest for each case
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d,%d) = %d, want %d", 
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// Test with more complex structs
type User struct {
    Name string
    Age  int
}

func IsAdult(u User) bool {
    return u.Age >= 18
}

func TestIsAdult(t *testing.T) {
    tests := []struct {
        user     User
        expected bool
    }{
        {User{"Alice", 25}, true},
        {User{"Bob", 17}, false},
        {User{"Charlie", 18}, true},
        {User{"Diana", 0}, false},
    }
    
    for _, tt := range tests {
        result := IsAdult(tt.user)
        if result != tt.expected {
            t.Errorf("IsAdult(%+v) = %v, want %v", 
                tt.user, result, tt.expected)
        }
    }
}`,
              explanation:
                "Table-driven tests are the idiomatic Go way to test multiple scenarios without code duplication."
            },
            practice:
              "Convert a test for a 'max' function to use table-driven testing with at least 4 test cases."
          },
        },
        {
          id: "go-benchmarks",
          title: "Benchmarks",
          content: {
            explanation: [
              "Benchmarks measure performance and help optimize code.",
              "Benchmark functions start with 'Benchmark', take *testing.B, and run b.N times.",
              "Run with 'go test -bench=.'",
              "The framework determines the optimal b.N for stable results."
            ],
            example: {
              title: "Benchmarking",
              code: `package main

import "testing"

// Function to benchmark
func FibRecursive(n int) int {
    if n <= 1 {
        return n
    }
    return FibRecursive(n-1) + FibRecursive(n-2)
}

func FibIterative(n int) int {
    if n <= 1 {
        return n
    }
    a, b := 0, 1
    for i := 2; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}

// Benchmark functions
func BenchmarkFibRecursive10(b *testing.B) {
    for i := 0; i < b.N; i++ {
        FibRecursive(10)
    }
}

func BenchmarkFibIterative10(b *testing.B) {
    for i := 0; i < b.N; i++ {
        FibIterative(10)
    }
}

// Benchmark with different inputs
func BenchmarkFibRecursive(b *testing.B) {
    benchmarks := []struct {
        name string
        n    int
    }{
        {"n=5", 5},
        {"n=10", 10},
        {"n=20", 20},
    }
    
    for _, bm := range benchmarks {
        b.Run(bm.name, func(b *testing.B) {
            for i := 0; i < b.N; i++ {
                FibRecursive(bm.n)
            }
        })
    }
}

// Run with:
// go test -bench=.
// go test -bench=Fib -benchmem (show memory allocation)
// go test -bench=. -cpuprofile=cpu.out (profile CPU)`,
              explanation:
                "Benchmarks help you compare implementations and find performance issues before they reach production."
            },
            practice:
              "Write benchmarks for a function that reverses a string using two different approaches."
          },
        },
      ],
    },
    {
      id: "go-concurrency",
      title: "Concurrency",
      description: "Goroutines, channels, and patterns",
      duration: "100 min",
      subtopics: [
        {
          id: "go-goroutines",
          title: "Goroutines",
          content: {
            explanation: [
              "Goroutines are lightweight threads managed by the Go runtime.",
              "Start a goroutine with the 'go' keyword followed by a function call.",
              "Goroutines are cheap – you can run thousands or millions.",
              "Use sync.WaitGroup to wait for multiple goroutines to finish.",
              "The main function returns without waiting for other goroutines unless synchronized."
            ],
            example: {
              title: "Working with Goroutines",
              code: `package main

import (
    "fmt"
    "sync"
    "time"
)

func printNumbers() {
    for i := 1; i <= 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Printf("%d ", i)
    }
}

func printLetters() {
    for i := 'a'; i <= 'e'; i++ {
        time.Sleep(150 * time.Millisecond)
        fmt.Printf("%c ", i)
    }
}

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done() // Signal completion
    fmt.Printf("Worker %d starting\\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    // Basic goroutine
    go printNumbers()
    go printLetters()
    time.Sleep(2 * time.Second) // Wait (not ideal, just for demo)
    fmt.Println()
    
    // Using WaitGroup
    var wg sync.WaitGroup
    
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    
    wg.Wait() // Wait for all workers
    fmt.Println("All workers completed")
}`,
              explanation:
                "Goroutines are concurrent, not necessarily parallel. Use WaitGroup to coordinate completion."
            },
            practice:
              "Launch 10 goroutines that each print their ID. Use WaitGroup to wait for all of them."
          },
        },
        {
          id: "go-channels",
          title: "Channels",
          content: {
            explanation: [
              "Channels are typed conduits for communication between goroutines.",
              "Create with make(chan Type) for unbuffered, or make(chan Type, bufferSize) for buffered.",
              "Send: ch <- value. Receive: value := <-ch.",
              "Unbuffered channels synchronize: send blocks until receive is ready.",
              "Channels can be closed with close() to signal no more values."
            ],
            example: {
              title: "Channel Communication",
              code: `package main

import "fmt"

func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum // Send result to channel
}

func counter(out chan<- int) {
    for i := 0; i < 5; i++ {
        out <- i
    }
    close(out)
}

func main() {
    // Unbuffered channel
    nums := []int{7, 2, 8, -9, 4, 0}
    c := make(chan int)
    go sum(nums[:len(nums)/2], c)
    go sum(nums[len(nums)/2:], c)
    x, y := <-c, <-c // Receive
    
    fmt.Printf("Partial sums: %d, %d, Total: %d\\n", x, y, x+y)
    
    // Buffered channel
    ch := make(chan string, 2)
    ch <- "buffered"
    ch <- "channel"
    fmt.Println(<-ch)
    fmt.Println(<-ch)
    
    // Range over channel (receives until closed)
    numbers := make(chan int)
    go counter(numbers)
    for n := range numbers {
        fmt.Println("Received:", n)
    }
}`,
              explanation:
                "Channels enable safe communication between goroutines. Use them to share data without explicit locks."
            },
            practice:
              "Create a pipeline: one goroutine generates numbers 1-10, another squares them, and the main receives and prints."
          },
        },
        {
          id: "go-select",
          title: "Select Statement",
          content: {
            explanation: [
              "Select lets a goroutine wait on multiple channel operations.",
              "First case that can proceed executes (random if multiple ready).",
              "Use default to avoid blocking (non-blocking selects).",
              "Use time.After for timeouts.",
              "Select is crucial for complex concurrent patterns."
            ],
            example: {
              title: "Using Select",
              code: `package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "from ch1"
    }()
    
    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "from ch2"
    }()
    
    // Select with timeout
    select {
    case msg1 := <-ch1:
        fmt.Println(msg1)
    case msg2 := <-ch2:
        fmt.Println(msg2)
    case <-time.After(1500 * time.Millisecond):
        fmt.Println("Timeout!")
    }
    
    // Non-blocking select
    messages := make(chan string)
    signals := make(chan bool)
    
    select {
    case msg := <-messages:
        fmt.Println("received message", msg)
    default:
        fmt.Println("no message received")
    }
    
    // Multi-way select
    tick := time.Tick(100 * time.Millisecond)
    boom := time.After(500 * time.Millisecond)
    
    for {
        select {
        case <-tick:
            fmt.Print("tick ")
        case <-boom:
            fmt.Println("BOOM!")
            return
        default:
            fmt.Print(".")
            time.Sleep(50 * time.Millisecond)
        }
    }
}`,
              explanation:
                "Select is like a switch for channels. Perfect for timeouts, non-blocking operations, and multiplexing."
            },
            practice:
              "Write a function that receives from multiple channels and returns the first value received using select."
          },
        },
        {
          id: "go-concurrency-patterns",
          title: "Common Concurrency Patterns",
          content: {
            explanation: [
              "Worker pools: multiple goroutines process tasks from a channel.",
              "Fan-out/Fan-in: distribute work to multiple goroutines and collect results.",
              "Pipeline: stages connected by channels.",
              "Context cancellation: propagate cancellation signals.",
              "These patterns solve real-world concurrency problems."
            ],
            example: {
              title: "Concurrency Patterns",
              code: `package main

import (
    "fmt"
    "sync"
    "time"
)

// Worker pool pattern
func workerPool() {
    const numJobs = 10
    const numWorkers = 3
    
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    
    // Worker function
    worker := func(id int, jobs <-chan int, results chan<- int) {
        for j := range jobs {
            fmt.Printf("Worker %d processing job %d\\n", id, j)
            time.Sleep(time.Millisecond * 100)
            results <- j * 2
        }
    }
    
    // Start workers
    for w := 1; w <= numWorkers; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for r := 1; r <= numJobs; r++ {
        <-results
    }
}

// Fan-out/Fan-in pattern
func fanOutFanIn() {
    generator := func(nums ...int) <-chan int {
        out := make(chan int)
        go func() {
            for _, n := range nums {
                out <- n
            }
            close(out)
        }()
        return out
    }
    
    square := func(in <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            for n := range in {
                out <- n * n
            }
            close(out)
        }()
        return out
    }
    
    merge := func(channels ...<-chan int) <-chan int {
        var wg sync.WaitGroup
        out := make(chan int)
        
        output := func(c <-chan int) {
            for n := range c {
                out <- n
            }
            wg.Done()
        }
        
        wg.Add(len(channels))
        for _, c := range channels {
            go output(c)
        }
        
        go func() {
            wg.Wait()
            close(out)
        }()
        return out
    }
    
    nums := generator(1, 2, 3, 4, 5)
    
    // Fan-out: create multiple squaring pipelines
    fanOutCount := 3
    squares := make([]<-chan int, fanOutCount)
    for i := 0; i < fanOutCount; i++ {
        squares[i] = square(nums)
    }
    
    // Fan-in: merge results
    for result := range merge(squares...) {
        fmt.Print(result, " ")
    }
    fmt.Println()
}

func main() {
    fmt.Println("Worker Pool Pattern:")
    workerPool()
    
    fmt.Println("\\nFan-out/Fan-in Pattern:")
    fanOutFanIn()
}`,
              explanation:
                "These patterns are building blocks for robust concurrent systems. Master them to write efficient Go programs."
            },
            practice:
              "Implement a worker pool that processes URLs: fetch each URL in parallel and collect response sizes."
          },
        },
      ],
    },
    {
      id: "go-advanced",
      title: "Advanced Topics",
      description: "Context, panic, and real-world patterns",
      duration: "60 min",
      subtopics: [
        {
          id: "go-context",
          title: "Context Package",
          content: {
            explanation: [
              "Context carries deadlines, cancellation signals, and request-scoped values.",
              "Use context.Background() for root context, context.TODO() when unsure.",
              "WithCancel, WithTimeout, WithDeadline create cancelable contexts.",
              "Always pass context as the first parameter.",
              "Crucial for HTTP servers, database operations, and any long-running process."
            ],
            example: {
              title: "Using Context for Cancellation",
              code: `package main

import (
    "context"
    "fmt"
    "time"
)

func slowOperation(ctx context.Context, id int) {
    select {
    case <-time.After(3 * time.Second):
        fmt.Printf("Operation %d completed\\n", id)
    case <-ctx.Done():
        fmt.Printf("Operation %d cancelled: %v\\n", id, ctx.Err())
    }
}

func main() {
    // Context with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()
    
    go slowOperation(ctx, 1)
    
    // Context with manual cancel
    ctx2, cancel2 := context.WithCancel(context.Background())
    go slowOperation(ctx2, 2)
    
    time.Sleep(1 * time.Second)
    cancel2() // Cancel early
    
    time.Sleep(3 * time.Second)
}`,
              explanation:
                "Contexts propagate cancellation signals through your program. Always respect ctx.Done() to exit early."
            },
            practice:
              "Write a function that takes a context and an integer, and sleeps for that many seconds unless cancelled."
          },
        },
        {
          id: "go-panic-recover",
          title: "Panic and Recover",
          content: {
            explanation: [
              "Panic is an unexpected error that stops normal execution.",
              "Recover catches panic and allows graceful handling.",
              "Use panic for unrecoverable errors (e.g., program bugs).",
              "Use error returns for expected errors.",
              "Defer + recover is common to prevent crashes in goroutines."
            ],
            example: {
              title: "Panic and Recover",
              code: `package main

import "fmt"

func safeDivision(a, b int) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    if b == 0 {
        panic("division by zero")
    }
    fmt.Println(a / b)
}

func main() {
    safeDivision(10, 2)
    safeDivision(10, 0) // Panic recovered gracefully
    fmt.Println("Program continues")
}`,
              explanation:
                "Recover only works inside deferred functions. Use it sparingly for truly exceptional cases."
            },
            practice:
              "Write a function that panics if given a negative number, and recover gracefully in the caller."
          },
        },
      ],
    },
  ],
};