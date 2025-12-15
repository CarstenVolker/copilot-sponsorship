# Creator Sponsorship Platform

A full-stack application for managing and discovering creator sponsorships. Built with modern web technologies, this platform connects brands with content creators for mutually beneficial partnerships.

## Overview

The Creator Sponsorship Platform is a comprehensive solution designed to streamline the sponsorship management process. It provides creators with tools to track sponsorship deals, manage deliverables, and view analytics, while enabling brands to discover creators and manage their sponsorship campaigns.

## Features

- 🎯 **Sponsorship Management** - Create, track, and manage sponsorship deals
- 📊 **Dashboard Analytics** - View pipeline value, active deals, and performance metrics
- 🔐 **Secure Authentication** - JWT-based authentication with user registration and login
- 💼 **Deal Tracking** - Track sponsorship status from pitch to completion
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **High Performance** - Fast API with optimized database queries

## Technology Stack

### Frontend
- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Context API
- **HTTP Client**: fetch/axios

### Backend
- **Language**: Go 1.21+
- **Framework**: chi (router)
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Clean Architecture with Repository Pattern

### Infrastructure
- **Database**: PostgreSQL
- **Containerization**: Docker (optional)

## Project Structure

```
copilot-sponsorship/
├── README.md                      # This file
├── package.json                   # Root package configuration
│
├── frontend/                      # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js app directory
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utility functions
│   │   └── types/                 # TypeScript types
│   ├── public/                    # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
└── sponsorship-backend/           # Go backend API
    ├── cmd/
    │   └── main.go                # Application entry point
    ├── internal/
    │   ├── api/                   # API utilities
    │   ├── database/              # Database layer
    │   ├── handlers/              # HTTP handlers
    │   ├── models/                # Data models
    │   ├── repositories/          # Data access layer
    │   └── routes/                # Route definitions
    ├── pkg/
    │   └── errors/                # Custom error handling
    ├── go.mod
    ├── go.sum
    ├── .env.example
    └── README.md                  # Backend-specific documentation
```

## Quick Start

### Prerequisites

**Frontend:**
- Node.js 18+ and npm/pnpm
- Modern web browser

**Backend:**
- Go 1.21+
- PostgreSQL 14+

### Setup Instructions

#### 1. Clone and Navigate to Project

```bash
cd copilot-sponsorship
```

#### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
pnpm install
```

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Configure environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at: **http://localhost:3000**

#### 3. Backend Setup

Navigate to the backend directory:

```bash
cd ../sponsorship-backend
```

Install Go dependencies:

```bash
go mod download
go mod tidy
```

Create `.env` file:

```bash
cp .env.example .env
```

Configure environment variables:

```env
# Server
SERVER_PORT=8080
ENVIRONMENT=development
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sponsorship_db
DB_USER=sponsorship_user
DB_PASSWORD=your_secure_password
DB_SSL_MODE=disable

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Start the backend server:

```bash
go run main.go
```

The API will be available at: **http://localhost:8080**

#### 4. Database Setup

**Important:** Set up PostgreSQL before running the backend.

See [Backend Database Setup Guide](./sponsorship-backend/README.md#database-setup) for detailed instructions.

Quick setup:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE sponsorship_db;
CREATE USER sponsorship_user WITH PASSWORD 'your_secure_password';
ALTER ROLE sponsorship_user SET client_encoding TO 'utf8';
ALTER ROLE sponsorship_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE sponsorship_db TO sponsorship_user;

# Exit psql
\q
```

Then run the SQL schema (see backend README for full schema).

### Verification

After starting both services, verify they're running:

```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:8080/health
```

## Frontend-Backend Integration

The frontend and backend are fully integrated using a custom API client. Here's how they communicate:

### API Client Architecture

**Frontend API Layer** (`frontend/src/lib/`):
- `api-client.ts` - Base HTTP client with token management
- `auth-api.ts` - Authentication endpoints
- `sponsorship-api.ts` - Sponsorship CRUD operations

**Frontend Hooks** (`frontend/src/hooks/`):
- `useAuth.ts` - User authentication state management
- `useSponsorships.ts` - Sponsorship data management with API calls

### Key Integration Points

1. **Authentication Flow**
   - User registers/logs in via frontend form
   - Backend generates JWT token
   - Frontend stores token in localStorage
   - Token automatically included in all API requests

2. **Data Fetching**
   - Frontend calls `sponsorshipApi.listSponsorships(page)`
   - Backend returns paginated sponsorship data
   - Frontend displays data with loading/error states

3. **Error Handling**
   - Backend returns standardized error responses
   - Frontend handles errors gracefully with user feedback
   - Auth errors trigger logout and redirect to login

### Example Usage

```typescript
import { useAuth } from '@/hooks/useAuth'
import { useSponsorships } from '@/hooks/useSponsorships'

function MyComponent() {
  const { user, login } = useAuth()
  const { sponsorships, loading, addSponsorship } = useSponsorships()
  
  // Use in component...
}
```

## API Documentation

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

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "creator@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid-here",
      "username": "creator1",
      "email": "creator@example.com"
    }
  },
  "status": "success"
}
```

### Sponsorship Endpoints

All sponsorship endpoints require authentication via `Authorization: Bearer <token>` header.

#### List Sponsorships
```http
GET /api/sponsorships?page=1
Authorization: Bearer <token>
```

#### Create Sponsorship
```http
POST /api/sponsorships
Authorization: Bearer <token>
Content-Type: application/json

{
  "brandName": "Nike",
  "productService": "Athletic Apparel",
  "dealAmount": 50000,
  "priority": "high",
  "contactName": "John Doe",
  "contactEmail": "john@nike.com",
  "description": "Sponsorship for fitness content",
  "startDate": "2025-12-15T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z"
}
```

#### Get Sponsorship
```http
GET /api/sponsorships/{id}
Authorization: Bearer <token>
```

#### Update Sponsorship
```http
PUT /api/sponsorships/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Sponsorship
```http
DELETE /api/sponsorships/{id}
Authorization: Bearer <token>
```

#### Dashboard Stats
```http
GET /api/sponsorships/stats/dashboard
Authorization: Bearer <token>
```

**Response:**
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

For complete API documentation, see [Backend README](./sponsorship-backend/README.md#api-endpoints).

## Development Workflow

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Format code
npm run format
```

### Backend Development

```bash
cd sponsorship-backend

# Download dependencies
go mod download

# Run server
go run main.go

# Build binary
go build -o sponsorship-backend main.go

# Run tests
go test ./...

# Format code
go fmt ./...
```

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:8080/api | Backend API base URL |

### Backend (`sponsorship-backend/.env`)

See [Backend README - Environment Configuration](./sponsorship-backend/README.md#environment-configuration) for complete list.

## Docker Setup (Optional)

### Prerequisites
- Docker and Docker Compose

### Run with Docker Compose

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: sponsorship_user
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: sponsorship_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./sponsorship-backend
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      DB_USER: sponsorship_user
      DB_PASSWORD: your_secure_password
      DB_NAME: sponsorship_db
      JWT_SECRET: your-super-secret-jwt-key
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

Start all services:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

Stop services:

```bash
docker-compose down
```

## Testing

### Frontend Tests

```bash
cd frontend
npm run test
```

### Backend Tests

```bash
cd sponsorship-backend
go test ./...
go test -v ./...  # Verbose output
go test -cover ./...  # With coverage
```

## Performance Optimization

### Frontend
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- CSS optimization with Tailwind CSS
- Caching strategies implemented
- SEO metadata optimization

### Backend
- Database indexing on frequently queried columns
- Connection pooling for database
- Response compression
- Pagination for list endpoints
- Rate limiting on authentication endpoints

## Security Best Practices

### Frontend
- XSS protection with React's built-in escaping
- CSRF tokens on all state-changing requests
- Secure cookie handling
- Input validation on all forms

### Backend
- Password hashing with bcrypt
- JWT token validation
- CORS configuration
- SQL injection prevention with prepared statements
- Rate limiting on auth endpoints
- Request validation and sanitization

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
# Change port
npm run dev -- -p 3001
```

**Module not found errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Database connection error:**
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in .env file
# Ensure database and user exist
```

**Port 8080 already in use:**
```bash
# Find and kill process
lsof -i :8080
kill -9 <PID>

# Or change port in .env
SERVER_PORT=8081
```

See individual README files for more detailed troubleshooting:
- [Frontend Troubleshooting](./frontend/README.md)
- [Backend Troubleshooting](./sponsorship-backend/README.md#troubleshooting)

## Common Commands

### Run Everything (after initial setup)

**Terminal 1 - Backend:**
```bash
cd sponsorship-backend
go run main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd sponsorship-backend
go build -ldflags="-s -w" -o sponsorship-backend main.go
./sponsorship-backend
```

## Deployment

### Frontend Deployment
- **Vercel**: Push to GitHub, Vercel will auto-deploy
- **Netlify**: Connect GitHub repository
- **Custom Server**: Build and deploy with `npm run build && npm run start`

### Backend Deployment
- **Docker**: Build Docker image and deploy to container registry
- **Cloud Run**: Deploy Go container to Google Cloud Run
- **Traditional Server**: Build binary and run with systemd/supervisor

See deployment guides in individual README files.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Code Style

### Frontend
- Follow Next.js and React best practices
- Use TypeScript for type safety
- Format code with Prettier (configured in project)
- Follow ESLint rules

### Backend
- Follow Go conventions
- Run `go fmt` before committing
- Write tests for new functions
- Use meaningful variable and function names

## Project Status

This is an active development project. Check individual directories for detailed progress:

- [Frontend Status](./frontend/README.md)
- [Backend Status](./sponsorship-backend/README.md)

## Support & Resources

### Documentation
- [Frontend README](./frontend/README.md)
- [Backend README](./sponsorship-backend/README.md)
- [Go Documentation](https://golang.org/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Getting Help
1. Check the troubleshooting section
2. Review relevant README file
3. Check browser console for frontend errors
4. Check server logs for backend errors
5. Open a GitHub issue with detailed description

## License

This project is proprietary and confidential.

---

**Last Updated:** December 12, 2025

For detailed setup and troubleshooting, please refer to the README files in each service directory:
- 📖 [Frontend README](./frontend/README.md)
- 📖 [Backend README](./sponsorship-backend/README.md)
