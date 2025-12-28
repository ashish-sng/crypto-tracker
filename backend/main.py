from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import chat

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Crypto Tracker API",
    description="Backend API for cryptocurrency tracking and AI chatbot",
    version="1.0.0"
)

# Configure CORS to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:80",    # Docker production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Crypto Tracker API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

