const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flavorverse';
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n🔄 Attempting to connect to MongoDB (Attempt ${attempt}/${retries})...`);
      
      const conn = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      });
      
      console.log(`✅ MongoDB Connected Successfully!`);
      console.log(`   📍 Host: ${conn.connection.host}`);
      console.log(`   🗄️  Database: ${conn.connection.name}`);
      console.log(`   🔌 Port: ${conn.connection.port}\n`);
      
      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected successfully!');
      });
      
      return conn;
      
    } catch (error) {
      console.error(`❌ MongoDB Connection Failed (Attempt ${attempt}/${retries})`);
      console.error(`   Error: ${error.message}`);
      
      if (attempt === retries) {
        console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ MONGODB CONNECTION FAILED AFTER ALL RETRIES');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.error('💡 Possible Solutions:\n');
        console.error('1. LOCAL MONGODB:');
        console.error('   • Make sure MongoDB is installed and running');
        console.error('   • Start MongoDB service:');
        console.error('     - Windows: net start MongoDB');
        console.error('     - Mac: brew services start mongodb-community');
        console.error('     - Linux: sudo systemctl start mongod');
        console.error('   • Check if MongoDB is running: mongosh or mongo\n');
        console.error('2. MONGODB ATLAS (Cloud Database):');
        console.error('   • Sign up at: https://www.mongodb.com/cloud/atlas');
        console.error('   • Create a free cluster');
        console.error('   • Get connection string and update .env file:');
        console.error('     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flavorverse\n');
        console.error('3. CHECK YOUR .env FILE:');
        console.error(`   • Current URI: ${MONGODB_URI}`);
        console.error('   • Make sure the URI is correct\n');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Don't crash the server, allow it to run without DB
        console.warn('⚠️  Server will continue running WITHOUT database connection.');
        console.warn('⚠️  API endpoints requiring database will not work.\n');
        return null;
      }
      
      // Wait before retrying
      console.log(`⏳ Retrying in ${delay / 1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
