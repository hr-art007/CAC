# Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional but recommended)

## Option 1: Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# Seed sample data
docker-compose exec backend npm run seed

# Access the app at http://localhost:3000
```

## Option 2: Manual Setup

### Database Setup

```bash
# Create database and user
psql -U postgres
CREATE DATABASE cac_db;
CREATE USER cac_user WITH PASSWORD 'cac_password';
GRANT ALL PRIVILEGES ON DATABASE cac_db TO cac_user;
\q

# Run migration
psql -U cac_user -d cac_db -f backend/migrations/001_create_tables.sql
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend (.env)

| Variable       | Description                    | Default         |
|----------------|--------------------------------|-----------------|
| PORT           | Server port                    | 5000            |
| DB_HOST        | PostgreSQL host                | localhost       |
| DB_NAME        | Database name                  | cac_db          |
| DB_USER        | Database user                  | cac_user        |
| DB_PASSWORD    | Database password              | cac_password    |
| JWT_SECRET     | JWT signing secret             | (required)      |
| JWT_EXPIRES_IN | Token expiration               | 7d              |

### Frontend (.env)

| Variable     | Description       | Default                |
|--------------|-------------------|------------------------|
| VITE_API_URL | Backend API URL   | http://localhost:5000  |
