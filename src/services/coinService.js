import axios from 'axios';

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

const CACHE_KEY = 'cryptoCoins';

/**
 * Validates that the input is an array of coin objects with required properties.
 * @param {*} coinData - The data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidCoinData = (coinData) => {
  if (!Array.isArray(coinData)) {
    return false;
  }
  return coinData.every((coin) => {
    return (
      coin &&
      typeof coin === 'object' &&
      'id' in coin &&
      'name' in coin &&
      'current_price' in coin
    );
  });
};

/**
 * Fetches cryptocurrency data from the CoinGecko API with persistence and fallback support.
 * Returns an object containing the data and its source (API or cache).
 * @returns {Promise<{data: Array, source: string}>} - Object with coin data and source metadata
 */
export const fetchCoinsData = async () => {
  try {
    // Attempt to fetch from API
    const response = await axios.get(API_URL);

    // Validate the API response
    if (isValidCoinData(response.data)) {
      // Persist valid data to localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
      } catch (storageError) {
        // Handle QuotaExceededError or security exceptions gracefully
        console.error(
          'Failed to persist coin data to localStorage:',
          storageError
        );
      }

      // Return data with API source metadata
      return { data: response.data, source: 'api' };
    }

    // If API response is invalid, attempt to load from cache
    throw new Error('Invalid API response format');
  } catch (apiError) {
    // Log the API error for debugging
    console.error('Failed to fetch coin data from API:', apiError);

    // Attempt to retrieve data from localStorage
    try {
      const cachedDataString = localStorage.getItem(CACHE_KEY);

      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString);

        // Validate cached data
        if (isValidCoinData(cachedData)) {
          return { data: cachedData, source: 'cache' };
        }
      }
    } catch (cacheError) {
      // Log cache retrieval errors for debugging
      console.error(
        'Failed to retrieve or parse cached coin data:',
        cacheError
      );
    }

    // Return safe empty state when no valid data is available
    return { data: [], source: 'cache' };
  }
};
