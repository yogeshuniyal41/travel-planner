// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, googleAuthCallback, logoutUser } = require('../controllers/authController');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const router = express.Router();

authRouter.get('/me', (req, res) => {
  const token = req.cookies.token;
 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
    res.json({ user: decoded }); // Send back user data
  });
});

// Local signup route
authRouter.post('/register', registerUser);

// Local login route
authRouter.post('/login', loginUser);

// Google OAuth route
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
authRouter.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), googleAuthCallback);

// Logout route
authRouter.post('/logout', logoutUser);

module.exports = authRouter;
