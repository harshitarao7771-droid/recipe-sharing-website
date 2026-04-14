const express = require('express');
const router = express.Router();
const {
  getRecipes, getRecipe, createRecipe,
  updateRecipe, deleteRecipe, toggleLike, rateRecipe,
  searchByIngredients
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getRecipes);
router.get('/search/ingredients', searchByIngredients);
router.get('/:id', getRecipe);
router.post('/', protect, upload.single('image'), createRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/rate', protect, rateRecipe);

module.exports = router;
