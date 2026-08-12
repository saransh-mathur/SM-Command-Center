# ⚡ SM COMMAND CENTER & TRI-TRACK PRODUCTIVITY OS

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.12](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Linux](https://img.shields.io/badge/Linux_x86__64-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://kernel.org/)

> **A futuristic, unified local operating system designed for engineers navigating high-intensity dual-track commitments:** balancing **Job Hunting**, **MBA Coursework (NMIMS Sem 1)**, and **Technical Skill Backlogs (Udemy)** while maintaining peak biological focus and zero-friction execution.

---

## 🌟 Full-Stack Architecture

```mermaid
graph TD
    subgraph Frontend["🖥️ Frontend (React 18 + TypeScript + Vite :3000)"]
        UI1["⚡ Main Cockpit (4-Quadrant Grid)"]
        UI2["💼 Career & Job Hunt Launchpad"]
        UI3["💻 Course Lab & Udemy Unblocker"]
        UI4["🎓 MBA Study Copilot (6 Subjects)"]
        UI5["🎲 'Unblock Me' Anti-Procrastination Roulette"]
    end

    subgraph Backend["🔌 Backend (FastAPI Async Engine :8000)"]
        API1["/api/telemetry (Host Hardware & Thermals)"]
        API2["/api/state/daily-inputs (Tsuna Inputs)"]
        API3["/api/mba/* (RAG Semantic Search & Notes)"]
        API4["/api/containers (Docker Watchdog)"]
    end

    subgraph Storage["💾 Dual-State Database Layer"]
        DB1[("PostgreSQL Primary")]
        DB2[("Async SQLite Fallback")]
    end

    subgraph Host["🌡️ Linux Host Telemetry"]
        HW1["CPU / GPU Thermals (Nitro AN515)"]
        HW2["NBFC Fan Controller Daemon"]
        HW3["RAM & Swap Memory Monitor"]
    end

    UI1 <--> API1
    UI2 <--> API2
    UI3 <--> API2
    UI4 <--> API3
    Backend <--> DB1
    Backend -.->|Auto Fallback| DB2
    API1 <--> Host
```

---

## 🚀 Key Modules & Feature Highlights

### 1. 💼 Career & Job Hunt Launchpad
- **Interactive Kanban Pipeline:** Track applications across 5 stages (`Targeted` $\rightarrow$ `Resume Tailored` $\rightarrow$ `Outreach Sent` $\rightarrow$ `Interviewing` $\rightarrow$ `Offer`).
- **1-Click Cold Outreach Bank:** Ready-to-copy, high-converting templates for LinkedIn recruiters, engineering managers, alumni coffee chats, and post-interview follow-ups.
- **Star Project Pitch Cards:** Instant copyable architecture summaries, tech stacks, and quantitative impact metrics.

### 2. 💻 Course Lab & Udemy Unblocker
- **1 Video = 1 Code Snippet Protocol:** Eliminates tutorial fatigue by transforming monolithic 30-hour courses into 10-minute micro-sprints.
- **10-Min Sprint Studio:** Integrated code editor with live countdown timer, commit message staging, and instant celebratory feedback.
- **AI Cheat-Sheet Generator:** Bypasses passive video watching by generating 3-bullet mental models, 5-minute code challenges, and active recall drills for any topic.

### 3. 🎓 MBA Study Copilot (NMIMS Sem 1)
- **6 Core Module Hub:** Financial Accounting, Quantitative Methods, Micro/Macro Economics, Organizational Behavior, Marketing Management, and Business Communication.
- **RAG Semantic Search:** Real-time semantic retrieval over academic lecture notes and formulas with cited references.

### 4. 🎲 Anti-Procrastination Roulette (<3-Min Protocol)
- Pinned in the Header and Q1 inputs. When decision fatigue strikes, one click rolls a single **sub-3-minute micro-task** across your 3 tracks, launching a focused timer with @Tsuna's low-friction coaching tips.

### 5. 🎯 Tri-Track Daily Controllable Inputs (@Tsuna Engine)
- Unified **Daily Momentum Score (0–100%)** tracking:
  - 💼 *Job Applications & Outreach*
  - 💻 *Udemy / Code Micro-Sprints*
  - 🎓 *MBA Flashcard & Formula Recall*
  - ⚡ *90-min Deep Dev Blocks*
- **7-Day Contribution Streak Heatmap** (GitHub-style) to build compounding consistency.

### 6. ⚡ Cognitive Energy & Nervous System (@Sky Engine)
- 90-minute ultradian focus timer with 10-minute context-switch buffers.
- Interactive **Physiological Sigh (30s)** and **4-7-8 Breathwork** modals for autonomic nervous system regulation.
- **Dynamic Energy Switcher:** [🌅 Morning Peak | ☀️ Midday Build | 🌙 Evening Diffuse].

### 7. 🖥️ Hardware Watchdog & Laptop Thermals
- Real-time CPU/GPU thermals, RAM/Swap metrics, and power draw for Acer Nitro AN515.
- Integrated **NBFC Linux Fan Profile Selector** (Auto / Performance / Quiet).
- **Clean Dev Mode:** 1-click Docker memory reclamation freeing up to 1.4GB RAM.

---

## 🏛️ Virtual Advisory Board Integration

The system natively embeds persona-driven coaching from Saransh's curated Advisory Board:

| Advisor | Domain | Role & Behavioral Directive |
| :--- | :--- | :--- |
| **🎓 @Ren** | System Design, Neuro-Learning & MBA Synthesis | Enforces Active Recall, Feynman 3-Stage Explanations, and business KPI translation. |
| **⚡ @Sky** | Neuroscience of Focus & Nervous System | Regulates 90-min ultradian cycles, dopamine baselines, and physiological calm. |
| **🎯 @Tsuna** | Frictionless Productivity & Execution | Enforces the 5-Minute Rule, anti-overengineering, and sub-2-minute starting tasks. |

---

## 🛠️ Monorepo Structure

```text
SM-Command-Center/
├── frontend/                     # 🖥️ React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── career/           # Kanban Pipeline & Outreach Bank
│   │   │   ├── courses/          # Course Lab & 10-Min Sprint Studio
│   │   │   ├── mba/              # MBA Study Copilot & Markdown Viewer
│   │   │   ├── modals/           # Roulette, Breathwork, Micro-Start, CleanDev
│   │   │   ├── quadrants/        # Q1 (Inputs), Q2 (Gym), Q3 (Hardware), Q4 (Energy)
│   │   │   ├── Header.tsx        # 4-Way Nav, Energy Switcher, Roulette trigger
│   │   │   └── FloatingDock.tsx  # Quick Advisor summoning dock
│   │   ├── context/              # DashboardContext (Unified state & fallback)
│   │   ├── data/                 # Seed datasets (Career, Courses, DSA, MBA)
│   │   └── App.tsx               # Root view router & layout container
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # 🔌 FastAPI Asynchronous Python Backend
│   ├── routers/
│   │   ├── telemetry.py          # Host CPU/GPU/Fan telemetry collector
│   │   ├── system.py             # NBFC fan profile switcher
│   │   ├── containers.py         # Docker orchestrator
│   │   ├── state.py              # Daily controllable inputs state
│   │   └── mba.py                # MBA semantic notes & RAG router
│   ├── database.py               # Async SQLAlchemy with SQLite fallback
│   ├── main.py                   # App lifecycle & CORS middleware
│   └── requirements.txt
│
├── advisors/                     # 🏛️ Virtual Advisory Board Profiles
│   ├── ren.md
│   ├── sky.md
│   └── tsuna.md
│
├── ADVISORY_BOARD.md             # Virtual Advisory Board System Blueprint
├── start.sh                      # 🚀 1-Command Unified Shell Launcher
├── launch.py                     # 🐍 1-Command Python Launcher
└── .gitignore                    # Root monorepo gitignore
```

---

## ⚡ Quickstart (1 Command)

### Prerequisites
- **Node.js** $\ge$ 18.x
- **Python** $\ge$ 3.10
- **Linux x86_64** (Ubuntu / Debian / Arch)

### Launch Everything
```bash
# Clone the repository
git clone https://github.com/saranshmathur/SM-Command-Center.git
cd SM-Command-Center

# 1-Command launch (starts backend :8000 & frontend :3000)
chmod +x start.sh
./start.sh
```
*or launch via Python:*
```bash
python3 launch.py
```

---

## 🌐 Endpoints & URLs

- **🖥️ Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- **🔌 Backend API:** [http://localhost:8000](http://localhost:8000)
- **📚 Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **🩺 Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 👤 Author & Architecture Lead
**Saransh Mathur**  
*Backend & AI Systems Engineer • MBA Candidate (NMIMS Sem 1)*  
- GitHub: [@saranshmathur](https://github.com/saranshmathur)

---

## 📄 License
This project is open-source and licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

Copyright © 2026 Saransh Mathur.
