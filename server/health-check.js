#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function healthCheck() {
  try {
    console.log('🔍 Checking API health...');
    
    const response = await axios.get(`${API_BASE_URL}/health`);
    
    console.log('✅ API is healthy!');
    console.log('📊 Health status:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
    return false;
  }
}

// Run the health check
if (require.main === module) {
  healthCheck().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = healthCheck;
