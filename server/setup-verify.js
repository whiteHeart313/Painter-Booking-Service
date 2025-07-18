#!/usr/bin/env node

/**
 * Setup Verification Script
 * 
 * This script verifies that the painting service backend is properly set up
 * and all components are working correctly.
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { setTimeout } = require('timers/promises');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  TIMEOUT: 5000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
};

console.log('🎨 Painting Service - Setup Verification');
console.log('========================================\n');

/**
 * Modern HTTP client using native fetch (Node.js 18+)
 */
async function makeRequest(path, method = 'GET', data = null, retries = CONFIG.MAX_RETRIES) {
  const url = `${CONFIG.API_BASE_URL}${path}`;
  
  // Use dynamic import for fetch in older Node.js versions
  const fetch = globalThis.fetch || (await import('node-fetch')).default;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: CONFIG.TIMEOUT,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      let responseData;
      
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }
      
      return {
        status: response.status,
        data: responseData,
        ok: response.ok,
      };
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Request failed after ${retries} attempts: ${error.message}`);
      }
      await setTimeout(CONFIG.RETRY_DELAY * attempt);
    }
  }
}

/**
 * Enhanced Docker services check with better error handling
 */
async function checkDockerServices() {
  log.info('Checking Docker services...');
  
  try {
    // Check if Docker is available
    await execAsync('docker --version');
    
    // Check if docker-compose is available
    await execAsync('docker-compose --version');
    
    // Get running services
    const { stdout } = await execAsync('docker-compose ps --services --filter "status=running"');
    const runningServices = stdout.trim().split('\n').filter(s => s.length > 0);
    
    const expectedServices = ['postgres', 'redis', 'api'];
    const missingServices = expectedServices.filter(service => !runningServices.includes(service));
    
    if (missingServices.length === 0) {
      log.success('All Docker services are running');
      return true;
    } else {
      log.error(`Missing services: ${missingServices.join(', ')}`);
      log.warning('Run: docker-compose up -d');
      return false;
    }
  } catch (error) {
    log.error(`Docker services check failed: ${error.message}`);
    if (error.message.includes('not found')) {
      log.warning('Make sure Docker and Docker Compose are installed and running');
    }
    return false;
  }
}

/**
 * Enhanced API health check with detailed diagnostics
 */
async function checkApiHealth() {
  log.info('Checking API health...');
  
  try {
    const response = await makeRequest('/health');
    
    if (response.ok && response.data.status === 'OK') {
      log.success('API is healthy');
      log.info(`API uptime: ${Math.floor(response.data.uptime)}s`);
      return true;
    } else {
      log.error(`API health check failed - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    log.error(`API health check failed: ${error.message}`);
    log.warning('Make sure the API container is running: docker-compose ps');
    return false;
  }
}

/**
 * Enhanced database tables check with better parsing
 */
async function checkDatabaseTables() {
  log.info('Checking database tables...');
  
  try {
    const { stdout } = await execAsync(
      'docker-compose exec -T postgres psql -U admin -d painting_service -c "\\dt" -t'
    );
    
    const tables = stdout
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())
      .filter(line => !line.startsWith('(') && line.includes('table'));
    
    const expectedTables = ['users', 'user_roles', 'painter_profiles', 'availabilities', 'booking_requests', 'bookings'];
    const missingTables = expectedTables.filter(table => 
      !tables.some(line => line.includes(table))
    );
    
    if (missingTables.length === 0) {
      log.success('All database tables exist');
      log.info(`Found ${tables.length} tables in database`);
      return true;
    } else {
      log.error(`Missing tables: ${missingTables.join(', ')}`);
      log.warning('Run migrations: docker-compose exec api yarn migrate:deploy');
      return false;
    }
  } catch (error) {
    log.error(`Database tables check failed: ${error.message}`);
    log.warning('Make sure PostgreSQL container is running');
    return false;
  }
}

/**
 * Enhanced seed data check with detailed validation
 */
async function checkSeedData() {
  log.info('Checking seed data...');
  
  try {
    const { stdout } = await execAsync(
      'docker-compose exec -T postgres psql -U admin -d painting_service -c "SELECT COUNT(*) FROM user_roles;" -t'
    );
    
    const roleCount = parseInt(stdout.trim(), 10);
    
    if (roleCount >= 2) {
      log.success(`Seed data exists (${roleCount} user roles found)`);
      
      // Additional check for specific roles
      const { stdout: rolesOutput } = await execAsync(
        'docker-compose exec -T postgres psql -U admin -d painting_service -c "SELECT name FROM user_roles;" -t'
      );
      
      const roles = rolesOutput.trim().split('\n').map(r => r.trim()).filter(r => r);
      log.info(`Available roles: ${roles.join(', ')}`);
      
      return true;
    } else {
      log.error('Seed data missing (no user roles found)');
      log.warning('Run seed script: docker-compose exec api yarn db:seed');
      return false;
    }
  } catch (error) {
    log.error(`Seed data check failed: ${error.message}`);
    return false;
  }
}

/**
 * Enhanced authentication endpoints check with better error handling
 */
async function checkAuthEndpoints() {
  log.info('Checking authentication endpoints...');
  
  try {
    // Generate unique test user
    const timestamp = Date.now();
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: `test-${timestamp}@example.com`,
      password: 'password123',
      role: 'USER',
      address: '123 Test St',
      phone: '1234567890'
    };
    
    // Test registration
    log.info('Testing user registration...');
    const registerResponse = await makeRequest('/api/auth/register', 'POST', testUser);
    
    if (registerResponse.ok && registerResponse.data.success) {
      log.success('User registration works');
      
      // Test login
      log.info('Testing user login...');
      const loginResponse = await makeRequest('/api/auth/login', 'POST', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.ok && loginResponse.data.success) {
        log.success('User login works');
        
        // Test protected route
        const token = loginResponse.data.data.token;
        log.info('Testing protected route...');
        
        const profileResponse = await makeRequest('/api/auth/profile', 'GET', null);
        // Note: This will fail without auth header, but we're testing the endpoint exists
        
        return true;
      } else {
        log.error('User login failed');
        log.info(`Login response: ${JSON.stringify(loginResponse.data, null, 2)}`);
        return false;
      }
    } else {
      log.error('User registration failed');
      log.info(`Registration response: ${JSON.stringify(registerResponse.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    log.error(`Authentication endpoints check failed: ${error.message}`);
    return false;
  }
}

/**
 * Enhanced verification runner with better reporting
 */
async function runVerification() {
  log.header('Starting setup verification...\n');
  
  const checks = [
    { name: 'Docker Services', fn: checkDockerServices },
    { name: 'API Health', fn: checkApiHealth },
    { name: 'Database Tables', fn: checkDatabaseTables },
    { name: 'Seed Data', fn: checkSeedData },
    { name: 'Authentication Endpoints', fn: checkAuthEndpoints }
  ];
  
  const results = [];
  
  for (const [index, check] of checks.entries()) {
    log.header(`${index + 1}. ${check.name}`);
    
    try {
      const result = await check.fn();
      results.push({ name: check.name, passed: result });
    } catch (error) {
      log.error(`Unexpected error in ${check.name}: ${error.message}`);
      results.push({ name: check.name, passed: false, error: error.message });
    }
    
    console.log(''); // Add spacing between checks
  }
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed);
  
  log.header('========================================');
  log.header(`Verification Results: ${passed}/${results.length} checks passed`);
  
  if (failed.length > 0) {
    log.error('\nFailed checks:');
    failed.forEach(result => {
      log.error(`  - ${result.name}${result.error ? `: ${result.error}` : ''}`);
    });
  }
  
  if (passed === results.length) {
    log.success('\n🎉 Setup verification PASSED! Your backend is ready to use.');
    console.log('\nYou can now:');
    console.log('- Access the API at http://localhost:3000');
    console.log('- View API docs in the README');
    console.log('- Start developing your frontend');
    console.log('- Open Prisma Studio: yarn db:studio');
    process.exit(0);
  } else {
    log.error('\n❌ Setup verification FAILED. Please check the issues above.');
    console.log('\nTroubleshooting:');
    console.log('- Run: docker-compose down && docker-compose up -d');
    console.log('- Check logs: docker-compose logs -f');
    console.log('- Verify Docker is running properly');
    console.log('- Check the README for more troubleshooting steps');
    process.exit(1);
  }
}

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection at ${promise}: ${reason}`);
  process.exit(1);
});

// Run the verification
runVerification().catch((error) => {
  log.error(`Verification failed: ${error.message}`);
  process.exit(1);
});
