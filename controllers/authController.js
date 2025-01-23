const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user (local signup)
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      provider: 'local',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user and generate JWT
// Login user and generate JWT
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  

	try{
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log(user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log(isMatch)
    
    // Generate JWT with only required data
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie with token
    res.cookie('token', token, {


      httpOnly: true,
      sameSite: 'None',
	  secure:true ,

      maxAge: 3600000,
    });

    // Send success response (frontend handles redirect)
    res.status(200).json({ message: 'Login successful' , user:user.email});
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Google OAuth callback handling
const googleAuthCallback = async (req, res) => {
  try {
    const { email, id, provider } = req.user;

    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // If not, register the user with Google details
      user = new User({
        email,
        provider,
        username: req.user.displayName || email.split('@')[0], // Set a default username if not available
      });
      await user.save();
    }

    // Generate JWT token for existing or newly registered user
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie with JWT token
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
	    secure:true,
 
      maxAge: 3600000,
    });

    // Redirect to frontend with token
    res.redirect(`https://travel-planner-1-6o7r.onrender.com/home`);
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    res.redirect(`https://travel-planner-1-6o7r.onrender.com/`);
  }
};


// Logout user and clear cookie
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    
    // Clear the JWT cookie
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'None',
	    secure:true

    });

    req.session = null; // Clear session data (for OAuth sessions)
    res.status(200).json({ message: 'Logout successful' });
  });
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthCallback,
  logoutUser,
};
