from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.llm_service import LLMService
from services.coin_service import CoinService

router = APIRouter()

# Request/Response models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    coin_id: Optional[str] = None  # Optional: specific coin to discuss
    conversation_history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    response: str
    coin_data: Optional[dict] = None  # Relevant coin data if discussed

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that provides AI-powered responses about cryptocurrencies.
    Can discuss general crypto topics or specific coins.
    """
    try:
        llm_service = LLMService()
        coin_service = CoinService()
        
        # If a specific coin is mentioned or provided, fetch its data
        coin_data = None
        if request.coin_id:
            coin_data = await coin_service.get_coin_details(request.coin_id)
        else:
            # Try to extract coin name from message
            coin_data = await coin_service.extract_coin_from_message(request.message)
        
        # Build context for LLM
        context = ""
        if coin_data:
            context = f"""
Current coin information:
- Name: {coin_data.get('name', 'N/A')}
- Symbol: {coin_data.get('symbol', 'N/A')}
- Current Price: ${coin_data.get('current_price', 'N/A')}
- 24h Change: {coin_data.get('price_change_percentage_24h', 'N/A')}%
- Market Cap: ${coin_data.get('market_cap', 'N/A'):,}
- Volume: ${coin_data.get('total_volume', 'N/A'):,}
- Description: {coin_data.get('description', {}).get('en', 'N/A')[:500]}...
"""
        
        # Convert Pydantic models to dicts for the LLM service
        conversation_history_dicts = None
        if request.conversation_history:
            conversation_history_dicts = [
                {"role": msg.role, "content": msg.content}
                for msg in request.conversation_history
            ]
        
        # Get AI response
        response = await llm_service.get_chat_response(
            user_message=request.message,
            coin_context=context,
            conversation_history=conversation_history_dicts
        )
        
        return ChatResponse(
            response=response,
            coin_data=coin_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

