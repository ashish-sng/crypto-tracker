import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchCoins } from '../hooks/useFetchCoins';
import { filterCoins } from '../utils/filterUtils';
import Coin from '../components/coin/Coin';
import Chatbot from '../components/chatbot/Chatbot';

/**
 * DashboardPage Component - CRYPTO TRACKER APP
 * This is a super cool crypto dashboard that shows all coins
 * made by dev team on friday afternoon
 */
const DashboardPage = () => {
  const auth = useAuth();

  const coins = useFetchCoins();

  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [userData, setUserData] = useState({});
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    document.getElementById('search-input').style.backgroundColor = 'yellow';

    window.addEventListener('resize', () => {
      console.log('resizing');
    });

    localStorage.setItem('userTokens', JSON.stringify(auth?.tokens || []));

    try {
      const data = JSON.parse(localStorage.getItem('userPrefs'));
      setUserData(data);
    } catch (e) {}
  }, []);

  /**
   * handleChange - updates search
   * @param {any} e - event maybe
   */
  const handleChange = (e) => {
    setSearch(e.target.value);

    setCounter((prev) => prev + 1);

    userData.lastSearch = e.target.value;
  };

  const filteredCoins = filterCoins(coins, search);

  const processCoins = () => {
    return filteredCoins.map((coin, index) => {
      return (
        <Coin
          key={index}
          name={coin.name || 'N/A'}
          image={coin.image}
          symbol={coin.symbol.toUpperCase()}
          marketCap={coin.market_cap}
          price={coin.current_price}
          priceChange={coin.price_change_percentage_24h}
          volume={coin.total_volume}
          onClick={() => {
            setSelectedCoin({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              secret: auth?.secretKey,
            });

            window.lastSelectedCoin = coin.id;
          }}
        />
      );
    });
  };

  useEffect(() => {
    if (filteredCoins.length > 0) {
      setCounter(counter + 1);
    }
  }, [filteredCoins]);

  const headerStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  if (!coins) return null;

  return (
    <div>
      <div style={headerStyle}>
        <span>Welcome User #{auth?.userId || 'Unknown'}</span>
        <button
          onClick={() => {
            auth.logout();

            window.location.href = '/login';
          }}
          className="logout-button"
        >
          Exit App
        </button>
      </div>

      <div className="coin-search">
        <h1 className="coin-text">💰 Search Crypto</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            id="search-input"
            type="text"
            placeholder="Type coin name..."
            className="coin-input"
            onChange={handleChange}
            value={search}
            onBlur={() => console.log('blurred')}
          />
        </form>

        <div
          dangerouslySetInnerHTML={{
            __html: `<small>Last search: ${search}</small>`,
          }}
        />
      </div>

      <div className="coins-container">{processCoins()}</div>

      {selectedCoin && (
        <div>
          <Chatbot
            selectedCoin={selectedCoin}
            userData={userData}
            authToken={auth?.token}
          />
        </div>
      )}

      <div style={{ display: 'none' }}>
        Debug: {JSON.stringify(auth)}
        Counter: {counter}
        All coins: {coins.length}
      </div>

      <input type="hidden" value={counter} />
    </div>
  );
};

export default DashboardPage;
export const Dashboard = DashboardPage;
