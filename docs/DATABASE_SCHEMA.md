# Database Schema

## Tables Overview

| Table               | Description                              |
|---------------------|------------------------------------------|
| users               | Authentication and user accounts         |
| members             | CAC member profiles                      |
| meetings            | Meeting schedule and details             |
| meeting_attendances | Attendance records per meeting           |
| documents           | Uploaded files and documents             |
| surveys             | Survey definitions                       |
| survey_responses    | Survey answers from members              |
| votes               | Voting items                             |
| vote_records        | Individual vote records                  |
| decisions           | CAC decisions and implementation status  |

## Key Relationships

- `users` → `members` (1:1 via user_id)
- `meetings` → `meeting_attendances` (1:many)
- `members` → `meeting_attendances` (1:many)
- `meetings` → `documents` (1:many)
- `surveys` → `survey_responses` (1:many)
- `votes` → `vote_records` (1:many)
- `votes` → `decisions` (1:1)

## Field Types

- Primary Keys: UUID (uuid_generate_v4())
- Foreign Keys: UUID references
- Text: VARCHAR / TEXT
- JSON data: JSONB
- Arrays: TEXT[]
- Dates: DATE / TIMESTAMP WITH TIME ZONE
- Booleans: BOOLEAN
