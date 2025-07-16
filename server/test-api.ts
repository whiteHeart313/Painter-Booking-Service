import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Test data - using unique emails to avoid conflicts
const testUser = {
  firstname: 'John',
  lastname: 'Doe',
  email: `john.test.${Date.now()}@example.com`,
  password: 'password123',
  address: '123 Main St, Test City',
  phone: '+1234567890',
};

const testPainter = {
  firstname: 'Jane',
  lastname: 'Smith',
  email: `jane.test.${Date.now()}@example.com`,
  password: 'password123',
  address: '456 Artist Ave, Test City',
  phone: '+1234567891',
};

async function getRoleIds() {
  try {
    const userLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123',
    });
    
    const painterLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'jane.painter@example.com',
      password: 'password123',
    });

    return {
      userRoleId: userLogin.data.data.user.roleId,
      painterRoleId: painterLogin.data.data.user.roleId,
    };
  } catch (error: any) {
    console.error('Failed to get role IDs:', error.response?.data || error.message);
    throw new Error('Could not retrieve role IDs from seeded data');
  }
}

async function testAPI() {
  try {
    console.log('🚀 Starting API tests...\n');

    console.log('1. Getting user roles...');
    const roles = await getRoleIds();
    console.log('✅ Retrieved role IDs from seeded data');

    console.log('2. Registering a user...');
    const userResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      ...testUser,
      roleId: roles.userRoleId,
    });
    const userToken = userResponse.data.data.token;
    console.log('✅ User registered successfully');

    console.log('3. Registering a painter...');
    const painterResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      ...testPainter,
      roleId: roles.painterRoleId,
    });
    const painterToken = painterResponse.data.data.token;
    console.log('✅ Painter registered successfully');

    console.log('4. Creating painter availability...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(17, 0, 0, 0);

    const availabilityResponse = await axios.post(
      `${API_BASE_URL}/availability`,
      {
        startTime: tomorrow.toISOString(),
        endTime: endTime.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${painterToken}`,
        },
      }
    );
    console.log('✅ Availability created successfully');

    console.log('5. Getting painter availability...');
    const myAvailabilityResponse = await axios.get(
      `${API_BASE_URL}/availability/me`,
      {
        headers: {
          Authorization: `Bearer ${painterToken}`,
        },
      }
    );
    console.log('✅ Retrieved painter availability:', myAvailabilityResponse.data);

    console.log('6. Creating booking request...');
    const bookingStart = new Date(tomorrow);
    bookingStart.setHours(10, 0, 0, 0);
    
    const bookingEnd = new Date(tomorrow);
    bookingEnd.setHours(14, 0, 0, 0);

    const bookingResponse = await axios.post(
      `${API_BASE_URL}/booking/booking-request`,
      {
        requestedStart: bookingStart.toISOString(),
        requestedEnd: bookingEnd.toISOString(),
        address: '789 Customer St, Test City',
        description: 'Interior painting for living room',
        estimatedHours: 4,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log('✅ Booking request created:', bookingResponse.data);

    console.log('7. Getting user bookings...');
    const myBookingsResponse = await axios.get(
      `${API_BASE_URL}/booking/my-bookings`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log('✅ Retrieved user bookings:', myBookingsResponse.data);

    console.log('8. Testing authentication...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    console.log('✅ User profile retrieved:', profileResponse.data.data.email);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    throw error; // Re-throw to let the caller handle it
  }
}

// Run the test
async function main() {
  try {
    await testAPI();
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

// Export for use in other modules
export default testAPI;

// Also export the main function for direct execution
export { main };
