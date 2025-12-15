# Sponsorship Backend

A robust REST API backend for managing creator sponsorships, built with Go, PostgreSQL, and featuring JWT authentication.

## Overview

The Sponsorship Backend provides a comprehensive set of API endpoints for managing sponsorship deals, including creation, updates, and dashboard analytics. The system is designed with a clean architecture pattern separating concerns into models, repositories, handlers, and routes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Go** 1.21 or later ([Download](https://golang.org/doc/install))
- **PostgreSQL** 14 or later ([Download](https://www.postgresql.org/download/))
- **git** for version control
- A code editor (VS Code, GoLand, etc.)

### Verify Installation

```bash
go version
psql --version
```

## Project Structure

```
sponsorship-backend/
├── cmd/
│   └── main.go                 # Application entry point
├── config/
│   └── config.go               # Configuration management
├── internal/
│   ├── api/
│   │   ├── middleware/
│   │   │   └── auth.go         # JWT authentication middleware
│   │   └── response.go         # API response utilities
│   ├── database/
│   │   ├── db.go               # Database connection
│   │   └── migrations/         # SQL migration files
│   ├── handlers/
│   │   ├── auth_handler.go     # Authentication endpoints
│   │   └── sponsorship_handler.go  # Sponsorship endpoints
│   ├── models/
│   │   └── models.go           # Data models
│   ├── repositories/
│   │   └── sponsorship_repo.go # Data access layer
│   └── routes/
│       └── routes.go           # Route definitions
├── pkg/
│   └── errors/
│       └── errors.go           # Custom error types
├── go.mod                      # Go module definition
├── go.sum                      # Go module checksums
├── .env.example                # Example environment variables
├── .env                        # Local environment variables
└── README.md                   # This file
```

## Database Setup

### 1. Create PostgreSQL Database

First, connect to PostgreSQL as the default user:

```bash
sudo -u postgres psql
```

Then create the database and user:

```sql
-- Create database
CREATE DATABASE sponsorship_db;

-- Create user
CREATE USER sponsorship_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
ALTER ROLE sponsorship_user SET client_encoding TO 'utf8';
ALTER ROLE sponsorship_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE sponsorship_user SET default_transaction_deferrable TO on;
ALTER ROLE sponsorship_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE sponsorship_db TO sponsorship_user;

-- Exit psql
\q
```

### 2. Create Database Tables

Connect to the database as the new user:

```bash
psql -h localhost -U sponsorship_user -d sponsorship_db
```

Run the following SQL to create the schema:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsorships table
CREATE TABLE sponsorships (
    id UUID PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    product_service TEXT,
    deal_amount DECIMAL(10, 2) NOT NULL,
    priority VARCHAR(50),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    description TEXT,
    deliverables TEXT[],
    target_audience TEXT,
    status VARCHAR(50) DEFAULT 'pitch-received',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_sponsorships_creator_id ON sponsorships(creator_id);
CREATE INDEX idx_sponsorships_status ON sponsorships(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

Exit psql:

```bash
\q
```

### 3. Verify Database Connection

```bash
psql -h localhost -U sponsorship_user -d sponsorship_db -c "SELECT 1;"
```

You should see output indicating a successful connection.

## Environment Configuration

### 1. Create `.env` File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your database and server settings:

```env
# Server Configuration
SERVER_PORT=8080
ENVIRONMENT=development
LOG_LEVEL=info

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sponsorship_db
DB_USER=sponsorship_user
DB_PASSWORD=your_secure_password
DB_SSL_MODE=disable

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION_HOURS=24

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Environment Variables Explained

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | 8080 | Port the API server runs on |
| `ENVIRONMENT` | development | Environment mode (development/production) |
| `LOG_LEVEL` | info | Logging level (debug/info/warn/error) |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_NAME` | sponsorship_db | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |
| `DB_SSL_MODE` | disable | SSL mode (disable/require) |
| `JWT_SECRET` | dev-secret-key | Secret key for signing JWT tokens |
| `JWT_EXPIRATION_HOURS` | 24 | JWT token expiration time |
| `CORS_ALLOWED_ORIGINS` | localhost:3000 | Comma-separated CORS allowed origins |

## Getting Started

### 1. Install Dependencies

```bash
go mod download
go mod tidy
```

### 2. Run Migrations (Optional)

If you have migration files, run them:

```bash
go run cmd/main.go migrate
```

### 3. Start the Server

#### Development Mode

```bash
go run main.go
```

You should see output similar to:

```
2025-12-12 10:30:15 Starting server on :8080
```

#### Production Build

```bash
# Build the binary
go build -o sponsorship-backend main.go

# Run the binary
./sponsorship-backend
```

### 4. Verify Server is Running

Open a new terminal and test the health endpoint:

```bash
curl -X GET http://localhost:8080/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "creator1",
  "email": "creator@example.com",
  "password": "securePassword123"
}
```

Response:

```json
{
  "data": {
    "id": "uuid-here",
    "username": "creator1",
    "email": "creator@example.com",
    "token": "jwt-token-here"
  },
  "status": "success"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "creator@example.com",
  "password": "securePassword123"
}
```

### Sponsorship Endpoints

All sponsorship endpoints require authentication via the `Authorization: Bearer <token>` header.

#### List Sponsorships

```http
GET /api/sponsorships?page=1
Authorization: Bearer <your-jwt-token>
```

#### Create Sponsorship

```http
POST /api/sponsorships
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "brandName": "Nike",
  "productService": "Athletic Apparel",
  "dealAmount": 50000,
  "priority": "high",
  "contactName": "John Doe",
  "contactEmail": "john@nike.com",
  "contactPhone": "+1-555-0123",
  "description": "Sponsorship for fitness content",
  "deliverables": ["5 posts", "1 video", "2 stories"],
  "targetAudience": "18-35 fitness enthusiasts",
  "startDate": "2025-12-15T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}
```

#### Get Sponsorship

```http
GET /api/sponsorships/{id}
Authorization: Bearer <your-jwt-token>
```

#### Update Sponsorship

```http
PUT /api/sponsorships/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "brandName": "Nike Updated",
  "dealAmount": 55000,
  ...
}
```

#### Delete Sponsorship

```http
DELETE /api/sponsorships/{id}
Authorization: Bearer <your-jwt-token>
```

#### Dashboard Stats

```http
GET /api/sponsorships/stats/dashboard
Authorization: Bearer <your-jwt-token>
```

Response:

```json
{
  "data": {
    "activeDeals": 3,
    "pendingApproval": 1,
    "completedDeals": 5,
    "pipelineValue": 150000,
    "averageDealAmount": 37500
  },
  "status": "success"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to Authenticate

1. **Register or Login** to get a JWT token
2. **Include the token** in the `Authorization` header for all protected endpoints:

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  http://localhost:8080/api/sponsorships
```

### Token Expiration

- Default expiration: 24 hours
- Configure via `JWT_EXPIRATION_HOURS` environment variable

## Development

### Installing New Dependencies

```bash
go get github.com/package/name
go mod tidy
```

### Running Tests

```bash
go test ./...
```

### Code Formatting

```bash
go fmt ./...
```

### Linting

```bash
golangci-lint run
```

### Database Queries

Connect to the database directly for debugging:

```bash
psql -h localhost -U sponsorship_user -d sponsorship_db
```

Useful queries:

```sql
-- List all sponsorships
SELECT * FROM sponsorships;

-- Count sponsorships by status
SELECT status, COUNT(*) FROM sponsorships GROUP BY status;

-- Find sponsorships by creator
SELECT * FROM sponsorships WHERE creator_id = 'uuid-here';

-- Check database size
SELECT pg_size_pretty(pg_database_size('sponsorship_db'));
```

## Docker Setup (Optional)

### Run PostgreSQL with Docker

```bash
docker run --name sponsorship-db \
  -e POSTGRES_USER=sponsorship_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=sponsorship_db \
  -p 5432:5432 \
  -v sponsorship_db_data:/var/lib/postgresql/data \
  -d postgres:16
```

### Build Docker Image for Backend

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o sponsorship-backend main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/sponsorship-backend .
COPY .env .

EXPOSE 8080
CMD ["./sponsorship-backend"]
```

Build and run:

```bash
docker build -t sponsorship-backend .
docker run -p 8080:8080 sponsorship-backend
```

## Troubleshooting

### Database Connection Error

**Error:** `dial tcp localhost:5432: connect: connection refused`

**Solution:**
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check database credentials in `.env`
3. Ensure database and user exist
4. Restart PostgreSQL: `sudo systemctl restart postgresql`

### Port Already in Use

**Error:** `listen tcp :8080: bind: address already in use`

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change SERVER_PORT in .env
```

### JWT Token Invalid

**Error:** `invalid or expired token`

**Solution:**
1. Ensure token hasn't expired
2. Check `JWT_SECRET` matches between client and server
3. Verify token format: `Authorization: Bearer <token>`

### Migration Failed

**Error:** `relation "users" does not exist`

**Solution:**
1. Run database creation SQL manually
2. Check database connection permissions
3. Verify `sponsorship_user` has proper privileges

### Go Module Issues

```bash
# Clear module cache
go clean -modcache

# Download dependencies again
go mod download
go mod tidy
```

## Production Deployment

Before deploying to production:

1. **Update `.env` with production values**
   ```env
   ENVIRONMENT=production
   LOG_LEVEL=warn
   DB_SSL_MODE=require
   JWT_SECRET=generate-strong-secret
   ```

2. **Build optimized binary**
   ```bash
   go build -ldflags="-s -w" -o sponsorship-backend main.go
   ```

3. **Use a process manager** (systemd, supervisor, PM2)

4. **Enable HTTPS** with a reverse proxy (nginx, Caddy)

5. **Set up monitoring and logging**

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check server logs: `grep ERROR logs/`
4. Open an issue on GitHub

---

**Last Updated:** December 12, 2025
