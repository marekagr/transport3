// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sekretnykluczdoaplikacji-transport2';

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    // 1. Verify user exists in Mongoose
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Issue the JWT that Angular expects
    const token = jwt.sign({ userId: user._id,roles:user.roles }, JWT_SECRET, { expiresIn: '8h' });
    
    res.json({ token,user:{login:user.login,roles:user.roles} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;