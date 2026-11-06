# Product Requirements Document (PRD)
## Tourism Destination Website - Backend API

**Version:** 1.0.0  
**Last Updated:** November 6, 2026  
**Status:** Production

---

## 📚 Documentation Structure

This project documentation is organized into four interconnected documents:

1. **PRD.md** (this file) - Product overview and business context
2. **[REQUIREMENTS.md](./REQUIREMENTS.md)** - Detailed functional & non-functional requirements
3. **[DESIGN.md](./DESIGN.md)** - Architecture, design decisions, and technical specifications
4. **[TASKS.md](./TASKS.md)** - Implementation tasks, project tracking, and roadmap

---

## 1. Executive Summary

### 1.1 Product Overview
The Tourism Backend API is a RESTful web service that provides destination data for a tourism website focused on Indonesian tourist attractions. Built with Node.js and Express, it serves as the data layer for frontend applications, offering information about popular destinations including descriptions, locations, pricing, and imagery.

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

### 1.4 Success Metrics
- **API Availability:** 99%+ uptime
- **Response Time:** < 100ms average
- **Error Rate:** < 1% of requests
- **Data Accuracy:** 100% (manual verification)

---

## 2. Product Scope

### 2.1 In Scope - Phase 1 (Implemented) ✅
- RESTful API with two GET endpoints
- In-memory data storage with 6 Indonesian destinations
- CORS support for cross-origin requests
- Static file serving for frontend
- Basic error handling
- JSON response format

### 2.2 Out of Scope - Phase 1
- Database integration
- User authentication & authorization
- CRUD operations (Create, Update, Delete)
- Search and filtering
- Pagination
- Image upload
- Rate limiting
- API documentation (Swagger)

### 2.3 Future Phases
See [TASKS.md](./TASKS.md) for detailed roadmap of Phase 2 and Phase 3 features.

---

## 3. API Overview

### 3.1 Base URL
```
http://localhost:3000/api
```

### 3.2 Endpoints

#### GET /api/destinations
Returns all available tourist destinations.

**Response:**
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

#### GET /api/destinations/:id
Returns a specific destination by ID.

**Response:**
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

> 📖 **Detailed specifications:** See [REQUIREMENTS.md](./REQUIREMENTS.md) for complete API requirements and response formats.

---

## 4. Technology Stack

### 4.1 Core Technologies
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v4.21.2
- **Middleware:** CORS v2.8.5
- **Data Storage:** In-memory JavaScript array

### 4.2 Development Tools
- **Package Manager:** npm
- **Development Mode:** Node.js --watch flag

> 🏗️ **Architecture details:** See [DESIGN.md](./DESIGN.md) for complete technical design and architecture decisions.

---

## 5. Data

### 5.1 Destination Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (format: `dest-{number}`) |
| `name` | String | Destination name |
| `location` | String | Geographic location (City, Province) |
| `description` | String | Detailed description in Indonesian |
| `ticketPrice` | Number | Entry price in IDR (0 = free) |
| `imageUrl` | String | External image URL |

### 5.2 Current Dataset (6 Destinations)
1. **Candi Borobudur** - Magelang, Jawa Tengah
2. **Raja Ampat** - Papua Barat Daya
3. **Taman Nasional Bromo Tengger Semeru** - Jawa Timur
4. **Pantai Kuta** - Badung, Bali
5. **Danau Toba & Pulau Samosir** - Sumatera Utara
6. **Labuan Bajo & Pulau Padar** - Manggarai Barat, NTT

---

## 6. Key Features

### 6.1 Current Features ✅
- ✅ RESTful API design
- ✅ Retrieve all destinations
- ✅ Retrieve destination by ID
- ✅ CORS enabled for all origins
- ✅ Static file serving
- ✅ Consistent JSON response format
- ✅ Comprehensive error handling
- ✅ Fast response times (< 100ms)

### 6.2 Planned Features ⏳
- Database integration (MongoDB/PostgreSQL)
- User authentication (JWT)
- Full CRUD operations
- Search and filtering
- Pagination support
- Rate limiting
- Input validation
- API documentation
- Image upload functionality
- Caching layer (Redis)

> 📋 **Project tracking:** See [TASKS.md](./TASKS.md) for detailed task breakdown and implementation status.

---

## 7. Business Context

### 7.1 Target Market
- **Geography:** Indonesia-focused tourism
- **Language:** Indonesian descriptions, English API
- **Audience:** Domestic and international tourists

### 7.2 Value Proposition
- Easy access to curated Indonesian tourist destinations
- High-quality imagery and detailed descriptions
- Simple integration for developers
- Fast and reliable API responses

### 7.3 Competitive Advantages
- Focus on Indonesian destinations
- Bilingual support (Indonesian content, English API)
- Simple, developer-friendly API
- No authentication required (public data)

---

## 8. Constraints & Limitations

### 8.1 Current Technical Constraints
- **No Persistence:** Data resets on server restart
- **No Authentication:** API is publicly accessible
- **Read-Only:** No write operations implemented
- **No Pagination:** All data returned at once
- **Limited Dataset:** Only 6 destinations

### 8.2 Design Trade-offs
- **Simplicity vs Features:** Chose simple in-memory storage over database complexity
- **Performance vs Scalability:** Fast access but limited to single instance
- **Security vs Accessibility:** Open CORS for easy integration

> 🔧 **Technical details:** See [DESIGN.md](./DESIGN.md) for design rationale and trade-off decisions.

---

## 9. Development & Deployment

### 9.1 Getting Started
```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev
```

### 9.2 Environment Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server listening port |

### 9.3 Project Structure
```
backend/
├── data/
│   └── destinations.js       # Data store
├── middleware/
│   └── cors.js              # CORS configuration
├── routes/
│   └── destinations.js      # API routes
├── server.js                # Application entry point
├── package.json             # Dependencies
├── PRD.md                   # This file
├── REQUIREMENTS.md          # Requirements specification
├── DESIGN.md               # Design documentation
└── TASKS.md                # Implementation tasks
```

---

## 10. Risks & Mitigation

### 10.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss on restart | High | Plan database integration (Phase 2) |
| No access control | Medium | Public API by design, add auth in Phase 2 |
| Single point of failure | Medium | Add clustering, load balancing later |
| External image dependencies | Low | Images hosted on reliable CDN (Unsplash) |

### 10.2 Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Limited dataset | Low | Easily expandable, add more destinations |
| No content management | Medium | Plan admin panel in Phase 2 |
| No analytics | Low | Add tracking in Phase 3 |

---

## 11. Stakeholders

### 11.1 Internal Stakeholders
- **Development Team:** Implementation and maintenance
- **Product Owner:** Feature prioritization
- **QA Team:** Testing and quality assurance

### 11.2 External Stakeholders
- **Frontend Developers:** API consumers
- **End Users:** Tourism website visitors
- **Content Managers:** Destination data (future)

---

## 12. Timeline & Milestones

### Phase 1: Core API ✅ Complete
**Timeline:** November 2026  
**Status:** Implemented and deployed

**Deliverables:**
- ✅ Basic REST API with GET endpoints
- ✅ 6 destinations dataset
- ✅ CORS support
- ✅ Error handling
- ✅ Documentation

### Phase 2: Database & CRUD ⏳ Planned
**Timeline:** Q1 2027 (Estimated)  
**Key Features:**
- Database integration
- Full CRUD operations
- Authentication
- Input validation
- API documentation

### Phase 3: Advanced Features ⏳ Planned
**Timeline:** Q2 2027 (Estimated)  
**Key Features:**
- Search and filtering
- Pagination
- Caching
- Rate limiting
- Analytics
- Image upload

> 📅 **Detailed timeline:** See [TASKS.md](./TASKS.md) for complete task breakdown and estimates.

---

## 13. Acceptance Criteria

### 13.1 Phase 1 Acceptance ✅
- [x] API returns all 6 destinations via GET /api/destinations
- [x] API returns single destination via GET /api/destinations/:id
- [x] 404 error returned for invalid destination ID
- [x] 500 error returned for server errors
- [x] All responses in consistent JSON format
- [x] CORS enabled and working
- [x] Static files served correctly
- [x] Response times < 100ms
- [x] No server crashes on invalid requests
- [x] Documentation complete

---

## 14. Appendix

### 14.1 Glossary
- **API:** Application Programming Interface
- **CORS:** Cross-Origin Resource Sharing
- **CRUD:** Create, Read, Update, Delete
- **IDR:** Indonesian Rupiah
- **REST:** Representational State Transfer
- **SPA:** Single Page Application

### 14.2 References
- [Express.js Documentation](https://expressjs.com/)
- [CORS Package](https://www.npmjs.com/package/cors)
- [REST API Best Practices](https://restfulapi.net/)

### 14.3 Contact Information
- **Project Repository:** (Add repository URL)
- **Issue Tracker:** (Add issue tracker URL)
- **Team Contact:** (Add team contact)

---

## Document Control

**Document Type:** Product Requirements Document  
**Version:** 1.0.0  
**Status:** Approved  
**Last Updated:** November 6, 2026  
**Next Review:** February 2027

**Related Documents:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Detailed requirements
- [DESIGN.md](./DESIGN.md) - Technical design
- [TASKS.md](./TASKS.md) - Implementation tasks

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Nov 2026 | Development Team | Initial release |

---

*This PRD provides the business and product context for the Tourism Backend API. For technical details, see REQUIREMENTS.md and DESIGN.md.*
