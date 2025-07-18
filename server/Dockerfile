FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

EXPOSE 3000

# Run migrations and seed on startup, then start the server
CMD ["sh", "-c", "yarn migrate:deploy && yarn prisma db seed && yarn serve"]
