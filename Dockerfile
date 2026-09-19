# Multi-stage production build: Node builds frontend, Python runs Flask + Gunicorn

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend & Gunicorn Server
FROM python:3.10-slim
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets from stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Train ML model inside container if artifacts not present
RUN python backend/train_model.py

# Expose port
ENV PORT=5001
EXPOSE 5001

# Run with gunicorn
CMD ["gunicorn", "--chdir", "backend", "app:app", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "120"]
