import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Recipe from '../models/Recipe.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const ProfilePhotoUrl = req.file?.path || '';
    const user = new User({ username, email, password, role, ProfilePhotoUrl });
    await user.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const mailOptions = {
      from: `"Delicious Recipes" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: 'Welcome to Delicious Recipes!',
      html: `<h1>Hi ${username},</h1>
        <p>Welcome to Delicious Recipes!</p>
        <p>We’re thrilled to have you on board. Start exploring and sharing your favorite recipes with our community.</p>
        <p>Happy cooking!</p>
        <p><strong>Delicious Recipes Team</strong></p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Error sending email:', error);
      else console.log('Welcome email sent:', info.response);
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(400).json({ error: 'Invalid email, password, or role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ProfilePhotoUrl: user.ProfilePhotoUrl,
        savedRecipes: user.savedRecipes,
      }
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

export const getUploaderDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const recipes = await Recipe.find({ uploadedBy: user._id })
      .populate('uploadedBy', 'username email');
    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        ProfilePhotoUrl: user.ProfilePhotoUrl
      },
      recipes: recipes.map(r => ({
        _id: r._id,
        title: r.title,
        category: r.category,
        views: r.views,
        likes: r.likes,
        createdAt: r.createdAt
      }))
    });
  } catch (err) {
    console.error('Error in getUploaderDetails:', err);
    res.status(500).json({ error: 'Failed to fetch uploader details or recipes' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (username && username !== user.username) user.username = username;
    if (email && email !== user.email) {
      const exist = await User.findOne({ email });
      if (exist) return res.status(400).json({ error: 'Email is already in use' });
      user.email = email;
    }
    if (req.file) user.ProfilePhotoUrl = req.file.path;
    await user.save();
    res.status(200).json({ message:'Profile updated', user:{ id:user._id, username:user.username, email:user.email, ProfilePhotoUrl:user.ProfilePhotoUrl }});
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({ error: 'All fields are required.' });
    if (newPassword !== confirmPassword) return res.status(400).json({ error:'Passwords do not match.' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error:'User not found.' });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error:'Old password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message:'Password updated successfully.' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error:'Failed to update password.' });
  }
};