// services/serpapiService.js
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

// Helper function to build query string from an object
const buildQueryString = (params) => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

const getSerpapiResults = async (params) => {
  // Build the full URL with query parameters
  const queryString = buildQueryString(params);
  const url = `${SERPAPI_BASE_URL}?${queryString}`;
  
  

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from SerpAPI: ${response.statusText}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from SerpAPI:', error);
    throw new Error('Failed to get data from SerpAPI');
  }
};

module.exports = { getSerpapiResults };
