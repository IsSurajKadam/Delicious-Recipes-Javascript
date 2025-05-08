import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import assignBadges from '../utils/assignBadges.js';
import mongoose from 'mongoose';

export const createRecipe = async (req, res) => {
  try {
    if (req.user.role !== 'uploader') {
      return res.status(403).json({ error: 'Only uploaders can add recipes' });
    }
    const { title, category, ingredients, instructions } = req.body;
    if (!title || !category || !ingredients || !instructions || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newRecipe = new Recipe({
      title,
      category,
      imageUrl: req.file.path,
      ingredients: ingredients.split(','),
      instructions,
      uploadedBy: req.user.id,
    });
    const savedRecipe = await newRecipe.save();

    // Notify viewers
    const viewers = await User.find({ role: 'viewer' }, 'email username');
    if (viewers.length) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
      });
      viewers.forEach(async (viewer) => {
        const mailOptions = {
          from: `"Delicious Recipes" <${process.env.SMTP_MAIL}>`,
          to: viewer.email,
          subject: `New Recipe Added: ${title}`,
          html: `<h1>Hello ${viewer.username},</h1>
            <p>A new recipe titled <strong>${title}</strong> has just been added to Delicious Recipes!</p>
            <p>Category: <strong>${category}</strong></p>
            <p>Check it out and get inspired for your next meal!</p>
            <p><strong>Delicious Recipes Team</strong></p>`,
        };
        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${viewer.email}`);
        } catch (error) {
          console.error(`Error sending email to ${viewer.email}:`, error);
        }
      });
    }

    // Update user points/badges
    const user = await User.findById(req.user.id);
    user.points += 10;
    user.badges = assignBadges(user);
    await user.save();

    res.status(201).json({ savedRecipe, points: user.points, badges: user.badges });
  } catch (err) {
    console.error('Error in createRecipe:', err);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .select('title category imageUrl views likes');
    const formatted = recipes.map(r => ({
      id: r._id,
      title: r.title,
      category: r.category,
      imageUrl: r.imageUrl,
      views: r.views || 0,
      likes: r.likes.length || 0,
    }));
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error in getRecipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    console.error('Error in getRecipeById:', err);
    res.status(500).json({ error: 'Failed to fetch the recipe' });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipes = await Recipe.find({ 'reviews.reviewedBy': userId })
      .select('title category imageUrl reviews')
      .populate('reviews.reviewedBy', 'username');
    if (!recipes.length) {
      return res.status(404).json({ error: 'No reviews found for this user.' });
    }
    const userReviews = recipes.flatMap(recipe =>
      recipe.reviews
        .filter(r => r.reviewedBy._id.toString() === userId)
        .map(r => ({
          recipeId: recipe._id,
          recipeTitle: recipe.title,
          category: recipe.category,
          imageUrl: recipe.imageUrl,
          review: r
        }))
    );
    if (!userReviews.length) {
      return res.status(404).json({ message: 'You have not posted any reviews yet.' });
    }
    res.status(200).json(userReviews);
  } catch (err) {
    console.error('Error in getReviewsByUser:', err);
    res.status(500).json({ error: 'Failed to fetch user reviews.' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const recipe = await Recipe.findOne({ 'reviews._id': reviewId });
    if (!recipe) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    recipe.reviews = recipe.reviews.filter(r => r._id.toString() !== reviewId);
    if (recipe.reviews.length) {
      const total = recipe.reviews.reduce((acc, r) => acc + r.rating, 0);
      recipe.averageRating = total / recipe.reviews.length;
    } else {
      recipe.averageRating = 0;
    }
    await recipe.save();
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    console.error('Error in deleteReview:', err);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({ _id: id, uploadedBy: req.user.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found or not authorized to update' });
    const { title, ingredients, instructions } = req.body;
    const updated = {};
    if (title) updated.title = title;
    if (ingredients) updated.ingredients = ingredients.split(',');
    if (instructions) updated.instructions = instructions;
    const result = await Recipe.findByIdAndUpdate(id, { $set: updated }, { new: true });
    res.status(200).json(result);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({ _id: id, uploadedBy: req.user.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found or not authorized to delete' });
    await Recipe.deleteOne({ _id: id });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required.' });
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    if (recipe.uploadedBy.toString() === req.user.id) return res.status(403).json({ error: 'You cannot review your own recipe.' });
    if (recipe.reviews.some(r => r.reviewedBy.toString() === req.user.id)) {
      return res.status(403).json({ error: 'You have already reviewed this recipe.' });
    }
    recipe.reviews.push({ reviewedBy: req.user.id, rating, comment: comment || '' });
    recipe.averageRating = recipe.reviews.reduce((a,r) => a+r.rating,0) / recipe.reviews.length;
    const user = await User.findById(req.user.id);
    user.points += 10;
    user.badges = assignBadges(user);
    await recipe.save();
    await user.save();
    res.status(201).json({ message: 'Review added successfully.', points: user.points, badges: user.badges });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review.' });
  }
};

export const getRecipeReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('reviews.reviewedBy', 'username ProfilePhotoUrl');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    res.status(200).json(recipe.reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};

export const viewRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const user = await User.findById(req.user.id);
    if (req.user.role === 'viewer' && recipe.uploadedBy.toString() !== req.user.id) {
      user.points += 1;
      user.badges = assignBadges(user);
      await user.save();
    }
    recipe.views = (recipe.views || 0) + 1;
    await recipe.save();
    res.status(200).json({ message: 'View count updated', views: recipe.views });
  } catch (err) {
    console.error('View error:', err);
    res.status(500).json({ error: 'Failed to update view count' });
  }
};

// Like/unlike recipe
export const likeRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const liked = recipe.likes.includes(req.user.id);
    if (liked) recipe.likes.pull(req.user.id);
    else {
      recipe.likes.push(req.user.id);
      user.points += 5;
      user.badges = assignBadges(user);
      await user.save();
    }
    await recipe.save();
    res.status(200).json({ message: liked ? 'You unliked the recipe' : 'You liked the recipe', likes: recipe.likes.length, points: user.points, badges: user.badges });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Failed to like recipe' });
  }
};

// Save recipe
export const saveRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid Recipe ID format.' });
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    if (recipe.uploadedBy.toString() === req.user.id) return res.status(400).json({ error: 'You cannot save your own recipe.' });
    const user = await User.findById(req.user.id);
    if (user.savedRecipes.includes(id)) return res.status(400).json({ error: 'Recipe is already saved.' });
    user.savedRecipes.push(id);
    user.points += 5;
    user.badges = assignBadges(user);
    await user.save();
    res.status(200).json({ message: 'Recipe saved successfully!', points: user.points, badges: user.badges });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save recipe.' });
  }
};

// Get saved recipes for user
export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error('Get saved error:', err);
    res.status(500).json({ error: 'Failed to fetch saved recipes.' });
  }
};

// Unsave recipe
export const unsaveRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.savedRecipes.includes(id)) return res.status(400).json({ error: 'Recipe not saved' });
    user.savedRecipes.pull(id);
    user.points = Math.max(0, user.points - 5);
    user.badges = assignBadges(user);
    await user.save();
    res.status(200).json({ message: 'Recipe removed from saved', points: user.points, badges: user.badges });
  } catch (err) {
    console.error('Unsave error:', err);
    res.status(500).json({ error: 'Failed to remove saved recipe' });
  }
};