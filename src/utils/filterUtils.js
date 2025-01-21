export const filterCoins = (coins, query) => {
  return coins.filter((coin) =>
    coin.name.toLowerCase().includes(query.toLowerCase())
  );
};
