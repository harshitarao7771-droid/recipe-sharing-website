const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user profile with their recipes
// @route   GET /api/users/:id
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const recipes = await Recipe.find({ author: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      user,
      recipes,
      recipesCount: recipes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    // Handle avatar image upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite recipe
// @route   PUT /api/users/favorites/:recipeId
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;

    // Check recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    const favIndex = user.favorites.findIndex(id => id.toString() === recipeId);

    if (favIndex === -1) {
      user.favorites.push(recipeId);
    } else {
      user.favorites.splice(favIndex, 1);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites list
// @route   GET /api/users/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'author', select: 'name avatar' }
    });

    res.json(user.favorites);
  } catch (error) {
    next(error);
  }
};
