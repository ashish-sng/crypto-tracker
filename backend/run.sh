#!/bin/bash

# Script to run the FastAPI backend server

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the server
uvicorn main:app --reload --host ${HOST:-0.0.0.0} --port ${PORT:-8000}

