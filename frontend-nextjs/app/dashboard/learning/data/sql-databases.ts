import { LearningTrack } from "../data";

export const sqlDatabases: LearningTrack = {
  id: "sql-databases",
  title: "SQL & Databases",
  subtitle: "Beginner to Data Management",
  description: "Complete SQL journey from understanding what a database is to writing complex queries. Every concept taught with real-world examples you can run and test.",
  type: "additional",
  icon: "HardDrive",
  color: "teal",
  coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
  totalHours: 28,
  language: "multi",
  category: "SQL",
  topics: [
    // ==================== TOPIC 1: INTRODUCTION TO DATABASES ====================
    {
      id: "sql-introduction",
      title: "Introduction to Databases",
      description: "Understand what databases are, why they matter, and how SQL fits into the picture.",
      duration: "45 min",
      subtopics: [
        {
          id: "sql-what-is-database",
          title: "What is a Database?",
          content: {
            explanation: [
              "A database is like a super-organized digital filing cabinet. Instead of papers, it stores information like names, addresses, or product prices.",
              "Think about your phone's contacts. When you save a friend's number, your phone puts it in a database. Later, when you type their name, the database finds the number instantly.",
              "Without databases, apps would be slow. Imagine searching through millions of sticky notes to find one phone number. That's what happens without a database.",
              "Databases keep data safe, organized, and lightning-fast to access. Every app you love uses databases behind the scenes."
            ],
            example: {
              title: "A Simple Mental Model",
              code: `-- Think of a database like a table:
-- 
-- | ID | Name     | Age | City      |
-- |----|----------|-----|-----------|
-- | 1  | Alice    | 25  | New York  |
-- | 2  | Bob      | 30  | London    |
-- | 3  | Charlie  | 22  | Tokyo     |
-- 
-- Each row is one "record" (one person)
-- Each column is one "field" (name, age, city)`,
              explanation: "This is a simple table. Databases store many tables like this. You can ask questions like 'Show me everyone from London' and get answers instantly."
            },
            practice: "Think of 3 things in your daily life that probably use a database."
          }
        },
        {
          id: "sql-history",
          title: "The Story of SQL",
          content: {
            explanation: [
              "In the 1970s, IBM researchers needed a way to talk to databases. They invented a language called SEQUEL (Structured English Query Language).",
              "Later, the name changed to SQL (pronounced 'ess-queue-el' or 'sequel'). The goal was simple: use English-like words to ask for data.",
              "Instead of writing complex code, you could write 'SELECT name FROM users' to get all names. Anyone could learn it, not just programmers.",
              "Today, SQL is everywhere. Banks, hospitals, airlines, and your favorite apps all use SQL. It's been the standard for over 40 years."
            ],
            example: {
              title: "SQL vs Regular English",
              code: `-- English question:
-- "Show me the names of all customers from Texas"

-- SQL version:
SELECT name FROM customers WHERE state = 'Texas';

-- Much like English, right?`,
              explanation: "SQL uses simple words like SELECT, FROM, and WHERE. It's designed to be readable, even for non-programmers."
            },
            practice: "Write an English question you'd ask about a list of students. We'll learn the SQL version later."
          }
        },
        {
          id: "sql-vs-excel",
          title: "Database vs Spreadsheet",
          content: {
            explanation: [
              "You already know spreadsheets like Excel or Google Sheets. A database is similar BUT much more powerful.",
              "Spreadsheets are great for small data (1000 rows). Databases handle millions of rows without slowing down.",
              "Only one person can edit a spreadsheet at a time. Thousands of people can use a database simultaneously.",
              "Spreadsheets can't connect easily. Databases let you link tables together.",
              "Think of spreadsheets as a bicycle - good for short trips. Databases are a cargo plane - built for heavy lifting."
            ],
            example: {
              title: "When to Use What",
              code: `-- Use a spreadsheet when:
-- - You have less than 10,000 rows
-- - Only 1-2 people need access
-- - You're doing simple calculations

-- Use a database when:
-- - You have millions of rows
-- - Many people need access at once
-- - You need to connect different types of data
-- - Speed and security are important`,
              explanation: "Choose the right tool for the job. Start with spreadsheets. When they become slow or messy, move to a database."
            },
            practice: "List 3 situations where a spreadsheet would work fine, and 3 where you'd need a real database."
          }
        }
      ]
    },
    // ==================== TOPIC 2: UNDERSTANDING TABLES ====================
    {
      id: "sql-tables",
      title: "Understanding Tables, Rows, and Columns",
      description: "Learn how databases organize data using rows, columns, and tables.",
      duration: "60 min",
      subtopics: [
        {
          id: "sql-tables-basics",
          title: "Tables: The Spreadsheet You Can Talk To",
          content: {
            explanation: [
              "A table is just like a spreadsheet. It has rows (horizontal) and columns (vertical).",
              "Columns define the type of information: 'Name', 'Age', 'Email' are columns.",
              "Rows are individual entries: 'Alice, 25, alice@email.com' is one row.",
              "Every table has a name, like 'students' or 'products' or 'orders'.",
              "When you ask a database a question, you always tell it which table to look in."
            ],
            example: {
              title: "Visualizing a Table",
              code: `-- Table name: students
-- 
-- | id | name     | age | grade |
-- |----|----------|-----|-------|
-- | 1  | Alice    | 15  | 10th  |
-- | 2  | Bob      | 14  | 9th   |
-- | 3  | Charlie  | 16  | 11th  |
-- 
-- Columns: id, name, age, grade (4 columns)
-- Rows: 3 rows (Alice, Bob, Charlie)`,
              explanation: "Each column holds one type of data. Each row is one complete record. The 'id' column gives every row a unique number."
            },
            practice: "Draw a table called 'books' with columns: title, author, year, rating. Add 3 sample rows."
          }
        },
        {
          id: "sql-column-types",
          title: "Data Types: What Can You Store?",
          content: {
            explanation: [
              "When you create a column, you must decide what type of data goes there. This keeps things organized.",
              "INTEGER stores whole numbers: 1, 42, 1000. Perfect for ages, counts, or IDs.",
              "TEXT stores words and sentences: 'Alice', 'hello@email.com'. Used for names, addresses, descriptions.",
              "REAL stores decimal numbers: 3.14, 19.99. Great for prices or measurements.",
              "DATE stores calendar dates: '2024-01-15'. Used for birthdays or order dates.",
              "BOOLEAN stores TRUE or FALSE. Perfect for 'is_active' or 'in_stock'."
            ],
            example: {
              title: "Choosing the Right Type",
              code: `-- A products table with different data types:
-- 
-- | id (INTEGER) | name (TEXT) | price (REAL) | in_stock (BOOLEAN) | created (DATE) |
-- |--------------|-------------|--------------|--------------------|----------------|
-- | 1            | Laptop      | 999.99       | TRUE               | 2024-01-15     |
-- | 2            | Mouse       | 25.50        | TRUE               | 2024-01-16     |
-- | 3            | Keyboard    | 75.00        | FALSE              | 2024-01-17     |`,
              explanation: "Each column only contains the right type of data. INTEGER column has only numbers. TEXT column has only words."
            },
            practice: "Create a 'users' table with columns: user_id (INTEGER), full_name (TEXT), age (INTEGER), signup_date (DATE), is_premium (BOOLEAN)."
          }
        },
        {
          id: "sql-primary-keys",
          title: "Primary Keys: The ID Card",
          content: {
            explanation: [
              "Every row in a table needs a unique ID. This is called the Primary Key.",
              "Think of it like a student ID number. Two students can have the same name, but never the same ID number.",
              "Primary keys are usually numbers that automatically increase: 1, 2, 3, 4...",
              "Why do we need this? When you want to update or delete a specific row, you use its primary key.",
              "Without a primary key, you might accidentally update the wrong person."
            ],
            example: {
              title: "Why Primary Keys Matter",
              code: `-- Two people named John Smith:
-- 
-- | id (PRIMARY) | name        | city        |
-- |--------------|-------------|-------------|
-- | 1            | John Smith  | New York    |
-- | 2            | John Smith  | Los Angeles |
-- 
-- To update the first John, use: UPDATE users SET city='Boston' WHERE id=1
-- 
-- Without an id, you'd update both Johns by accident!`,
              explanation: "The id column guarantees each row is unique. Even with identical names, the ids (1 and 2) are different."
            },
            practice: "Why would using 'name' as a primary key be a bad idea? Think about people with the same name."
          }
        }
      ]
    },
    // ==================== TOPIC 3: BASIC SELECT QUERIES ====================
    {
      id: "sql-select-basic",
      title: "Basic SELECT Queries",
      description: "Learn to ask your database questions and get answers back.",
      duration: "50 min",
      subtopics: [
        {
          id: "sql-select-all",
          title: "SELECT: Asking for Data",
          content: {
            explanation: [
              "SELECT is the most common SQL command. It means 'show me data from the database'.",
              "The simplest query is 'SELECT * FROM table_name'. The * means 'everything'.",
              "Think of it like saying 'Show me everything in this spreadsheet'.",
              "You can also ask for specific columns: 'SELECT name, age FROM students'."
            ],
            example: {
              title: "Your First SQL Query",
              code: `-- Show everything from the students table:
SELECT * FROM students;
-- Result:
-- | id | name    | age | grade |
-- | 1  | Alice   | 15  | 10th  |
-- | 2  | Bob     | 14  | 9th   |
-- | 3  | Charlie | 16  | 11th  |

-- Show only names and ages:
SELECT name, age FROM students;
-- Result:
-- | name    | age |
-- | Alice   | 15  |
-- | Bob     | 14  |
-- | Charlie | 16  |`,
              explanation: "SELECT * gives you all columns. SELECT name, age gives you only the columns you ask for."
            },
            practice: "If you have a 'products' table with columns (id, name, price, category), write SQL to show only names and prices."
          }
        },
        {
          id: "sql-select-rename",
          title: "Aliases: Renaming Columns in Results",
          content: {
            explanation: [
              "Sometimes column names are technical or unclear. Aliases let you rename them in your results.",
              "Use the AS keyword to give a column a temporary name.",
              "Aliases only affect the output, not the actual table structure.",
              "This is especially useful when combining columns or using calculations."
            ],
            example: {
              title: "Using Aliases",
              code: `-- Give a column a friendlier name:
SELECT name AS customer_name, price AS product_price FROM products;

-- Without alias vs with alias:
SELECT name, price * 1.1 FROM products;
SELECT name, price * 1.1 AS price_with_tax FROM products;

-- Multiple aliases:
SELECT 
  name AS "Product Name",
  price AS "Current Price",
  price * 0.9 AS "Sale Price"
FROM products;`,
              explanation: "AS makes your output easier to read. Column names become whatever you choose."
            },
            practice: "Write a query that shows product name and price, renaming 'name' to 'Product' and 'price' to 'Cost'."
          }
        }
      ]
    },
    // ==================== TOPIC 4: FILTERING DATA ====================
    {
      id: "sql-filtering",
      title: "Filtering Data",
      description: "Learn to narrow down results using WHERE, AND, OR, and NOT.",
      duration: "55 min",
      subtopics: [
        {
          id: "sql-where-basic",
          title: "WHERE: Basic Filtering",
          content: {
            explanation: [
              "Often you don't want all rows - just the ones that match certain conditions. That's what WHERE does.",
              "WHERE lets you say 'show me rows WHERE something is true'.",
              "You can filter by numbers: WHERE age > 18, WHERE price < 100.",
              "You can filter by text: WHERE city = 'New York', WHERE name = 'Alice'."
            ],
            example: {
              title: "Filtering with WHERE",
              code: `-- Show students older than 15:
SELECT * FROM students WHERE age > 15;
-- Result: Charlie (age 16)

-- Show products under $50:
SELECT name, price FROM products WHERE price < 50;

-- Show customers from Texas:
SELECT * FROM customers WHERE state = 'Texas';

-- Exact match (text must be exact, case-sensitive in some databases):
SELECT * FROM users WHERE status = 'active';`,
              explanation: "WHERE acts like a filter. Only rows that make the condition TRUE appear in results."
            },
            practice: "Write a query to show all products in the 'Electronics' category."
          }
        },
        {
          id: "sql-and-or",
          title: "AND, OR, NOT: Combining Conditions",
          content: {
            explanation: [
              "Sometimes one condition isn't enough. AND, OR, and NOT let you combine multiple conditions.",
              "AND means ALL conditions must be true. 'Age > 18 AND city = 'London''",
              "OR means AT LEAST ONE condition must be true. 'City = 'NYC' OR city = 'LA''",
              "NOT reverses a condition. 'NOT status = 'inactive'' means status is NOT inactive.",
              "Use parentheses to group conditions: WHERE (age > 18 OR has_permission = TRUE) AND status = 'active'"
            ],
            example: {
              title: "Combining Conditions",
              code: `-- AND: Both conditions must be true
SELECT * FROM products 
WHERE category = 'Electronics' AND price < 500;

-- OR: Either condition can be true
SELECT * FROM customers 
WHERE state = 'Texas' OR state = 'California';

-- Combining AND and OR (parentheses matter!)
SELECT * FROM users 
WHERE (age >= 18 AND age <= 30) OR is_premium = TRUE;

-- NOT: Reverse a condition
SELECT * FROM orders 
WHERE NOT status = 'cancelled';

-- Equivalent to:
SELECT * FROM orders WHERE status != 'cancelled';`,
              explanation: "Use parentheses to make complex conditions clear. Without them, AND is evaluated before OR."
            },
            practice: "Write a query to show products that are either in 'Electronics' category with price over $500, OR in 'Accessories' category."
          }
        },
        {
          id: "sql-in-between",
          title: "IN and BETWEEN: Ranges and Lists",
          content: {
            explanation: [
              "IN checks if a value is in a list. Instead of 'city = 'A' OR city = 'B' OR city = 'C'', write 'city IN ('A', 'B', 'C')'.",
              "BETWEEN checks if a value is within a range (inclusive). BETWEEN 10 AND 20 means 10 to 20.",
              "These make queries much shorter and easier to read."
            ],
            example: {
              title: "IN and BETWEEN",
              code: `-- IN: Value in a list
SELECT * FROM customers 
WHERE state IN ('Texas', 'California', 'New York');

-- Same query without IN (much longer):
SELECT * FROM customers 
WHERE state = 'Texas' OR state = 'California' OR state = 'New York';

-- BETWEEN: Value in range (inclusive)
SELECT * FROM products 
WHERE price BETWEEN 50 AND 100;

-- Same query without BETWEEN:
SELECT * FROM products 
WHERE price >= 50 AND price <= 100;

-- Combine with NOT:
SELECT * FROM orders 
WHERE status NOT IN ('cancelled', 'refunded');

-- Date ranges:
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';`,
              explanation: "IN is perfect for checking against multiple specific values. BETWEEN is perfect for numeric or date ranges."
            },
            practice: "Write a query to show orders from January, February, or March 2024 using IN with month numbers."
          }
        },
        {
          id: "sql-like-null",
          title: "LIKE and NULL: Partial Matches and Missing Data",
          content: {
            explanation: [
              "LIKE finds patterns in text, not just exact matches. Use % for 'any characters' and _ for 'one character'.",
              "'J%' finds anything starting with J. '%son' finds anything ending with 'son'.",
              "NULL means 'no value' - different from empty string or zero.",
              "You can't use = to check for NULL. Use 'IS NULL' or 'IS NOT NULL'."
            ],
            example: {
              title: "Pattern Matching and Nulls",
              code: `-- LIKE: Find patterns in text
SELECT * FROM users WHERE name LIKE 'A%';  -- Names starting with A
SELECT * FROM users WHERE name LIKE '%son';  -- Names ending with 'son'
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- Gmail addresses

-- _ matches exactly one character
SELECT * FROM users WHERE name LIKE 'J_n';  -- Jan, Jon, Jin (3 letters starting with J, ending with n)

-- NULL checking (not = NULL!)
SELECT * FROM customers WHERE phone IS NULL;  -- Customers with no phone number
SELECT * FROM customers WHERE phone IS NOT NULL;  -- Customers who provided phone

-- Common mistake: This won't work
SELECT * FROM customers WHERE phone = NULL;  -- ❌ Wrong!`,
              explanation: "LIKE is for text search. % matches any number of characters. NULL is absence of data, not the same as empty string ''."
            },
            practice: "Write a query to find all customers with .org email addresses, and another to find customers missing their date_of_birth."
          }
        }
      ]
    },
    // ==================== TOPIC 5: SORTING RESULTS ====================
    {
      id: "sql-sorting",
      title: "Sorting Results",
      description: "Learn to order your query results using ORDER BY.",
      duration: "35 min",
      subtopics: [
        {
          id: "sql-order-basic",
          title: "ORDER BY: Sorting Your Data",
          content: {
            explanation: [
              "Sometimes you want the highest score or the most recent order. ORDER BY sorts your results.",
              "ORDER BY column_name ASC sorts from smallest to largest (A to Z, 1 to 10).",
              "ORDER BY column_name DESC sorts from largest to smallest (Z to A, 10 to 1).",
              "ASC is the default - you don't have to write it, but it's good practice."
            ],
            example: {
              title: "Basic Sorting",
              code: `-- Sort students by age (youngest first - ASC is default):
SELECT name, age FROM students ORDER BY age ASC;
-- Result: Bob (14), Alice (15), Charlie (16)

-- Sort by age (oldest first):
SELECT name, age FROM students ORDER BY age DESC;
-- Result: Charlie (16), Alice (15), Bob (14)

-- Sort products by price (cheapest first):
SELECT name, price FROM products ORDER BY price;

-- Sort by date (most recent first):
SELECT * FROM orders ORDER BY created_at DESC;`,
              explanation: "ASC is ascending (1,2,3). DESC is descending (3,2,1). ORDER BY goes at the end of your query."
            },
            practice: "Write a query to show customers ordered by signup date, newest first."
          }
        },
        {
          id: "sql-order-multiple",
          title: "Multiple Column Sorting",
          content: {
            explanation: [
              "Sometimes you need to sort by more than one column. ORDER BY lets you specify multiple.",
              "First, it sorts by the first column. Then within ties, it sorts by the second column.",
              "Each column can have its own direction (ASC or DESC).",
              "Example: ORDER BY state ASC, city ASC sorts all rows by state, then by city within each state."
            ],
            example: {
              title: "Multi-Column Sorting",
              code: `-- Sort by state, then by city within each state:
SELECT name, state, city FROM customers 
ORDER BY state ASC, city ASC;

-- Sort by category, then by price (lowest to highest within each category):
SELECT name, category, price FROM products 
ORDER BY category ASC, price ASC;

-- Sort by department, then by salary (highest first):
SELECT name, department, salary FROM employees 
ORDER BY department ASC, salary DESC;

-- Complex example: Orders by status, then by date (newest first within each status):
SELECT id, status, created_at FROM orders 
ORDER BY status ASC, created_at DESC;`,
              explanation: "Think of it like sorting a spreadsheet: first by column A, then by column B within groups of identical A values."
            },
            practice: "Write a query to sort products by category (A-Z), and within each category, sort by price from highest to lowest."
          }
        },
        {
          id: "sql-limit",
          title: "LIMIT: Getting Just the Top Results",
          content: {
            explanation: [
              "LIMIT cuts off results after a certain number of rows. Perfect for 'top 10' lists.",
              "Often used with ORDER BY to get 'highest', 'lowest', 'most recent'.",
              "Example: Get top 5 most expensive products, or newest 3 customers."
            ],
            example: {
              title: "Limiting Results",
              code: `-- Top 3 youngest students:
SELECT name, age FROM students ORDER BY age ASC LIMIT 3;

-- Most expensive product (single result):
SELECT name, price FROM products ORDER BY price DESC LIMIT 1;

-- Top 5 best-selling products:
SELECT product_id, COUNT(*) as times_ordered 
FROM order_items 
GROUP BY product_id 
ORDER BY times_ordered DESC 
LIMIT 5;

-- Newest 10 customers:
SELECT name, signup_date FROM customers 
ORDER BY signup_date DESC 
LIMIT 10;`,
              explanation: "LIMIT always goes at the very end of your query. Combine with ORDER BY for meaningful top-N results."
            },
            practice: "Write a query to find the 3 most expensive products, showing name and price."
          }
        }
      ]
    },
    // ==================== TOPIC 6: RELATIONSHIPS BETWEEN TABLES ====================
    {
      id: "sql-relationships",
      title: "Table Relationships",
      description: "Understand primary keys, foreign keys, and how tables connect.",
      duration: "45 min",
      subtopics: [
        {
          id: "sql-foreign-keys",
          title: "Foreign Keys: Connecting Tables",
          content: {
            explanation: [
              "A foreign key is a column in one table that points to a primary key in another table.",
              "It creates a link between tables. Example: orders.customer_id points to customers.id.",
              "This is how databases prevent duplicate data and maintain consistency.",
              "Foreign keys ensure you can't create an order for a customer that doesn't exist."
            ],
            example: {
              title: "How Foreign Keys Work",
              code: `-- Two related tables:
-- 
-- customers table (parent):
-- | id (PRIMARY) | name         |
-- | 1            | Alice Smith  |
-- | 2            | Bob Johnson  |
-- 
-- orders table (child):
-- | id | customer_id (FOREIGN) | product    |
-- | 1  | 1                     | Laptop     |  <- Alice's order
-- | 2  | 1                     | Mouse      |  <- Alice's order
-- | 3  | 2                     | Keyboard   |  <- Bob's order
-- 
-- customer_id in orders points to id in customers`,
              explanation: "The foreign key (customer_id) creates the relationship. One customer can have many orders. That's called a one-to-many relationship."
            },
            practice: "Draw a diagram showing how a 'users' table would connect to a 'posts' table using foreign keys."
          }
        },
        {
          id: "sql-one-to-many",
          title: "One-to-Many Relationships",
          content: {
            explanation: [
              "One-to-many is the most common relationship type. One record in table A can link to many records in table B.",
              "Example: One customer can place many orders. One author can write many books.",
              "The foreign key always goes on the 'many' side of the relationship (orders table has customer_id).",
              "This is how databases handle real-world relationships without repeating data."
            ],
            example: {
              title: "One-to-Many in Action",
              code: `-- One customer, many orders:
-- 
-- customers (one side):
-- | id | name     |
-- | 1  | Alice    |
-- 
-- orders (many side):
-- | id | customer_id | order_date  | amount |
-- | 1  | 1           | 2024-01-01  | 50.00  |
-- | 2  | 1           | 2024-01-15  | 30.00  |
-- | 3  | 1           | 2024-01-20  | 25.00  |
-- 
-- Other examples:
-- - One department, many employees
-- - One category, many products
-- - One user, many comments`,
              explanation: "The foreign key (customer_id) appears many times in the orders table, but only once in customers table."
            },
            practice: "Give three real-world examples of one-to-many relationships in databases."
          }
        },
        {
          id: "sql-many-to-many",
          title: "Many-to-Many Relationships",
          content: {
            explanation: [
              "Sometimes many records relate to many records. Example: students can take many courses, and courses have many students.",
              "You can't represent this with just two tables - you need a 'junction' or 'bridge' table.",
              "The junction table contains foreign keys to both main tables.",
              "Each row in the junction table represents one connection between the two sides."
            ],
            example: {
              title: "Many-to-Many Setup",
              code: `-- Students and courses (many-to-many):
--
-- students table:
-- | id | name     |
-- | 1  | Alice    |
-- | 2  | Bob      |
--
-- courses table:
-- | id | title           |
-- | 1  | Mathematics     |
-- | 2  | Physics         |
--
-- enrollments (junction table):
-- | student_id | course_id |
-- | 1          | 1         |  <- Alice in Math
-- | 1          | 2         |  <- Alice in Physics
-- | 2          | 1         |  <- Bob in Math
--
-- Now each student can have many courses, and each course can have many students`,
              explanation: "The junction table connects both sides. It contains foreign keys pointing to both original tables."
            },
            practice: "Design a many-to-many relationship for a library: books and authors (one book can have multiple authors, one author can write multiple books)."
          }
        }
      ]
    },
    // ==================== TOPIC 7: JOINS ====================
    {
      id: "sql-joins",
      title: "Joins: Combining Tables",
      description: "Learn to pull data from multiple tables at once using JOINs.",
      duration: "70 min",
      subtopics: [
        {
          id: "sql-inner-join",
          title: "INNER JOIN: Only Matching Records",
          content: {
            explanation: [
              "INNER JOIN returns only rows that have matches in BOTH tables.",
              "If a customer has no orders, they won't appear. If an order has no customer, it won't appear.",
              "This is the most common type of join. Use it when you only care about complete matches."
            ],
            example: {
              title: "INNER JOIN in Action",
              code: `-- Show all orders with customer names:
SELECT 
  orders.id AS order_id,
  customers.name AS customer_name,
  orders.amount
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

-- Customers who have placed at least one order:
SELECT DISTINCT customers.name
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;

-- Products that have been ordered (with total sold):
SELECT 
  products.name,
  SUM(order_items.quantity) AS total_sold
FROM products
INNER JOIN order_items ON products.id = order_items.product_id
GROUP BY products.id
ORDER BY total_sold DESC;`,
              explanation: "INNER JOIN excludes customers with zero orders. Only matching rows survive."
            },
            practice: "Write an INNER JOIN to show all enrollments with student names and course titles."
          }
        },
        {
          id: "sql-left-join",
          title: "LEFT JOIN: All Records from Left Table",
          content: {
            explanation: [
              "LEFT JOIN returns ALL rows from the left (first) table, plus matching rows from the right.",
              "If there's no match on the right, those columns show NULL.",
              "Perfect for 'Show me all customers, even those without orders'."
            ],
            example: {
              title: "LEFT JOIN in Action",
              code: `-- All customers, with order info if they have any:
SELECT 
  customers.name,
  orders.id as order_id,
  orders.amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;
-- Customers without orders show NULL for order columns

-- Find customers with no orders (very common pattern):
SELECT customers.name
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
WHERE orders.id IS NULL;

-- All products, with total sales (including unsold products):
SELECT 
  products.name,
  COALESCE(SUM(order_items.quantity), 0) as total_sold
FROM products
LEFT JOIN order_items ON products.id = order_items.product_id
GROUP BY products.id;`,
              explanation: "LEFT JOIN is powerful for finding missing relationships. The left table always keeps all its rows."
            },
            practice: "Write a LEFT JOIN to show all courses, including those with no students enrolled."
          }
        },
        {
          id: "sql-right-join",
          title: "RIGHT JOIN: All Records from Right Table",
          content: {
            explanation: [
              "RIGHT JOIN is the opposite of LEFT JOIN. It returns ALL rows from the right table.",
              "RIGHT JOIN is less common - you can usually write the same query as a LEFT JOIN by swapping table order.",
              "Some databases don't support RIGHT JOIN at all. LEFT JOIN is more standard."
            ],
            example: {
              title: "RIGHT JOIN Example",
              code: `-- These two queries give the same result:

-- Using RIGHT JOIN:
SELECT customers.name, orders.id
FROM customers
RIGHT JOIN orders ON customers.id = orders.customer_id;

-- Same query as LEFT JOIN (swap table order):
SELECT customers.name, orders.id
FROM orders
LEFT JOIN customers ON orders.customer_id = customers.id;

-- Recommendation: Stick with LEFT JOIN for consistency`,
              explanation: "Most SQL developers prefer LEFT JOIN because it's more readable and supported everywhere."
            },
            practice: "Rewrite a RIGHT JOIN as a LEFT JOIN by switching the table order."
          }
        },
        {
          id: "sql-full-join",
          title: "FULL OUTER JOIN: All Records from Both Tables",
          content: {
            explanation: [
              "FULL OUTER JOIN returns ALL rows from both tables, matching where possible.",
              "If a row exists in left table but not right, right columns are NULL. If in right but not left, left columns are NULL.",
              "Less common than INNER/LEFT joins, but useful for finding discrepancies.",
              "Not all databases support FULL OUTER JOIN (MySQL doesn't, for example)."
            ],
            example: {
              title: "FULL JOIN Use Case",
              code: `-- Find customers without orders AND orders with missing customers:
SELECT 
  customers.name as customer_name,
  orders.id as order_id
FROM customers
FULL OUTER JOIN orders ON customers.id = orders.customer_id
WHERE customers.id IS NULL OR orders.id IS NULL;

-- This reveals:
-- - Customers who never ordered (customer has name, order is NULL)
-- - Orphaned orders (order exists but customer missing)`,
              explanation: "Use FULL JOIN when you need to see all data from both tables, even when relationships are incomplete."
            },
            practice: "When would you use a FULL JOIN instead of a LEFT JOIN?"
          }
        },
        {
          id: "sql-self-join",
          title: "Self Join: Joining a Table to Itself",
          content: {
            explanation: [
              "Sometimes you need to compare rows within the same table. That's a self join.",
              "Use table aliases to give the table two different names in the same query.",
              "Common uses: finding duplicates, employee hierarchies (manager-subordinate), following chains."
            ],
            example: {
              title: "Self Join Examples",
              code: `-- Employee hierarchy (manager relationships):
SELECT 
  e1.name AS employee,
  e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Find products in the same category with similar prices:
SELECT 
  p1.name AS product1,
  p2.name AS product2,
  p1.category,
  p1.price
FROM products p1
INNER JOIN products p2 
  ON p1.category = p2.category 
  AND p1.id < p2.id  -- Avoid duplicate pairs
  AND ABS(p1.price - p2.price) < 10;

-- Find duplicate emails:
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;`,
              explanation: "A self join treats the same table as two separate tables. Use different aliases to keep them straight."
            },
            practice: "Write a self join to find pairs of customers from the same city."
          }
        }
      ]
    },
    // ==================== TOPIC 8: AGGREGATION AND GROUPING ====================
    {
      id: "sql-aggregation",
      title: "Aggregation and Grouping",
      description: "Learn to count, sum, average, and group your data for reports.",
      duration: "60 min",
      subtopics: [
        {
          id: "sql-count",
          title: "COUNT: Counting Rows",
          content: {
            explanation: [
              "COUNT tells you how many rows match your query. It's like asking 'how many?'.",
              "COUNT(*) counts every row. COUNT(column) counts rows where that column is NOT NULL.",
              "COUNT(DISTINCT column) counts unique values in that column."
            ],
            example: {
              title: "Counting Rows",
              code: `-- Count all users:
SELECT COUNT(*) FROM users;
-- Result: 150

-- Count users with email addresses (excludes NULL emails):
SELECT COUNT(email) FROM users;

-- Count unique cities (each city counted once):
SELECT COUNT(DISTINCT city) FROM users;

-- Combine with WHERE:
SELECT COUNT(*) FROM users WHERE age >= 18;

-- Use with alias for clarity:
SELECT COUNT(*) AS active_users FROM users WHERE status = 'active';`,
              explanation: "COUNT(*) is fastest when you just need row count. COUNT(DISTINCT) is great for 'how many different' questions."
            },
            practice: "Write a query to count how many products are in each category."
          }
        },
        {
          id: "sql-sum-avg",
          title: "SUM and AVG: Totals and Averages",
          content: {
            explanation: [
              "SUM adds up all values in a column. Perfect for total sales or total points.",
              "AVG calculates the average (mean) of values. Great for average price or average score.",
              "Both ignore NULL values automatically.",
              "Use ROUND to clean up decimal places."
            ],
            example: {
              title: "Calculating Totals and Averages",
              code: `-- Total revenue from all orders:
SELECT SUM(amount) as total_revenue FROM orders;

-- Average order amount:
SELECT AVG(amount) as avg_order FROM orders;

-- Rounded to 2 decimals:
SELECT ROUND(AVG(amount), 2) as avg_order FROM orders;

-- Total and average by product category:
SELECT 
  category,
  ROUND(AVG(price), 2) as avg_price,
  SUM(price) as total_value,
  COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY total_value DESC;`,
              explanation: "SUM and AVG only work with numeric columns. Use ROUND to control decimal places."
            },
            practice: "Write a query to show average order value per customer, ordered from highest to lowest."
          }
        },
        {
          id: "sql-min-max",
          title: "MIN and MAX: Finding Extremes",
          content: {
            explanation: [
              "MIN finds the smallest value in a column. MAX finds the largest.",
              "They work with numbers, dates, and even text (alphabetical order).",
              "Perfect for finding the cheapest product or newest user."
            ],
            example: {
              title: "Finding Extremes",
              code: `-- Most and least expensive products:
SELECT 
  MIN(price) as cheapest,
  MAX(price) as most_expensive
FROM products;

-- Earliest and latest orders:
SELECT 
  MIN(created_at) as first_order,
  MAX(created_at) as last_order
FROM orders;

-- By category, find the cheapest and most expensive:
SELECT 
  category,
  MIN(price) as cheapest,
  MAX(price) as costliest
FROM products
GROUP BY category;

-- Highest and lowest salary per department:
SELECT 
  department,
  MIN(salary) as lowest_paid,
  MAX(salary) as highest_paid
FROM employees
GROUP BY department;`,
              explanation: "MIN and MAX are great for finding ranges. Combine with GROUP BY to find extremes per category."
            },
            practice: "Write a query to find the highest paid employee in each department."
          }
        },
        {
          id: "sql-group-by",
          title: "GROUP BY: Grouping Data for Aggregation",
          content: {
            explanation: [
              "GROUP BY groups rows that have the same values. You then apply aggregate functions to each group.",
              "Think of it like sorting laundry by color before counting. First group, then calculate.",
              "Any column in your SELECT that isn't an aggregate must be in GROUP BY.",
              "WHERE filters rows before grouping. HAVING filters groups after grouping."
            ],
            example: {
              title: "Grouping Data",
              code: `-- Count users by status:
SELECT status, COUNT(*) as count
FROM users
GROUP BY status;

-- Average price by category, only categories with >5 products:
SELECT 
  category,
  COUNT(*) as product_count,
  ROUND(AVG(price), 2) as avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY avg_price DESC;

-- Multiple group columns:
SELECT 
  category,
  status,
  COUNT(*) as count,
  AVG(price) as avg_price
FROM products
GROUP BY category, status;`,
              explanation: "GROUP BY happens before HAVING. WHERE filters rows before grouping, HAVING filters groups after grouping."
            },
            practice: "Write a query to count orders per month, showing only months with more than 100 orders."
          }
        }
      ]
    },
    // ==================== TOPIC 9: DATA MODIFICATION ====================
    {
      id: "sql-modification",
      title: "Data Modification",
      description: "Learn to insert, update, and delete records in your database.",
      duration: "50 min",
      subtopics: [
        {
          id: "sql-insert",
          title: "INSERT: Adding New Rows",
          content: {
            explanation: [
              "INSERT adds new rows to your table. It's like adding a new row to a spreadsheet.",
              "You tell the database which table, which columns, and what values to put.",
              "Always be careful with INSERT. Once data is added, it stays unless you delete it."
            ],
            example: {
              title: "Adding New Records",
              code: `-- Add one new customer:
INSERT INTO customers (name, email, city) 
VALUES ('Alice Johnson', 'alice@email.com', 'New York');

-- Add multiple customers at once:
INSERT INTO customers (name, email, city) 
VALUES 
  ('Bob Smith', 'bob@email.com', 'London'),
  ('Carol Davis', 'carol@email.com', 'Tokyo');

-- Insert from another table (copy data):
INSERT INTO premium_customers (name, email)
SELECT name, email FROM customers WHERE total_spent > 1000;

-- Insert with specific ID (if your database allows):
INSERT INTO products (id, name, price)
VALUES (100, 'Special Item', 49.99);`,
              explanation: "The order of columns and values must match. Always specify columns - it's safer and more readable."
            },
            practice: "Write an INSERT to add a new product with name 'Wireless Headphones', price 79.99, category 'Electronics'."
          }
        },
        {
          id: "sql-update",
          title: "UPDATE: Changing Existing Data",
          content: {
            explanation: [
              "UPDATE changes values in existing rows. Without WHERE, it updates EVERY row - be careful!",
              "Always use WHERE with UPDATE unless you really mean to change everything.",
              "You can update one column or many columns at once."
            ],
            example: {
              title: "Updating Data Safely",
              code: `-- Update a single customer's city:
UPDATE customers 
SET city = 'Boston' 
WHERE name = 'Alice Johnson';

-- Update multiple columns at once:
UPDATE customers 
SET city = 'Los Angeles', email = 'alice.new@email.com'
WHERE id = 1;

-- Increase all product prices by 10%:
UPDATE products SET price = price * 1.10;

-- Update based on another table:
UPDATE orders 
SET status = 'shipped'
FROM shipments 
WHERE orders.id = shipments.order_id 
AND shipments.shipped_date IS NOT NULL;

-- DANGEROUS! This updates EVERY row:
UPDATE customers SET status = 'active';  -- Don't do this without WHERE!`,
              explanation: "Always test your WHERE condition with a SELECT first to see which rows will be updated."
            },
            practice: "Write an UPDATE to change the price of 'Wireless Headphones' to 69.99."
          }
        },
        {
          id: "sql-delete",
          title: "DELETE: Removing Data",
          content: {
            explanation: [
              "DELETE removes entire rows from your table. Like UPDATE, without WHERE it deletes EVERYTHING.",
              "Once deleted, data is gone. There's no undo button in most databases!",
              "Before deleting, run SELECT with the same WHERE to see what you're about to remove.",
              "Many apps don't actually delete data - they add an 'is_active' column and UPDATE instead."
            ],
            example: {
              title: "Deleting Safely",
              code: `-- First, check what will be deleted:
SELECT * FROM customers WHERE last_order_date < '2020-01-01';

-- Then delete inactive customers:
DELETE FROM customers WHERE last_order_date < '2020-01-01';

-- Delete a specific row by primary key:
DELETE FROM products WHERE id = 42;

-- Delete all rows but keep the table structure:
DELETE FROM log_entries;

-- DANGEROUS! Deletes every row (same as above):
DELETE FROM customers;  -- Make sure you mean it!

-- Safer alternative - just mark as inactive instead of deleting:
UPDATE customers SET is_active = FALSE WHERE last_order_date < '2020-01-01';`,
              explanation: "When in doubt, use UPDATE to mark rows as inactive instead of DELETE. You can always reactivate them later."
            },
            practice: "Write a DELETE to remove all products with price less than $10. First write the SELECT to check."
          }
        }
      ]
    },
    // ==================== TOPIC 10: ADVANCED CONCEPTS ====================
    {
      id: "sql-advanced",
      title: "Advanced Concepts",
      description: "Learn about indexes, transactions, and views for better database performance and reliability.",
      duration: "55 min",
      subtopics: [
        {
          id: "sql-indexes",
          title: "Indexes: Making Queries Faster",
          content: {
            explanation: [
              "Indexes are like book indexes. They help the database find data quickly without scanning every row.",
              "Without an index, finding a specific row is like reading every page of a book to find one word.",
              "With an index, the database jumps directly to the right location.",
              "Downside: Indexes take extra storage and slow down INSERT/UPDATE/DELETE.",
              "Trade-off: Index columns you search on frequently (WHERE, JOIN, ORDER BY)."
            ],
            example: {
              title: "How Indexes Help",
              code: `-- Without index (slow for large tables):
SELECT * FROM customers WHERE last_name = 'Smith';
-- Database scans ALL rows to find matches

-- Create an index on the column you search on:
CREATE INDEX idx_last_name ON customers(last_name);

-- Now the query is fast - database jumps to 'Smith' entries

-- Multiple column index (for searches on both columns):
CREATE INDEX idx_name ON customers(last_name, first_name);

-- Useful for:
-- - WHERE clauses: WHERE last_name = 'Smith'
-- - JOIN conditions: ON customers.id = orders.customer_id
-- - ORDER BY: ORDER BY created_at DESC

-- Unique index (prevents duplicates):
CREATE UNIQUE INDEX idx_email ON users(email);`,
              explanation: "Indexes speed up reads but slow down writes. Find the right balance for your application."
            },
            practice: "What columns would you index in an orders table? Why?"
          }
        },
        {
          id: "sql-transactions",
          title: "Transactions: All or Nothing",
          content: {
            explanation: [
              "A transaction groups multiple operations into one atomic unit. Either ALL succeed, or NONE take effect.",
              "Think of transferring money: withdrawal from account A and deposit to account B must both happen.",
              "If the deposit fails, the withdrawal should roll back (undo).",
              "Transactions use ACID properties: Atomic, Consistent, Isolated, Durable."
            ],
            example: {
              title: "Transaction Example",
              code: `-- Begin a transaction
BEGIN TRANSACTION;

-- Step 1: Withdraw from Alice
UPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';

-- Step 2: Deposit to Bob
UPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';

-- Check if both succeeded (you could check conditions)
-- If everything is good:
COMMIT;
-- Now changes are permanent

-- If something went wrong:
ROLLBACK;
-- Undo both updates, balances unchanged

-- Transaction with error handling:
BEGIN TRANSACTION;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;
INSERT INTO orders (product_id, customer_id) VALUES (1, 100);
-- If inventory had enough quantity and insert succeeded:
COMMIT;
-- Otherwise:
ROLLBACK;`,
              explanation: "Transactions ensure data integrity. Use them whenever multiple related changes must happen together."
            },
            practice: "Why would you use a transaction when moving inventory from one warehouse to another?"
          }
        },
        {
          id: "sql-views",
          title: "Views: Virtual Tables",
          content: {
            explanation: [
              "A view is a saved query that acts like a table. It doesn't store data - it runs the query when you use it.",
              "Views simplify complex queries. Instead of writing a 10-line join every time, create a view.",
              "Views provide security - you can give users access to a view without access to underlying tables.",
              "Some views can be updated (if they map directly to one table). Most are read-only."
            ],
            example: {
              title: "Creating and Using Views",
              code: `-- Create a view for order summaries
CREATE VIEW order_summary AS
SELECT 
  o.id as order_id,
  c.name as customer_name,
  o.order_date,
  SUM(oi.quantity * oi.price) as total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.name, o.order_date;

-- Now query it like a table:
SELECT * FROM order_summary WHERE total_amount > 1000;

-- Create a view for active customers
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE status = 'active' AND last_login > '2024-01-01';

-- Simple views (single table) can sometimes be updatable:
UPDATE active_customers SET email = 'new@email.com' WHERE id = 1;

-- Drop a view when no longer needed:
DROP VIEW order_summary;`,
              explanation: "Views are great for simplifying complex queries, enforcing security, and creating consistent business rules."
            },
            practice: "Create a view that shows each product with its total number of orders and total quantity sold."
          }
        },
        {
          id: "sql-subqueries",
          title: "Subqueries: Queries Inside Queries",
          content: {
            explanation: [
              "A subquery is a SELECT statement inside another SQL statement.",
              "Subqueries can be in SELECT, FROM, or WHERE clauses.",
              "Use them when a single query can't express what you need.",
              "Correlated subqueries reference the outer query - they run once per outer row."
            ],
            example: {
              title: "Subquery Examples",
              code: `-- IN with subquery: Customers who have placed orders
SELECT name FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);

-- Comparison with subquery: Products above average price
SELECT name, price FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- EXISTS: Customers with at least one order
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- Subquery in SELECT (scalar subquery)
SELECT 
  name,
  price,
  (SELECT AVG(price) FROM products) as avg_price,
  price - (SELECT AVG(price) FROM products) as difference
FROM products;

-- Correlated subquery: Products more expensive than average in their category
SELECT name, category, price
FROM products p1
WHERE price > (SELECT AVG(price) FROM products p2 WHERE p2.category = p1.category);`,
              explanation: "Subqueries are powerful but can be slow with large data. Often a JOIN performs better."
            },
            practice: "Write a subquery to find employees who earn more than their department average."
          }
        }
      ]
    }
  ]
};