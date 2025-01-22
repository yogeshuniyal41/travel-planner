// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthForm from './pages/AuthForm';
import SearchResult from './pages/SearchResult';

// Use the PUBLIC_URL prefix if images are stored in the 'public' folder.
const images = [
  `${process.env.PUBLIC_URL}/bg1.jpg`,
  `${process.env.PUBLIC_URL}/bg2.jpg`,
  `${process.env.PUBLIC_URL}/bg3.jpg`,
  `${process.env.PUBLIC_URL}/bg4.jpg`,
  `${process.env.PUBLIC_URL}/bg5.jpg`,
  `${process.env.PUBLIC_URL}/bg6.jpg`,
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images to avoid flickering during background changes
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  useEffect(() => {
    // Set interval to change background every 10 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <Router>
      <div
        className="App w-full bg-center bg-cover transition-all duration-3000"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          transition: 'background-image 1s ease-in-out',
          backgroundAttachment:'fixed'
          
        }}
      >
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
