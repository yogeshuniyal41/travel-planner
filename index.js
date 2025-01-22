// app.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');  // Change here
require('dotenv').config();
require('./config/passport-setup');

const tripRoutes = require('./routes/tripSuggestionRoutes.js'); // CommonJS require
const authenticateJWT = require('./middleware/authMiddleware');
const authRouter = require('./routes/authRoutes.js'); // CommonJS require
const router = require('./routes/tripSuggestionRoutes.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


// Middleware


// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL, // Allow frontend origin
  credentials: true, // Allow cookies to be sent with requests
}));

// Session setup
app.use(
  session({
    secret: process.env.COOKIE_KEY, // Store secret key in .env
    resave: false,                  // Don't save session if not modified
    saveUninitialized: false,       // Don't create session until something is stored
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1-day expiration
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use('/auth', authRouter);
app.use('/search', router);

// Protected route example




// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
