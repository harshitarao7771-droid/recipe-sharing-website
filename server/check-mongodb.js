#!/usr/bin/env node

/**
 * Quick MongoDB Connection Checker
 * Run this to test if MongoDB is accessible before starting the server
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flavorverse';

console.log('\n🔍 Checking MongoDB Connection...\n');
console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then((conn) => {
    console.log('✅ SUCCESS! MongoDB is accessible!\n');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}\n`);
    console.log('👍 You can now start your server with: npm run dev\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! Cannot connect to MongoDB\n');
    console.error(`   Error: ${error.message}\n`);
    console.error('💡 Solutions:\n');
    console.error('   1. Make sure MongoDB is running locally');
    console.error('   2. Or use MongoDB Atlas (cloud database)');
    console.error('   3. Check server/MONGODB_SETUP.md for detailed instructions\n');
    process.exit(1);
  });
