// src/apiService.js

import BASE_URL from "../BaseURL";

const API_URL = BASE_URL; // Replace with your backend URL if different

// Function to get trip suggestions using fetch
export const getTripSuggestions = async (tripData) => {
  try {
    console.log(tripData)
    const response = await fetch(`${API_URL}/search/tripsuggestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    // console.log(response.json());
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching trip suggestions:', error);
    throw error;
  }
};
