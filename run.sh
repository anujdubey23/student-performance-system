#!/usr/bin/env bash
# AI-Driven Student Performance & Personalized Learning System
# Convenient launch script for both Backend and Frontend

set -e

echo "=================================================================="
echo " Starting AI-Driven Student Performance & Learning System"
echo "=================================================================="

# Check Python virtual environment
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment in backend/venv..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# Train ML model if not already trained
if [ ! -f "backend/model/performance_model.pkl" ]; then
    echo "Training Random Forest ML Model..."
    backend/venv/bin/python3 backend/train_model.py
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend npm packages..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "------------------------------------------------------------------"
echo " Starting Backend API server on http://localhost:5001"
echo " Starting Frontend Vite server on http://localhost:3000"
echo "------------------------------------------------------------------"
echo ""

# Trap SIGINT to kill background jobs cleanly
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start Backend
(cd backend && ./venv/bin/python3 app.py) &
BACKEND_PID=$!

# Start Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
