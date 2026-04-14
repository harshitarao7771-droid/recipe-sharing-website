const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/:id', getUserProfile);

// Protected
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/favorites/:recipeId', protect, toggleFavorite);
router.get('/me/favorites', protect, getFavorites);

module.exports = router;
