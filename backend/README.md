# Crypto Tracker Backend API

FastAPI backend for the Crypto Tracker application, providing AI-powered chatbot functionality for cryptocurrency discussions.

## Features

- 🤖 AI-powered chatbot using OpenAI GPT models
- 📊 Real-time cryptocurrency data integration via CoinGecko API
- 💬 Conversation history support
- 🔍 Automatic coin detection from user messages
- 🚀 Fast async/await architecture

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `COINGECKO_API_KEY`: Your CoinGecko API key (optional, for higher rate limits)
- `OPENAI_MODEL`: Model to use (default: `gpt-3.5-turbo`)

### 3. Run the Server

**Development mode:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### POST `/api/chat`

Chat with the AI about cryptocurrencies.

**Request Body:**

```json
{
  "message": "Tell me about Bitcoin",
  "coin_id": "bitcoin", // Optional
  "conversation_history": [
    // Optional
    {
      "role": "user",
      "content": "What is Bitcoin?"
    },
    {
      "role": "assistant",
      "content": "Bitcoin is..."
    }
  ]
}
```

**Response:**

```json
{
  "response": "Bitcoin is a decentralized digital currency...",
  "coin_data": {
    "name": "Bitcoin",
    "symbol": "btc",
    "current_price": 45000,
    ...
  }
}
```

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── routers/
│   └── chat.py            # Chat API routes
├── services/
│   ├── llm_service.py     # LLM integration (OpenAI)
│   └── coin_service.py    # CoinGecko API integration
├── requirements.txt       # Python dependencies
└── .env.example          # Environment variables template
```

## Development

### Using Different LLM Providers

To use a different LLM provider (Anthropic, Google, etc.), modify `backend/services/llm_service.py` to use the appropriate SDK.

### Rate Limits

- **CoinGecko Free Tier**: 10-50 calls/minute
- **OpenAI**: Depends on your plan (check your dashboard)

Consider implementing caching for frequently requested coins to reduce API calls.

## Docker Support

You can containerize this backend separately or integrate it with the main Dockerfile. Example:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
