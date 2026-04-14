const Recipe = require('../models/Recipe');

// @desc    Get all recipes with search, filter, sort, pagination
// @route   GET /api/recipes
exports.getRecipes = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12, author } = req.query;
    let query = {};

    // Search by title or ingredient name using regex (more flexible than $text)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'popular') sortOption = { likes: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'cookTime') sortOption = { cookTime: 1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .populate('author', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Recipe.countDocuments(query)
    ]);

    res.json({
      recipes,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('likes', 'name');

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, category, cookTime, prepTime, servings, difficulty, tags } = req.body;

    // Parse ingredients and steps if they come as JSON strings (from FormData)
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : (tags || []);
    const parsedNutrition = req.body.nutrition ? (typeof req.body.nutrition === 'string' ? JSON.parse(req.body.nutrition) : req.body.nutrition) : {};

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      category,
      cookTime: parseInt(cookTime),
      prepTime: parseInt(prepTime) || 0,
      servings: parseInt(servings) || 2,
      difficulty: difficulty || 'easy',
      nutrition: parsedNutrition,
      author: req.user._id,
      tags: parsedTags
    });

    const populated = await recipe.populate('author', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this recipe');
    }

    const updates = { ...req.body };

    // Parse JSON strings from FormData
    if (typeof updates.ingredients === 'string') updates.ingredients = JSON.parse(updates.ingredients);
    if (typeof updates.steps === 'string') updates.steps = JSON.parse(updates.steps);
    if (typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);
    if (typeof updates.nutrition === 'string') updates.nutrition = JSON.parse(updates.nutrition);
    if (updates.cookTime) updates.cookTime = parseInt(updates.cookTime);
    if (updates.prepTime) updates.prepTime = parseInt(updates.prepTime);
    if (updates.servings) updates.servings = parseInt(updates.servings);

    // Handle image update
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar');

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this recipe');
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a recipe
// @route   PUT /api/recipes/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    const userId = req.user._id;
    const likeIndex = recipe.likes.findIndex(id => id.toString() === userId.toString());

    if (likeIndex === -1) {
      recipe.likes.push(userId); // Like
    } else {
      recipe.likes.splice(likeIndex, 1); // Unlike
    }

    await recipe.save();
    res.json({ likes: recipe.likes, likesCount: recipe.likes.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a recipe (1-5 stars)
// @route   POST /api/recipes/:id/rate
exports.rateRecipe = async (req, res, next) => {
  try {
    const { score } = req.body;
    if (!score || score < 1 || score > 5) {
      res.status(400);
      throw new Error('Rating must be between 1 and 5');
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    // Check if user already rated - update existing rating
    const existingRating = recipe.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.score = score;
    } else {
      recipe.ratings.push({ user: req.user._id, score });
    }

    // Recalculate average
    recipe.calcAverageRating();
    await recipe.save();

    res.json({
      averageRating: recipe.averageRating,
      totalRatings: recipe.ratings.length,
      userRating: score
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search recipes by multiple ingredients
// @route   GET /api/recipes/search/ingredients?ingredients=paneer,tomato
exports.searchByIngredients = async (req, res, next) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients || !ingredients.trim()) {
      return res.status(400).json({ message: 'Please provide ingredients to search' });
    }
    const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
    if (ingredientList.length === 0) {
      return res.status(400).json({ message: 'No valid ingredients provided' });
    }
    // Find recipes that contain ANY of the searched ingredients
    const recipes = await Recipe.find({
      'ingredients.name': {
        $in: ingredientList.map(ing => new RegExp(ing, 'i'))
      }
    })
    .populate('author', 'name avatar')
    .lean();

    // Score recipes by how many searched ingredients they contain
    const scored = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
      const matchCount = ingredientList.filter(ing =>
        recipeIngredients.some(ri => ri.includes(ing) || ing.includes(ri))
      ).length;
      return { ...recipe, matchCount };
    });

    // Sort by match count (most matching ingredients first)
    scored.sort((a, b) => b.matchCount - a.matchCount);

    res.json({
      recipes: scored,
      total: scored.length,
      searchedIngredients: ingredientList
    });
  } catch (error) {
    next(error);
  }
};

