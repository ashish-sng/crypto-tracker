import os
from typing import List, Optional
from openai import OpenAI
import sys

class LLMService:
    """
    Service for interacting with LLM APIs (OpenAI, Anthropic, etc.)
    Currently configured for OpenAI, but can be extended for other providers.
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        # Initialize OpenAI client with only api_key to avoid version conflicts
        # The 'proxies' error usually indicates an old OpenAI library version
        try:
            self.client = OpenAI(api_key=self.api_key)
        except TypeError as e:
            if "proxies" in str(e) or "unexpected keyword argument" in str(e):
                raise ValueError(
                    f"OpenAI library version issue: {str(e)}\n"
                    f"Please upgrade the OpenAI library by running:\n"
                    f"  pip install --upgrade openai\n"
                    f"Or reinstall dependencies:\n"
                    f"  pip install -r requirements.txt"
                )
            raise
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        
        # System prompt for crypto specialist
        self.system_prompt = """You are a knowledgeable cryptocurrency and blockchain expert assistant. 
You help users understand cryptocurrencies, analyze market trends, explain technical concepts, 
and provide insights about specific coins and tokens.

Key guidelines:
- Provide accurate, helpful information about cryptocurrencies
- Use the provided coin data when available to give current, real-time information
- Explain complex concepts in an accessible way
- Be honest about market risks and volatility
- If you don't know something, say so rather than guessing
- Focus on education and analysis, not financial advice
"""
    
    async def get_chat_response(
        self,
        user_message: str,
        coin_context: str = "",
        conversation_history: Optional[List[dict]] = None
    ) -> str:
        """
        Get a chat response from the LLM with coin context.
        
        Args:
            user_message: The user's message
            coin_context: Contextual information about coins (if available)
            conversation_history: Previous messages in the conversation
            
        Returns:
            The LLM's response as a string
        """
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Add coin context if available
        if coin_context:
            messages.append({
                "role": "system",
                "content": f"Additional context:\n{coin_context}"
            })
        
        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history:
                # Handle both dict and Pydantic model objects
                if isinstance(msg, dict):
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                else:
                    # Pydantic model or object with attributes
                    role = getattr(msg, "role", "user")
                    content = getattr(msg, "content", "")
                
                messages.append({
                    "role": role,
                    "content": content
                })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Error calling LLM API: {str(e)}")

