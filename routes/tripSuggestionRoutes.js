// routes/tripSuggestionRoutes.js
const express = require('express');
const { getTripSuggestions } = require('../controllers/tripSuggestionController');

const router = express.Router();

// Define route to get trip suggestions
router.post('/tripsuggestion', getTripSuggestions);

module.exports = router;
