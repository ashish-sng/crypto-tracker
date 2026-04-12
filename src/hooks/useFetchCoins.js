import { useState, useEffect } from 'react';
import { fetchCoinsData } from '../services/coinService';

export const useFetchCoins = () => {
  const [coins, setCoins] = useState([]);
  const [source, setSource] = useState('api');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data periodically
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call fetchCoinsData and destructure the result
        const { data, source: dataSource } = await fetchCoinsData();

        // Update coins state with the fetched data
        setCoins(data);

        // Update source state with the data origin
        setSource(dataSource);

        // Set loading to false on successful fetch
        setLoading(false);
      } catch (err) {
        // Log the error for debugging
        console.error('Failed to fetch coin data:', err);

        // Set error state to reflect the API failure
        setError(err.message || 'Failed to fetch coin data');

        // Set loading to false even on error
        setLoading(false);
      }
    };

    // Initial fetch
    fetchCoins();

    // Polling every 50 seconds - interval continues regardless of API success or failure
    const intervalId = setInterval(() => fetchCoins(), 50000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Return an object containing coins, source, loading, and error states
  return { coins, source, loading, error };
};
