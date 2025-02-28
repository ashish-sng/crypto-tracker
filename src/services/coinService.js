import axios from 'axios';

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

export const fetchCoinsData = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
