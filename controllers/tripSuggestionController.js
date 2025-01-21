// controllers/tripSuggestionController.js
const { fetchFlights, fetchHotels, fetchPlaces } = require('../services/tripSuggestionAPI');

const getTripSuggestions = async (req, res) => {
  const { fromCity, toCity, startDate, endDate, adults, interests, destination } = req.body;

  // Validate required parameters
  if (!fromCity || !toCity || !startDate || !endDate || !adults || !interests || !destination) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Fetch trip suggestions in parallel
    const [flightSuggestions, hotelSuggestions, placesSuggestions] = await Promise.all([
      fetchFlights(fromCity, toCity, startDate, endDate, adults),
      fetchHotels(destination, startDate, endDate),
      fetchPlaces(destination, interests),
    ]);

    // Respond with combined trip suggestions
    res.status(200).json({
      flights: flightSuggestions.length ? flightSuggestions : "No flight data available",
      hotels: hotelSuggestions.length ? hotelSuggestions : "No hotel data available",
      places: placesSuggestions.length ? placesSuggestions : "No place data available",
    });
  } catch (error) {
    console.error('Error fetching trip suggestions:', error.message);
    res.status(500).json({ error: 'Failed to get trip suggestions' });
  }
};

module.exports = { getTripSuggestions };
