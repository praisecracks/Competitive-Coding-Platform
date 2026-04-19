import { LearningTrack } from "../data";

export const masterGo: LearningTrack = {
  id: "master-go",
  title: "Master Go",
  subtitle: "Beginner to Advanced",
  description: "Build efficient backend systems with Go",
  type: "master_track",
  icon: "Code2",
  color: "cyan",
  coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
  totalHours: 33,
  language: "go",
  category: "Go",
  topics: [
    {
      id: "go-basics",
      title: "Go Fundamentals",
      description: "Get started with Go basics",
      duration: "60 min",
      subtopics: [
        {
          id: "go-variables-intro",
          title: "Variables and Creation",
          content: {
            explanation: [
              "Go has two ways to create variables: `var` for explicit declarations and `:=` for short assignment inside functions.",
              "",
              "The `var` keyword works both inside and outside functions.",
              "The short declaration `:=` is a shortcut that infers the type from the right side.",
              "Go is statically typed - once a variable has a type, it cannot change."
            ],
            example: {
              title: "Creating Variables",
              code: `package main
import "fmt"

var globalVar int = 10

func main() {
    var name string = "Alice"
    var age int = 25
    
    city := "NYC"
    isActive := true
    
    fmt.Println(name, age, city, isActive)
}`,
              explanation: "This example demonstrates creating variables."
            },
            practice: "Create variables using both var and :=. Print them all."
          }
        },
        {
          id: "go-data-types",
          title: "Basic Data Types",
          content: {
            explanation: [
              "Go has several basic types:",
              "",
              "Numbers: int, int8, int16, int32, int64, uint, float32, float64",
              "Other: string, bool",
              "",
              "The int and float64 types are most commonly used."
            ],
            example: {
              title: "Data Types",
              code: `package main
import "fmt"

func main() {
    var count int = 42
    var price float64 = 19.99
    var name string = "Alice"
    var isActive bool = true
    
    fmt.Printf("count: %d, price: %.2f\\n", count, price)
    fmt.Println("name:", name)
    fmt.Println("active:", isActive)
}`,
              explanation: "This example demonstrates data types."
            },
            practice: "Create variables of each basic type. Print them with their types."
          }
        },
        {
          id: "go-arithmetic",
          title: "Arithmetic Operators",
          content: {
            explanation: [
              "Go supports standard arithmetic operators: +, -, *, /, %",
              "",
              "Integer division truncates! 5/2 = 2, not 2.5. Use float64 for decimal results."
            ],
            example: {
              title: "Arithmetic",
              code: `package main
import "fmt"

func main() {
    a, b := 10, 3
    
    fmt.Println(a + b)
    fmt.Println(a - b)
    fmt.Println(a * b)
    fmt.Println(a / b)
    fmt.Println(a % b)
}`,
              explanation: "This example demonstrates arithmetic."
            },
            practice: "Calculate the area of a circle with radius 5 using float64."
          }
        },
        {
          id: "go-constants",
          title: "Constants",
          content: {
            explanation: [
              "Constants are variables that cannot change. Use `const` to declare them.",
              "Constants can be untyped or typed.",
              "iota creates auto-incrementing constants."
            ],
            example: {
              title: "Constants",
              code: `package main
import "fmt"

const Pi = 3.14159

const (
    StatusOK = 200
    StatusNotFound = 404
)

func main() {
    fmt.Println(Pi * 2)
    fmt.Println(StatusOK)
}`,
              explanation: "This example demonstrates constants."
            },
            practice: "Create constants for max login attempts and error codes."
          }
        },
        {
          id: "go-type-conversion",
          title: "Type Conversion",
          content: {
            explanation: [
              "Go does not support automatic type conversion. Use explicit conversion: Type(value)",
              "Convert between numeric types with int(), float64(), etc.",
              "Use strconv package for parsing numbers from strings."
            ],
            example: {
              title: "Type Conversion",
              code: `package main
import (
    "fmt"
    "strconv"
)

func main() {
    var a int = 10
    var b float64 = float64(a)
    fmt.Println(a, b)
    
    s := "42"
    n, _ := strconv.Atoi(s)
    fmt.Println(n + 10)
}`,
              explanation: "This example demonstrates type conversion."
            },
            practice: "Convert the string '3.14' to float64, multiply by 2."
          }
        }
      ]
    },
    {
      id: "go-functions",
      title: "Functions",
      description: "Create reusable functions",
      duration: "65 min",
      subtopics: [
        {
          id: "go-func-def",
          title: "Defining Functions",
          content: {
            explanation: [
              "A function in Go: func name(parameters) returnType { body }",
              "Parameters need both name and type.",
              "The return type is specified after the parameters."
            ],
            example: {
              title: "Basic Function",
              code: `package main
import "fmt"

func greet(name string) string {
    return "Hello, " + name + "!"
}

func add(a, b int) int {
    return a + b
}

func main() {
    msg := greet("Alice")
    fmt.Println(msg)
    fmt.Println(add(3, 4))
}`,
              explanation: "This example demonstrates basic function."
            },
            practice: "Create a function that takes a name and age."
          }
        },
        {
          id: "go-func-return-multiple",
          title: "Multiple Return Values",
          content: {
            explanation: [
              "Functions can return multiple values.",
              "Common use: return value + error",
              "Use the blank identifier _ if you do not need a return value."
            ],
            example: {
              title: "Multiple Returns",
              code: `package main
import "fmt"

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 3)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println(result)
    }
}`,
              explanation: "This example demonstrates multiple returns."
            },
            practice: "Create a function that returns both quotient and remainder."
          }
        },
        {
          id: "go-func-variadic",
          title: "Variadic Functions",
          content: {
            explanation: [
              "A variadic function accepts zero or more arguments. Use ... before the type.",
              "Inside the function, the parameter is a slice.",
              "Useful for functions that accept any number of arguments."
            ],
            example: {
              title: "Variadic Functions",
              code: `package main
import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))
    fmt.Println(sum(1, 2, 3, 4))
}`,
              explanation: "This example demonstrates variadic functions."
            },
            practice: "Create a variadic function that finds the maximum."
          }
        },
        {
          id: "go-func-closures",
          title: "Closures",
          content: {
            explanation: [
              "A closure is a function that references variables outside its body.",
              "The function closes over those variables.",
              "Captured variables persist between calls."
            ],
            example: {
              title: "Closures",
              code: `package main
import "fmt"

func main() {
    x := 10
    add := func(a int) int {
        return a + x
    }
    fmt.Println(add(5))
    
    makeAdder := func(delta int) func(int) int {
        return func(n int) int {
            return n + delta
        }
    }
    
    add5 := makeAdder(5)
    fmt.Println(add5(3))
}`,
              explanation: "This example demonstrates closures."
            },
            practice: "Create a closure that generates incrementing IDs."
          }
        },
        {
          id: "go-func-defer",
          title: "Defer",
          content: {
            explanation: [
              "defer postpones a function call until the surrounding function returns.",
              "It runs even if the function panics.",
              "Multiple defers execute in LIFO order."
            ],
            example: {
              title: "Defer",
              code: `package main
import "fmt"

func process() {
    defer fmt.Println("3. Cleanup")
    fmt.Println("1. Start")
    fmt.Println("2. Do work")
}

func main() {
    process()
}`,
              explanation: "This example demonstrates defer."
            },
            practice: "Use defer to print 'Entering' and 'Exiting' for a function."
          }
        }
      ]
    },
    {
      id: "go-structs",
      title: "Structs and Methods",
      description: "Custom types and methods",
      duration: "70 min",
      subtopics: [
        {
          id: "go-struct-def",
          title: "Defining Structs",
          content: {
            explanation: [
              "A struct groups related values together.",
              "Define with type Name struct { fields }.",
              "Fields have name and type."
            ],
            example: {
              title: "Struct Basics",
              code: `package main
import "fmt"

type Person struct {
    Name string
    Age  int
}

func main() {
    p1 := Person{
        Name: "Alice",
        Age:  25,
    }
    fmt.Println(p1.Name)
    
    p2 := Person{"Bob", 30}
    fmt.Println(p2)
}`,
              explanation: "This example demonstrates struct basics."
            },
            practice: "Create a Book struct with title, author, and year."
          }
        },
        {
          id: "go-struct-methods",
          title: "Methods",
          content: {
            explanation: [
              "A method is a function with a receiver.",
              "Define: func (receiver Type) name(params) returnType { body }",
              "Pass a pointer to modify the struct."
            ],
            example: {
              title: "Methods",
              code: `package main
import "fmt"

type Counter struct {
    Value int
}

func (c *Counter) Increment() {
    c.Value++
}

func (c Counter) Get() int {
    return c.Value
}

func main() {
    c := Counter{Value: 10}
    c.Increment()
    fmt.Println(c.Get())
}`,
              explanation: "This example demonstrates methods."
            },
            practice: "Add a method to increment the counter by a specific amount."
          }
        },
        {
          id: "go-struct-embedding",
          title: "Composition (Embedding)",
          content: {
            explanation: [
              "Go does not have inheritance. Instead, use embedding.",
              "Embed a struct by declaring it without a name.",
              "The embedded fields are promoted."
            ],
            example: {
              title: "Embedding",
              code: `package main
import "fmt"

type Logger struct {
    Name string
}

func (l Logger) Log(msg string) {
    fmt.Println("[", l.Name, "]", msg)
}

type Service struct {
    Logger
    Host string
}

func main() {
    s := Service{
        Logger: Logger{Name: "INFO"},
        Host:  "localhost",
    }
    s.Log("Starting")
}`,
              explanation: "This example demonstrates embedding."
            },
            practice: "Create two structs and embed one into the other."
          }
        },
        {
          id: "go-struct-interfaces",
          title: "Interfaces",
          content: {
            explanation: [
              "An interface defines a set of methods.",
              "Any type implementing those methods implements the interface.",
              "You do not explicitly declare implementation - it is implicit."
            ],
            example: {
              title: "Interfaces",
              code: `package main
import "fmt"

type Writer interface {
    Write(msg string)
}

type ConsoleWriter struct{}

func (ConsoleWriter) Write(msg string) {
    fmt.Println(msg)
}

func process(w Writer) {
    w.Write("Hello, world!")
}

func main() {
    process(ConsoleWriter{})
}`,
              explanation: "This example demonstrates interfaces."
            },
            practice: "Create an interface with one method. Implement it."
          }
        },
        {
          id: "go-struct-empty-interface",
          title: "Empty Interface",
          content: {
            explanation: [
              "interface{} or any means any type.",
              "Use it for generic-like behavior.",
              "But avoid when possible - you lose type safety."
            ],
            example: {
              title: "Empty Interface",
              code: `package main
import "fmt"

func printAny(v interface{}) {
    fmt.Printf("Type: %T, Value: %v\\n", v, v)
}

func main() {
    printAny(42)
    printAny("hello")
}`,
              explanation: "This example demonstrates empty interface."
            },
            practice: "Create a function that prints the type of an interface{}."
          }
        }
      ]
    },
    {
      id: "go-arrays",
      title: "Slices and Maps",
      description: "Collections in Go",
      duration: "60 min",
      subtopics: [
        {
          id: "go-slice-intro",
          title: "Slices vs Arrays",
          content: {
            explanation: [
              "An array has fixed size: [5]int.",
              "A slice has dynamic size: []int.",
              "A slice has pointer, length, and capacity."
            ],
            example: {
              title: "Arrays vs Slices",
              code: `package main
import "fmt"

func main() {
    arr := [3]int{1, 2, 3}
    fmt.Println(arr)
    
    slice := []int{1, 2, 3}
    fmt.Println(slice)
    
    s := make([]int, 3, 10)
    fmt.Println(len(s), cap(s))
}`,
              explanation: "This example demonstrates arrays vs slices."
            },
            practice: "Create a slice and check its length and capacity."
          }
        },
        {
          id: "go-slice-operations",
          title: "Slice Operations",
          content: {
            explanation: [
              "append adds elements.",
              "copy copies slices.",
              "slice[i:j] creates a subslice.",
              "APPEND MAY REALLOCATE!"
            ],
            example: {
              title: "Slice Operations",
              code: `package main
import "fmt"

func main() {
    s := []int{1, 2}
    s = append(s, 3, 4, 5)
    fmt.Println(s)
    
    s = s[1:4]
    fmt.Println(s)
}`,
              explanation: "This example demonstrates slice operations."
            },
            practice: "Add elements to a slice and remove an element."
          }
        },
        {
          id: "go-map-intro",
          title: "Maps",
          content: {
            explanation: [
              "A map is a hash map with O(1) average lookup.",
              "Define: map[KeyType]ValueType",
              "Create with make or a map literal."
            ],
            example: {
              title: "Map Basics",
              code: `package main
import "fmt"

func main() {
    users := make(map[string]int)
    users["Alice"] = 25
    users["Bob"] = 30
    fmt.Println(users["Alice"])
    
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
    }
    fmt.Println(ages)
}`,
              explanation: "This example demonstrates map basics."
            },
            practice: "Create a map of string to int for user ages."
          }
        },
        {
          id: "go-map-operations",
          title: "Map Operations",
          content: {
            explanation: [
              "Iterate with for key, value := range map",
              "Get length with len(map)",
              "Check existence with two-value form",
              "Delete with delete(map, key)"
            ],
            example: {
              title: "Map Operations",
              code: `package main
import "fmt"

func main() {
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
    }
    
    for name, age := range ages {
        fmt.Println(name, age)
    }
    
    fmt.Println(len(ages))
}`,
              explanation: "This example demonstrates map operations."
            },
            practice: "Iterate over a map and find the key with the highest value."
          }
        },
        {
          id: "go-slice-map-sorting",
          title: "Sorting Slices",
          content: {
            explanation: [
              "sort.Ints, sort.Strings, sort.Float64s",
              "sort.Sort for anything with Sort interface"
            ],
            example: {
              title: "Sorting",
              code: `package main
import (
    "fmt"
    "sort"
)

func main() {
    nums := []int{3, 1, 4, 1, 5}
    sort.Ints(nums)
    fmt.Println(nums)
}`,
              explanation: "This example demonstrates sorting."
            },
            practice: "Sort a slice of integers in reverse order."
          }
        }
      ]
    },
    {
      id: "go-concurrency",
      title: "Concurrency",
      description: "Goroutines and channels",
      duration: "75 min",
      subtopics: [
        {
          id: "go-goroutines-intro",
          title: "Goroutines",
          content: {
            explanation: [
              "A goroutine is a lightweight thread. Start with go keyword.",
              "Goroutines are cheap - you can start thousands.",
              "Use sync.WaitGroup to wait for goroutines."
            ],
            example: {
              title: "Goroutines",
              code: `package main
import (
    "fmt"
    "sync"
)

var wg sync.WaitGroup

func say(msg string) {
    defer wg.Done()
    fmt.Println(msg)
}

func main() {
    wg.Add(3)
    go say("Hello")
    go say("World")
    go say("Go!")
    wg.Wait()
}`,
              explanation: "This example demonstrates goroutines."
            },
            practice: "Start multiple goroutines and wait for them."
          }
        },
        {
          id: "go-channels-intro",
          title: "Channels",
          content: {
            explanation: [
              "Channels are pipes that connect goroutines.",
              "Create: make(chan Type) or make(chan Type, buffer)",
              "Unbuffered channels synchronize."
            ],
            example: {
              title: "Channels",
              code: `package main
import "fmt"

func main() {
    ch := make(chan int)
    
    go func() {
        ch <- 42
    }()
    
    v := <-ch
    fmt.Println(v)
}`,
              explanation: "This example demonstrates channels."
            },
            practice: "Create a channel, send a value, receive and print it."
          }
        },
        {
          id: "go-channels-direction",
          title: "Directional Channels",
          content: {
            explanation: [
              "Channels have direction: send-only or receive-only.",
              "chan<- T or <-chan T.",
              "This prevents sending on a receive-only channel."
            ],
            example: {
              title: "Directional Channels",
              code: `package main
import "fmt"

func sink(ch <-chan int) {
    v := <-ch
    fmt.Println("Received:", v)
}

func source(ch chan<- int) {
    ch <- 42
}

func main() {
    ch := make(chan int)
    source(ch)
    sink(ch)
}`,
              explanation: "This example demonstrates directional channels."
            },
            practice: "Write a function that receives only from a channel."
          }
        },
        {
          id: "go-select",
          title: "Select",
          content: {
            explanation: [
              "select lets you wait on multiple channel operations.",
              "Only one case runs - the one that is ready.",
              "Use for timeouts and fan-in."
            ],
            example: {
              title: "Select",
              code: `package main
import (
    "fmt"
    "time"
)

func main() {
    ch1, ch2 := make(chan int), make(chan int)
    
    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- 1
    }()
    go func() {
        ch2 <- 2
    }()
    
    for i := 0; i < 2; i++ {
        select {
        case v := <-ch1:
            fmt.Println("ch1:", v)
        case v := <-ch2:
            fmt.Println("ch2:", v)
        }
    }
}`,
              explanation: "This example demonstrates select."
            },
            practice: "Implement a timeout using select and time.After."
          }
        },
        {
          id: "go-goroutine-patterns",
          title: "Common Patterns",
          content: {
            explanation: [
              "Generator Pattern: Return a channel that produces values",
              "Pipeline Pattern: Chain stages",
              "Fan-out/Fan-in: Multiple goroutines receive from one channel"
            ],
            example: {
              title: "Pipeline",
              code: `package main
import "fmt"

func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func double(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * 2
        }
        close(out)
    }()
    return out
}

func main() {
    c := generate(1, 2, 3, 4, 5)
    c = double(c)
    for v := range c {
        fmt.Println(v)
    }
}`,
              explanation: "This example demonstrates pipeline."
            },
            practice: "Create a pipeline that generates and filters numbers."
          }
        }
      ]
    },
    {
      id: "go-pointers",
      title: "Pointers and Memory",
      description: "Understand memory addresses and pointer manipulation",
      duration: "45 min",
      subtopics: [
        {
          id: "go-pointer-basics",
          title: "Pointer Basics",
          content: {
            explanation: [
              "A pointer holds a memory address. Use *T for pointer to type T.",
              "The zero value of a pointer is nil.",
              "Use and to get address, * to dereference.",
              "Pointers let you modify data in functions, avoid copying large data."
            ],
            example: {
              title: "Pointers in Action",
              code: `package main
import "fmt"

func main() {
    x := 10
    p := &x
    
    fmt.Println("x:", x)
    fmt.Println("&x:", p)
    fmt.Println("*p:", *p)
    
    *p = 20
    fmt.Println("x now:", x)
}`,
              explanation: "This demonstrates creating pointers with & and dereferencing with *."
            },
            practice: "Create a pointer to an integer, modify it through the pointer."
          }
        },
        {
          id: "go-pointer-passing",
          title: "Passing Pointers to Functions",
          content: {
            explanation: [
              "When you pass a pointer to a function, it can modify the original data.",
              "Without a pointer, the function gets a copy.",
              "Use pointers for large structs to avoid copying."
            ],
            example: {
              title: "Pointer Parameters",
              code: `package main
import "fmt"

func modify(p *int) {
    *p = 100
}

type User struct {
    Name string
    Age  int
}

func updateAge(u *User, newAge int) {
    u.Age = newAge
}

func main() {
    n := 10
    modify(&n)
    fmt.Println(n)
    
    u := User{Name: "Alice", Age: 25}
    updateAge(&u, 30)
    fmt.Println(u.Age)
}`,
              explanation: "Pointers allow functions to modify original values."
            },
            practice: "Create a function that takes a pointer to a slice."
          }
        },
        {
          id: "go-pointer-struct",
          title: "Pointer to Struct",
          content: {
            explanation: [
              "When creating structs with new(), you get a pointer.",
              "Access struct fields through a pointer using dot notation.",
              "Go auto-dereferences."
            ],
            example: {
              title: "Struct Pointers",
              code: `package main
import "fmt"

type Point struct {
    X int
    Y int
}

func newPoint(x, y int) *Point {
    return &Point{X: x, Y: y}
}

func main() {
    p := new(Point)
    p.X = 10
    p.Y = 20
    fmt.Println(*p)
    
    p2 := &Point{X: 1, Y: 2}
    fmt.Println(p2.X)
}`,
              explanation: "Struct pointers are common in Go."
            },
            practice: "Create a function that returns a pointer to a User struct."
          }
        }
      ]
    },
    {
      id: "go-error-handling",
      title: "Error Handling",
      description: "Idiomatic Go error handling patterns",
      duration: "45 min",
      subtopics: [
        {
          id: "go-errors-intro",
          title: "Error Basics",
          content: {
            explanation: [
              "Go does not have exceptions. Errors are values that functions return.",
              "Convention: return error as the last return value.",
              "The error interface has one method: Error() string.",
              "Always check errors."
            ],
            example: {
              title: "Error Handling",
              code: `package main
import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
}`,
              explanation: "This shows the basic error handling pattern in Go."
            },
            practice: "Create a function that returns an error when given invalid input."
          }
        },
        {
          id: "go-errors-custom",
          title: "Custom Errors",
          content: {
            explanation: [
              "Create custom error types for better error handling.",
              "Use fmt.Errorf with %w to wrap errors.",
              "Define custom types that implement error interface."
            ],
            example: {
              title: "Custom Error Types",
              code: `package main
import (
    "fmt"
)

type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

func main() {
    err := ValidationError{Field: "email", Message: "invalid format"}
    fmt.Println(err)
}`,
              explanation: "Custom errors improve error handling."
            },
            practice: "Create a custom error type for a not-found case."
          }
        },
        {
          id: "go-errors-patterns",
          title: "Error Patterns",
          content: {
            explanation: [
              "Sentinel errors: Predefined errors to check against",
              "Error wrapping: Use %w in fmt.Errorf",
              "Error checking: Use errors.Is and errors.As"
            ],
            example: {
              title: "Error Patterns",
              code: `package main
import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) error {
    if id < 0 {
        return fmt.Errorf("invalid id %d: %w", id, ErrNotFound)
    }
    return nil
}

func main() {
    err := findUser(-1)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("User not found!")
    }
}`,
              explanation: "Use sentinel errors and error wrapping."
            },
            practice: "Create a function that uses sentinel errors."
          }
        }
      ]
    },
    {
      id: "go-packages",
      title: "Packages and Modules",
      description: "Organize code with packages and modules",
      duration: "50 min",
      subtopics: [
        {
          id: "go-package-basics",
          title: "Packages",
          content: {
            explanation: [
              "A package is a collection of Go files in the same folder.",
              "Every Go file starts with package name.",
              "Packages with name main are executable.",
              "Use import to use other packages."
            ],
            example: {
              title: "Package Structure",
              code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
              explanation: "This shows basic package structure."
            },
            practice: "Create a simple package with a function."
          }
        },
        {
          id: "go-module-init",
          title: "Modules and Imports",
          content: {
            explanation: [
              "A module is a collection of packages. Created with go mod init.",
              "The module path is the import path.",
              "Go get fetches dependencies."
            ],
            example: {
              title: "Module Commands",
              code: `# Create module
go mod init github.com/username/project

# Add dependency
go get github.com/some/package

# Tidy
go mod tidy`,
              explanation: "Module commands for managing Go projects."
            },
            practice: "Initialize a Go module and add a dependency."
          }
        },
        {
          id: "go-package-visibility",
          title: "Exported vs Unexported",
          content: {
            explanation: [
              "Names starting with uppercase are exported (public).",
              "Names starting with lowercase are unexported (private).",
              "Exported functions can be imported by other packages."
            ],
            example: {
              title: "Visibility",
              code: `package math

func Add(a, b int) int {
    return a + b
}

func addInternal(a, b int) int {
    return a + b
}

type Calculator struct {
    Value int
}`,
              explanation: "Exports are controlled by capital letters."
            },
            practice: "Create a package with both exported and unexported functions."
          }
        }
      ]
    },
    {
      id: "go-testing",
      title: "Testing",
      description: "Write tests in Go",
      duration: "45 min",
      subtopics: [
        {
          id: "go-test-basics",
          title: "Writing Tests",
          content: {
            explanation: [
              "Go has built-in testing. Test files end with _test.go.",
              "Tests are functions with signature func TestXxx(t *testing.T).",
              "Use t.Fatal or t.Errorf to fail a test.",
              "Run with go test."
            ],
            example: {
              title: "Basic Test",
              code: `package math

func Add(a, b int) int {
    return a + b
}

package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2,3) = %d, want 5", result)
    }
}`,
              explanation: "Test files are in the same package with _test.go suffix."
            },
            practice: "Write a test for a function that subtracts two numbers."
          }
        },
        {
          id: "go-test-table",
          title: "Table-Driven Tests",
          content: {
            explanation: [
              "Table-driven tests use a slice of test cases.",
              "Easier to add cases and keeps tests organized.",
              "Common pattern in Go."
            ],
            example: {
              title: "Table Tests",
              code: `package math

import "testing"

func TestAddTable(t *testing.T) {
    tests := []struct {
        a, b, want int
    }{
        {2, 3, 5},
        {0, 0, 0},
        {-1, 1, 0},
    }
    
    for _, tt := range tests {
        got := Add(tt.a, tt.b)
        if got != tt.want {
            t.Errorf("Add(%d,%d) = %d", tt.a, tt.b, got)
        }
    }
}`,
              explanation: "Table tests make it easy to add more test cases."
            },
            practice: "Convert a basic test to table-driven format."
          }
        },
        {
          id: "go-test-benchmark",
          title: "Benchmarks",
          content: {
            explanation: [
              "Benchmark functions start with Benchmark and take *testing.B.",
              "Run with go test -bench=.",
              "The loop runs b.N times."
            ],
            example: {
              title: "Benchmark",
              code: `package math

import "testing"

func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(1, 2)
    }
}`,
              explanation: "Benchmarks measure performance."
            },
            practice: "Add a benchmark for a function and run it."
          }
        }
      ]
    }
  ]
};