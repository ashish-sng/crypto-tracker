import React, { useState } from "react";
import "./App.css";
import Coin from "./components/coin/Coin";
import { useFetchCoins } from "./hooks/useFetchCoins";
import { filterCoins } from "./utils/filterUtils";

function App() {
  const coins = useFetchCoins(); // Using custom hook to fetch coins data
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = filterCoins(coins, search); // Using utility function to filter coins instead of writing the logic here

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
