# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
│           React SPA (Vite + TypeScript)              │
│         Tailwind CSS + Chart.js + Axios              │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/REST
                      │ JWT Bearer Token
┌─────────────────────▼───────────────────────────────┐
│              Node.js / Express API                   │
│                                                      │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │  Routes  │→ │Controllers │→ │    Services      │ │
│  └──────────┘  └────────────┘  └────────┬────────┘ │
│  ┌──────────────────────────────────────▼────────┐  │
│  │         Middleware (Auth/Validation/Log)       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ Sequelize ORM
┌─────────────────────▼───────────────────────────────┐
│              PostgreSQL 15                           │
│         (users, members, meetings, ...)              │
└─────────────────────────────────────────────────────┘
```

## Security

- JWT authentication with configurable expiry
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Input validation with express-validator
- Rate limiting (100 req/15 min)
- Helmet.js security headers
- CORS configuration
- SQL injection protection via Sequelize ORM

## API Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": { "total": 100, "page": 1, "limit": 20, "pages": 5 }
}
```

## Frontend Architecture

- **AuthContext**: Global authentication state
- **Service Layer**: Axios-based API clients per resource
- **Protected Routes**: Redirect unauthenticated users
- **Role Guards**: Component-level permission checks
