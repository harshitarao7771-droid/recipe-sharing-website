const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Get comments for a recipe (public)
router.get('/recipes/:recipeId/comments', getComments);

// Add comment (protected)
router.post('/recipes/:recipeId/comments', protect, addComment);

// Delete comment (protected)
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
