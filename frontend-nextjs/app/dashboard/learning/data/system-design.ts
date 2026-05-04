import { LearningTrack } from "../data";

export const systemDesign: LearningTrack = {
  id: "system-design",
  title: "System Design",
  subtitle: "Beginner to System Architecture",
  description: "Complete system design journey from understanding what makes apps scale to building reliable, high-performance systems. Every concept taught with real-world stories and analogies.",
  type: "additional",
  icon: "CircuitBoard",
  color: "orange",
  coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
  totalHours: 52,
  language: "multi",
  category: "System Design",
  topics: [
    // ==================== TOPIC 1: INTRODUCTION TO SYSTEM DESIGN ====================
    {
      id: "sd-introduction",
      title: "Introduction to System Design",
      description: "Understand what system design means and why it matters for building real-world applications.",
      duration: "50 min",
      subtopics: [
        {
          id: "sd-what-is-system-design",
          title: "What is System Design?",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "System design is the art of planning how an application works behind the scenes. It answers: 'How do we handle millions of users?'",
              "Think about Instagram. One person posting a photo is easy. But 500 million people posting? That's a system design challenge.",
              "A good system design makes your app FAST, RELIABLE, and SCALABLE. It doesn't crash when lots of people use it.",
              "Bad system design? Your app freezes on New Year's Eve when everyone tries to send 'Happy New Year' messages at once.",
              "System design is like urban planning. One house is easy. A city of millions needs roads, traffic lights, and public transit."
            ],
            example: {
              title: "The Lemonade Stand Analogy",
              code: `// Stage 1: One customer
// You: One pitcher of lemonade. One friend helping.
// Works fine for 10 customers.

// Stage 2: 100 customers (School Fair)
// Problem: Long lines! People get angry and leave.
// Solution: Add 3 more friends, more pitchers.

// Stage 3: 10,000 customers (City Festival)
// Problem: Can't make enough lemonade fast enough.
// Solution: Build a factory, hire delivery trucks, add online ordering.

// System design is planning for Stage 3 before Stage 2 breaks.`,
              explanation: "Small systems are simple. Large systems need careful planning. System design helps you grow without breaking."
            },
            practice: "Think of an app you love that got slow or crashed when it became popular. Why did that happen?"
          }
        },
        {
          id: "sd-why-matters",
          title: "Why System Design Matters",
          type: "read",
          duration: "10 min",
          content: {
            explanation: [
              "Every popular app started small. Twitter began with a few thousand users. Now it handles millions of tweets per minute.",
              "Without good design, success can kill your app. That's called the 'success disaster'.",
              "Amazon handles 2.5 million orders per DAY during holidays. That's 30 orders per second!",
              "Good design saves money. A poorly designed system might need 100 servers. A good design needs 10 servers.",
              "System design separates toy projects from real companies. Anyone can build for 100 users. Few can build for 100 million."
            ],
            example: {
              title: "Numbers Tell the Story",
              code: `// Small app (100 users):
// - 1 server (like a laptop)
// - Cost: $50/month
// - Works fine

// Medium app (10,000 users):
// - 5 servers
// - Cost: $500/month
// - Need load balancing

// Large app (1,000,000 users):
// - 100+ servers across multiple locations
// - Cost: $10,000+/month
// - Need databases, caching, CDNs, queues

// System design chooses the right setup for each stage.`,
              explanation: "What works for 100 users breaks for 10,000. System design helps you plan for growth without rebuilding everything."
            },
            practice: "List 3 apps that grew very fast. Did they have outages during their growth?"
          }
        },
        {
          id: "sd-history",
          title: "The Story of System Design",
          type: "read",
          duration: "8 min",
          content: {
            explanation: [
              "In the early days of the internet (1990s), websites were simple. One server, one database. That was enough.",
              "Then came Google, Amazon, and Facebook. They grew so fast that one server couldn't keep up. Engineers had to invent new ways to scale.",
              "They created load balancers, caches, and distributed databases. These became the building blocks of modern system design.",
              "Today, system design is a formal discipline. Engineers study patterns that work (and failures that don't).",
              "The best lessons come from outages. When a big site goes down, engineers learn what NOT to do."
            ],
            example: {
              title: "Famous Outages",
              code: `// 2009: Twitter's "Fail Whale"
// Too many users at once. Site kept crashing.
// Lesson: Plan for traffic spikes.

// 2012: Amazon Prime Day outage
// Too many orders at once. Database couldn't keep up.
// Lesson: Scale databases before you need them.

// 2021: Facebook DNS outage
// One configuration change took down all of Facebook.
// Lesson: Test changes carefully. Have rollback plans.

// Every outage teaches us something about system design.`,
              explanation: "The best system designers learn from past failures. Understanding why systems break helps you build stronger ones."
            },
            practice: "Research one major internet outage. What caused it? How could better design have prevented it?"
          }
        },
        {
          id: "sd-building-blocks",
          title: "The Building Blocks of Systems",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "Every system has the same basic ingredients. Just like a house has walls, roof, and doors.",
              "CLIENTS: Your phone, laptop, or browser. They ASK for things.",
              "SERVERS: Powerful computers that ANSWER requests. They do the heavy work.",
              "DATABASES: Where data lives permanently. User profiles, posts, messages all stored here.",
              "CACHES: Fast temporary storage. Like your brain remembering an answer.",
              "LOAD BALANCERS: Traffic cops. They decide which server handles each request.",
              "MESSAGE QUEUES: Like a task list. Helps services talk without waiting."
            ],
            example: {
              title: "The Restaurant Analogy",
              code: `// Restaurant = Your System
// - CLIENTS = You (the hungry customer)
// - SERVER = Waiter (takes your order)
// - KITCHEN = Application Server (cooks your food)
// - FRIDGE = Database (stores ingredients)
// - PRE-MADE DISHES = Cache (ready-to-serve popular items)
// - HOST = Load Balancer (seats you at an available table)
// - ORDER TICKET BOARD = Message Queue (orders waiting to be cooked)

// Without load balancer: Some tables get 10 customers, some get zero.
// Without cache: Every meal cooked from scratch. Slow!
// Without message queue: Waiter waits at kitchen for food. Customer waits longer.`,
              explanation: "Each building block has a job. Together, they create a system that can handle thousands of requests at once."
            },
            practice: "Draw a simple diagram of how you think Instagram works. Label the clients, servers, databases, and caches."
          }
        }
      ]
    },
    // ==================== TOPIC 2: SCALING BASICS ====================
    {
      id: "sd-scaling-basics",
      title: "Scaling: Growing Your System",
      description: "Learn how to handle more users without breaking your app.",
      duration: "55 min",
      subtopics: [
        {
          id: "sd-vertical-scaling",
          title: "Vertical Scaling: Getting a Bigger Server",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "Vertical scaling means making your existing server MORE POWERFUL. More RAM, faster CPU, bigger storage.",
              "It's like upgrading from a sedan to a truck. Same vehicle, just bigger and stronger.",
              "Vertical scaling is SIMPLE. No code changes needed. Just pay for a better server.",
              "BUT there's a limit. You can only make one server so powerful.",
              "Also, bigger servers get EXPENSIVE. Double the power often costs more than double the price."
            ],
            example: {
              title: "Vertical Scaling Example",
              code: `// Start: 2 CPU, 4GB RAM → 1,000 users → $50/month
// Upgrade: 4 CPU, 8GB RAM → 2,000 users → $150/month
// Upgrade: 16 CPU, 64GB RAM → 8,000 users → $800/month
// Eventually you can't get bigger servers.`,
              explanation: "Vertical scaling is great for starting out. But costs grow faster than capacity."
            },
            practice: "What's the biggest server you've ever heard of? Why might even that not be enough for some apps?"
          }
        },
        {
          id: "sd-horizontal-scaling",
          title: "Horizontal Scaling: Adding More Servers",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "Horizontal scaling means adding MORE servers instead of bigger ones.",
              "It's like opening more checkout lanes at a grocery store.",
              "Horizontal scaling has NO theoretical limit. Need 10x users? Add 10x servers.",
              "Key requirement: Make services STATELESS. Don't store user data in server memory!"
            ],
            example: {
              title: "Horizontal Scaling in Action",
              code: `// One server: handles all 1,000 users. If it crashes? Site down!

// Ten servers with load balancer:
// Server 1: users 1-100
// Server 2: users 101-200
// ...
// Server 10: users 901-1000

// If Server 5 crashes: Only 100 users lose connection!
// Key: Store sessions in Redis, not server memory!`,
              explanation: "Horizontal scaling is how Google, Facebook, and Amazon handle billions of users."
            },
            practice: "Why do large websites sometimes go down for 'some users' but not everyone?"
          }
        },
        {
          id: "sd-load-balancers",
          title: "Load Balancers: The Traffic Directors",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "A load balancer sits in front of your servers. Every request hits the load balancer FIRST.",
              "Common rules: Round Robin (server 1, then 2, then 3). Least Connections (send to least busy). IP Hash (same user to same server).",
              "Health checks: Load balancer regularly asks 'Are you alive?' If a server dies, traffic stops."
            ],
            example: {
              title: "Load Balancer in Action",
              code: `// Round Robin example:
// Request 1: Server 1
// Request 2: Server 2
// Request 3: Server 3
// Request 4: Server 1 (cycles back)

// Health check configuration:
// Check every 10 seconds
// Mark server unhealthy after 3 failed checks
// Stop sending traffic to unhealthy servers`,
              explanation: "Load balancers make horizontal scaling possible. Without them, some servers would be overloaded while others sit idle."
            },
            practice: "If you run a website with 100 servers and one server stops responding, what should the load balancer do?"
          }
        },
        {
          id: "sd-stateless",
          title: "Stateless vs Stateful Services",
          type: "read",
          duration: "10 min",
          content: {
            explanation: [
              "STATELESS: Doesn't remember anything between requests. Like a vending machine.",
              "STATEFUL: Remembers things. Like a shopping cart.",
              "Stateless services are EASY to scale. Stateful services are HARD to scale.",
              "Best practice: Make services stateless. Store state in databases or caches."
            ],
            example: {
              title: "Stateless vs Stateful",
              code: `// STATELESS (good for scaling):
function getUserProfile(userId) {
    return db.query("SELECT * FROM users WHERE id = ?", userId);
}
// Any server can handle any request!

// STATEFUL (bad for scaling):
let sessions = {}; // Stored in server memory!
function login(userId) {
    sessions[userId] = { loggedIn: true };
}
// If Server 1 crashes, user's session is gone!

// FIX: Store sessions in Redis (shared cache)`,
              explanation: "Stateless services scale easily. Move state out of servers and into shared databases or caches."
            },
            practice: "Is a file upload service stateless or stateful? What about a chat room service?"
          }
        }
      ]
    },
    // ==================== TOPIC 3: DATABASE SCALING ====================
    {
      id: "sd-database-scaling",
      title: "Database Scaling",
      description: "Learn how to handle massive amounts of data and queries.",
      duration: "50 min",
      subtopics: [
        {
          id: "sd-read-replicas",
          title: "Read Replicas: Distribute the Load",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "Most apps read data way more than they write. Instagram: 100 reads for every 1 write.",
              "Read replicas are copies of your database that handle ONLY read queries.",
              "Trade-off: Replicas are eventually consistent. Writes may take seconds to appear.",
              "Perfect for: News feeds, product catalogs. Not for: Banking balances."
            ],
            example: {
              title: "Read Replicas Architecture",
              code: `//      [Primary DB] (handles writes)
//         ↓        ↓
//    [Replica 1] [Replica 2] (handle reads)

function getUser(id) {
    // Try read replica first
    let user = replicaDB.query("SELECT * FROM users WHERE id = ?", id);
    if (user) return user;
    // Fall back to primary
    return primaryDB.query("SELECT * FROM users WHERE id = ?", id);
}

function createUser(user) {
    // Writes always go to primary
    return primaryDB.insert("users", user);
}`,
              explanation: "Read replicas are the easiest way to scale databases. Most apps are 90% reads!"
            },
            practice: "Would a banking app use read replicas for account balances? Why or why not?"
          }
        },
        {
          id: "sd-database-indexes",
          title: "Database Indexes: Finding Data Fast",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "An index is like a book's index. Instead of reading every page, you jump to the right page.",
              "Without index: Full table scan (slow). With index: Instant lookup (fast).",
              "Trade-off: Indexes make reads faster but writes slower (must update the index)."
            ],
            example: {
              title: "Indexes Explained",
              code: `// Without index: checks 1,000,000 rows → Slow!
// With index: finds row instantly → Fast!

// Create index:
CREATE INDEX idx_users_email ON users(email);

// Now this query is lightning fast:
SELECT * FROM users WHERE email = 'alice@example.com';

// When NOT to index:
// - Very small tables (< 100 rows)
// - Columns that change often
// - Columns rarely used in WHERE`,
              explanation: "Indexes are the #1 way to speed up slow queries. Add them on columns used in WHERE, JOIN, and ORDER BY."
            },
            practice: "If a query is slow, what columns should you consider indexing first?"
          }
        },
        {
          id: "sd-sharding",
          title: "Sharding: Splitting Data Across Databases",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "Sharding splits your data across multiple databases. Each database (shard) holds a portion.",
              "Think: Filing cabinet A has A-M, cabinet B has N-Z.",
              "Challenge 1: Choosing the right SHARD KEY.",
              "Challenge 2: Queries that need data from multiple shards become harder.",
              "Only shard when you have millions of rows."
            ],
            example: {
              title: "Sharding Example",
              code: `// Sharding by user_id:
// Shard 1: users 1-1000
// Shard 2: users 1001-2000
// Shard 3: users 2001-3000

// To find a user:
shard_id = (user_id % 3) + 1
// user_id 500 → 500 % 3 = 2 → Shard 2

// Complexity: Getting a user's posts
// - User might be in Shard 2
// - Their posts might be in Shard 1
// - Need to query both shards!`,
              explanation: "Sharding is powerful but complex. Start with read replicas first. Only shard when necessary."
            },
            practice: "If you were sharding a messaging app, would you shard by sender_id or receiver_id? What's the problem?"
          }
        },
        {
          id: "sd-cdn",
          title: "CDN: Content Delivery Networks",
          type: "read",
          duration: "10 min",
          content: {
            explanation: [
              "A CDN brings your content closer to users. It caches static assets worldwide.",
              "Without CDN: User in Australia downloads from New York. Slow!",
              "With CDN: Image stored in Australia. Lightning fast!",
              "Always use a CDN for images, CSS, and JavaScript files."
            ],
            example: {
              title: "CDN in Action",
              code: `// Without CDN: 300ms latency
// With CDN: 5ms latency (60x faster!)

// Cache headers:
Cache-Control: public, max-age=31536000  // Cache 1 year
Cache-Control: public, max-age=60        // Cache 60 seconds
Cache-Control: private                    // Don't cache`,
              explanation: "CDNs make your site load faster everywhere. It's cheap and effective."
            },
            practice: "What types of content should NOT be cached on a CDN? Why?"
          }
        }
      ]
    },
    // ==================== TOPIC 4: CACHING ====================
    {
      id: "sd-caching",
      title: "Caching Strategies",
      description: "Learn to make your system faster by remembering answers.",
      duration: "50 min",
      subtopics: [
        {
          id: "sd-cache-basics",
          title: "What is Caching?",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "A cache is temporary storage for frequently accessed data.",
              "Database reads: milliseconds. Cache reads: microseconds. 1000x faster!",
              "Perfect for: User profiles, product details, configuration.",
              "Trade-off: Cached data can become stale (outdated)."
            ],
            example: {
              title: "Cache-Aside Pattern",
              code: `function getUser(userId) {
    // 1. Check cache first
    let user = redis.get("user:" + userId);
    if (user) return JSON.parse(user); // Cache hit! Fast!
    
    // 2. Cache miss - get from database (slow)
    user = db.query("SELECT * FROM users WHERE id = ?", userId);
    
    // 3. Store in cache for next time
    redis.setex("user:" + userId, 3600, JSON.stringify(user));
    return user;
}`,
              explanation: "Cache-aside is the most common pattern. Always check cache first, fall back to database."
            },
            practice: "What happens if the cache server crashes? Does the application still work?"
          }
        },
        {
          id: "sd-cache-invalidation",
          title: "Cache Invalidation",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "'There are only two hard things: cache invalidation and naming things.'",
              "Three main strategies:",
              "1. TIME-BASED (TTL): Cache expires after fixed time. Simplest.",
              "2. WRITE-THROUGH: Update cache AND database together. Freshest.",
              "3. WRITE-BEHIND: Update cache immediately, database later. Fastest."
            ],
            example: {
              title: "Cache Invalidation Strategies",
              code: `// Strategy 1: Time-based (Simplest)
redis.setex("user:123", 300, JSON.stringify(user)); // 5 min TTL

// Strategy 2: Write-through (Fresh)
function updateUser(userId, newData) {
    db.update("users", newData, "id = ?", userId);
    redis.set("user:" + userId, JSON.stringify(newData));
}

// Strategy 3: Write-behind (Fast)
function updateUser(userId, newData) {
    redis.set("user:" + userId, JSON.stringify(newData));
    queue.add("db-update", { userId, newData });
}`,
              explanation: "Choose strategy based on your needs. TTL for simple cases. Write-through for banking."
            },
            practice: "For a weather app, what's a good TTL? For a stock price app? For a user's profile picture?"
          }
        },
        {
          id: "sd-cache-types",
          title: "Types of Caches",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "1. **Application Memory Cache**: Fastest, lost on restart. Single server only.",
              "2. **Distributed Cache** (Redis): Shared across servers, survives restarts.",
              "3. **CDN Cache**: For static assets close to users.",
              "4. **Database Query Cache**: Built-in, for repeated identical queries."
            ],
            example: {
              title: "Choosing the Right Cache",
              code: `// In-memory cache (single server):
const cache = new Map();

// Redis (multiple servers):
const user = await redis.get("user:" + userId);

// When to upgrade to Redis:
// - You have multiple servers
// - Data needs to be consistent across servers
// - Cache needs to survive restarts`,
              explanation: "Use in-memory for single-server. Use Redis for multiple servers. Use CDN for static files."
            },
            practice: "If you have 10 servers, why can't you use in-memory cache for user sessions?"
          }
        },
        {
          id: "sd-cache-patterns",
          title: "Advanced Cache Patterns",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "1. **Cache Warming**: Pre-fill cache before traffic hits.",
              "2. **Cache Stampede Prevention**: Only one request fetches on cache miss.",
              "3. **Hot Keys**: Popular data that gets hammered. Replicate across servers."
            ],
            example: {
              title: "Cache Stampede Prevention",
              code: `// Problem: Cache expires at 12:00
// 1,000 requests hit database at once! Database crashes.

// Solution: Use a lock
if (!data) {
    const acquired = await redis.setnx(lockKey, "locked");
    if (acquired) {
        // Only ONE request does the query
        const freshData = await db.query(...);
        await redis.setex(key, 300, JSON.stringify(freshData));
        await redis.del(lockKey);
        return freshData;
    } else {
        // Other requests wait and retry
        await sleep(100);
        return getCachedUser(id);
    }
}`,
              explanation: "Cache stampede happens when popular cache expires and everyone hits the database. Use locks to prevent it."
            },
            practice: "How would you handle a 'hot key' - a single user profile that gets 1 million views per minute?"
          }
        }
      ]
    },
    // ==================== TOPIC 5: API DESIGN ====================
    {
      id: "sd-api-design",
      title: "API Design",
      description: "Learn to design APIs that are easy to use and hard to misuse.",
      duration: "55 min",
      subtopics: [
        {
          id: "sd-api-basics",
          title: "What is an API?",
          type: "read",
          duration: "10 min",
          content: {
            explanation: [
              "API = Application Programming Interface. How software talks to each other.",
              "Think of a restaurant menu. You (client) order. Kitchen (server) makes it.",
              "APIs hide complexity. You don't need to know how the kitchen works.",
              "When your phone shows weather, it calls a weather API."
            ],
            example: {
              title: "API in Everyday Life",
              code: `// You don't need to know how this works:
// https://api.weather.com/v1/forecast?city=London

// API Response:
{
    "city": "London",
    "temperature": 18,
    "condition": "Cloudy"
}

// The API hides all complexity behind the scenes.`,
              explanation: "APIs are contracts. 'If you send me this, I'll send you that.'"
            },
            practice: "List 3 APIs you use every day without thinking about them."
          }
        },
        {
          id: "sd-rest-basics",
          title: "REST API Principles",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "REST is the most common API design. Uses HTTP methods and URLs.",
              "Resources are NOUNS (users, orders). NOT verbs (getUser).",
              "GET = read, POST = create, PUT = update, DELETE = remove.",
              "Status codes tell what happened: 200 (OK), 404 (Not found), 500 (Error)."
            ],
            example: {
              title: "Good REST API Design",
              code: `// Good REST API (noun-based)
GET    /api/users           // List users
GET    /api/users/123       // Get user 123
POST   /api/users           // Create user
PUT    /api/users/123       // Update user
DELETE /api/users/123       // Delete user

// Bad REST API (verb-based - DON'T DO!)
GET    /api/getUser?id=123
POST   /api/createUser

// Status codes:
200 OK - Everything worked
201 Created - New resource created
400 Bad Request - Client sent bad data
401 Unauthorized - Not logged in
403 Forbidden - No permission
404 Not Found - Doesn't exist
500 Internal Error - Server broke`,
              explanation: "Use nouns for resources. Use HTTP methods for actions. Use status codes for results."
            },
            practice: "Design a REST API for a library. What endpoints for books, authors, and borrowers?"
          }
        },
        {
          id: "sd-api-versioning",
          title: "API Versioning",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "APIs change over time. Versioning prevents breaking existing users.",
              "Most common: URL path versioning (/v1/users, /v2/users).",
              "Best practice: Version from day one. Even before you need it.",
              "Deprecation: Announce new version, give 6-12 months to migrate, then turn off old."
            ],
            example: {
              title: "API Versioning",
              code: `// Both versions work simultaneously:
// v1 returns: { "user_id": 123, "user_name": "Alice" }
// v2 returns: { "id": 123, "name": "Alice", "created_at": "2024-01-01" }

// Deprecation strategy:
// 1. Announce v2 available
// 2. Mark v1 as "deprecated"
// 3. Give users 6 months to migrate
// 4. Turn off v1

// Never break existing users without warning!`,
              explanation: "Version your API from the start. When you need breaking changes, create a new version."
            },
            practice: "You want to rename 'user_id' to 'id' in your API. How do you do this without breaking existing apps?"
          }
        },
        {
          id: "sd-api-query",
          title: "Query Parameters",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "Query parameters let clients filter, sort, and paginate results.",
              "Pagination: ?page=2&limit=20",
              "Filtering: ?status=active&category=electronics",
              "Sorting: ?sort=price&order=desc",
              "Always paginate lists. A million records will crash both client and server."
            ],
            example: {
              title: "Using Query Parameters",
              code: `// Pagination
GET /api/users?page=2&limit=20

// Filtering
GET /api/products?category=electronics&min_price=10

// Sorting
GET /api/users?sort=created_at&order=desc

// Combined
GET /api/products?page=1&limit=10&category=electronics&sort=price&order=asc

// Response includes metadata:
{
    "data": [...],
    "meta": {
        "page": 2,
        "per_page": 20,
        "total": 1543,
        "total_pages": 78
    }
}`,
              explanation: "Query parameters make APIs flexible. Always paginate lists. Use consistent naming."
            },
            practice: "Design query parameters for a search endpoint that searches products by name, category, and price range."
          }
        }
      ]
    },
    // ==================== TOPIC 6: MESSAGE QUEUES ====================
    {
      id: "sd-message-queues",
      title: "Message Queues",
      description: "Learn to decouple services and handle background tasks.",
      duration: "50 min",
      subtopics: [
        {
          id: "sd-mq-basics",
          title: "What is a Message Queue?",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "A message queue is like a task list. One service adds tasks, another works on them.",
              "Without queue: User uploads video → waits 45 seconds → response. Slow!",
              "With queue: User uploads video → gets response in 100ms → background processes.",
              "Benefits: Faster responses, handles traffic spikes, services can fail gracefully."
            ],
            example: {
              title: "Message Queue in Action",
              code: `// WITHOUT queue: User waits 45 seconds!
app.post("/upload-video", async (req, res) => {
    await convertVideo(video);      // 30 seconds
    await generateThumbnail(video); // 5 seconds
    await uploadToCDN(video);       // 10 seconds
    res.json({ success: true });
});

// WITH queue: Response in 100ms!
app.post("/upload-video", async (req, res) => {
    queue.send("video-processing", { videoId: video.id });
    res.json({ success: true, message: "Processing in background" });
});`,
              explanation: "Message queues make slow operations background tasks. User gets immediate response."
            },
            practice: "What operations in a food delivery app could be handled by message queues?"
          }
        },
        {
          id: "sd-mq-patterns",
          title: "Work Queue vs Pub/Sub",
          type: "read",
          duration: "14 min",
          content: {
            explanation: [
              "WORK QUEUE: One message, ONE worker. Perfect for background jobs.",
              "PUB/SUB: One message, ALL subscribers. Perfect for events.",
              "Work queues help with LOAD BALANCING. Pub/Sub helps with EVENT DRIVEN architecture."
            ],
            example: {
              title: "Work Queue vs Pub/Sub",
              code: `// WORK QUEUE: One message, ONE worker
queue.send("image-resize", { imageId: 123 });
// Only ONE worker resizes this image

// PUB/SUB: One message, ALL subscribers
publisher.publish("user.registered", { userId: 123 });
// Email service gets it → sends welcome email
// Analytics gets it → records registration
// CRM gets it → adds to database

// Real system combines both:
publisher.publish("order.created", order);
// Email: sends receipt
// Inventory: updates stock
// Payment: processes payment (work queue)`,
              explanation: "Work queues distribute tasks. Pub/Sub broadcasts events to all subscribers."
            },
            practice: "For a ride-sharing app when a ride is requested: finding drivers, notifying driver app, logging analytics - which pattern for which?"
          }
        },
        {
          id: "sd-mq-examples",
          title: "Real-World Queue Examples",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "Example 1: Sending emails. Queue it, respond quickly, send later.",
              "Example 2: Processing payments. Queue it, return 'processing', webhook when done.",
              "Example 3: Black Friday traffic spike. Queue stores all orders, workers process at safe speed."
            ],
            example: {
              title: "Black Friday Example",
              code: `// Without queue: 10,000 requests/sec, server handles 1,000 → CRASH!

// With queue: 
app.post("/order", async (req, res) => {
    queue.send("order-processing", order);
    res.json({ success: true, status: "processing" });
    // Response in 10ms!
});
// Queue stores all 10,000 orders
// Workers process at 1,000 per second
// After 10 seconds, all orders done
// No crash! No lost orders!`,
              explanation: "Queues act as shock absorbers. When traffic spikes, queue stores requests. Workers process at safe speed."
            },
            practice: "Your app needs to generate a PDF report for users. It takes 30 seconds. Should you do it synchronously or with a queue? Why?"
          }
        },
        {
          id: "sd-mq-failure",
          title: "Handling Failures",
          type: "read",
          duration: "12 min",
          content: {
            explanation: [
              "Queues make your system resilient. If a worker crashes, the message returns to queue.",
              "'At-least-once' delivery: Task will be done at least once (maybe more).",
              "Dead Letter Queue (DLQ): Failed messages go here after too many retries. Manual review needed."
            ],
            example: {
              title: "Resilience Example",
              code: `// With retries:
queue.consume("payment", async (task) => {
    try {
        await processPayment(task);
    } catch (error) {
        if (task.retryCount < 3) {
            // Retry: 1s, then 2s, then 4s
            queue.retry(task, delay: 2 ** task.retryCount);
        } else {
            // Failed 3 times → Dead Letter Queue
            queue.sendToDLQ(task, error);
            // Alert team: Fix this order manually
        }
    }
});

// Key principle: Assume services will fail.
// Design your system to handle failures gracefully.`,
              explanation: "Queues add resilience. If something fails, retry. If it keeps failing, move to Dead Letter Queue for manual review."
            },
            practice: "Why is 'at-least-once' delivery acceptable for sending a welcome email but not for charging a credit card?"
          }
        }
      ]
    },
    // ==================== TOPIC 7: HANDS-ON DESIGN EXERCISES ====================
    {
      id: "sd-design-exercises",
      title: "Hands-On Design Exercises",
      description: "Apply everything you've learned to design real systems step by step.",
      duration: "90 min",
      subtopics: [
        {
          id: "sd-design-url-shortener",
          title: "Design a URL Shortener (like bit.ly)",
          type: "interactive",
          duration: "25 min",
          content: {
            explanation: [
              "Let's design a URL shortener step by step. This is a classic system design interview question.",
              "",
              "**Step 1: Understand Requirements**",
              "- Users enter a long URL → get a short code (e.g., bit.ly/abc123)",
              "- When someone visits the short URL, they get redirected to the original",
              "- Need analytics: count clicks, track referrers",
              "",
              "**Step 2: Estimate Traffic**",
              "- Assume 100 million new URLs per month",
              "- 1 billion clicks per month (10 clicks per URL average)",
              "- 1 billion clicks = ~400 requests per second",
              "",
              "**Step 3: Data Storage**",
              "- Store mapping: short_code → original_url",
              "- Need 100 million rows. Each row ~200 bytes = 20GB total",
              "- Use PostgreSQL (good for lookups, ACID)",
              "",
              "**Step 4: Generate Short Codes**",
              "- Base62 encoding (a-z, A-Z, 0-9) = 62 characters",
              "- 6 characters = 62^6 = 56 billion combinations",
              "- Use counter + encode to base62",
              "",
              "**Step 5: API Design**",
              "POST /v1/shorten → { original_url } → { short_code, short_url }",
              "GET /{short_code} → 302 Redirect to original_url",
              "",
              "**Step 6: Scaling**",
              "- Read-heavy (1B reads vs 100M writes = 10:1 ratio)",
              "- Add read replicas for GET requests",
              "- Cache popular short codes in Redis",
              "- Use CDN for static assets"
            ],
            example: {
              title: "URL Shortener Architecture",
              code: `// API Design:
POST /api/v1/shorten
Request: { "url": "https://very-long-url.com/..." }
Response: { "short_code": "abc123", "short_url": "https://short.com/abc123" }

GET /abc123
Response: 302 Redirect to "https://very-long-url.com/..."

// Database Schema:
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);

// URL Encoding (Base62):
function encode(num) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    while (num > 0) {
        result = chars[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result.padStart(6, 'a');
}

// 6 chars = 56 billion unique combinations

// Architecture Diagram:
// [Client] → [Load Balancer] → [API Servers]
//                                  ↓
//                            [Redis Cache]
//                                  ↓
//                            [PostgreSQL]
//                            (Primary + Replicas)`,
              explanation: "URL shortener is read-heavy. Use caching for popular URLs. Base62 encoding creates compact short codes."
            },
            practice: "Design a URL shortener that tracks analytics per link (clicks by country, browser, referrer). How would you store this data?"
          }
        },
        {
          id: "sd-design-chat",
          title: "Design a Chat System (like WhatsApp)",
          type: "interactive",
          duration: "25 min",
          content: {
            explanation: [
              "Let's design a real-time chat system. This tests your knowledge of WebSockets, message queues, and databases.",
              "",
              "**Step 1: Requirements**",
              "- One-on-one chat, group chat (max 100 people)",
              "- Messages delivered instantly (real-time)",
              "- Read receipts, typing indicators",
              "- Message history stored forever",
              "- Offline messages: deliver when user comes online",
              "",
              "**Step 2: Traffic Estimates**",
              "- 1 billion users total",
              "- 100 million daily active users",
              "- Each user sends 10 messages/day = 1B messages/day",
              "- 1B messages/day = ~12,000 messages/second",
              "",
              "**Step 3: Real-Time Communication**",
              "- Use WebSockets (persistent connection, bi-directional)",
              "- Each user maintains WebSocket connection to server",
              "- When User A sends message to User B, server forwards through B's WebSocket",
              "",
              "**Step 4: Message Storage**",
              "- Two databases: Messages (time-series) + User data",
              "- Messages: Use Cassandra or TimeScaleDB (write-heavy, time-ordered)",
              "- User data: PostgreSQL (relationships, profiles)",
              "",
              "**Step 5: Offline Messages**",
              "- If recipient offline, store messages in Redis",
              "- When user comes online, fetch from Redis and deliver",
              "- After delivery, move to permanent storage",
              "",
              "**Step 6: Scaling**",
              "- WebSocket connections stateful → use consistent hashing",
              "- Partition users across servers by user_id",
              "- Message queues for async processing (read receipts)"
            ],
            example: {
              title: "Chat System Architecture",
              code: `// WebSocket Flow:
// User A → WebSocket → Chat Server → WebSocket → User B

// Message IDs (monotonically increasing per user):
message_id = timestamp_ms + user_id_counter

// Database Schema (Cassandra):
CREATE TABLE messages (
    conversation_id UUID,
    message_id BIGINT,
    sender_id UUID,
    content TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (conversation_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

// Offline Messages (Redis):
// Store: pending_messages:{user_id} = List of messages
// When user connects: deliver all, then clear

// Group Chat:
// - Members list stored in Redis
// - Message fan-out: send to all online members
// - Offline members: queue messages

// Architecture:
// [User A] ↔ WebSocket ↔ [Chat Server] ↔ [Message Queue]
//                              ↓
//                       [Redis] [Cassandra]
//                              ↓
// [User B] ↔ WebSocket ↔ [Chat Server]`,
              explanation: "Chat systems need real-time delivery (WebSockets), persistent storage (Cassandra), and offline queues (Redis)."
            },
            practice: "How would you design read receipts? What happens if User B reads the message but User A's app is closed?"
          }
        },
        {
          id: "sd-design-social-feed",
          title: "Design a Social Media Feed (Twitter/X)",
          type: "interactive",
          duration: "25 min",
          content: {
            explanation: [
              "Let's design a social media feed. This tests your knowledge of fan-out patterns, caching, and timeline generation.",
              "",
              "**Step 1: Requirements**",
              "- Users follow others, see posts from followed users",
              "- Home feed: chronological or algorithmic sorting",
              "- Support likes, comments, reposts",
              "- Handle celebrity accounts (millions of followers)",
              "",
              "**Step 2: Traffic Estimates**",
              "- 500 million daily active users",
              "- Each user follows 200 people on average",
              "- 10,000 tweets per second peak",
              "- 150,000 read requests per second (viewing feeds)",
              "",
              "**Step 3: Feed Generation Strategies**",
              "- Push (write fan-out): When user tweets, push to all followers' feeds → Pre-computed",
              "- Pull (read fan-out): When user views feed, query all followed users → Real-time",
              "- Hybrid: Celebrities use pull, normal users use push",
              "",
              "**Step 4: Push Approach (Normal Users)**",
              "- User A (1,000 followers) posts tweet",
              "- Server writes tweet ID to each follower's timeline list",
              "- Follower's feed is pre-computed, ready instantly",
              "",
              "**Step 5: Pull Approach (Celebrities)**",
              "- Celebrity (50M followers) posts tweet",
              "- Writing to 50M lists would take hours!",
              "- Instead, followers query on-demand when viewing",
              "",
              "**Step 6: Caching**",
              "- Cache timeline lists in Redis (sorted sets)",
              "- Cache popular tweets in CDN-backed cache"
            ],
            example: {
              title: "Social Feed Architecture",
              code: `// Push (write fan-out) - for normal users:
function postTweet(userId, tweet) {
    // Store tweet
    tweetId = db.insert("tweets", { userId, content, timestamp });
    
    // Get followers
    followers = db.query("SELECT follower_id FROM follows WHERE followed_id = ?", userId);
    
    // Push tweet to each follower's timeline
    for (const follower of followers) {
        redis.zadd("timeline:" + follower, timestamp, tweetId);
    }
}

// Pull (read fan-out) - for celebrities:
function viewFeed(userId) {
    // Get followed users (including celebrities)
    followed = db.query("SELECT followed_id FROM follows WHERE follower_id = ?", userId);
    
    // Query recent tweets from each followed user
    for (const followedId of followed) {
        tweets += db.query("SELECT * FROM tweets WHERE user_id = ? ORDER BY created_at DESC LIMIT 100", followedId);
    }
    
    // Merge and sort
    return sortByTime(tweets).slice(0, 50);
}

// Hybrid:
function postTweet(userId, tweet) {
    // Store tweet
    // Get follower count
    followerCount = getFollowerCount(userId);
    
    if (followerCount < 10000) {
        // Push to all followers
        pushToAllFollowers(userId, tweetId);
    } else {
        // Mark as "celebrity tweet", pull on read
        markAsCelebrityTweet(userId, tweetId);
    }
}

// Database Schema:
CREATE TABLE tweets (
    tweet_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT,
    created_at TIMESTAMP,
    is_celebrity BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_tweets_user_created ON tweets(user_id, created_at DESC);

// Redis timeline (sorted by timestamp):
// timeline:{user_id} = sorted set of tweet_ids
// Score = timestamp for sorting`,
              explanation: "Social feeds use push for normal users (pre-computed), pull for celebrities (too many followers). Hybrid handles both."
            },
            practice: "How would you design the 'trending tweets' feature? What data structures would you use?"
          }
        },
        {
          id: "sd-design-ecommerce",
          title: "Design an E-Commerce Checkout",
          type: "interactive",
          duration: "15 min",
          content: {
            explanation: [
              "Let's design an e-commerce checkout that handles Black Friday traffic.",
              "",
              "**Step 1: The Problem**",
              "- 10,000 orders per second during flash sales",
              "- Inventory must not be oversold",
              "- Payments must be reliable",
              "- Users shouldn't see 'sold out' after clicking buy",
              "",
              "**Step 2: Inventory Management**",
              "- Reserve inventory BEFORE payment",
              "- Short reservation window (5-10 minutes)",
              "- Release if payment fails",
              "",
              "**Step 3: Order Flow with Queues**",
              "- Add to cart → Reserve inventory → Queue payment",
              "- User gets 'processing' response",
              "- Payment worker processes asynchronously",
              "- Webhook notifies user when complete",
              "",
              "**Step 4: Handling Failures**",
              "- Payment fails? Release inventory, notify user",
              "- Inventory reservation expires? Release automatically",
              "- Queue stores orders during traffic spikes"
            ],
            example: {
              title: "E-Commerce Checkout Flow",
              code: `// Step 1: Add to cart
POST /api/cart/add { product_id, quantity }
→ Check inventory, hold reservation (5 min TTL)

// Step 2: Initiate checkout
POST /api/checkout { cart_id, payment_info }
→ Queue order for processing
→ Response: { order_id, status: "processing" }

// Step 3: Background processing
queue.consume("order-processing", async (order) => {
    try {
        // Verify inventory still available (idempotent)
        const reserved = await inventory.reserve(order.items, order.reservationId);
        if (!reserved) throw new Error("Out of stock");
        
        // Process payment (idempotent - use idempotency key)
        await payment.process(order.paymentInfo, order.idempotencyKey);
        
        // Confirm order
        await db.update("orders", { status: "confirmed" }, order.id);
        await inventory.commitReservation(order.reservationId);
        
        // Send confirmation
        await email.send(order.userEmail, "Order confirmed!");
    } catch (error) {
        // Rollback
        await inventory.releaseReservation(order.reservationId);
        await db.update("orders", { status: "failed", error: error.message });
        await email.send(order.userEmail, "Order failed");
    }
});

// Idempotency key prevents double charges:
POST /api/checkout { idempotency_key: "user_123_timestamp" }
// Same key → same order won't be processed twice

// Inventory reservation (Redis + TTL):
await redis.setex("reservation:" + orderId, 300, JSON.stringify(items)); // 5 min
await redis.decrby("inventory:" + productId, quantity); // Reserve

// If time expires: background job releases inventory
// If payment succeeds: remove reservation, commit inventory
// If payment fails: release inventory`,
              explanation: "E-commerce checkout needs inventory reservation, idempotent payments, and queues for reliability. Never hold inventory during payment processing!"
            },
            practice: "How would you handle a 'flash sale' where 1,000 units sell out in 1 second? How do you prevent overselling?"
          }
        }
      ]
    }
  ]
};