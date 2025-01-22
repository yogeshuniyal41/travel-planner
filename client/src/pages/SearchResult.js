import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from './HomePage';
import BASE_URL from '../BaseURL';

function SearchResult() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('User authenticated:', data.user);
        }
         else {
          setAuthError(true);
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthError(true);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const location = useLocation();
  const { tripSuggestions } = location.state || {};
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tripSuggestions) {
    return <emp>return to <Link to="/home" className='text-blue-500' >home</Link></emp>;
  }

  const { flights: mockFlights, hotels: mockHotels, places: mockPlaces } = tripSuggestions;

  return (
    <>
    <Navbar/>
    <div className="p-6">
      {/* Suggested Flights Section */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">Suggested Flights</h1>
        {Array.isArray(mockFlights) && mockFlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFlights.map((flight, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                <img src={flight.airline_logo} alt={`${flight.airline} logo`} className="h-10 mb-2" />
                <h2 className="text-lg font-medium">{flight.airline} - {flight.flight_number}</h2>
                <p>Price:₹{flight.price}</p>
                <p>Departure: {flight.departure_time}</p>
                <p>Arrival: {flight.arrival_time}</p>
                <a href={flight.booking_link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Book Now
                </a>
              </div>
            ))}
          </div>
        ) : typeof mockFlights === 'string' ? (
          <p>{mockFlights}</p>
        ) : (
          <p>No flight suggestions available right now.</p>
        )}
      </div>

      {/* Suggested Hotels Section */}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold mb-4">Suggested Hotels</h1>
        {Array.isArray(mockHotels) && mockHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockHotels.map((hotel, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                <img src={hotel.image} alt={hotel.name} className="h-40 mb-2 w-full object-cover rounded" />
                <h2 className="text-lg font-medium">{hotel.name}</h2>
                <p>Rating: {hotel.rating} ★</p>
                <p>Price: {hotel.price}</p>
                <a href={hotel.booking_link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Book Now
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No hotel suggestions available.</p>
        )}
      </div>

      {/* Suggested Places Section */}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold mb-4">Suggested Places</h1>
        {Array.isArray(mockPlaces) && mockPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPlaces.map((place, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                <img src={place.image} alt={place.name} className="h-20 mb-2 w-full object-cover rounded" />
                <h2 className="text-lg font-medium">{place.name}</h2>
                <p>Type: {place.type}</p>
                <p>{place.description}</p>
                <a href={place.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Learn More
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No place suggestions available.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default SearchResult;
