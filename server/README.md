# Painting Service Backend

A comprehensive backend system for a painting service scheduling application built with Node.js, TypeScript, Express, Prisma, and Docker.

## Features

- **User Management**: Authentication and authorization with JWT tokens
- **Role-based Access Control**: Different roles for users and painters
- **Availability Management**: Painters can set their availability slots
- **Smart Booking System**: Automatic painter assignment based on availability and rating
- **Alternative Slot Recommendations**: When requested time isn't available
- **Rating System**: Painters have ratings that influence selection priority
- **Comprehensive Logging**: Winston-based logging with request tracking
- **Input Validation**: Joi-based request validation
- **Database**: PostgreSQL with Prisma ORM
- **Docker Support**: Full containerization with Docker Compose

## Tech Stack

- **Runtime**: Node.js 18
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose
- **Password Hashing**: bcryptjs

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Availability (Painters only)

- `POST /api/availability` - Create availability slot
- `GET /api/availability/me` - Get painter's availability
- `DELETE /api/availability/:id` - Delete availability slot

### Booking (Users only)

- `POST /api/booking/booking-request` - Create booking request
- `GET /api/booking/my-bookings` - Get user's bookings

## Project Structure

```
src/
├── index.ts                 # Application entry point
├── middlewares/            # Express middlewares
│   ├── auth.ts            # Authentication middleware
│   ├── errorHandler.ts    # Error handling middleware
│   ├── logger.ts          # Request logging middleware
│   └── validation.ts      # Input validation middleware
├── routes/                 # API route handlers
│   ├── auth.ts            # Authentication routes
│   ├── availability.ts    # Availability management routes
│   └── booking.ts         # Booking management routes
├── services/               # Business logic layer
│   ├── authService.ts     # Authentication service
│   ├── availabilityService.ts # Availability management service
│   └── bookingService.ts  # Booking management service
└── utils/                  # Utility functions
    ├── jwt.ts             # JWT token utilities
    ├── logger.ts          # Winston logger configuration
    ├── prisma.ts          # Prisma client configuration
    └── validation.ts      # Joi validation schemas
```

## Database Schema

The application uses the following main entities:

- **User**: Basic user information with role-based access
- **UserRole**: Role definitions (USER, PAINTER)
- **PainterProfile**: Extended profile for painters with ratings and specialties
- **Availability**: Time slots when painters are available
- **BookingRequest**: User requests for painting services
- **Booking**: Confirmed bookings with assigned painters

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if running locally)

### Running with Docker (Recommended)

1. Clone the repository
2. Start the application:

```bash
docker-compose up -d
```

This will automatically:
- Start PostgreSQL database on port 5432
- Start Redis for caching on port 6379
- Run database migrations (create all tables)
- Seed initial data (user roles, sample users)
- Start API server on port 3000

3. Verify everything is working:

```bash
# Run verification script
yarn verify

# Or manually check health
curl http://localhost:3000/health
```

**No manual database setup required!** Everything is automated.

### Running Locally

1. Install dependencies:

```bash
yarn install
```

2. Set up your database and update the `.env` file

3. Run database migrations:

```bash
yarn migrate
```

4. Seed the database:

```bash
yarn db:seed
```

5. Start the development server:

```bash
yarn dev
```

### Database Setup

After starting the containers, run the following commands to set up the database:

```bash
# Run migrations
docker exec -it painting_api yarn migrate

# Seed the database
docker exec -it painting_api yarn db:seed
```

## Environment Variables

```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/painting_service"
REDIS_URL="redis://localhost:6379"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## API Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "roleId": "USER_ROLE_ID"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Availability (Painter)

```bash
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "startTime": "2024-01-20T09:00:00Z",
    "endTime": "2024-01-20T17:00:00Z"
  }'
```

### Create Booking Request (User)

```bash
curl -X POST http://localhost:3000/api/booking/booking-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "requestedStart": "2024-01-20T10:00:00Z",
    "requestedEnd": "2024-01-20T14:00:00Z",
    "address": "123 Main St, City, Country",
    "description": "Interior painting for living room",
    "estimatedHours": 4
  }'
```

## Smart Painter Selection

The system automatically selects the best painter based on:

1. **Availability**: Painter must be available during the requested time
2. **Rating**: Higher-rated painters get priority
3. **Experience**: Painters with more completed jobs get bonus points
4. **Specialties**: Future enhancement for matching job types

## Alternative Slot Recommendations

When no painters are available for the requested time, the system:

1. Searches for alternative slots within a 7-day window
2. Considers slots before and after the requested time
3. Ranks alternatives by time difference from the original request
4. Returns the top 5 closest alternatives

## Logging

The application uses Winston for comprehensive logging:

- Request/response logging
- Error tracking
- Authentication events
- Business logic events

Logs are stored in:

- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output for development

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

## Testing

Run tests with:

```bash
yarn test
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
