# CAC - Community Advisory Committee Healthcare Management System

A comprehensive, production-ready management platform for Community Advisory Committees (CAC) in healthcare settings.

## 🚀 Features

- **Member Management** – Register and manage CAC members with profiles, roles, and status tracking
- **Meeting Management** – Schedule meetings, manage agendas, record minutes, and track attendance
- **Document Management** – Upload and share meeting agendas, minutes, and healthcare documents
- **Surveys & Feedback** – Create surveys, collect member feedback, and analyze responses
- **Voting System** – Online voting with real-time results and decision tracking
- **Analytics Dashboard** – Key metrics, charts, and performance indicators
- **Reports** – Attendance, engagement, and decision tracking reports

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4
- **Database**: PostgreSQL 15 with Sequelize ORM
- **Auth**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, rate limiting

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **UI**: Heroicons, Headless UI

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- npm or yarn

## ⚡ Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/hr-art007/CAC.git
cd CAC

# Start all services
docker-compose up -d

# Seed the database (first time)
docker-compose exec backend npm run seed

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Health: http://localhost:5000/health
```

## 🔧 Local Development Setup

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create the database
psql -U postgres -c "CREATE DATABASE cac_db;"
psql -U postgres -c "CREATE USER cac_user WITH PASSWORD 'cac_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cac_db TO cac_user;"

# Run migrations
psql -U cac_user -d cac_db -f migrations/001_create_tables.sql

# Start the server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔐 Demo Credentials

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@cac.org      | Admin123!  |
| Chair  | chair@cac.org      | Chair123!  |
| Member | member1@cac.org    | Member123! |

## 📁 Project Structure

```
CAC/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/          # Database & app config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/       # Auth, validation, logging
│   │   ├── models/          # Sequelize ORM models
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Helpers & utilities
│   ├── migrations/          # Database migration scripts
│   ├── seeds/               # Sample data seeder
│   └── server.js            # Application entry point
├── frontend/                # React/TypeScript SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Application pages
│   │   └── services/        # API service layer
├── docs/                    # Documentation
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.backend       # Backend container
└── Dockerfile.frontend      # Frontend container
```

## 📚 API Overview

| Resource    | Endpoints                                      |
|-------------|------------------------------------------------|
| Auth        | POST /api/auth/login, /register, GET/PUT /profile |
| Members     | CRUD /api/members + GET /stats                 |
| Meetings    | CRUD /api/meetings + attendance, GET /stats    |
| Documents   | CRUD /api/documents + file upload/download     |
| Surveys     | CRUD /api/surveys + respond, GET results       |
| Votes       | CRUD /api/votes + cast vote, close             |
| Decisions   | CRUD /api/decisions + GET /stats               |

Full API documentation: [docs/API.md](docs/API.md)

## 📖 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [User Guide](docs/USER_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License.
