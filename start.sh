#!/usr/bin/env bash
# ==============================================================================
# ⚡ SM COMMAND CENTER & TRI-TRACK PRODUCTIVITY OS - UNIFIED LAUNCHER
# ==============================================================================
# Starts FastAPI Backend (:8000) and React 18 + Vite Frontend (:3000) concurrently.
# ==============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo -e "${CYAN}"
cat << "EOF"
  ███████╗███╗   ███╗     ██████╗ ██████╗ ███╗   ███╗███╗   ███╗ █████╗ ███╗   ██╗██████╗ 
  ██╔════╝████╗ ████║    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔══██╗████╗  ██║██╔══██╗
  ███████╗██╔████╔██║    ██║     ██║   ██║██╔████╔██║██╔████╔██║███████║██╔██╗ ██║██║  ██║
  ╚════██║██║╚██╔╝██║    ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║
  ███████║██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝
  ╚══════╝╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ 
EOF
echo -e "${PURPLE}  ⚡ SM COMMAND CENTER & TRI-TRACK PRODUCTIVITY OS${NC}"
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Clean up background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down SM Command Center stack...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    fuser -k 8000/tcp 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped cleanly.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Clean up stale ports
echo -e "${CYAN}[1/3] Checking ports 8000 & 3000...${NC}"
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 0.5

# 2. Check & Launch FastAPI Backend
echo -e "${CYAN}[2/3] Starting FastAPI Backend (Port 8000)...${NC}"
PYTHON_BIN="python3"
if [ -d "$BACKEND_DIR/venv/bin" ]; then
    PYTHON_BIN="$BACKEND_DIR/venv/bin/python"
elif [ -d "/home/saransh/command_center_backend/venv/bin" ]; then
    PYTHON_BIN="/home/saransh/command_center_backend/venv/bin/python"
fi

cd "$BACKEND_DIR"
$PYTHON_BIN -m uvicorn main:app --host 0.0.0.0 --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!
echo -e "      ${GREEN}✓ Backend online (PID: $BACKEND_PID) -> http://localhost:8000${NC}"

# 3. Launch Vite React Frontend
echo -e "${CYAN}[3/3] Starting React + Vite Frontend (Port 3000)...${NC}"
cd "$FRONTEND_DIR"
npm run dev -- --host 0.0.0.0 --port 3000 > /dev/null 2>&1 &
FRONTEND_PID=$!
echo -e "      ${GREEN}✓ Frontend online (PID: $FRONTEND_PID) -> http://localhost:3000${NC}"

echo -e "\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}🚀 ALL SYSTEMS OPERATIONAL!${NC}"
echo -e "  • 🖥️  Command Center UI:  ${CYAN}http://localhost:3000${NC}"
echo -e "  • 💼  Career & Jobs:      ${GREEN}http://localhost:3000 (Career Tab)${NC}"
echo -e "  • 💻  Course Lab:         ${CYAN}http://localhost:3000 (Courses Tab)${NC}"
echo -e "  • 🎓  MBA Study Copilot:  ${PURPLE}http://localhost:3000 (MBA Tab)${NC}"
echo -e "  • 🔌  FastAPI Backend API: ${YELLOW}http://localhost:8000${NC}"
echo -e "  • 📚  Swagger Docs:        ${YELLOW}http://localhost:8000/docs${NC}"
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  Press ${YELLOW}[Ctrl + C]${NC} at any time to stop both servers.\n"

wait
