import React, { useState, useEffect } from 'react';
import './App.css';
import Coin from './components/coin/Coin';
import { useFetchCoins } from './hooks/useFetchCoins';
import { filterCoins } from './utils/filterUtils';
import OfflinePage from './offline/offlinePage';
import { registerServiceWorker } from './services/offlineService';

function App() {
  const coins = useFetchCoins();
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleChange = (e) => setSearch(e.target.value);
  const filteredCoins = filterCoins(coins, search);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <div className="coin-app">
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
    </div>
  );
}

export default App;
