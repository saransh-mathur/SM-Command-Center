#!/usr/bin/env python3
"""
⚡ SM COMMAND CENTER & TRI-TRACK PRODUCTIVITY OS - PYTHON LAUNCHER
Run with: python3 launch.py
"""
import os
import sys
import subprocess
import signal
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

processes = []

def cleanup(signum=None, frame=None):
    print("\n\033[1;33m🛑 Stopping SM Command Center services...\033[0m")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    os.system("fuser -k 8000/tcp 2>/dev/null || true")
    os.system("fuser -k 3000/tcp 2>/dev/null || true")
    print("\033[0;32m✅ All services stopped cleanly.\033[0m")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    print("\033[0;36m============================================================")
    print("  ⚡ SM COMMAND CENTER & TRI-TRACK PRODUCTIVITY OS")
    print("============================================================\033[0m")
    
    # 1. Clear stale ports
    os.system("fuser -k 8000/tcp 2>/dev/null || true")
    os.system("fuser -k 3000/tcp 2>/dev/null || true")
    time.sleep(0.5)

    # 2. Find Python Interpreter
    py_bin = sys.executable
    venv_py = os.path.join(BACKEND_DIR, "venv", "bin", "python")
    fallback_py = "/home/saransh/command_center_backend/venv/bin/python"
    
    if os.path.exists(venv_py):
        py_bin = venv_py
    elif os.path.exists(fallback_py):
        py_bin = fallback_py

    # 3. Start Backend
    print("\033[0;36m[1/2] Starting FastAPI Backend (Port 8000)...\033[0m")
    backend_p = subprocess.Popen(
        [py_bin, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=BACKEND_DIR
    )
    processes.append(backend_p)
    time.sleep(1)

    # 4. Start Frontend
    print("\033[0;36m[2/2] Starting React 18 + Vite Frontend (Port 3000)...\033[0m")
    frontend_p = subprocess.Popen(
        ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"],
        cwd=FRONTEND_DIR
    )
    processes.append(frontend_p)

    print("\n\033[0;32m🚀 READY! Open: http://localhost:3000\033[0m")
    print("Press Ctrl+C to terminate both servers.\n")

    for p in processes:
        p.wait()

if __name__ == "__main__":
    main()
