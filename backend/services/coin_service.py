import aiohttp
import os
from typing import Optional, Dict, Any
import re

class CoinService:
    """
    Service for fetching cryptocurrency data from CoinGecko API.
    Provides coin information to enhance LLM responses with real-time data.
    """
    
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.api_key = os.getenv("COINGECKO_API_KEY")  # Optional, for higher rate limits
        
    async def _make_request(self, endpoint: str) -> Dict[str, Any]:
        """Make an async HTTP request to CoinGecko API"""
        url = f"{self.base_url}{endpoint}"
        headers = {}
        
        if self.api_key:
            headers["x-cg-demo-api-key"] = self.api_key
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 429:
                    raise Exception("Rate limit exceeded. Please try again later.")
                else:
                    raise Exception(f"CoinGecko API error: {response.status}")
    
    async def get_coin_details(self, coin_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a specific coin by its ID.
        
        Args:
            coin_id: CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
            
        Returns:
            Dictionary with coin details or None if not found
        """
        try:
            # Get market data
            market_data = await self._make_request(
                f"/coins/markets?vs_currency=usd&ids={coin_id}&order=market_cap_desc&per_page=1&page=1&sparkline=false"
            )
            
            if not market_data:
                return None
            
            coin_info = market_data[0]
            
            # Get additional details (description, etc.)
            try:
                coin_details = await self._make_request(f"/coins/{coin_id}")
                coin_info['description'] = coin_details.get('description', {})
            except:
                pass  # If detailed info fails, use market data only
            
            return coin_info
            
        except Exception as e:
            print(f"Error fetching coin details: {e}")
            return None
    
    async def search_coin(self, query: str) -> Optional[str]:
        """
        Search for a coin by name or symbol and return its CoinGecko ID.
        
        Args:
            query: Coin name or symbol to search for
            
        Returns:
            CoinGecko ID if found, None otherwise
        """
        try:
            # Get list of coins and search locally (CoinGecko search endpoint is limited)
            coins = await self._make_request("/coins/list")
            
            query_lower = query.lower().strip()
            
            # Try exact match first
            for coin in coins:
                if (coin['id'].lower() == query_lower or 
                    coin['symbol'].lower() == query_lower or
                    coin['name'].lower() == query_lower):
                    return coin['id']
            
            # Try partial match
            for coin in coins:
                if (query_lower in coin['name'].lower() or 
                    query_lower in coin['symbol'].lower()):
                    return coin['id']
            
            return None
            
        except Exception as e:
            print(f"Error searching for coin: {e}")
            return None
    
    async def extract_coin_from_message(self, message: str) -> Optional[Dict[str, Any]]:
        """
        Try to extract coin name/symbol from user message and fetch its data.
        
        Args:
            message: User's message that might contain a coin name
            
        Returns:
            Coin data if a coin is found, None otherwise
        """
        # Common coin names and symbols to look for
        common_coins = {
            'bitcoin': 'bitcoin', 'btc': 'bitcoin',
            'ethereum': 'ethereum', 'eth': 'ethereum',
            'binance': 'binancecoin', 'bnb': 'binancecoin',
            'cardano': 'cardano', 'ada': 'cardano',
            'solana': 'solana', 'sol': 'solana',
            'polkadot': 'polkadot', 'dot': 'polkadot',
            'dogecoin': 'dogecoin', 'doge': 'dogecoin',
            'ripple': 'ripple', 'xrp': 'ripple',
            'litecoin': 'litecoin', 'ltc': 'litecoin',
        }
        
        message_lower = message.lower()
        
        # Check for common coins first
        for key, coin_id in common_coins.items():
            if key in message_lower:
                return await self.get_coin_details(coin_id)
        
        # Try to extract potential coin names (words that might be coin names)
        words = re.findall(r'\b\w+\b', message_lower)
        for word in words:
            if len(word) > 2:  # Skip very short words
                coin_id = await self.search_coin(word)
                if coin_id:
                    return await self.get_coin_details(coin_id)
        
        return None

