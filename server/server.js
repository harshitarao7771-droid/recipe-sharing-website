const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');

const app = express();

// Security & parsing middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base API route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'FlavorVerse API is running 🍽️',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      users: '/api/users',
      comments: '/api/recipes/:recipeId/comments',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FlavorVerse API is running 🍽️',
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mealplan', mealPlanRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  // Connect to MongoDB first
  await connectDB();
  
  // Start Express server
  app.listen(PORT, () => {
    console.log('🚀 ═══════════════════════════════════════════════════');
    console.log(`   FlavorVerse API Server`);
    console.log('   ═══════════════════════════════════════════════════');
    console.log(`   🌐 Server:    http://localhost:${PORT}`);
    console.log(`   📡 API Base:  http://localhost:${PORT}/api`);
    console.log(`   💚 Health:    http://localhost:${PORT}/api/health`);
    console.log(`   🔐 Auth:      http://localhost:${PORT}/api/auth`);
    console.log(`   🍳 Recipes:   http://localhost:${PORT}/api/recipes`);
    console.log(`   👤 Users:     http://localhost:${PORT}/api/users`);
    console.log('   ═══════════════════════════════════════════════════\n');
  });
};

// Start the server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
