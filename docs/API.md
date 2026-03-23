# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "member"
}
```

### POST /auth/login
Authenticate and get JWT token.

**Body:**
```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "firstName": "...", "role": "..." },
    "token": "eyJhbGc..."
  }
}
```

### GET /auth/profile
Get current user profile. **(Protected)**

### PUT /auth/profile
Update profile. **(Protected)**

### PUT /auth/change-password
Change password. **(Protected)**

---

## Members

### GET /members
List all members with pagination.

Query params: `status`, `role`, `page`, `limit`

### GET /members/stats
Get member statistics.

### GET /members/:id
Get member details.

### POST /members
Create new member. **(Admin/Chair)**

### PUT /members/:id
Update member. **(Admin/Chair)**

### DELETE /members/:id
Deactivate member. **(Admin)**

---

## Meetings

### GET /meetings
List meetings. Query: `status`, `from`, `to`, `page`, `limit`

### GET /meetings/stats
Meeting statistics.

### GET /meetings/:id
Meeting details with attendances and documents.

### POST /meetings
Create meeting. **(Admin/Chair/Staff)**

### PUT /meetings/:id
Update meeting. **(Admin/Chair/Staff)**

### DELETE /meetings/:id
Cancel meeting. **(Admin/Chair)**

### POST /meetings/:id/attendance
Record attendance. Body: `{ attendances: [{ memberId, status, notes }] }`

### GET /meetings/:id/attendance
Get attendance list.

---

## Documents

### GET /documents
List documents. Query: `type`, `meetingId`, `page`, `limit`

### GET /documents/:id
Document details.

### POST /documents
Upload document (multipart/form-data). Fields: `title`, `type`, `file`

### PUT /documents/:id
Update document metadata.

### DELETE /documents/:id
Soft delete document. **(Admin/Chair/Staff)**

### GET /documents/:id/download
Download document file.

---

## Surveys

### GET /surveys
List surveys.

### GET /surveys/:id
Survey with responses.

### GET /surveys/:id/results
Survey results with analytics.

### POST /surveys
Create survey. **(Admin/Chair/Staff)**

Body: `{ title, description, questions: [{ id, text, type }], status, isAnonymous }`

### POST /surveys/:id/respond
Submit survey response.

Body: `{ answers: { questionId: answer }, isAnonymous: false }`

### PUT /surveys/:id
Update survey. **(Admin/Chair/Staff)**

### DELETE /surveys/:id
Delete survey. **(Admin)**

---

## Votes

### GET /votes
List votes.

### GET /votes/stats
Vote statistics.

### GET /votes/:id
Vote details with records.

### POST /votes
Create vote. **(Admin/Chair)**

Body: `{ title, description, options: ["Yes", "No"], votingMethod, endDate }`

### POST /votes/:id/cast
Cast a vote.

Body: `{ choice: "Yes", comment: "..." }`

### POST /votes/:id/close
Close a vote. **(Admin/Chair)**

### PUT /votes/:id
Update vote. **(Admin/Chair)**

---

## Decisions

### GET /decisions
List decisions. Query: `status`, `priority`, `page`, `limit`

### GET /decisions/stats
Decision statistics.

### GET /decisions/:id
Decision details.

### POST /decisions
Create decision. **(Admin/Chair)**

Body: `{ title, description, priority, category, dueDate }`

### PUT /decisions/:id
Update decision. **(Admin/Chair/Staff)**

### DELETE /decisions/:id
Delete decision. **(Admin)**
