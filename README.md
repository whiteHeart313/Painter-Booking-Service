# 🎨 Painting Service Platform

A full-stack application for scheduling painting services with smart painter selection and booking management.

## 📋 **Project Overview**

This is a comprehensive painting service platform that connects users with professional painters through an intelligent booking system. The platform features automatic painter selection based on availability, ratings, and experience.

## 🏗️ **Architecture**

```
Adam/
├── server/              # Backend API (Node.js + TypeScript)
│   ├── src/
│   │   ├── handlers/    # Request handlers (validation + response)
│   │   ├── services/    # Business logic layer
│   │   ├── models/      # Database models (Prisma)
│   │   ├── routes/      # API endpoints
│   │   ├── middlewares/ # Authentication, logging, validation
│   │   └── utils/       # Utilities (JWT, logger, validation)
│   ├── prisma/          # Database schema and migrations
│   └── docker-compose.yml
├── client/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── utils/       # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
│   ├── public/          # Static assets
│   └── package.json
└── README.md           # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Docker & Docker Compose
- Yarn package manager

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd Adam
```

### **2. Start the Backend**
```bash
# Navigate to server directory
cd server

# Start all services (PostgreSQL, Redis, API)
# This will automatically:
# - Set up PostgreSQL database
# - Run database migrations
# - Seed initial data (user roles, sample users)
# - Start the API server
docker-compose up -d

# Verify setup is complete
yarn verify

# Check API health
curl http://localhost:3000/health
```

### **3. Start the Frontend**
```bash
# Navigate to client directory
cd client

# Install dependencies
yarn install

# Start development server
yarn  dev

# Frontend will be available at http://localhost:5173
```

**That's it!** No manual database setup required. The system is fully automated.

### **3. What's Running**
- **API Server**: http://localhost:3000
- **Frontend**: http://localhost:5173 (when running)
- **Database**: PostgreSQL on port 5432
- **Redis**: Cache on port 6379
- **Prisma Studio**: Run `yarn db:studio` to view data

## 🎯 **Key Features**

### **🔐 Authentication & Authorization**
- JWT-based authentication
- Role-based access control (USER, PAINTER)
- Secure password hashing
- Protected routes with middleware

### **🎨 Smart Painter Selection**
- **Automatic assignment** based on availability
- **Rating-based prioritization** (higher ratings get priority)
- **Experience weighting** (more completed jobs = higher score)
- **Alternative slot recommendations** when requested time unavailable

### **📅 Availability Management**
- Painters can create/manage availability slots
- Real-time availability checking
- Booking status tracking
- Conflict prevention

### **📋 Booking System**
- User booking requests
- Automatic painter assignment
- Status tracking (PENDING, CONFIRMED, COMPLETED, etc.)
- Booking history and management

### **🎨 Frontend Features**
- **Modern React App** - Built with TypeScript and Vite
- **Responsive Design** - Tailwind CSS for mobile-first design
- **Role-Based UI** - Different interfaces for USER and PAINTER roles
- **Authentication** - JWT-based login/register with protected routes
- **User Dashboard** - Book services, view booking history
- **Painter Dashboard** - Set availability, manage appointments


### **🛡️ Security & Quality**
- Input validation with Joi
- Rate limiting (100 requests/15 minutes)
- CORS protection
- Security headers with Helmet
- Comprehensive error handling
- Request/response logging

## 📊 **Database Schema**

### **Core Entities**
- **Users** - Basic user information with roles
- **UserRole** - Role definitions (USER, PAINTER)
- **PainterProfile** - Extended profile for painters (ratings, specialties)
- **Availability** - Time slots when painters are available
- **BookingRequest** - User requests for painting services
- **Booking** - Confirmed bookings with assigned painters

### **Smart Matching Algorithm**
1. **Find Available Painters** - Query painters available during requested time
2. **Score Painters** - Rate based on:
   - Rating (max 100 points)
   - Experience (total ratings, max 40 points)
   - Base availability (40 points)
3. **Select Best Painter** - Choose highest-scoring painter
4. **Create Booking** - Assign painter and mark slot as booked
5. **Alternatives** - If no one available, suggest closest alternatives

## 🔧 **Development**

### **Backend Development**
```bash
cd server

# Install dependencies
yarn install

# Start development server
yarn dev

# Run migrations
yarn migrate

# Seed database
yarn db:seed

# View database
yarn db:studio
```

### **Frontend Development**
```bash
cd client

# Install dependencies
yarn install

# Start development server
yarn  dev

# Build for production
yarn  build

# Preview production build
yarn  preview
```

### **Available Scripts**

#### **Backend (server/)**
```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn serve            # Run production build

# Database
yarn migrate          # Run migrations
yarn db:seed          # Seed database
yarn db:studio        # Open Prisma Studio

# Testing & Verification
yarn test:api         # Run API tests
yarn verify           # Verify complete setup
yarn type-check       # Check TypeScript types

# Utilities
yarn clean            # Clean build artifacts
yarn reset            # Clean and reinstall
```

#### **Frontend (client/)**
```bash
# Development
yarn dev           # Start development server
yarn build         # Build for production
yarn preview       # Preview production build


```

## 📚 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### **Painter Endpoints**
- `POST /api/availability` - Create availability slot
- `GET /api/availability/me` - Get painter's availability
- `DELETE /api/availability/:id` - Delete availability slot

### **Booking Endpoints**
- `POST /api/booking/booking-request` - Create booking request
- `GET /api/booking/my-bookings` - Get user's bookings

### **Example Usage**

#### **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER",
    "address": "123 Main St",
    "phone": "1234567890"
  }'
```

#### **Create Booking Request**
```bash
curl -X POST http://localhost:3000/api/booking/booking-request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "requestedStart": "2024-01-20T10:00:00Z",
    "requestedEnd": "2024-01-20T14:00:00Z",
    "address": "123 Main St",
    "description": "Interior painting",
    "estimatedHours": 4
  }'
```

## 🐳 **Docker Deployment**

### **Development**
```bash
# Start all services
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f api
```

### **Production**
```bash
# Build production image
docker build -t painting-service .

# Run with environment variables
docker run -p 3000:3000 --env-file .env painting-service
```

## 🔍 **Project Structure Details**

### **Backend Architecture (Layered)**
```
src/
├── handlers/           # Request validation and response formatting
├── services/           # Business logic and ServiceResult returns
├── models/             # Database operations with Prisma
├── routes/             # HTTP endpoint definitions
├── middlewares/        # Authentication, logging, validation
└── utils/              # Shared utilities and helpers
```

### **Key Design Patterns**
- **Dependency Injection** - Services and handlers use DI
- **Singleton Pattern** - Database connections and models
- **ServiceResult Pattern** - Consistent service responses
- **Layered Architecture** - Clear separation of concerns

## 📝 **Environment Variables**

### **Backend Variables (server/.env)**
```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/painting_service"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### **Frontend Variables (client/.env)**
```env
API_ENDPOINT="http://localhost:3000"
```

## 🧪 **Testing**

### **Setup Verification**
```bash
# Verify complete setup (recommended)
yarn verify

# Manual health check
curl http://localhost:3000/health
```

### **API Testing**
```bash
# Run comprehensive API tests
yarn test:api

# Manual testing with curl/Postman
# See API documentation above
```

### **Database Testing**
```bash
# Reset database
yarn migrate:reset

# Re-seed with test data
yarn db:seed
```

## 📈 **Monitoring & Logs**

### **Health Monitoring**
- Health check endpoint: `GET /health`
- Service status monitoring
- Database connection health

### **Logging**
- Winston-based logging system
- Request/response logging
- Error tracking with stack traces
- Log files in `logs/` directory

## 🔒 **Security Features**

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting protection
- Input validation and sanitization
- CORS configuration
- Security headers
- SQL injection prevention (Prisma ORM)


## 📄 **Documentation**

- **Backend README**: `server/README.md` - Detailed backend documentation
- **Quick Start Guide**: `server/QUICK_START.md` - Fast setup instructions
- **Implementation Summary**: `server/IMPLEMENTATION_SUMMARY.md` - Technical details
- **API Tests**: `server/test-api.ts` - Comprehensive API testing


## 📋 **Roadmap**

### **Phase 1: Backend API** ✅
- [x] User authentication and authorization
- [x] Painter availability management
- [x] Smart booking system
- [x] Rating and selection algorithm
- [x] Alternative slot recommendations

### **Phase 2: Frontend** ✅
- [x] React frontend with TypeScript
- [x] User authentication and registration
- [x] USER role: Book services, view bookings
- [x] PAINTER role: Set availability, manage appointments
- [x] Responsive design with Tailwind CSS
- [x] Role-based navigation and access control
- [x] API integration with authentication tokens


## 🐛 **Troubleshooting**

### **Common Issues**

1. **Setup Verification Failed**
   ```bash
   # Run verification to see what's wrong
   yarn verify
   
   # Restart all services
   docker-compose down && docker-compose up -d
   ```

2. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Port Already in Use**
   ```bash
   # Find and kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or on Windows
   netstat -ano | findstr :3000
   taskkill /PID <process_id> /F
   ```

4. **Migration Issues**
   ```bash
   # Reset database and start fresh
   docker-compose down -v
   docker-compose up -d
   yarn verify
   ```

## 📞 **Support**

For support, please:
1. Check the documentation in `server/` directory
2. Review the troubleshooting section
3. Check existing issues
4. Create a new issue with detailed information

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Painting! 🎨**
