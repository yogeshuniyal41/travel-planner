// src/authService.js

const API_URL = 'http://localhost:5000'; // Replace with your backend API URL

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // userData contains { username, email, password }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData), // loginData contains { email, password }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token); // Save token in localStorage
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Google OAuth callback handling
export const googleAuthCallback = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/google/callback`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials for sessions/cookies
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    throw error;
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials for sessions/cookies
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }

    localStorage.removeItem('authToken'); // Clear auth token from local storage
    return await response.json();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
