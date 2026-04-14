const express = require('express');
const router = express.Router();
const { getMealPlan, saveMealPlan } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMealPlan);
router.post('/', protect, saveMealPlan);

module.exports = router;