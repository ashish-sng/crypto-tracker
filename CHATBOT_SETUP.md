# Chatbot Setup Guide

This guide will help you set up the AI-powered cryptocurrency chatbot feature.

## Overview

The chatbot uses:

- **FastAPI** (Python) backend for API endpoints
- **OpenAI GPT** models for AI responses
- **CoinGecko API** for real-time cryptocurrency data
- **React** frontend component for the chat interface

## Step-by-Step Setup

### 1. Get API Keys

#### OpenAI API Key (Required)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (you won't see it again!)

**Cost**: Pay-as-you-go. GPT-3.5-turbo is very affordable (~$0.002 per 1K tokens)

#### CoinGecko API Key (Optional but Recommended)

1. Go to [coingecko.com/api](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 10-50 calls/minute (sufficient for development)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp env.example .env

# Edit .env and add your keys
# OPENAI_API_KEY=sk-...
# COINGECKO_API_KEY=... (optional)
```

### 3. Run Backend Server

```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### 4. Frontend Setup

Create a `.env` file in the project root (same level as `package.json`):

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 5. Start Frontend

```bash
# From project root
npm start
```

The React app will start on `http://localhost:3000`

### 6. Test the Chatbot

1. Log in to the app
2. You should see a chatbot widget in the bottom-right corner
3. Click on any coin to select it (optional - provides context)
4. Type a message like "Tell me about Bitcoin"
5. The chatbot will respond with AI-generated information!

## Troubleshooting

### Backend won't start

- Check Python version: `python --version` (need 3.11+)
- Verify dependencies: `pip list | grep fastapi`
- Check `.env` file exists and has `OPENAI_API_KEY`

### Frontend can't connect to backend

- Verify backend is running on port 8000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors
- Ensure backend CORS allows `http://localhost:3000`

### Chatbot returns errors

- Check OpenAI API key is valid
- Verify you have credits in your OpenAI account
- Check backend logs for error messages
- Test API directly: `curl http://localhost:8000/health`

### Rate limit errors

- CoinGecko free tier: 10-50 calls/minute
- Add `COINGECKO_API_KEY` to `.env` for higher limits
- Consider caching coin data

## Architecture

```
User (React Frontend)
    ↓
Chatbot Component
    ↓
chatService.js (API calls)
    ↓
FastAPI Backend (localhost:8000)
    ↓
LLM Service → OpenAI API
Coin Service → CoinGecko API
    ↓
Response with AI answer + coin data
```

## Customization

### Change LLM Model

Edit `backend/.env`:

```env
OPENAI_MODEL=gpt-4  # or gpt-4-turbo-preview, gpt-3.5-turbo
```

### Modify System Prompt

Edit `backend/services/llm_service.py`:

```python
self.system_prompt = """Your custom prompt here..."""
```

### Adjust Chatbot UI

Edit `src/components/chatbot/Chatbot.css` for styling changes.

## Production Deployment

### Backend Deployment Options

1. **Vercel/Netlify** (Serverless Functions)
2. **Railway/Render** (Traditional hosting)
3. **AWS/GCP/Azure** (Cloud platforms)
4. **Docker** (Container deployment)

### Environment Variables

Make sure to set environment variables in your hosting platform:

- `OPENAI_API_KEY`
- `COINGECKO_API_KEY` (optional)
- `OPENAI_MODEL` (optional)

### Frontend Environment

Update `REACT_APP_API_URL` to your production backend URL.

## Cost Estimation

**OpenAI GPT-3.5-turbo:**

- ~$0.002 per 1K tokens
- Average conversation: ~500 tokens
- 1000 conversations ≈ $1

**CoinGecko:**

- Free tier: 10-50 calls/minute
- Paid plans available if needed

## Security Notes

- ✅ Never commit `.env` files to git
- ✅ Keep API keys secret
- ✅ Use environment variables in production
- ✅ Consider rate limiting for production
- ✅ Add authentication to backend endpoints if needed

## Next Steps

- Add conversation history persistence
- Implement coin price alerts
- Add voice input support
- Create chat history/export feature
- Add multi-language support
