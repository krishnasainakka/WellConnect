import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'wellconnect'; 


// POST /api/users/signup - Simple user registration
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Basic validation
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and username are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed automatically by the model)
    const user = new User({
      email: email.toLowerCase(),
      password,
      username: username.trim()
    });

    const savedUser = await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ New user registered:', savedUser.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        stats: savedUser.stats,
        badges: savedUser.badges,
        lastLogin: savedUser.lastLogin,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      }
    });
  } catch (error) {
    console.error('❌ Error in user signup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// POST /api/users/signin - Simple user login
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ User signed in:', user.email);

    res.json({
      success: true,
      message: 'User signed in successfully',
      token,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        stats: user.stats,
        badges: user.badges,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error('❌ Error in user signin:', error);
    res.status(500).json({
      success: false,
      message: 'Error signing in user',
      error: error.message
    });
  }
});


// GET /api/users - Get all users (simple admin route)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

export default router;