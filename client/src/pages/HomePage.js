import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../BaseURL';

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
          method:'GET' // Send cookies with the request
        });
        console.log(response);
        if (response.ok) { // Corrected from `response.OK` to `response.ok`
          const data = await response.json();
          console.log('User authenticated:', data.user);
        } else {
          navigate('/'); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/'); // Redirect in case of any error
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    checkAuth(); // Run authentication check on mount
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  return (
    <div>
      <Navbar />
      <SearchBar />
    </div>
  );
};

export default HomePage;
