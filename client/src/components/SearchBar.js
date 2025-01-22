import React, { useState, useEffect, useRef } from 'react';
import airportsData from '../iatacodes.json';
import interestsData from '../Interest.json';
import { getTripSuggestions } from '../api/tripSuggesionAPI';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

// AutocompleteInput Component


const AutocompleteInput = ({ label, placeholder, onSelect, isDisabled }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleChange = (e) => {
    const input = e.currentTarget.value;
    setUserInput(input);

    if (input) {
      const filtered = airportsData.filter(
        (airport) =>
          airport.city?.toLowerCase().includes(input.toLowerCase()) ||
          airport.name?.toLowerCase().includes(input.toLowerCase()) ||
          airport.iata?.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
      scrollToActive();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      scrollToActive();
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleClick(filteredSuggestions[activeIndex]);
      setFilteredSuggestions([]);
    } else if (e.key === 'Escape') {
      setFilteredSuggestions([]);
    }
  };

  const scrollToActive = () => {
    const activeItem = suggestionsRef.current?.children[activeIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleClick = (suggestion) => {
    setUserInput(`${suggestion.city} , ${suggestion.iata}`);
    setFilteredSuggestions([]);
    onSelect(suggestion.iata, suggestion.city);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setFilteredSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-4" ref={wrapperRef}>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={userInput}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        className="w-full p-3 border border-gray-300 rounded-md"
      />
      {filteredSuggestions.length > 0 && (
        <ul
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-48 overflow-y-auto z-50"
          ref={suggestionsRef}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleClick(suggestion)}
              className={`cursor-pointer p-3 hover:bg-gray-100 ${
                index === activeIndex ? 'bg-gray-200' : ''
              }`}
            >
              {suggestion.city} ({suggestion.iata})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



// InterestsDropdown Component


const InterestsDropdown = ({ onSelect, isDisabled }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleSelectInterest = (interest) => {
    if (!selectedInterests.includes(interest)) {
      const updatedInterests = [...selectedInterests, interest];
      setSelectedInterests(updatedInterests);
      onSelect(updatedInterests);
    }
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleRemoveInterest = (interest) => {
    const updatedInterests = selectedInterests.filter((i) => i !== interest);
    setSelectedInterests(updatedInterests);
    onSelect(updatedInterests);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => Math.min(prev + 1, interestsData.length - 1));
      scrollToActive();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      scrollToActive();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && showDropdown) {
        handleSelectInterest(interestsData[activeIndex].interest);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const scrollToActive = () => {
    const activeItem = dropdownRef.current?.children[activeIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <div className="flex flex-wrap">
        {selectedInterests.map((interest, index) => (
          <span key={index} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 mr-2 mb-2">
            {interest}
            <button className="ml-2 text-red-500" onClick={() => handleRemoveInterest(interest)}>
              &times;
            </button>
          </span>
        ))}
      </div>
      <button
        className="border border-gray-300 p-2 w-full text-left rounded-md"
        onClick={toggleDropdown}
        disabled={isDisabled}
      >
        Select Interests
      </button>
      {showDropdown && (
        <ul
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-48 overflow-y-auto z-50"
          ref={dropdownRef}
          onKeyDown={handleKeyDown}
        >
          {interestsData.map((interest, index) => (
            <li
              key={index}
              className={`cursor-pointer p-3 hover:bg-gray-100 ${
                index === activeIndex ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleSelectInterest(interest.interest)}
            >
              {interest.interest}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



// SearchBar Component remains unchanged


// SearchBar Component
const SearchBar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    startDate: '',
    endDate: '',
    interests: [],
    adults: 1,
    destination: ''
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getTripSuggestions(formData);
      if (data) {
        navigate('/search', { state: { tripSuggestions: data } });
      } else {
        console.error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching trip suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Flight Search</h1>
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <ClipLoader color="#3b82f6" loading={loading} size={50} />
          </div>
        )}
        <AutocompleteInput
          label="From"
          placeholder="Enter departure city or airport"
          onSelect={(iata) => updateField('fromCity', iata)}
        />
        <AutocompleteInput
          label="Destination"
          placeholder="Enter destination city or airport"
          onSelect={(iata, cityName) => {
            updateField('toCity', iata);
            updateField('destination', cityName);
          }}
        />
        <InterestsDropdown onSelect={(value) => updateField('interests', value)} />
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">No. of Persons</label>
          <input
            type="number"
            min={1}
            max={10}
            className="w-full p-2 border rounded"
            onChange={(e) => updateField('adults', parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date of Departure</label>
          <input
            type="date"
            min={today}
            className="w-full p-2 border rounded"
            onChange={(e) => updateField('startDate', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date of Arrival</label>
          <input
            type="date"
            min={formData.startDate || today}
            className="w-full p-2 border rounded"
            onChange={(e) => updateField('endDate', e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
