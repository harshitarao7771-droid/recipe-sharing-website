const Comment = require('../models/Comment');

// @desc    Get comments for a recipe
// @route   GET /api/recipes/:recipeId/comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a recipe
// @route   POST /api/recipes/:recipeId/comments
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const comment = await Comment.create({
      text: text.trim(),
      recipe: req.params.recipeId,
      user: req.user._id
    });

    const populated = await comment.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
