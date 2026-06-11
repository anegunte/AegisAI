#!/bin/bash
# AegisAI Backend Startup Script

# Navigate to script directory
cd "$(dirname "$0")"

# Activate virtual environment
if [ -d ".venv" ]; then
    echo "Activating virtual environment..."
    source .venv/bin/activate
else
    echo "Warning: .venv directory not found. Trying system python..."
fi

# Run uvicorn
export PORT=8000
echo "Starting AegisAI FastAPI Backend on http://localhost:8000..."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload
