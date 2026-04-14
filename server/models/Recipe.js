const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Recipe title is required'], trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
  description: { type: String, required: [true, 'Description is required'], maxlength: [500, 'Description cannot exceed 500 characters'] },
  ingredients: [{ name: { type: String, required: true }, amount: { type: String, required: true } }],
  steps: [{ stepNumber: { type: Number, required: true }, instruction: { type: String, required: true } }],
  image: { type: String, default: '' },
  category: { type: String, required: [true, 'Category is required'], enum: ['vegetarian', 'non-vegetarian', 'vegan', 'dessert', 'beverage', 'appetizer', 'breakfast', 'lunch', 'dinner'] },
  cookTime: { type: Number, required: [true, 'Cook time is required'] },
  prepTime: { type: Number, default: 0 },
  servings: { type: Number, required: [true, 'Servings is required'], default: 2 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  nutrition: {
    calories:      { type: Number, default: 0 },
    protein:       { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat:           { type: Number, default: 0 },
    fiber:         { type: Number, default: 0 }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: { type: Number, min: 1, max: 5 } }],
  averageRating: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });
recipeSchema.index({ title: 'text', 'ingredients.name': 'text', tags: 'text' });
recipeSchema.methods.calcAverageRating = function() {
  if (this.ratings.length === 0) { this.averageRating = 0; }
  else {
    const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
};
module.exports = mongoose.model('Recipe', recipeSchema);
