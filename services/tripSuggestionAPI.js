const { getSerpapiResults } = require('./apiServices');


const fetchFlights = async (fromCity, toCity, startDate, endDate, adults) => {
    try {
      if (!fromCity || !toCity || !startDate || !endDate || adults <= 0) {
        throw new Error("Invalid input parameters for fetching flights.");
      }
  
      const flightParams = {
        engine: 'google_flights',
        departure_id: fromCity,
        arrival_id: toCity,
        outbound_date: startDate,
        return_date: endDate,
        adults:adults,
        currency: 'INR',
        hl: 'en',
        api_key: process.env.SERPAPI_KEY,
      };
  
      // Fetch data from SerpAPI
      const flightData = await getSerpapiResults(flightParams);
  
      // Check for error or empty results
      if (flightData?.error || flightData?.search_information?.flights_results_state === "Fully empty") {
        console.log('No flight data from SerpAPI, switching to RapidAPI');
      } else {
        const flightsArray = flightData.best_flights || flightData.other_flights || [];
        return flightsArray.map(flight => ({
          price: flight.price || "Price not available",
          type: flight.type || "Unknown",
          airline: flight.flights[0]?.airline || "Unknown",
          flight_number: flight.flights[0]?.flight_number || "N/A",
          departure_time: flight.flights[0]?.departure_airport?.time || "Time not available",
          arrival_time: flight.flights[0]?.arrival_airport?.time || "Time not available",
          airline_logo: flight.airline_logo || "default-logo.png",
          booking_link: `https://www.google.com/flights?hl=en#flt=${fromCity}.${toCity}.${startDate}`,
        }));
      }
  
      // Fallback to RapidAPI
      const rapidAPIUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=${fromCity}&destinationAirportCode=${toCity}&date=${startDate}&itineraryType=ROUND_TRIP&sortOrder=ML_BEST_VALUE&numAdults=${adults}&classOfService=ECONOMY&returnDate=${endDate}&currencyCode=INR`;
      const rapidAPIOptions = {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
        },
      };
  
      const rapidResponse = await fetch(rapidAPIUrl, rapidAPIOptions);
      if (!rapidResponse.ok) throw new Error(`Flight API Error: ${rapidResponse.statusText}`);
      const rapidFlightsData = await rapidResponse.json();
      const rapidFlights = rapidFlightsData.data.flights || [];
  
      return rapidFlights.map(flight => ({
        price: flight.purchaseLinks[0]?.totalPrice || "Price not available",
        currency: flight.purchaseLinks[0]?.currency || "INR",
        airline: flight.segments[0]?.legs[0]?.operatingCarrier?.displayName || "Unknown",
        flight_number: `${flight.segments[0]?.legs[0]?.marketingCarrier?.code}${flight.segments[0]?.legs[0]?.flightNumber}` || "N/A",
        departure_time: flight.segments[0]?.legs[0]?.departureDateTime || "Time not available",
        arrival_time: flight.segments[0]?.legs[0]?.arrivalDateTime || "Time not available",
        airline_logo: flight.segments[0]?.legs[0]?.operatingCarrier?.logoUrl || "default-logo.png",
        booking_link: flight.purchaseLinks[0]?.url || "#",
      }));
    } catch (error) {
      console.error('Error fetching flights:', error.message);
      return [];
    }
  };
  

/**
 * Fetch hotel suggestions.
 * @param {string} destination - Travel destination.
 * @param {string} startDate - Start date of the stay (YYYY-MM-DD).
 * @param {string} endDate - End date of the stay (YYYY-MM-DD).
 * @returns {Promise<Array>} - Array of hotel suggestions.
 */
const fetchHotels = async (destination, startDate, endDate,adults) => {
  try {
    const hotelParams = {
      engine: 'google_hotels',
      q: `${destination} Resorts`,
      check_in_date: startDate,
      check_out_date: endDate,
      adults: adults,
      currency: 'INR',
      gl: 'us',
      hl: 'en',
      api_key: process.env.SERPAPI_KEY,
    };

    const hotelData = await getSerpapiResults(hotelParams);
    return (hotelData?.properties || []).map(hotel => ({
      name: hotel.name || "N/A",
      type: hotel.type || "Unknown",
      price: hotel.total_rate?.lowest || "Price not available",
      rating: hotel.location_rating || "No rating",
      booking_link: hotel.link || "#",
      image: hotel.images?.[0]?.original_image || "default-image.jpg",
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    return [];
  }
};

/**
 * Fetch place suggestions based on interests and destination.
 * @param {string} destination - Travel destination.
 * @param {string} interests - User interests (e.g., "nature, museums").
 * @returns {Promise<Array>} - Array of place suggestions.
 */
const fetchPlaces = async (destination, interests) => {
  try {
    const placesParams = {
      engine: 'google',
      q: `best places for ${interests} in ${destination}`,
      hl: 'en',
      location: destination,
      
      api_key: process.env.SERPAPI_KEY,
    };

    const placesData = await getSerpapiResults(placesParams);
    return (placesData?.local_results?.places || placesData?.organic_results || []).map(place => ({
      name: place.title || "N/A",
      type: place.type || "Unknown",
      direction: place.links?.direction || "#",
      link: place.links?.website || "#",
      description: place.description || "No description available",
      image: place.thumbnail || "default-image.jpg",
    }));
  } catch (error) {
    console.error('Error fetching places:', error.message);
    return [];
  }
};

module.exports = { fetchFlights, fetchHotels, fetchPlaces };
