#!/usr/bin/env node

/**
 * Setup Verification Script
 * 
 * This script verifies that the painting service backend is properly set up
 * and all components are working correctly.
 */

const http = require('http');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

console.log('🎨 Painting Service - Setup Verification');
console.log('========================================\n');

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function checkDockerServices() {
  console.log('1. Checking Docker services...');
  try {
    const { stdout } = await execAsync('docker-compose ps --services --filter "status=running"');
    const runningServices = stdout.trim().split('\n').filter(s => s.length > 0);
    
    const expectedServices = ['postgres', 'redis', 'api'];
    const missingServices = expectedServices.filter(service => !runningServices.includes(service));
    
    if (missingServices.length === 0) {
      console.log('   ✅ All Docker services are running');
      return true;
    } else {
      console.log(`   ❌ Missing services: ${missingServices.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error checking Docker services:', error.message);
    return false;
  }
}

async function checkApiHealth() {
  console.log('2. Checking API health...');
  try {
    const response = await makeRequest('/health');
    if (response.status === 200 && response.data.status === 'OK') {
      console.log('   ✅ API is healthy');
      return true;
    } else {
      console.log('   ❌ API health check failed');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error checking API health:', error.message);
    return false;
  }
}

async function checkDatabaseTables() {
  console.log('3. Checking database tables...');
  try {
    const { stdout } = await execAsync('docker-compose exec -T postgres psql -U admin -d painting_service -c "\\dt" -t');
    const tables = stdout.split('\n').filter(line => line.trim().length > 0);
    
    const expectedTables = ['users', 'user_roles', 'painter_profiles', 'availabilities', 'booking_requests', 'bookings'];
    const missingTables = expectedTables.filter(table => 
      !tables.some(line => line.includes(table))
    );
    
    if (missingTables.length === 0) {
      console.log('   ✅ All database tables exist');
      return true;
    } else {
      console.log(`   ❌ Missing tables: ${missingTables.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error checking database tables:', error.message);
    return false;
  }
}

async function checkSeedData() {
  console.log('4. Checking seed data...');
  try {
    const { stdout } = await execAsync('docker-compose exec -T postgres psql -U admin -d painting_service -c "SELECT COUNT(*) FROM user_roles;" -t');
    const roleCount = parseInt(stdout.trim());
    
    if (roleCount >= 2) {
      console.log('   ✅ Seed data exists (user roles created)');
      return true;
    } else {
      console.log('   ❌ Seed data missing (no user roles found)');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error checking seed data:', error.message);
    return false;
  }
}

async function checkAuthEndpoints() {
  console.log('5. Checking authentication endpoints...');
  try {
    // Test registration
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role: 'USER',
      address: '123 Test St',
      phone: '1234567890'
    };
    
    const registerResponse = await makeRequest('/api/auth/register', 'POST', testUser);
    if (registerResponse.status === 200 && registerResponse.data.success) {
      console.log('   ✅ User registration works');
      
      // Test login
      const loginResponse = await makeRequest('/api/auth/login', 'POST', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.status === 200 && loginResponse.data.success) {
        console.log('   ✅ User login works');
        return true;
      } else {
        console.log('   ❌ User login failed');
        return false;
      }
    } else {
      console.log('   ❌ User registration failed');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error checking auth endpoints:', error.message);
    return false;
  }
}

async function runVerification() {
  console.log('Starting setup verification...\n');
  
  const checks = [
    checkDockerServices,
    checkApiHealth,
    checkDatabaseTables,
    checkSeedData,
    checkAuthEndpoints
  ];
  
  let passed = 0;
  for (const check of checks) {
    const result = await check();
    if (result) passed++;
    console.log('');
  }
  
  console.log('========================================');
  console.log(`Verification Results: ${passed}/${checks.length} checks passed`);
  
  if (passed === checks.length) {
    console.log('🎉 Setup verification PASSED! Your backend is ready to use.');
    console.log('\nYou can now:');
    console.log('- Access the API at http://localhost:3000');
    console.log('- View API docs in the README');
    console.log('- Start developing your frontend');
    process.exit(0);
  } else {
    console.log('❌ Setup verification FAILED. Please check the issues above.');
    console.log('\nTroubleshooting:');
    console.log('- Run: docker-compose down && docker-compose up -d');
    console.log('- Check logs: docker-compose logs');
    console.log('- Verify Docker is running properly');
    process.exit(1);
  }
}

runVerification().catch(console.error);
