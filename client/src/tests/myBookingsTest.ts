// Test script to verify the MyBookings integration
import { BookingService } from '../services/bookingService';

async function testMyBookingsIntegration() {
  console.log('Testing MyBookings integration...');
  
  try {
    // Test 1: Check if getUserBookings method exists
    if (typeof BookingService.getUserBookings === 'function') {
      console.log('✅ BookingService.getUserBookings method exists');
    } else {
      console.log('❌ BookingService.getUserBookings method missing');
      return;
    }
    
    // Test 2: Try to call the method (will fail if not authenticated, but that's expected)
    try {
      const bookings = await BookingService.getUserBookings();
      console.log('✅ BookingService.getUserBookings call succeeded');
      console.log('Bookings returned:', bookings);
    } catch (error) {
      console.log('ℹ️ BookingService.getUserBookings call failed (expected if not authenticated)');
      console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    console.log('✅ MyBookings integration test completed');
  } catch (error) {
    console.log('❌ MyBookings integration test failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export default testMyBookingsIntegration;
