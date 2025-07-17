# 🎨 Painting Service Backend - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Application with Docker

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# Check if services are running
docker-compose ps
```

### 2. Setup Database

```bash
# Run database migrations
docker exec -it painting_api yarn migrate

# Seed the database with sample data
docker exec -it painting_api yarn db:seed
```

### 3. Test the API

```bash
# Check API health
node health-check.js

# Run comprehensive API tests
npx ts-node test-api.ts
```

## 🔧 Development Setup

### Local Development (without Docker)

```bash
# Install dependencies
yarn install

# Start PostgreSQL and Redis locally
# Update .env file with your database connection

# Run migrations
yarn migrate

# Seed database
yarn db:seed

# Start development server
yarn dev
```

## 📋 API Documentation

### Authentication Endpoints

#### Register User

```bash
POST /api/auth/register
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "roleId": "USER_ROLE_ID",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

#### Login

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile

```bash
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Painter Endpoints

#### Create Availability

```bash
POST /api/availability
Authorization: Bearer PAINTER_JWT_TOKEN
{
  "startTime": "2024-01-20T09:00:00Z",
  "endTime": "2024-01-20T17:00:00Z"
}
```

#### Get My Availability

```bash
GET /api/availability/me
Authorization: Bearer PAINTER_JWT_TOKEN
```

#### Delete Availability

```bash
DELETE /api/availability/{id}
Authorization: Bearer PAINTER_JWT_TOKEN
```

### User Booking Endpoints

#### Create Booking Request

```bash
POST /api/booking/booking-request
Authorization: Bearer USER_JWT_TOKEN
{
  "requestedStart": "2024-01-20T10:00:00Z",
  "requestedEnd": "2024-01-20T14:00:00Z",
  "address": "789 Customer St",
  "description": "Interior painting for living room",
  "estimatedHours": 4
}
```

#### Get My Bookings

```bash
GET /api/booking/my-bookings
Authorization: Bearer USER_JWT_TOKEN
```

## 🏗️ System Architecture

### Layer Structure

1. **Routes** (`src/routes/`) - HTTP request handlers
2. **Services** (`src/services/`) - Business logic
3. **Models** (Prisma) - Database operations
4. **Middlewares** (`src/middlewares/`) - Authentication, logging, validation

### Key Features

- **Smart Painter Selection**: Automatic assignment based on availability and rating
- **Rating System**: Painters with higher ratings get priority
- **Alternative Recommendations**: Suggests closest available slots when requested time is unavailable
- **Role-based Access**: Different permissions for users and painters
- **Comprehensive Logging**: All requests and errors are logged

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi
- CORS protection
- Security headers with Helmet

## 📊 Database Schema

### Main Tables

- **users** - User accounts and basic info
- **user_roles** - Role definitions (USER, PAINTER)
- **painter_profiles** - Extended info for painters (rating, specialties)
- **availabilities** - Time slots when painters are available
- **booking_requests** - User requests for services
- **bookings** - Confirmed bookings with assigned painters

### Smart Matching Algorithm

When a user creates a booking request:

1. **Find Available Painters**: Query painters available during requested time
2. **Score Painters**: Rate based on:
   - Rating (max 100 points)
   - Experience (total ratings, max 40 points)
   - Base availability (40 points)
3. **Select Best Painter**: Choose highest-scoring painter
4. **Create Booking**: Assign painter and mark slot as booked
5. **Alternatives**: If no one available, suggest closest alternatives

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps

   # Restart database
   docker-compose restart postgres
   ```

2. **Permission Denied**

   ```bash
   # Check user role
   # Users can only create bookings
   # Painters can only create availability
   ```

3. **Invalid Token**
   ```bash
   # Get new token by logging in again
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

### Development Commands

```bash
# View logs
docker-compose logs -f api

# Access database
docker exec -it painting_db psql -U admin -d painting_service

# Run Prisma Studio (database UI)
npx prisma studio

# Reset database
docker exec -it painting_api yarn migrate:reset
```

## 🚀 Production Deployment

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-production-key
PORT=3000
```

### Docker Production

```bash
# Build production image
docker build -t painting-service .

# Run in production
docker run -p 3000:3000 --env-file .env painting-service
```

## 📈 Monitoring & Logs

- **Health Check**: `GET /health`
- **Logs**: Available in `logs/` directory
- **Metrics**: Request duration, response codes
- **Error Tracking**: All errors logged with stack traces

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Write tests
4. Submit pull request

## 📝 License

MIT License - feel free to use in your projects!

---

**Happy Painting! 🎨**
