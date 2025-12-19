import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchCoins } from '../hooks/useFetchCoins';
import { filterCoins } from '../utils/filterUtils';
import Coin from '../components/coin/Coin';

/**
 * DashboardPage Component
 * Serves as the protected main application view for authenticated users.
 * Provides cryptocurrency tracking functionality with coin search and display.
 * Includes logout functionality that calls the AuthContext logout function.
 */
const DashboardPage = () => {
  // Destructure logout function from useAuth hook
  const { logout } = useAuth();

  // Fetch coins data using the custom hook
  const coins = useFetchCoins();

  // Initialize search state to store the search input value
  const [search, setSearch] = useState('');

  /**
   * handleChange Function
   * Updates the search state with the input value from the search field
   * @param {Event} e - The change event from the input element
   */
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter coins based on the current search input
  const filteredCoins = filterCoins(coins, search);

  return (
    <>
      {/* Header section with logout button */}
      <div className="header">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Search section for filtering coins */}
      <div className="coin-search">
        <h1 className="coin-text">Search a currency</h1>
        <form>
          <input
            type="text"
            placeholder="Search Coin"
            className="coin-input"
            onChange={handleChange}
          />
        </form>
      </div>

      {/* Render the list of filtered coins */}
      {filteredCoins.map((coin) => (
        <Coin
          key={coin.id}
          name={coin.name}
          image={coin.image}
          symbol={coin.symbol}
          marketCap={coin.market_cap}
          price={coin.current_price}
          priceChange={coin.price_change_percentage_24h}
          volume={coin.total_volume}
        />
      ))}
    </>
  );
};

export default DashboardPage;
