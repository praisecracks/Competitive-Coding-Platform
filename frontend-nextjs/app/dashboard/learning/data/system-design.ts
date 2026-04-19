import { LearningTrack } from "../data";

export const systemDesign: LearningTrack = {
  id: "system-design",
  title: "System Design",
  subtitle: "Beginner to Hero",
  description: "Design scalable systems from APIs to microservices. Master architectural patterns, caching strategies, and real-world system fundamentals",
  type: "additional",
  icon: "CircuitBoard",
  color: "orange",
  coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
  totalHours: 38,
  language: "multi",
  category: "System Design",
  topics: [
    {
      id: "sd-api-design",
      title: "API Design",
      description: "Design RESTful APIs and GraphQL",
      duration: "60 min",
      subtopics: [
        {
          id: "api-rest",
          title: "RESTful API Principles",
          content: {
            explanation: [
              "REST (Representational State Transfer) is the standard for web APIs. Key principles:",
              "",
              "1. **Resources as nouns**: Use URI paths like /users, /orders, not /getUsers",
              "",
              "2. **HTTP methods semantically**:",
              "- GET — retrieve (safe, idempotent)",
              "- POST — create new resource",
              "- PUT — replace entire resource",
              "- PATCH — partial update",
              "- DELETE — remove",
              "",
              "3. **Status codes**: 200 (OK), 201 (Created), 400 (Bad), 401 (Unauthorized), 404 (Not found), 500 (Server error)",
              "",
              "4. **Version early**: /v1/users to allow evolution"
            ],
            example: {
              title: "REST API Examples",
              code: `# Good REST API design

GET    /api/v1/users          # List users
GET    /api/v1/users/123     # Get user 123
POST   /api/v1/users         # Create user
PUT    /api/v1/users/123     # Update user 123 (full)
PATCH  /api/v1/users/123    # Partial update
DELETE /api/v1/users/123    # Delete user 123

# Nested resources
GET    /api/v1/users/123/orders          # User's orders
POST   /api/v1/users/123/orders          # Create order for user

# Response format
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "page": 1,
    "total": 100,
    "per_page": 20
  }
}`,
              explanation: "Use plural nouns for resources. Version your API early. Include pagination meta."
            },
            practice: "Design an API for a todo list application."
          }
        },
        {
          id: "api-query",
          title: "Query Parameters & Filtering",
          content: {
            explanation: [
              "Query parameters make APIs flexible:",
              "",
              "1. **Pagination**: ?page=1&limit=20",
              "2. **Filtering**: ?status=active&type=premium",
              "3. **Sorting**: ?sort=created_at&order=desc",
              "4. **Field selection**: ?fields=id,name,email",
              "5. **Search**: ?q=search+term",
              "",
              "Pattern: Use consistent parameter names across APIs."
            ],
            example: {
              title: "Query Parameters",
              code: `# Pagination
GET /api/v1/users?page=2&limit=20

# Filtering
GET /api/v1/users?status=active&country=US
GET /api/v1/products?min_price=10&max_price=100

# Sorting (sort by field, order = asc/desc)
GET /api/v1/users?sort=created_at&order=desc

# Field selection (reduce bandwidth)
GET /api/v1/users?fields=id,name,email

# Combined
GET /api/v1/users?page=1&limit=10&status=active&sort=name&order=asc&fields=id,name`,
              explanation: "Combine multiple query parameters for complex queries. Use default values when parameters are missing."
            },
            practice: "Add query parameters to filter and sort a products API."
          }
        },
        {
          id: "api-graphql",
          title: "GraphQL vs REST",
          content: {
            explanation: [
              "GraphQL is an alternative that gives clients more control:",
              "",
              "**REST issues** (over-fetching):",
              "- GET /user/123 returns all fields",
              "- Need multiple endpoints for related data",
              "",
              "**GraphQL solution** (single endpoint):",
              "- Client specifies exactly what it needs",
              "- Single request for multiple related resources",
              "",
              "When to choose:",
              "- GraphQL: complex UI, multiple nested fetches",
              "- REST: simple CRUD, caching important, bandwidth constrained"
            ],
            example: {
              title: "GraphQL Query",
              code: `# GraphQL query - exactly what you need
query GetUserData {
  user(id: 123) {
    name
    email
    posts(first: 5, orderBy: { createdAt: DESC }) {
      edges {
        node {
          title
          createdAt
        }
      }
    }
  }
}

# Response
{
  "data": {
    "user": {
      "name": "John",
      "email": "john@example.com",
      "posts": {
        "edges": [
          { "node": { "title": "My First Post", "createdAt": "2024-01-01" } }
        ]
      }
    }
  }
}`,
              explanation: "GraphQL is flexible but adds complexity. REST is simpler but can over-fetch data."
            },
            practice: "Write a GraphQL query to get a user and their last 5 posts."
          }
        },
        {
          id: "api-error",
          title: "Error Handling",
          content: {
            explanation: [
              "Good error responses help clients handle issues:",
              "",
              "1. **Use standard status codes**:",
              "- 400: Client error (bad request)",
              "- 401: Unauthorized (not logged in)",
              "- 403: Forbidden (logged in but no access)",
              "- 404: Not found",
              "- 429: Too many requests (rate limit)",
              "- 500: Server error",
              "",
              "2. **Include helpful message**: Error code, message, details",
              "",
              "3. **Consistent format**: All errors in same structure"
            ],
            example: {
              title: "Error Responses",
              code: `# 400 Bad Request
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email format is invalid",
    "field": "email"
  }
}

# 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "Include Authorization header"
  }
}

# 404 Not Found
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found"
  }
}

# 429 Rate Limited
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after": 60
  }
}`,
              explanation: "Include error codes that clients canprogrammaticallyhandle. Include field for validation errors."
            },
            practice: "Design error response for failed user registration with validation errors."
          }
        }
      ]
    },
    {
      id: "sd-scalability",
      title: "Scalability Basics",
      description: "Handle growth and load",
      duration: "65 min",
      subtopics: [
        {
          id: "scale-vertical-horizontal",
          title: "Vertical vs Horizontal Scaling",
          content: {
            explanation: [
              "Scaling handles increased load:",
              "",
              "**Vertical scaling**: Add more power to existing machine",
              "- More CPU, RAM, disk",
              "- Simple, no code changes",
              "- Hard limits (can't scale infinitely)",
              "- Cost grows non-linearly",
              "",
              "**Horizontal scaling**: Add more machines",
              "- More instances behind load balancer",
              "- Can scale infinitely (in theory)",
              "- Need stateless services",
              "- More complex",
              "",
              "Tip: Start with vertical, move to horizontal as needed."
            ],
            example: {
              title: "Horizontal Scaling Architecture",
              code: `# Incoming traffic
      ↓
[Load Balancer]
      ↓
┌─────▼─────┐
│ Server 1  │ (stateless)
└───────────┘
┌───────────┐
│ Server 2  │ (stateless)
└───────────┘
┌───────────┐
│ Server 3  │ (stateless)
└───────────┘
      ↓
  [Database]

# Key: Make services stateless
# Bad: sessions stored in memory
# Good: sessions in Redis/database
# Or: JWT tokens (stateless auth)`,
              explanation: "Horizontal scaling is better for growth. Enable it from the start: use stateless services and external session storage."
            },
            practice: "Design a horizontally scalable user service."
          }
        },
        {
          id: "scale-database",
          title: "Database Scaling",
          content: {
            explanation: [
              "Databases are often the bottleneck. Scaling strategies:",
              "",
              "1. **Read replicas**: Distribute read queries",
              "- One primary (write), multiple replicas (read)",
              "- Eventually consistent (not immediately)",
              "- Good for read-heavy workloads",
              "",
              "2. **Vertical scaling**: Bigger database server",
              "- Eventually hits hardware limits",
              "- Expensive at high scale",
              "",
              "3. **Sharding**: Split data across databases",
              "- Complex to implement",
              "- Need to choose partition key",
              "",
              "4. **Caching**: Reduce database load (later)"
            ],
            example: {
              title: "Read Replicas",
              code: `# Database topology
        [Primary DB]
           ��
        ┌────┼────┐
        │         │
    [Replica 1] [Replica 2]
        (reads)

# Application code
func getUser(id int64) (*User, error) {
    // Try read replica first
    user, err := replicaDB.Get(id)
    if err != nil {
        return nil, err
    }
    if user != nil {
        return user, nil
    }
    // Fall back to primary
    return primaryDB.Get(id)
}

# Writes always go to primary
func createUser(user *User) error {
    return primaryDB.Create(user)
}`,
              explanation: "Use read replicas for read-heavy workloads (most apps!). Replicas are eventually consistent."
            },
            practice: "Design a database architecture for a social media app."
          }
        },
        {
          id: "scale-load-balancer",
          title: "Load Balancing",
          content: {
            explanation: [
              "Load balancers distribute traffic across servers:",
              "",
              "1. **Round robin**: Cycle through servers",
              "2. **Least connections**: Send to least busy",
              "3. **IP hash**: Same IP to same server (sticky sessions)",
              "4. **Weighted**: More capacity = more traffic",
              "",
              "Levels:",
              "- DNS load balancing (low-tech)",
              "- Application load balancer (layer 7)",
              "- Network load balancer (layer 4)",
              "",
              "Health checks are critical for removing failed servers."
            ],
            example: {
              title: "Load Balancer Setup",
              code: `# Health check configuration
# Check every 10 seconds
# Mark unhealthy after 3 failed checks
# Remove from pool after unhealthy

health_check {
  path: /health
  interval: 10s
  timeout: 5s
  unhealthy_threshold: 3
  healthy_threshold: 2
}

# Routing strategies
round_robin:  # Equal distribution
least_connections:  # To least busy server  
ip_hash:  # Sticky sessions (shopping cart)
weighted:  # Unequal based on capacity`,
              explanation: "Use health checks to detect failed servers. Choose routing strategy based on your needs."
            },
            practice: "Design a load balancer health check flow."
          }
        },
        {
          id: "scale-cdn",
          title: "CDN and Edge Computing",
          content: {
            explanation: [
              "CDN (Content Delivery Network) brings content closer to users:",
              "",
              "How it works:",
              "- Cache content at edge locations worldwide",
              "- User gets content from nearest edge",
              "- Reduces latency significantly",
              "",
              "What to cache:",
              "- Static assets (images, CSS, JS)",
              "- API responses (if rarely changing)",
              "",
              "Dynamic content:",
              "- Use edge functions to personalize",
              "- Vercel Edge, Cloudflare Workers"
            ],
            example: {
              title: "CDN Caching",
              code: `# CDN cache headers
# Static assets - cache long
Cache-Control: public, max-age=31536000, immutable

# API responses - cache short
Cache-Control: public, max-age=60, s-maxage=60

# Don't cache private data
Cache-Control: private

# In Vercel/Next.js
// At build time
export async function getStaticProps() {
  return {
    revalidate: 60,  // regenerate every 60s
  }
}

// Edge function
export default function handler(req) {
  const user = getUserFromCookie(req)
  return JSON.stringify({ name: user.name })
}`,
              explanation: "Cache static assets for a long time. Use revalidation for dynamic content. Edge functions personalize cached content."
            },
            practice: "Design a caching strategy for a news website."
          }
        }
      ]
    },
    {
      id: "sd-caching",
      title: "Caching Strategies",
      description: "Redis, CDN, and cache patterns",
      duration: "55 min",
      subtopics: [
        {
          id: "cache-basics",
          title: "Cache Fundamentals",
          content: {
            explanation: [
              "Caching stores frequently accessed data in fast storage:",
              "",
              "Why:",
              "- Database reads are slow (ms)",
              "- Cache reads are fast (µs)",
              "- Orders of magnitude faster",
              "",
              "Types:",
              "1. **Local**: In-memory (process)",
              "2. **Distributed**: Redis/Memcached (across servers)",
              "3. **CDN**: Edge locations",
              "",
              "Key principle: Cache can go stale. Design for it."
            ],
            example: {
              title: "Redis Cache Pattern",
              code: `def get_user(user_id):
    # Try cache first
    cache_key = f"user:{user_id}"
    user = redis.get(cache_key)
    
    if user:
        return json.loads(user)
    
    # Cache miss - get from database
    user = database.get(f"SELECT * FROM users WHERE id = ?", user_id)
    
    if user:
        # Store in cache (1 hour TTL)
        redis.setex(cache_key, 3600, json.dumps(user))
    
    return user`,
              explanation: "Cache-aside pattern: Check cache first, fallback to database, store result in cache with TTL."
            },
            practice: "Implement cache-aside for getting user profile."
          }
        },
        {
          id: "cache-strategies",
          title: "Cache Strategies",
          content: {
            explanation: [
              "Different strategies for different use cases:",
              "",
              "1. **Cache-aside (lazy)**: Application manages cache",
              "- Check cache first, on miss get from DB, store in cache",
              "- Simple, popular",
              "",
              "2. **Write-through**: Write to cache and DB together",
              "- Cache always has latest",
              "- Overwrites on every write",
              "",
              "3. **Write-back**: Write to cache, async to DB",
              "- Fast writes",
              "- Risk of data loss",
              "",
              "Cache invalidation: The hard part! TTL or explicit delete."
            ],
            example: {
              title: "Cache Invalidation",
              code: `# When to invalidate cache
# 1. Time-based (TTL)
redis.setex(key, 300, value)  # 5 min TTL

# 2. On write (write-through)
def update_user(user):
    database.update(user)
    redis.set(key, json.dumps(user))  # update cache too
    redis.setex(f"user:{user.id}", 3600, ...)

# 3. On delete (write-back)
def delete_user(user_id):
    database.delete(user_id)
    redis.delete(f"user:{user_id}")  # delete cache
    
# 4. Using tags (advanced)
redis.sadd("user:tags:admin", user_id)
redis.sadd("user:tags:vip", user_id)
# Invalidate all admin users
redis.delete("user:tags:*")`,
              explanation: "Choose strategy based on read/write ratio. Write-heavy use write-through, read-heavy use cache-aside."
            },
            practice: "Design cache invalidation for a user profile that updates frequently."
          }
        },
        {
          id: "cache-patterns",
          title: "Cache Patterns",
          content: {
            explanation: [
              "Advanced caching patterns:",
              "",
              "1. **Cache warming**: Pre-fill cache on startup",
              "- No cold cache misses",
              "- Can use stale data",
              "",
              "2. **Stale-while-revalidate**: Allow stale data temporarily",
              "- Serve old while refreshing in background",
              "",
              "3. **Cache stampede prevention** (thundering herd):",
              "- Only one request fetches on cache miss",
              "",
              "4. **Hot keys**: Popular data that gets accessed a lot",
              "- Pre-warm these keys",
              "- Replicate to more instances"
            ],
            example: {
              title: "Stampede Prevention",
              code: `def get_user_cached(user_id):
    key = f"user:{user_id}"
    
    # Check cache
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    
    # Only one fetches when cache miss
    # Use key with SETNX or similar
    lock_key = f"lock:{key}"
    if redis.setnx(lock_key, 1):
        try:
            # Fetch from database
            user = db.get(user_id)
            if user:
                redis.setex(key, 300, json.dumps(user))
        finally:
            redis.delete(lock_key)
    else:
        # Wait and retry
        time.sleep(0.1)
        return get_user_cached(user_id)
    
    return user`,
              explanation: "Prevent thundering herd: Only one request fetches on cache miss. Use distributed lock or first-write policy."
            },
            practice: "Design a cache system that handles hot keys."
          }
        }
      ]
    },
    {
      id: "sd-microservices",
      title: "Microservices Basics",
      description: "Service decomposition patterns",
      duration: "70 min",
      subtopics: [
        {
          id: "ms-monolith",
          title: "Monolith vs Microservices",
          content: {
            explanation: [
              "Two architectural styles:",
              "",
              "**Monolith**: Everything in one deployment",
              "- Simple to develop",
              "- Simple to deploy",
              "- Simple to test",
              "- Can become complex at scale",
              "",
              "**Microservices**: Small, independent services",
              "- Can scale independently",
              "- Different tech stacks",
              "- Can deploy independently",
              "- More complex",
              "",
              "Start with monolith, evolve to microservices when needed. Premature splitting adds complexity."
            ],
            example: {
              title: "When to Split",
              code: `# Monolith - good for:
# - Small team (< 5 engineers)
# - Startup/pivot phase
# - Simple domain
# - Fast iteration needed

# Microservices - good for:
# - Different scaling needs per component
# - Different tech requirements
# - Large team (> 20 engineers)
# - Independent deployment needs

# Signs it's time to split:
# 1. Deploy one component breaks whole system
# 2. Team steps on each other's toes
# 3. Some components need 10x scale of others
# 4. Different teams own different domains`,
              explanation: "Don't over-engineer. Start simple, split when complexity outweighs benefits."
            },
            practice: "Design criteria for deciding when to split a monolith."
          }
        },
        {
          id: "ms-communication",
          title: "Service Communication",
          content: {
            explanation: [
              "Services need to communicate:",
              "",
              "1. **Synchronous (request-response)**",
              "- REST/gRPC APIs",
              "- Blocks until response",
              "- Simpler to understand",
              "",
              "2. **Asynchronous (message queues)**",
              "- Event-driven",
              "- Lower coupling",
              "- More complex",
              "",
              "Key: Services should be loosely coupled. Events are better for independence."
            ],
            example: {
              title: "Service Communication",
              code: `# Synchronous: REST API call
user_service.get_user(id)
order_service.create_order(data)

# Using gRPC (faster)
user_client := pb.NewUserServiceClient(conn)
resp, err := user_client.GetUser(ctx, &pb.GetUserRequest{Id: id})

# Asynchronous: Message queue
# User created event
publisher.Publish("user.created", UserCreatedEvent{
    UserID: newUser.ID,
    Email: newUser.Email,
})

# Consumer (order service) handles it
consumer.Subscribe("user.created", func(event UserCreatedEvent) {
    // Create user account in order service
})`,
              explanation: "Synchronous is simpler for workflows. Asynchronous is better for independence and eventual consistency."
            },
            practice: "Design event flow for user registration in multiple services."
          }
        },
        {
          id: "ms-circuit",
          title: "Circuit Breaker",
          content: {
            explanation: [
              "Circuit breaker prevents cascade failures:",
              "",
              "States:",
              "1. **Closed**: Normal operation",
              "2. **Open**: Failing, reject calls",
              "3. **Half-open**: Testing recovery",
              "",
              "When to use: External service calls that might fail. Don't let one failure bring down your service."
            ],
            example: {
              title: "Circuit Breaker Implementation",
              code: `type CircuitBreaker struct {
    failures int
    threshold int
    timeout   time.Duration
    state     int  // 0: closed, 1: open, 2: half-open
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    if cb.state == 1 {  // open
        return fmt.Errorf("circuit open")
    }
    
    err := fn()
    
    if err != nil {
        cb.failures++
        if cb.failures >= cb.threshold {
            cb.state = 1
            go cb.resetAfterTimeout()
        }
        return err
    }
    
    cb.failures = 0
    cb.state = 0  // closed
    return nil
}

func (cb *CircuitBreaker) resetAfterTimeout() {
    time.Sleep(cb.timeout)
    cb.state = 2  // half-open
}`,
              explanation: "When failures exceed threshold, open circuit. Accept few test requests to test recovery."
            },
            practice: "Add circuit breaker to a service that calls an external API."
          }
        },
        {
          id: "ms-discovery",
          title: "Service Discovery",
          content: {
            explanation: [
              "Services need to find each other:",
              "",
              "1. **DNS**: Simple, but slow updates",
              "2. **Service registry**: Dynamic (Consul, Eureka)",
              "3. **Load balancer**: Client LB is common",
              "",
              "Client-side discovery: Client looks up from registry",
              "Server-side: Load balancer decides",
              "",
              "Health checks ensure only healthy instances receive traffic."
            ],
            example: {
              title: "Service Registry",
              code: `# Service registers on startup
service := &ServiceInstance{
    ID:        generateUUID(),
    Name:      "user-service",
    Address:    "user-service-1:8080",
    Port:       8080,
    HealthURL:  "http://user-service-1:8080/health",
}
registry.Register(service)

# Heartbeat to stay alive
go func() {
    for {
        registry.Heartbeat(service.ID)
        time.Sleep(30 * time.Second)
    }
}()

# Client looks up
instances, _ := registry.Find("user-service")
# Choose one (random, round-robin, etc.)
selected := choose(instances)`,
              explanation: "Services register themselves. Client discovers from registry. Use health checks for reliability."
            },
            practice: "Design a service registry that handles instance registration and health checks."
          }
        }
      ]
    },
    {
      id: "sd-security",
      title: "Security Fundamentals",
      description: "Authentication and authorization",
      duration: "55 min",
      subtopics: [
        {
          id: "security-auth",
          title: "Auth: JWT vs Sessions",
          content: {
            explanation: [
              "Two main authentication approaches:",
              "",
              "1. **Sessions**: Server stores user state",
              "- Server maintains session ID",
              "- Cookie/header references session",
              "- Easy to revoke",
              "- State required",
              "",
              "2. **JWT** (JSON Web Token): Client stores token",
              "- Token contains user info (claims)",
              "- Server validates signature only",
              "- Stateless",
              "- Harder to revoke",
              "",
              "Token: header.payload.signature"
            ],
            example: {
              title: "JWT Authentication",
              code: `# Client stores token
# Login
POST /login { email, password }
Response: { token: "eyJhbGciOiJIUz..." }

# Subsequent requests
GET /api/users
Authorization: Bearer eyJhbGciOiJIUz...

# JWT payload (payload)
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}

# Server validates (no DB lookup needed!)
func ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, keyFunc)
    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }
    return nil, err
}`,
              explanation: "Use JWT for stateless services. Use sessions when you need easy revocation or don't want token management."
            },
            practice: "Implement JWT authentication flow."
          }
        },
        {
          id: "security-authorization",
          title: "Authorization: RBAC vs ACL",
          content: {
            explanation: [
              "Authorization controls what users can do:",
              "",
              "1. **RBAC** (Role-Based Access Control):",
              "- Users have roles (admin, user, moderator)",
              "- Roles have permissions",
              "- Simple to manage",
              "",
              "2. **ACL** (Access Control Lists):",
              "- Per-resource permissions",
              "- Fine-grained control",
              "- More complex",
              "",
              "3. **ABAC** (Attribute-Based): Context-based policies",
              "",
              "Principle: Least privilege — minimum access needed"
            ],
            example: {
              title: "RBAC Implementation",
              code: `# Define roles and permissions
roles := map[string][]string{
    "admin": {"read", "write", "delete", "manage_users"},
    "moderator": {"read", "write", "delete_content"},
    "user": {"read"},
}

# Middleware checks permission
func requirePermission(permission string) HandlerFunc {
    return func(c *Context) {
        role := c.Get("user_role").(string)
        perms := roles[role]
        
        hasPermission := false
        for _, p := range perms {
            if p == permission {
                hasPermission = true
                break
            }
        }
        
        if !hasPermission {
            c.JSON(403, Error{"Forbidden"})
            return
        }
        
        c.Next()
    }
}

// Usage
r.DELETE("/users/:id", requirePermission("manage_users"), deleteUser)`,
              explanation: "Assign users roles. Check permissions on protected resources. Keep roles simple for most apps."
            },
            practice: "Design RBAC for a blog system with authors and readers."
          }
        },
        {
          id: "security-https",
          title: "HTTPS and TLS",
          content: {
            explanation: [
              "HTTPS encrypts traffic in transit:",
              "",
              "How it works:",
              "1. Client connects, server sends certificate",
              "2. Client verifies certificate (trusted CA)",
              "3. Generate session key (asymmetric encryption)",
              "4. Encrypt/decrypt with session key (symmetric)",
              "",
              "TLS 1.3 is latest standard. Use it for all traffic.",
              "",
              "Certificate: Get from Let's Encrypt (free) or buy."
            ],
            example: {
              title: "HTTPS in Go",
              code: `// Create TLS configuration
cert, err := tls.LoadX509KeyPair("server.crt", "server.key")
if err != nil {
    log.Fatal(err)
}

config := &tls.Config{
    Certificates: []tls.Certificate{cert},
    MinVersion: tls.VersionTLS12,
    // TLS 1.3 only (requires modern clients)
    CurvePreferences: []tls.CurveID{
        tls.CurveP256,
        tls.X25519,
    },
    CipherSuites: []uint16{
        tls.TLS_AES_128_GCM_SHA256,
        tls.TLS_CHACHA20_POLY1305_SHA256,
    },
}

server := &http.Server{
    Addr:      ":https",
    TLSConfig:   config,
    Handler:    router,
}

server.ListenAndServeTLS()`,
              explanation: "Use HTTPS everywhere, even for private services. Set up auto-redirect HTTP → HTTPS."
            },
            practice: "Set up automatic redirect from HTTP to HTTPS."
          }
        }
      ]
    },
    {
      id: "sd-message-queues",
      title: "Message Queues",
      description: "Event-driven communication and async processing",
      duration: "50 min",
      subtopics: [
        {
          id: "mq-intro",
          title: "Introduction to Message Queues",
          content: {
            explanation: [
              "Message queues enable asynchronous communication between services.",
              "",
              "**Why use message queues?**",
              "- Decouple producers from consumers",
              "- Handle traffic bursts (buffering)",
              "- Enable async processing",
              "- Build event-driven systems",
              "",
              "**Core concepts**:",
              "- Producer: sends messages",
              "- Consumer: receives messages",
              "- Queue: stores messages temporarily",
              "- Broker: manages the queue"
            ],
            example: {
              title: "Message Queue Architecture",
              code: `# Without queue: synchronous
# User places order → waits → order processed → email sent
# If email service down, entire order fails

# With queue: asynchronous
# 1. User places order → saved to database
# 2. Order saved to message queue
# 3. Response sent to user immediately
# 4. Background: consumer picks up order → processes → sends email
# Even if email service temporarily down, order is safe in queue`,
              explanation: "Message queues act as a buffer between services, ensuring reliability even when some services are down."
            },
            practice: "Draw a diagram showing how a message queue decouples order processing from inventory management."
          }
        },
        {
          id: "mq-rabbitmq",
          title: "RabbitMQ",
          content: {
            explanation: [
              "RabbitMQ is a popular open-source message broker.",
              "",
              "**Key concepts**:",
              "- Exchange: routes messages to queues",
              "- Queue: stores messages",
              "- Binding: links exchange to queue",
              "- Routing key: determines which queue gets the message",
              "",
              "**Exchange types**:",
              "- Direct: exact match on routing key",
              "- Fanout: sends to all bound queues",
              "- Topic: pattern matching on routing key",
              "- Headers: match on message headers"
            ],
            example: {
              title: "RabbitMQ Example",
              code: `# Producer sends to exchange
channel.exchange_declare(exchange="orders", type="topic")

# Publish with routing key
channel.basic_publish(
    exchange="orders",
    routing_key="order.created",
    body=order_data
)

# Consumer binds to queue
channel.queue_bind(queue="email_service", exchange="orders", routing_key="order.*")`,
              explanation: "RabbitMQ uses exchanges as intermediaries - producers send to exchanges, exchanges route to queues based on rules."
            },
            practice: "Create a scenario where orders go to one queue and inventory updates to another, both using the same exchange."
          }
        },
        {
          id: "mq-kafka",
          title: "Apache Kafka",
          content: {
            explanation: [
              "Kafka is a distributed event streaming platform, not just a message queue.",
              "",
              "**Differences from RabbitMQ**:",
              "- Append-only logs (durable, replayable)",
              "- Ordered within partitions",
              "- Consumer groups for parallel processing",
              "- High throughput for big data",
              "",
              "**Kafka concepts**:",
              "- Topic: category of messages",
              "- Partition: ordered segments within topic",
              "- Offset: position in partition",
              "- Consumer Group: shared consumption"
            ],
            example: {
              title: "Kafka Example",
              code: `# Create topic
kafka.create_topic("user_events", partitions=3)

# Producer
producer.send("user_events", {"user_id": 123, "event": "signup"})

# Consumer group
consumer = KafkaConsumer("user_events", group_id="analytics")
for message in consumer:
    process(message.value)

# Multiple consumers in same group share the work
# Each partition goes to one consumer in the group`,
              explanation: "Kafka's log-based approach means messages persist and can be replayed - great for audit trails and event sourcing."
            },
            practice: "Design a Kafka setup for tracking user clicks across a website. How would you handle 1 million events per second?"
          }
        },
        {
          id: "mq-patterns",
          title: "Message Queue Patterns",
          content: {
            explanation: [
              "**Common patterns**:",
              "",
              "**Pub/Sub**: One producer, many consumers (notifications, logs)",
              "",
              "**Task Queue**: One producer, one consumer (async jobs)",
              "",
              "**Event Sourcing**: Store all changes as events (audit trail)",
              "",
              "**Saga Pattern**: Choreography or orchestration for distributed transactions",
              "",
              "**At-least-once vs exactly-once**: Handle duplicates vs guarantee delivery"
            ],
            example: {
              title: "Pub/Sub Pattern",
              code: `# Publisher: order status updates
for status in ["confirmed", "packed", "shipped", "delivered"]:
    publish("order_events", order_id, status)

# Subscribers:
# - Email service subscribes to all events
# - Inventory service subscribes to "confirmed" only
# - Tracking service subscribes to "shipped"
# - Analytics subscribes to all events`,
              explanation: "Pub/Sub allows different services to react to the same events without the producer knowing about them."
            },
            practice: "Design a system where a payment triggers: inventory reservation, loyalty points, and notification - using message queues."
          }
        }
      ]
    }
  ]
};