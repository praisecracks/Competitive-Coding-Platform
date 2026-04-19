import { LearningTrack } from "../data";

export const sqlDatabases: LearningTrack = {
  id: "sql-databases",
  title: "SQL & Databases",
  subtitle: "Beginner to Hero",
  description: "Master SQL queries, database design, and optimization. From basic SELECTs to complex joins and query optimization",
  type: "additional",
  icon: "HardDrive",
  color: "teal",
  coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600",
  totalHours: 25,
  language: "multi",
  category: "SQL",
  topics: [
    {
      id: "sql-basics",
      title: "SQL Fundamentals",
      description: "Basic queries and filtering",
      duration: "55 min",
      subtopics: [
        {
          id: "sql-select",
          title: "SELECT and Filtering",
          content: {
            explanation: [
              "SELECT is the foundation of all SQL queries. It chooses which columns to retrieve.",
              "",
              "Basic syntax: SELECT columns FROM table_name",
              "",
              "Filtering with WHERE:",
              "- Comparison: =, <>, <, >, <=, >=",
              "- Logical: AND, OR, NOT",
              "- Special: IN, BETWEEN, LIKE, IS NULL",
              "",
              "ORDER BY controls output order (ASC/DESC).",
              "LIMIT restricts number of rows returned."
            ],
            example: {
              title: "SELECT Basics",
              code: `-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email, age FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE status = 'active' AND age > 21;

-- IN and BETWEEN
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
SELECT * FROM orders WHERE status IN ('pending', 'processing');

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'J%';  -- starts with J
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Combine operators
SELECT * FROM users 
WHERE age >= 18 AND country = 'US' 
ORDER BY name ASC 
LIMIT 10;`,
              explanation: "Start with SELECT, filter with WHERE, control order with ORDER BY, limit results with LIMIT."
            },
            practice: "Query users over 18 from USA, ordered by name."
          }
        },
        {
          id: "sql-aggregates",
          title: "Aggregate Functions",
          content: {
            explanation: [
              "Aggregate functions perform calculations on groups of rows:",
              "",
              "**COUNT**: Number of rows",
              "**SUM**: Total of values",
              "**AVG**: Average value",
              "**MIN/MAX**: Smallest/largest value",
              "",
              "GROUP BY groups rows for aggregation.",
              "HAVING filters after grouping (WHERE filters before).",
              "",
              "Alias (AS) gives meaningful column names."
            ],
            example: {
              title: "Aggregations",
              code: `-- Count all rows
SELECT COUNT(*) FROM users;

-- Count non-null values
SELECT COUNT(email) FROM users;

-- Sum, AVG, MIN, MAX
SELECT 
  SUM(price) AS total_price,
  AVG(price) AS avg_price,
  MIN(price) AS min_price,
  MAX(price) AS max_price
FROM products;

-- GROUP BY
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category;

-- Having (filter after grouping)
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING COUNT(*) > 5;

-- Multiple aggregations
SELECT 
  category,
  COUNT(*) as total_products,
  AVG(price) as avg_price,
  SUM(stock) as total_stock
FROM products
GROUP BY category
ORDER BY avg_price DESC;`,
              explanation: "WHERE filters rows before grouping, HAVING filters groups after aggregation."
            },
            practice: "Find average order value by customer, filtering for customers with > 3 orders."
          }
        },
        {
          id: "sql-distinct",
          title: "DISTINCT and DISTINCT ON",
          content: {
            explanation: [
              "DISTINCT removes duplicate values:",
              "",
              "SELECT DISTINCT returns unique values.",
              "COUNT(DISTINCT) counts unique values.",
              "",
              "PostgreSQL-specific: DISTINCT ON (column) keeps first row per group.",
              "",
              "Other databases: Use GROUP BY for the same result."
            ],
            example: {
              title: "DISTINCT",
              code: `-- Get unique categories
SELECT DISTINCT category FROM products;

-- Count unique categories
SELECT COUNT(DISTINCT category) FROM products;

-- DISTINCT ON (PostgreSQL)
-- Get cheapest product per category  
SELECT DISTINCT ON (category) *
FROM products
ORDER BY category, price ASC;

-- Equivalent in MySQL (using GROUP BY)
SELECT p.*
FROM products p
INNER JOIN (
  SELECT category, MIN(price) as min_price
  FROM products
  GROUP BY category
) min_prices ON p.category = min_prices.category AND p.price = min_prices.min_price;`,
              explanation: "DISTINCT removes duplicates. Use COUNT(DISTINCT) to count unique values."
            },
            practice: "Find unique email domains from users table."
          }
        },
        {
          id: "sql-case",
          title: "Conditional Logic with CASE",
          content: {
            explanation: [
              "CASE adds conditional logic to SQL:",
              "",
              "CASE WHEN condition THEN result... ELSE default END",
              "",
              "Use cases:",
              "- Categorize data (price ranges)",
              "- Transform values (status labels)",

              "- Conditional aggregation (count specific conditions)"
            ],
            example: {
              title: "CASE Expressions",
              code: `-- Categorize products by price
SELECT 
  name,
  price,
  CASE 
    WHEN price < 10 THEN 'cheap'
    WHEN price < 50 THEN 'moderate'
    ELSE 'expensive'
  END as category
FROM products;

-- Count by category
SELECT 
  CASE 
    WHEN price < 10 THEN 'cheap'
    WHEN price < 50 THEN 'moderate'
    ELSE 'expensive'
  END as category,
  COUNT(*) as count
FROM products
GROUP BY 
  CASE 
    WHEN price < 10 THEN 'cheap'
    WHEN price < 50 THEN 'moderate'
    ELSE 'expensive'
  END;

-- Status labels
SELECT 
  id,
  status,
  CASE status
    WHEN 'pending' THEN 'In Progress'
    WHEN 'completed' THEN 'Done'
    ELSE 'Unknown'
  END as status_label
FROM orders;`,
              explanation: "CASE evaluates conditions in order. First match returns result."
            },
            practice: "Categorize users by age: minor (<18), adult (18-65), senior (>65)."
          }
        }
      ]
    },
    {
      id: "sql-joins",
      title: "Joins",
      description: "Combine tables effectively",
      duration: "65 min",
      subtopics: [
        {
          id: "join-inner",
          title: "INNER and OUTER Joins",
          content: {
            explanation: [
              "Joins combine rows from multiple tables based on a relationship.",
              "",
              "**INNER JOIN**: Only matching rows from both tables.",
              "**LEFT JOIN**: All from left table + matching from right.",
              "**RIGHT JOIN**: All from right table + matching from left.",
              "**FULL OUTER**: All rows from both tables.",
              "",
              "Best practice: Always specify the join type to be explicit."
            ],
            example: {
              title: "Join Types",
              code: `-- INNER JOIN: only matches
SELECT u.name, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: all users, including no orders
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- RIGHT JOIN: all orders (rarely used)
SELECT u.name, o.order_id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER: all users and all orders
SELECT u.name, o.order_id
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- Multiple joins
SELECT 
  u.name,
  o.order_id,
  p.name as product
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;`,
              explanation: "Use LEFT JOIN when you need all rows from one table. INNER JOIN when you only want matches."
            },
            practice: "Find all customers and their orders, including customers with no orders."
          }
        },
        {
          id: "join-self",
          title: "Self Joins and Subqueries",
          content: {
            explanation: [
              "**Self join**: Join a table to itself. Useful for:",
              "- Employee-manager relationships",
              "- Adjacent rows (parent-child)",
              "- Recursive structures",
              "",
              "**Subqueries**: Query inside query. Use:",
              "- WHERE clause (IN, EXISTS)",
              "- FROM clause (derived tables)",
              "- SELECT clause (scalar subqueries)"
            ],
            example: {
              title: "Self Joins and Subqueries",
              code: `-- Self join: employees and managers
SELECT 
  e.name as employee,
  m.name as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Subquery in WHERE
SELECT * FROM products
WHERE category_id IN (
  SELECT category_id FROM categories
  WHERE name = 'Electronics'
);

-- Subquery in FROM (derived table)
SELECT * FROM (
  SELECT category, AVG(price) as avg_price
  FROM products
  GROUP BY category
) category_avg
WHERE avg_price > 50;

-- EXISTS: find users who have orders
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- Correlated subquery: avg price per category
SELECT * FROM products p
WHERE price > (
  SELECT AVG(price) FROM products 
  WHERE category_id = p.category_id
);`,
              explanation: "Self joins need aliases to distinguish columns. Subqueries can replace joins but may be slower."
            },
            practice: "Find all employees who earn more than their manager."
          }
        },
        {
          id: "join-multi",
          title: "Multiple Joins",
          content: {
            explanation: [
              "Complex queries often join > 2 tables. Process:",
              "",
              "1. Start with table with most filters",
              "2. Join tables in logical order",

              "3. Add filters after joins (WHERE)",
              "",
              "Tips:",
              "- Don't join unnecessary tables",
              "- Filter early (before joins)",

              "- Use proper join conditions"
            ],
            example: {
              title: "Complex Joins",
              code: `-- 4-table join
SELECT 
  u.name as customer,
  o.order_id,
  o.created_at,
  p.name as product,
  oi.quantity,
  oi.price * oi.quantity as line_total
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.created_at >= '2024-01-01'
ORDER BY o.created_at DESC;

-- Aggregating across joins
SELECT 
  u.name,
  COUNT(DISTINCT o.order_id) as total_orders,
  SUM(oi.price * oi.quantity) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY u.id, u.name
HAVING SUM(oi.price * oi.quantity) > 1000
ORDER BY total_spent DESC;`,
              explanation: "Filter early to reduce rows before joins. Join only what's needed."
            },
            practice: "Write a query to get monthly revenue by product category."
          }
        },
        {
          id: "join-union",
          title: "UNION and INTERSECT",
          content: {
            explanation: [
              "Set operators combine results:",
              "",
              "**UNION**: All rows (removes duplicates)",
              "**UNION ALL**: All rows (keeps duplicates)",
              "**INTERSECT**: Common rows only",
              "**EXCEPT**: Rows in first but not second",
              "",
              "Requirements: Same number of columns, compatible types."
            ],
            example: {
              title: "Set Operators",
              code: `-- UNION: all unique customers
SELECT email FROM customers
UNION
SELECT email FROM newsletter_subscribers;

-- UNION ALL: keep duplicates
SELECT email FROM customers
UNION ALL
SELECT email FROM newsletter_subscribers;

-- INTERSECT: customers AND subscribers
SELECT email FROM customers
INTERSECT
SELECT email FROM newsletter_subscribers;

-- EXCEPT: customers NOT subscribed
SELECT email FROM customers
EXCEPT
SELECT email FROM newsletter_subscribers;

-- More practical: archived + current orders
SELECT * FROM orders WHERE status = 'active'
UNION ALL
SELECT * FROM orders_archive
ORDER BY created_at DESC;`,
              explanation: "Use UNION ALL when you know there are no duplicates (faster). UNION for distinct values."
            },
            practice: "Find email addresses that appear in both customers and blacklist."
          }
        }
      ]
    },
    {
      id: "sql-indexes",
      title: "Indexes",
      description: "Speed up queries",
      duration: "45 min",
      subtopics: [
        {
          id: "index-basics",
          title: "Index Fundamentals",
          content: {
            explanation: [
              "Indexes are lookup structures that speed up queries:",
              "",
              "Without index: Full table scan (slow).",
              "With index: Binary search (fast O(log n)).",
              "",
              "B-tree is default for most databases.",
              "",
              "Trade-offs:",
              "- Faster reads (SELECT with WHERE)",

              "- Slower writes (INSERT/UPDATE/DELETE)",
              "- More storage space"
            ],
            example: {
              title: "Create Index",
              code: `-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (multi-column)
CREATE INDEX idx_orders_user_date 
ON orders(user_id, created_at DESC);

-- Unique index
CREATE UNIQUE INDEX idx_products_sku 
ON products(sku);

-- Partial index (PostgreSQL) - only for active users
CREATE INDEX idx_active_users 
ON users(email) 
WHERE status = 'active';

-- If index already exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Drop index
DROP INDEX idx_users_email;

-- View indexes
-- MySQL: SHOW INDEX FROM users;
-- PostgreSQL: \d users`,
              explanation: "Create indexes on columns used in WHERE and JOIN. Composite indexes support leading columns."
            },
            practice: "Analyze query and suggest appropriate indexes."
          }
        },
        {
          id: "index-composite",
          title: "Composite Indexes",
          content: {
            explanation: [
              "Composite indexes cover multiple columns:",
              "",
              "Index on (a, b, c) supports:",
              "- Query on a only",
              "- Query on a AND b",
              "- Query on a AND b AND c",
              "",
              "Does NOT support:",
              "- Query on b only",
              "- Query on b AND c",
              "",
              "Column order matters: Put most selective first."
            ],
            example: {
              title: "Composite Index Usage",
              code: `-- Create composite
CREATE INDEX idx_orders_status_date 
ON orders(status, created_at DESC);

-- These queries use the index:
SELECT * FROM orders WHERE status = 'pending';
SELECT * FROM orders WHERE status = 'pending' AND created_at > '2024-01-01';

-- This query does NOT use index:
SELECT * FROM orders WHERE created_at > '2024-01-01';

-- Index column order matters
-- If most queries filter by status first:
CREATE INDEX idx_orders_status_date 
ON orders(status, created_at);

-- If queries vary:
CREATE INDEX idx_orders_status_date ON orders(status, created_at);
CREATE INDEX idx_orders_date ON orders(created_at);`,
              explanation: "Composite index leftmost columns are used first. Order columns by selectivity in queries."
            },
            practice: "Design indexes for a common query: orders by user and status."
          }
        }
      ]
    },
    {
      id: "sql-optimization",
      title: "Query Optimization",
      description: "Make queries fast",
      duration: "55 min",
      subtopics: [
        {
          id: "opt-explain",
          title: "EXPLAIN and Analysis",
          content: {
            explanation: [
              "EXPLAIN shows the query plan: how database executes your query.",
              "",
              "Key terms:",
              "- **Seq Scan**: Full table scan (slow)",
              "- **Index Scan**: Using index (fast)",
              "- **Index Only Scan**: Index covers all (fastest)",
              "- **Hash Join**: In-memory join",
              "- **Nested Loop**: Row-by-row",
              "",
              "EXPLAIN ANALYZE runs and times the query."
            ],
            example: {
              title: "EXPLAIN",
              code: `-- MySQL
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- PostgreSQL
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- With ANALYZE (PostgreSQL) - actually runs
EXPLAIN ANALYZE 
SELECT u.name, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.email LIKE '%@gmail.com';

-- Output interpretation:
-- "Seq Scan on users" = full table scan (bad!)
-- "Index Scan using idx_users_email" = uses index (good)
-- "Index Only Scan" = best (covers all)`,
              explanation: "Look for Index Scan in plan. Seq Scan means table scan (slow). ANALYZE shows actual times."
            },
            practice: "Use EXPLAIN to analyze a slow query."
          }
        },
        {
          id: "opt-patterns",
          title: "Optimization Patterns",
          content: {
            explanation: [
              "Common optimization techniques:",
              "",
              "1. **Add indexes** for WHERE and JOIN columns",
              "2. **Select specific columns**, not SELECT *",
              "3. **Use LIMIT** for testing",
              "4. **Avoid functions** on indexed columns",
              "5. **Use IN with small values**, not massive lists",
              "6. **Prefer EXISTS over IN** for correlated subqueries"
            ],
            example: {
              title: "Fast Queries",
              code: `-- BAD: Select all columns
SELECT * FROM users WHERE id = 1;

-- GOOD: Specific columns
SELECT id, name, email FROM users WHERE id = 1;

-- BAD: Function on column
SELECT * FROM users WHERE UPPER(name) = 'JOHN';

-- GOOD: Index-friendly
SELECT * FROM users WHERE name = 'John';

-- BAD: Large IN list
SELECT * FROM users WHERE id IN (1,2,3,4,5,...1000);

-- GOOD: Use JOIN or EXISTS
SELECT * FROM users u 
WHERE EXISTS (
  SELECT 1 FROM big_list b WHERE b.user_id = u.id
);

-- BAD:
SELECT DISTINCT u.*
FROM users u JOIN orders o ON u.id = o.user_id;

-- GOOD:
SELECT u.id FROM users u INNER JOIN (...)`,
              explanation: "Start optimized and add WHERE to limit early. Don't SELECT * when you only need a few columns."
            },
            practice: "Rewrite an inefficient query to be faster."
          }
        },
        {
          id: "opt-partition",
          title: "Partitioning",
          content: {
            explanation: [
              "Partitioning splits large tables into smaller pieces:",
              "",
              "**Range partitions**: By date ranges",
              "**List partitions**: By category values",
              "**Hash partitions**: Even distribution",
              "",
              "Benefits:",
              "- Faster queries (scan relevant partition only)",
              "- Easier maintenance (archive/delete partitions)",

              "- Better data organization"
            ],
            example: {
              title: "Table Partitioning",
              code: `-- Range partition by date (PostgreSQL)
CREATE TABLE orders (
    id SERIAL,
    created_at TIMESTAMP,
    status VARCHAR(20)
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Query automatically uses relevant partition
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-03-31';

-- List partition
CREATE TABLE products (
    id SERIAL,
    category VARCHAR(20)
) PARTITION BY LIST (category);

CREATE TABLE electronics PARTITION OF products
    FOR VALUES IN ('electronics', 'gadgets');`,
              explanation: "Partitions look like regular tables. Queries automatically skip irrelevant partitions."
            },
            practice: "Design partition strategy for an orders table."
          }
        }
      ]
    },
    {
      id: "sql-database-design",
      title: "Database Design",
      description: "Schema design and normalization",
      duration: "60 min",
      subtopics: [
        {
          id: "db-normalization",
          title: "Normalization Forms",
          content: {
            explanation: [
              "Normalization organizes data to reduce redundancy:",
              "",
              "**1NF**: Atomic values, no repeating groups",
              "- Each column has single value",
              "",
              "**2NF**: No partial dependencies",
              "- Non-key columns depend on entire primary key",
              "",
              "**3NF**: No transitive dependencies",
              "- Non-key columns don't depend on other non-keys",
              "",
              "Higher normal forms = less redundancy, more tables."
            ],
            example: {
              title: "Normalization",
              code: `-- NOT 1NF: repeating values in column
-- orders: 1, 'John', 'item1,item2'

-- 1NF: atomic values
orders: 1, 'John', 'item1'
orders: 1, 'John', 'item2'

-- NOT 2NF: partial dependency
-- order_items: (order_id, product_id), product_name
-- product_name depends on product_id, not full key

-- 2NF: separate tables
order_items: order_id, product_id
products: product_id, product_name

-- NOT 3NF: transitive dependency  
-- users: user_id, name, department, department_head
-- department_head depends on department, not user_id

-- 3NF: normalize dependency
users: user_id, name, department_id
departments: department_id, department_name, department_head`,
              explanation: "1NF: single values per cell. 2NF: full primary key determines columns. 3NF: columns depend only on primary key."
            },
            practice: "Normalize a denormalized customer_orders table."
          }
        },
        {
          id: "db-keys",
          title: "Keys and Constraints",
          content: {
            explanation: [
              "Keys uniquely identify rows:",
              "",
              "**PRIMARY KEY**: Unique identifier, NOT NULL",
              "- One per table",
              "- Auto-increment or UUID",
              "",
              "**FOREIGN KEY**: References another table",
              "- Enforces referential integrity",
              "- ON DELETE CASCADE, SET NULL",
              "",
              "**UNIQUE**: No duplicates (but can be NULL)",
              "**CHECK**: Custom validation"
            ],
            example: {
              title: "Constraints",
              code: `-- Primary key
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Composite primary key
CREATE TABLE order_items (
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1,
    PRIMARY KEY (order_id, product_id)
);

-- Foreign key with cascade
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint
CREATE TABLE users (
    email VARCHAR(255) UNIQUE NOT NULL,
    -- or
    CONSTRAINT unique_email UNIQUE (email)
);

-- Check constraint
CREATE TABLE products (
    price DECIMAL(10,2) CHECK (price > 0),
    quantity INT CHECK (quantity >= 0)
);

-- Composite foreign key
REFERENCES orders(order_id, product_id)`,
              explanation: "Primary key is core identity. Foreign keys connect tables. Use CHECK for validation."
            },
            practice: "Create a properly constrained schema for a blog."
          }
        },
        {
          id: "db-design",
          title: "Schema Design",
          content: {
            explanation: [
              "Good schema design process:",
              "",
              "1. **Identify entities**: Nouns in requirements",
              "2. **Identify relationships**: one-to-one, one-to-many, many-to-many",
              "3. **Define keys**: Primary and foreign keys",

              "4. **Add attributes**: Columns for each entity",
              "5. **Apply constraints**: NOT NULL, UNIQUE, CHECK",
              "",
              "Many-to-many requires junction table."
            ],
            example: {
              title: "Schema Design",
              code: `-- Entities and relationships:
-- Users have Orders (one-to-many)
-- Orders have Products (many-to-many via OrderItems)
-- Products have Categories (many-to-one)

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table (one-to-many with users)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table (many-to-one with categories)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0)
);

-- OrderItems junction table (many-to-many)
CREATE TABLE order_items (
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);`,
              explanation: "Identify entities and relationships first. Use junction tables for many-to-many relationships."
            },
            practice: "Design schema for an e-learning platform with courses and enrollments."
          }
        }
      ]
    }
  ]
};