import { useState, useEffect } from "react";
import { fetchCoinsData } from "../services/coinService";

export const useFetchCoins = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Function to fetch data periodically
    const fetchCoins = async () => {
      try {
        const data = await fetchCoinsData();
        setCoins(data);
      } catch (err) {
        console.error("Failed to fetch coin data:", err);
      }
    };

    // Initial fetch
    fetchCoins();

    // Polling every 5 seconds
    const intervalId = setInterval(() => fetchCoins(), 5000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return coins;
};
