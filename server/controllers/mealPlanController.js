const MealPlan = require('../models/MealPlan');

// Get meal plan for a week
exports.getMealPlan = async (req, res, next) => {
  try {
    const { weekStart } = req.query;
    let plan = await MealPlan.findOne({
      user: req.user._id,
      weekStart: new Date(weekStart)
    });
    if (!plan) {
      plan = { days: {
        Monday:    { breakfast: '', lunch: '', dinner: '' },
        Tuesday:   { breakfast: '', lunch: '', dinner: '' },
        Wednesday: { breakfast: '', lunch: '', dinner: '' },
        Thursday:  { breakfast: '', lunch: '', dinner: '' },
        Friday:    { breakfast: '', lunch: '', dinner: '' },
        Saturday:  { breakfast: '', lunch: '', dinner: '' },
        Sunday:    { breakfast: '', lunch: '', dinner: '' }
      }};
    }
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

// Save meal plan
exports.saveMealPlan = async (req, res, next) => {
  try {
    const { weekStart, days } = req.body;
    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user._id, weekStart: new Date(weekStart) },
      { days },
      { new: true, upsert: true }
    );
    res.json(plan);
  } catch (error) {
    next(error);
  }
};