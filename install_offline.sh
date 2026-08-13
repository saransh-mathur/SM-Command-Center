#!/bin/bash
set -e

echo "================================================="
echo "   Universal Command Center - Offline Setup"
echo "================================================="

# 1. Check Docker & Compose
if ! command -v docker &> /dev/null; then
    echo "[!] Docker could not be found. Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 2. Check Ollama
if ! command -v ollama &> /dev/null; then
    echo "[!] Ollama could not be found. Please install Ollama on your host machine: https://ollama.com/"
    exit 1
fi

echo "[✓] Docker and Ollama dependencies met."

# 3. Environment Configuration
if [ ! -f .env ]; then
    echo "[*] Creating .env file from .env.example..."
    cp .env.example .env
fi

# 4. Pull Local Models
echo "[*] Ensuring offline LLM models are cached locally..."
ollama pull qwen3:8b-q4_K_M || echo "[!] Failed to pull chat model, but setup will continue..."
ollama pull qwen3-embedding:4b || echo "[!] Failed to pull embedding model, but setup will continue..."

# 5. Build and Deploy
echo "[*] Building and spinning up the offline cluster..."
docker compose up -d --build

echo "================================================="
echo "[✓] Deployment Complete & Secured!"
echo "    Frontend Access:  http://localhost:3000"
echo "    Backend API:      http://localhost:8000"
echo "================================================="
