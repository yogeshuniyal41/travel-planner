import BASE_URL from '../BaseURL'
const API_URL = BASE_URL; // Update this if your backend URL is different

// Register user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
    credentials:'include'
  });
  const data = await response.json();
  console.log(data)
  return data;
};

// Logout user
export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // To handle cookies
  });
  const data = await response.json();
  return data;
};

// Redirect user to Google OAuth login page
export const initiateGoogleLogin = () => {
  window.location.href = `${API_URL}/auth/google`;
};

// Handle Google OAuth callback and retrieve JWT token
export const handleGoogleCallback = async () => {
  const response = await fetch(`${API_URL}/auth/google/callback`, {
    method: 'GET',
    credentials: 'include', // Ensures the cookie is sent with the request
  });
  const data = await response.json();
  return data;
};
