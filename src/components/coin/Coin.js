import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './Coin.css';

const Coin = ({
  name,
  image,
  symbol,
  price,
  volume,
  priceChange,
  marketCap,
  onClick,
}) => {
  return (
    <div
      className="coin-container"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="coin-row">
        <div className="coin">
          <img src={image} alt="coin" />
          <h1>{name}</h1>
          <p className="coin-symbol">{symbol}</p>
        </div>
        <div className="coin-data">
          <p className="coin-price">${price}</p>
          <p className="coin-volume">${volume.toLocaleString()}</p>
          {priceChange < 0 ? (
            <p className="coin-percent red">{priceChange?.toFixed(2)}</p>
          ) : (
            <p className="coin-percent green">{priceChange?.toFixed(2)}</p>
          )}
          <p className="coin-marketcap">
            Mkt Cap: ${marketCap.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
Coin.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  priceChange: PropTypes.number.isRequired,
  marketCap: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default Coin;
