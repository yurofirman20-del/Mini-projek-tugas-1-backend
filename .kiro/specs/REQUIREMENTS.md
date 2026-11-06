# Requirements Document
## Tourism Destination Website - Backend API

**Version:** 1.0.0  
**Last Updated:** November 6, 2026  
**Status:** Production

---

## 1. Executive Summary

### 1.1 Product Overview
The Tourism Backend API is a RESTful web service that provides destination data for a tourism website focused on Indonesian tourist attractions. The API serves as the data layer for frontend applications, offering information about popular destinations including descriptions, locations, pricing, and imagery.

### 1.2 Target Users
- Frontend web applications
- Mobile applications
- Third-party travel platforms
- Tourism aggregators

### 1.3 Key Objectives
- Provide reliable access to Indonesian tourism destination data
- Enable quick retrieval of destination information
- Support scalable integration with frontend applications
- Maintain simple, predictable API responses

---

## 2. Functional Requirements

### 2.1 API Endpoints

#### FR-001: Get All Destinations
**Priority:** High  
**Status:** Implemented

**Description:** The system shall provide an endpoint to retrieve all available tourist destinations.

**Endpoint:** `GET /api/destinations`

**Requirements:**
- Return all destinations in a single response
- Include complete destination information for each item
- Return consistent JSON structure
- Handle server errors gracefully

**Success Criteria:**
- Returns 200 status code on success
- Returns array of destination objects
- Response time < 100ms

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dest-1",
      "name": "Candi Borobudur",
      "location": "Magelang, Jawa Tengah",
      "description": "...",
      "ticketPrice": 50000,
      "imageUrl": "https://..."
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Terjadi kesalahan pada server saat memuat data destinasi."
}
```

---

#### FR-002: Get Destination by ID
**Priority:** High  
**Status:** Implemented

**Description:** The system shall provide an endpoint to retrieve a specific destination by its unique identifier.

**Endpoint:** `GET /api/destinations/:id`

**Requirements:**
- Accept destination ID as URL parameter
- Return single destination if found
- Return 404 if destination not found
- Return complete destination information
- Handle server errors gracefully

**Success Criteria:**
- Returns 200 status code when destination exists
- Returns 404 status code when destination not found
- Returns single destination object
- Response time < 100ms

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "dest-1",
    "name": "Candi Borobudur",
    "location": "Magelang, Jawa Tengah",
    "description": "...",
    "ticketPrice": 50000,
    "imageUrl": "https://..."
  }
}
```

**Not Found Response:**
```json
{
  "success": false,
  "error": "Destination not found"
}
```

---

### 2.2 Data Requirements

#### DR-001: Destination Data Model
**Priority:** High  
**Status:** Implemented

**Description:** The system shall store and provide destination information with the following attributes.

**Required Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | Unique, Required | Identifier in format `dest-{number}` |
| `name` | String | Required | Official destination name |
| `location` | String | Required | Geographic location (City, Province) |
| `description` | String | Required | Detailed description in Indonesian |
| `ticketPrice` | Number | Required, >= 0 | Entry price in IDR (0 = free) |
| `imageUrl` | String | Required, Valid URL | External image reference |

**Validation Rules:**
- ID must follow pattern: `dest-{number}`
- Name must not be empty
- Location must include city and province
- Description must be in Indonesian language
- Ticket price must be non-negative integer
- Image URL must be valid HTTP/HTTPS URL

---

#### DR-002: Initial Dataset
**Priority:** High  
**Status:** Implemented

**Description:** The system shall include an initial dataset of Indonesian tourist destinations.

**Required Destinations:**
1. Candi Borobudur (Magelang, Jawa Tengah)
2. Raja Ampat (Papua Barat Daya)
3. Taman Nasional Bromo Tengger Semeru (Jawa Timur)
4. Pantai Kuta (Badung, Bali)
5. Danau Toba & Pulau Samosir (Sumatera Utara)
6. Labuan Bajo & Pulau Padar (Manggarai Barat, NTT)

**Success Criteria:**
- Minimum 6 destinations available
- All fields populated for each destination
- Diverse geographic coverage across Indonesia
- High-quality images from reliable sources

---

### 2.3 Cross-Origin Resource Sharing (CORS)

#### FR-003: CORS Support
**Priority:** High  
**Status:** Implemented

**Description:** The system shall support Cross-Origin Resource Sharing to allow frontend applications from different domains to access the API.

**Requirements:**
- Allow requests from any origin
- Support preflight OPTIONS requests
- Allow standard HTTP methods
- Allow standard headers

**Configuration:**
- **Origins:** All origins (`*`)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

**Success Criteria:**
- Frontend applications can successfully make API requests
- No CORS-related errors in browser console
- Preflight requests handled correctly

---

### 2.4 Static File Serving

#### FR-004: Frontend Static Files
**Priority:** Medium  
**Status:** Implemented

**Description:** The system shall serve static files for the frontend application.

**Requirements:**
- Serve files from `../frontend` directory
- Support HTML, CSS, JavaScript, and image files
- Provide fallback to index.html for SPA routing

**Success Criteria:**
- Frontend accessible from root URL
- All static assets load correctly
- API routes take precedence over static files

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

#### NFR-001: Response Time
**Priority:** High  
**Status:** Met

**Description:** API endpoints shall respond within acceptable time limits.

**Requirements:**
- Average response time < 100ms
- 95th percentile response time < 150ms
- No caching required (in-memory data)

---

#### NFR-002: Payload Size
**Priority:** Medium  
**Status:** Met

**Description:** API responses shall be optimized for network transfer.

**Requirements:**
- Full destination list < 10KB
- Single destination < 2KB
- Use JSON compression when available

---

### 3.2 Security Requirements

#### NFR-003: Error Handling
**Priority:** High  
**Status:** Met

**Description:** The system shall not expose sensitive information in error responses.

**Requirements:**
- No stack traces in production responses
- Generic error messages for server errors
- Log detailed errors server-side only

**Success Criteria:**
- 500 errors return generic message
- No internal paths or code exposed
- Errors logged to server console

---

#### NFR-004: Input Validation
**Priority:** Medium  
**Status:** Partial

**Description:** The system shall validate all user inputs.

**Current State:**
- URL parameter extraction only
- No SQL injection risk (no database)
- No XSS risk (no HTML rendering)

**Future Requirements:**
- Validate ID format
- Sanitize query parameters
- Rate limiting per IP

---

### 3.3 Reliability Requirements

#### NFR-005: Error Recovery
**Priority:** High  
**Status:** Met

**Description:** The system shall handle errors gracefully without crashing.

**Requirements:**
- Try-catch blocks on all route handlers
- Global error handler as fallback
- Server continues running after errors

**Success Criteria:**
- Server never crashes due to route errors
- All errors result in proper JSON response
- Error logged for debugging

---

#### NFR-006: Availability
**Priority:** High  
**Status:** Met

**Description:** The system shall maintain high availability during operation.

**Requirements:**
- Single process deployment
- Automatic restart on crash (via process manager)
- No planned downtime for data updates

**Target:** 99%+ uptime

---

### 3.4 Maintainability Requirements

#### NFR-007: Code Organization
**Priority:** Medium  
**Status:** Met

**Description:** Code shall be organized for easy maintenance and updates.

**Requirements:**
- Separation of concerns (routes/middleware/data)
- ES6+ module system
- Descriptive naming conventions
- Minimal dependencies

**Success Criteria:**
- New developers can understand structure quickly
- Easy to add new routes
- Clear separation between layers

---

#### NFR-008: Documentation
**Priority:** Medium  
**Status:** Partial

**Description:** System shall be documented for developers.

**Current State:**
- Inline comments in code
- This requirements document

**Future Requirements:**
- API documentation (Swagger/OpenAPI)
- Setup and deployment guide
- Contributing guidelines

---

### 3.5 Scalability Requirements

#### NFR-009: Concurrent Users
**Priority:** Low  
**Status:** Limited

**Description:** System shall support multiple concurrent users.

**Current State:**
- Single-threaded Node.js process
- In-memory data (no I/O bottleneck)
- Standard Express.js concurrency

**Limitations:**
- No database connection pooling needed
- No caching layer
- Single instance only

**Future Requirements:**
- Support for clustering
- Database connection pooling
- Redis caching layer

---

## 4. Technical Constraints

### 4.1 Technology Constraints

#### TC-001: Runtime Environment
**Description:** Must run on Node.js with ES modules support

**Requirements:**
- Node.js version 14+ (ES modules support)
- npm or compatible package manager
- No browser-specific APIs

---

#### TC-002: Dependencies
**Description:** Minimize external dependencies

**Current Dependencies:**
- express: ^4.21.2
- cors: ^2.8.5

**Rationale:** Reduce security vulnerabilities and maintenance overhead

---

### 4.2 Data Constraints

#### TC-003: Data Storage
**Description:** Data stored in-memory only

**Limitations:**
- No persistence between restarts
- Maximum ~1000 destinations (memory limit)
- No concurrent write protection

**Rationale:** Simplicity for prototype/MVP phase

---

#### TC-004: Data Updates
**Description:** Data updates require code deployment

**Process:**
1. Edit `data/destinations.js`
2. Restart server
3. Data available immediately

**Limitation:** No runtime data management

---

### 4.3 Deployment Constraints

#### TC-005: Frontend Coupling
**Description:** Frontend expected at `../frontend` path

**Requirement:** Frontend must be deployed alongside backend

**Alternative:** Configure different static path

---

#### TC-006: Port Configuration
**Description:** Single port for both API and static files

**Default:** 3000  
**Configurable:** Via PORT environment variable

---

## 5. Business Requirements

### 5.1 Target Market
**Geography:** Indonesia-focused tourism  
**Language:** Indonesian descriptions, English API  
**Audience:** Domestic and international tourists

### 5.2 Content Requirements
**Destinations:** Major Indonesian tourist attractions  
**Coverage:** Diverse geographic locations  
**Quality:** High-resolution images, detailed descriptions

### 5.3 Success Metrics
- API uptime: 99%+
- Response time: < 100ms average
- Error rate: < 1% of requests
- Data accuracy: 100%

---

## 6. Future Requirements (Out of Scope)

### 6.1 Phase 2 Requirements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Admin panel for content management
- [ ] Image upload and storage
- [ ] Destination reviews and ratings

### 6.2 Phase 3 Requirements
- [ ] Search and filtering capabilities
- [ ] Pagination support
- [ ] Advanced sorting options
- [ ] Booking integration
- [ ] Multi-language support

### 6.3 Phase 4 Requirements
- [ ] Analytics and tracking
- [ ] Recommendation engine
- [ ] Social media integration
- [ ] Mobile app API extensions
- [ ] Third-party API integrations

---

## 7. Acceptance Criteria

### 7.1 API Functionality
- ✅ GET /api/destinations returns all destinations
- ✅ GET /api/destinations/:id returns specific destination
- ✅ 404 returned for invalid destination ID
- ✅ 500 returned for server errors
- ✅ All responses in consistent JSON format

### 7.2 Data Quality
- ✅ 6 destinations available
- ✅ All required fields populated
- ✅ Valid image URLs
- ✅ Accurate location information
- ✅ Reasonable ticket prices

### 7.3 Integration
- ✅ CORS enabled for frontend access
- ✅ Static files served correctly
- ✅ API accessible from localhost
- ✅ No console errors on startup

### 7.4 Reliability
- ✅ Server starts without errors
- ✅ Errors handled gracefully
- ✅ Server doesn't crash on invalid requests

---

## Document Control

**Document Type:** Requirements Specification  
**Related Documents:**
- [DESIGN.md](./DESIGN.md) - Design specifications
- [TASKS.md](./TASKS.md) - Implementation tasks

**Stakeholders:**
- Product Owner
- Development Team
- Frontend Team
- QA Team

**Approval Status:** Approved  
**Review Cycle:** Quarterly  
**Next Review:** February 2027

---

*This document defines WHAT the system must do and WHY.*
