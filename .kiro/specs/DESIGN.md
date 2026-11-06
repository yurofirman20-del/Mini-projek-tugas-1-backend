# Design Document
## Tourism Destination Website - Backend API

**Version:** 1.0.0  
**Last Updated:** November 6, 2026  
**Status:** Implemented

---

## 1. System Architecture

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                   │
│  (Browser / Mobile App / Third-party Client)    │
└────────────────┬────────────────────────────────┘
                 │ HTTP/HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│              Express.js Server                   │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │      Middleware Stack                   │    │
│  │  • CORS Middleware                      │    │
│  │  • JSON Body Parser                     │    │
│  │  • Static File Server                   │    │
│  └────────────────┬───────────────────────┘    │
│                   ▼                              │
│  ┌────────────────────────────────────────┐    │
│  │         Route Layer                     │    │
│  │  • /api/destinations (router)           │    │
│  └────────────────┬───────────────────────┘    │
│                   ▼                              │
│  ┌────────────────────────────────────────┐    │
│  │         Data Layer                      │    │
│  │  • destinations array (in-memory)       │    │
│  └────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 1.2 Architecture Pattern
**Pattern:** Layered Architecture (MVC-lite)

**Layers:**
1. **Route Layer** (`routes/`) - Request handling and routing
2. **Middleware Layer** (`middleware/`) - Cross-cutting concerns
3. **Data Layer** (`data/`) - Data storage and access

**Design Rationale:**
- Simple and easy to understand
- Clear separation of concerns
- Easy to test each layer independently
- Scalable to add new routes/middleware

---

## 2. Technology Stack Design

### 2.1 Core Technologies

#### Node.js + ES Modules
**Decision:** Use ES6 modules instead of CommonJS

**Rationale:**
- Modern JavaScript standard
- Better tree-shaking support
- Cleaner import/export syntax
- Future-proof

**Implementation:**
```json
{
  "type": "module"
}
```

#### Express.js v4.21.2
**Decision:** Use Express as web framework

**Rationale:**
- Industry standard
- Large ecosystem
- Excellent documentation
- Minimal and unopinionated

#### CORS Package v2.8.5
**Decision:** Use dedicated CORS middleware

**Rationale:**
- Handles preflight requests automatically
- Configurable per-route
- Production-ready
- Well-maintained

---

## 3. Project Structure Design

### 3.1 Directory Organization

```
backend/
├── data/
│   └── destinations.js       # Data store
├── middleware/
│   └── cors.js              # CORS configuration
├── routes/
│   └── destinations.js      # API routes
├── server.js                # Application entry
├── package.json             # Dependencies
├── REQUIREMENTS.md          # What to build
├── DESIGN.md               # How to build (this file)
└── TASKS.md                # Implementation tasks
```

### 3.2 Module Design Principles

#### Separation by Feature
Each route gets its own file in `routes/`

**Example:**
```
routes/
├── destinations.js
├── users.js         (future)
└── bookings.js      (future)
```

#### Shared Middleware
Common middleware in `middleware/`

**Example:**
```
middleware/
├── cors.js
├── auth.js          (future)
└── validation.js    (future)
```

#### Data Abstraction
Data access isolated in `data/`

**Example:**
```
data/
├── destinations.js
├── users.js         (future)
└── reviews.js       (future)
```

---

## 4. API Design

### 4.1 RESTful Design Principles

#### Resource-Based URLs
```
/api/destinations       - Collection
/api/destinations/:id   - Individual resource
```

**Not:**
```
/api/getDestinations    ❌
/api/destination_list   ❌
```

#### HTTP Method Mapping
| Method | Action | Current Status |
|--------|--------|----------------|
| GET | Retrieve | ✅ Implemented |
| POST | Create | ⚠️ Configured but not implemented |
| PUT | Update | ⚠️ Configured but not implemented |
| DELETE | Delete | ⚠️ Configured but not implemented |

#### Stateless Design
- No session storage
- Each request contains all necessary information
- Authentication via headers (future)

---

### 4.2 Response Format Design

#### Consistent Envelope
All responses wrapped in standard structure:

```javascript
// Success
{
  "success": true,
  "data": <payload>
}

// Error
{
  "success": false,
  "error": "<message>"
}
```

**Design Rationale:**
- Client knows immediately if request succeeded
- Consistent error handling
- Easy to add metadata later (pagination, etc.)

#### Status Code Strategy
| Code | Usage | Response |
|------|-------|----------|
| 200 | Success | Data payload |
| 404 | Not Found | Error message |
| 500 | Server Error | Generic error |

**Future Additions:**
- 201 Created (for POST)
- 400 Bad Request (validation errors)
- 401 Unauthorized (auth required)
- 403 Forbidden (insufficient permissions)

---

### 4.3 Endpoint Design

#### GET /api/destinations

**Purpose:** Retrieve all destinations

**Design Decision:** Return all at once (no pagination)

**Rationale:**
- Small dataset (6 items)
- Simple client implementation
- Fast response time

**Future Enhancement:**
```
GET /api/destinations?page=1&limit=10&location=Bali
```

**Handler Design:**
```javascript
router.get('/', (req, res) => {
  try {
    // Direct data access (no business logic)
    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat memuat data destinasi.'
    });
  }
});
```

---

#### GET /api/destinations/:id

**Purpose:** Retrieve single destination

**Design Decision:** Use URL parameter for ID

**Rationale:**
- RESTful convention
- Clean URL structure
- Easy to cache

**Handler Design:**
```javascript
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const destination = destinations.find(item => item.id === id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server.'
    });
  }
});
```

**Key Design Elements:**
- Early return for 404
- Array.find() for lookup
- Separate error messages for 404 vs 500

---

## 5. Data Model Design

### 5.1 Destination Entity

```javascript
{
  id: String,           // Primary key
  name: String,         // Display name
  location: String,     // "City, Province"
  description: String,  // Long text (Indonesian)
  ticketPrice: Number,  // Integer (IDR)
  imageUrl: String      // External URL
}
```

### 5.2 Design Decisions

#### ID Format: `dest-{number}`
**Rationale:**
- Human-readable
- Easy to debug
- Sequential numbering
- Prefix prevents collision with future entity types

**Alternative Considered:** UUID  
**Rejected Because:** Overkill for small dataset, harder to debug

---

#### Location Format: "City, Province"
**Rationale:**
- Easy to display
- Natural for Indonesian geography
- Can parse later if needed

**Alternative Considered:** Structured object  
```javascript
location: {
  city: "Magelang",
  province: "Jawa Tengah",
  country: "Indonesia"
}
```
**Rejected Because:** Adds complexity for current use case

---

#### Price as Number (not String)
**Rationale:**
- Enable sorting/filtering
- Accurate mathematical operations
- Standard data type

**Alternative Considered:** String with currency  
**Rejected Because:** Hard to sort, process

---

#### External Image URLs
**Rationale:**
- No storage infrastructure needed
- Leverages Unsplash CDN
- High-quality images

**Trade-off:** Dependent on external service

**Future Enhancement:** Own image storage (S3, Cloudinary)

---

### 5.3 Data Storage Design

#### In-Memory Array
```javascript
export const destinations = [
  { id: "dest-1", ... },
  { id: "dest-2", ... },
  // ...
];
```

**Design Decision:** Static array in JavaScript file

**Advantages:**
- Zero setup
- Fast access (O(1) memory, O(n) search)
- No database dependencies
- Perfect for prototype

**Disadvantages:**
- No persistence
- No concurrent write safety
- Limited to process memory
- Requires restart for updates

**When to Replace:** When any of these become true:
- Need data persistence
- Need concurrent writes
- Dataset > 1000 items
- Need complex queries

**Replacement Pattern:**
```javascript
// Future: data/destinations.js
import { db } from './database.js';

export const getAllDestinations = async () => {
  return await db.destinations.find().toArray();
};

export const getDestinationById = async (id) => {
  return await db.destinations.findOne({ id });
};
```

---

## 6. Middleware Design

### 6.1 CORS Middleware

**Configuration:**
```javascript
export const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

**Design Decisions:**

#### Open Origin (`*`)
**Rationale:**
- Public API
- Development flexibility
- No sensitive operations

**Future:** Restrict to specific domains in production
```javascript
origin: ['https://example.com', 'https://www.example.com']
```

#### Comprehensive Methods
**Rationale:**
- Prepared for future write operations
- Handles preflight requests

#### Standard Headers
**Rationale:**
- Content-Type: JSON requests
- Authorization: Future auth token

---

### 6.2 Middleware Stack Order

```javascript
// Order matters!
app.use(corsMiddleware);           // 1. CORS first
app.use(express.json());           // 2. Parse JSON bodies
app.use('/api/destinations', ...); // 3. API routes
app.use(express.static(...));      // 4. Static files (fallback)
app.use(errorHandler);             // 5. Error handler (last)
```

**Design Rationale:**
1. CORS before anything (preflight)
2. Body parsing before routes
3. API routes before static (precedence)
4. Static files as fallback
5. Error handler catches all

---

### 6.3 Error Handling Design

#### Route-Level Try-Catch
```javascript
router.get('/', (req, res) => {
  try {
    // Handler logic
  } catch (error) {
    // Route-specific error
  }
});
```

**Rationale:**
- Explicit error handling
- Custom error messages per route
- Prevents uncaught exceptions

---

#### Application-Level Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});
```

**Rationale:**
- Safety net for missed errors
- Prevents server crash
- Generic message (no leak)
- Logs for debugging

---

## 7. Routing Design

### 7.1 Express Router Pattern

```javascript
// routes/destinations.js
import { Router } from 'express';
const router = Router();

router.get('/', handler);
router.get('/:id', handler);

export default router;
```

**Design Rationale:**
- Modular route organization
- Easy to test in isolation
- Can apply middleware per router
- Clear file structure

---

### 7.2 Route Mounting

```javascript
// server.js
import destinationRoutes from './routes/destinations.js';
app.use('/api/destinations', destinationRoutes);
```

**Design Rationale:**
- Centralized route configuration
- Easy to see all mounted routes
- Version prefix can be added: `/api/v1/destinations`

---

### 7.3 Static File Routing

```javascript
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));
```

**Design Decision:** Mount after API routes

**Rationale:**
- API routes take precedence
- Prevents static files from shadowing API
- SPA fallback works naturally

---

## 8. Configuration Design

### 8.1 Environment Configuration

```javascript
const PORT = process.env.PORT || 3000;
```

**Design Pattern:** Environment variables with fallback

**Current Configuration:**
| Variable | Default | Purpose |
|----------|---------|---------|
| PORT | 3000 | Server port |

**Future Configuration:**
```javascript
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET,
  uploadPath: process.env.UPLOAD_PATH || './uploads'
};
```

---

### 8.2 Package Configuration

```json
{
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**Design Decisions:**

#### `"type": "module"`
Enables ES6 imports throughout project

#### Development Script
`node --watch` for auto-reload

**Alternative:** nodemon  
**Chosen:** Native Node.js feature (no extra dependency)

---

## 9. Performance Design

### 9.1 Response Time Optimization

**Strategy:** In-memory data access

**Performance Characteristics:**
- Array access: O(1) for all, O(n) for find
- JSON serialization: O(n)
- Network overhead: Variable

**Estimated Response Times:**
- GET /api/destinations: ~10-20ms
- GET /api/destinations/:id: ~5-10ms

**No Optimization Needed:**
- Dataset too small for indexing
- No database query optimization
- No caching layer required

---

### 9.2 Scalability Design

**Current Limitations:**
- Single process
- No clustering
- No load balancing
- No caching

**Future Scaling Strategy:**

#### Horizontal Scaling
```javascript
// Use PM2 or cluster module
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start Express server
}
```

#### Database Integration
- Replace in-memory array
- Connection pooling
- Read replicas for scaling reads

#### Caching Layer
```javascript
// Redis for frequently accessed data
import redis from 'redis';
const cache = redis.createClient();

// Cache destinations list
app.get('/api/destinations', async (req, res) => {
  const cached = await cache.get('destinations:all');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  // Fetch from DB, cache, return
});
```

---

## 10. Security Design

### 10.1 Current Security Measures

#### No Stack Traces
```javascript
catch (error) {
  // Don't send error.stack to client
  res.status(500).json({
    success: false,
    error: 'Generic message'
  });
}
```

#### Input Validation
- URL parameters extracted safely
- Express handles malformed JSON
- No SQL injection risk (no database)

---

### 10.2 Future Security Enhancements

#### Authentication
```javascript
// middleware/auth.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  // Verify JWT token
  next();
};
```

#### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Input Validation
```javascript
import { body, param, validationResult } from 'express-validator';

router.get('/:id',
  param('id').matches(/^dest-\d+$/),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid destination ID'
      });
    }
    // Continue...
  }
);
```

---

## 11. Testing Design

### 11.1 Test Strategy (Future)

#### Unit Tests
**Target:** Individual route handlers, data functions

**Framework:** Jest or Vitest

**Example:**
```javascript
import { getDestinationById } from '../data/destinations.js';

describe('getDestinationById', () => {
  it('should return destination when ID exists', () => {
    const result = getDestinationById('dest-1');
    expect(result).toBeDefined();
    expect(result.id).toBe('dest-1');
  });

  it('should return undefined when ID does not exist', () => {
    const result = getDestinationById('invalid');
    expect(result).toBeUndefined();
  });
});
```

#### Integration Tests
**Target:** Full request/response cycle

**Framework:** Supertest + Jest

**Example:**
```javascript
import request from 'supertest';
import app from '../server.js';

describe('GET /api/destinations', () => {
  it('should return all destinations', async () => {
    const response = await request(app)
      .get('/api/destinations')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(6);
  });
});
```

---

## 12. Design Patterns Applied

### 12.1 Patterns Used

#### Module Pattern
Separate files for routes, middleware, data

#### Router Pattern
Express Router for modular routing

#### Middleware Pattern
Chainable request processing

#### Error-First Pattern
Try-catch for error handling

#### Factory Pattern (Future)
For creating database connections, services

---

### 12.2 Design Principles

#### SOLID Principles

**Single Responsibility:**
- Each route file handles one resource
- Each middleware file handles one concern

**Open/Closed:**
- Easy to add new routes without modifying existing
- Middleware can be composed

**Dependency Inversion:**
- Routes depend on data abstraction (imports)
- Can swap data layer implementation

---

#### DRY (Don't Repeat Yourself)
- Shared CORS middleware
- Consistent response format
- Reusable error handling

#### KISS (Keep It Simple, Stupid)
- No over-engineering
- Minimal dependencies
- Clear, readable code

---

## 13. Integration Design

### 13.1 Frontend Integration

**Expected Frontend Calls:**
```javascript
// Fetch all
const response = await fetch('/api/destinations');
const { success, data } = await response.json();

// Fetch one
const response = await fetch(`/api/destinations/${id}`);
const { success, data } = await response.json();
```

**Error Handling Pattern:**
```javascript
try {
  const response = await fetch('/api/destinations');
  const result = await response.json();
  
  if (!result.success) {
    // Handle error
    console.error(result.error);
    return;
  }
  
  // Use result.data
} catch (error) {
  // Network error
  console.error('Network error:', error);
}
```

---

## Document Control

**Document Type:** Design Specification  
**Related Documents:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - System requirements
- [TASKS.md](./TASKS.md) - Implementation tasks

**Stakeholders:**
- Development Team
- System Architects
- DevOps Team

**Review Cycle:** Quarterly  
**Next Review:** February 2027

---

*This document defines HOW the system is built.*
