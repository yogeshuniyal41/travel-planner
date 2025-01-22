import React from 'react';
import { logoutUser } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const confirm = window.confirm('Do you want to logout?');
      if (confirm) {
        const res = await logoutUser();
        
        // Check for success response
        if (res?.message === 'Logout successful') {
          navigate('/'); // Redirect to the homepage
        } else {
          console.error('Logout failed:', res?.message || 'Unknown error');
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Travel Planner</div>
        <div>
          <button onClick={handleLogout} className="text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 mr-2">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
