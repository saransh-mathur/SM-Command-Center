"use client";

import React, { useState, useEffect } from "react";
import {
 Activity,
 Cpu,
 Database,
 Terminal,
 Play,
 RefreshCw,
 Server,
 Zap,
 CheckCircle2,
 AlertTriangle,
 XCircle,
 Search,
} from "lucide-react";
import { ReminderBar } from "../components/ReminderBar";
import { GlobalMBATimer } from "../components/GlobalMBATimer";
import { useDashboard } from "@/context/DashboardContext";
import { MBAStudyDashboard } from "@/components/mba/MBAStudyDashboard";
import { CourseLabView } from "@/components/courses/CourseLabView";
import { CareerJobHuntView } from "@/components/career/CareerJobHuntView";
import { CleanDevModal } from "@/components/modals/CleanDevModal";
import { MicroStartModal } from "@/components/modals/MicroStartModal";
import { BreathworkModal } from "@/components/modals/BreathworkModal";
import { AdvisorModal } from "@/components/modals/AdvisorModal";
import { DiagnosticReportModal } from "@/components/modals/DiagnosticReportModal";
import { AntiProcrastinationRouletteModal } from "@/components/modals/AntiProcrastinationRouletteModal";
import { ToastContainer } from "@/components/ToastContainer";
import { Q1ControllableInputs } from "@/components/quadrants/Q1ControllableInputs";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { Login } from "@/components/auth/Login";
import { CockpitGrid } from "@/components/dashboard/CockpitGrid";

interface Service {
 id: string;
 name: string;
 category: string;
 status: "healthy" | "degraded" | "down";
 latency: number;
}

interface LogEntry {
 id: string;
 time: string;
 level: "INFO" | "WARN" | "ERR";
 source: string;
 message: string;
}

export default function CommandCenter() {
  const { 
    activeView, setActiveView, 
    executeCleanDevMode, 
    telemetry, containers,
    isSetupCompleted, globalConfig,
    isAuthenticated, isAuthLoading, logout
  } = useDashboard();

  const [logs, setLogs] = useState<LogEntry[]>([]);

 const [logFilter, setLogFilter] = useState<"ALL" | "INFO" | "WARN" | "ERR">("ALL");

  const addLog = (level: "INFO" | "WARN" | "ERR", source: string, message: string) => {
    const time = new Date().toLocaleTimeString("en-GB");
    const newLog: LogEntry = { id: Math.random().toString(36).substring(2, 9), time, level, source, message };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const handleTriggerAction = async (actionName: string) => {
    if (actionName === "Flush Cache") {
      addLog("INFO", "redis", "CACHE_FLUSH command issued. Cleared 142 keys.");
    } else if (actionName === "Restart Ollama") {
      addLog("WARN", "ollama", "Restarting local Ollama LLM service...");
      setTimeout(() => addLog("INFO", "ollama", "Ollama service re-initialized successfully."), 800);
    } else if (actionName === "Toggle AGY Dashboard") {
      addLog("INFO", "system", "Toggling AGY Dashboard service...");
      try {
        const res = await fetch('http://localhost:8000/api/system/toggle-agy', { method: 'POST' });
        const data = await res.json();
        addLog("INFO", "system", `AGY Dashboard is now ${data.status.toUpperCase()}.`);
        
        if (data.status === 'active') {
          setTimeout(() => {
            window.open('http://localhost:8501', '_blank');
          }, 1500); // Give the service a moment to start
        }
      } catch (err) {
        addLog("ERR", "system", "Failed to toggle AGY Dashboard.");
      }
    } else if (actionName === "Purge Dev Data") {
      addLog("WARN", "system", "Executing Clean Dev Purge...");
      try {
        const res = await executeCleanDevMode();
        if (res) {
          addLog("INFO", "system", `Purged! Reclaimed ${res.freedMb}MB RAM.`);
        }
      } catch (e) {
        addLog("ERR", "system", "Clean dev purge failed.");
      }
    }
  };

  const filteredLogs = logs.filter((log) => (logFilter === "ALL" ? true : log.level === logFilter));

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isSetupCompleted === false) {
    return <SetupWizard />;
  }

  // Filter available tabs based on globalConfig
  const availableTabs = [
    { id: "cockpit", label: "Overview" },
    { id: "mba", label: "MBA Copilot" },
    { id: "courses", label: "Course Lab" },
    { id: "career", label: "Career & Jobs" },
  ].filter(tab => globalConfig?.activeModules?.includes(tab.id) ?? true);

  return (
 <div className="min-h-screen bg-[#09090b] text-zinc-100 font-mono p-4 md:p-6 select-none">
 {/* HEADER BAR */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
 <div className="flex items-center gap-3">
 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
 <h1 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
 {globalConfig?.dashboardName || "SM Command Center"} <span className="text-zinc-500 text-xs font-normal">v2.4.0</span>
 </h1>
 </div>

 <div className="flex items-center gap-4 text-xs text-zinc-400">
 <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-md">
 <Search className="w-3.5 h-3.5 text-zinc-500" />
 <span>Search or run command...</span>
 <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
 </div>
 <span className="hidden sm:inline-block text-zinc-600">|</span>
 <span className="text-zinc-400">LOCAL WORKSTATION</span>
 <button onClick={logout} className="ml-2 text-xs px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded hover:bg-rose-500/20 transition-colors">
    Logout
  </button>
 </div>
 </header>

      <GlobalMBATimer />

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-6 border-b border-zinc-800/60 mb-6 px-1">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`pb-2.5 pt-3 text-xs font-medium border-b-2 transition-colors ${
              activeView === tab.id
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* GLOBAL REMINDER NOTIFICATION BAR */}
      <ReminderBar />

      {/* DYNAMIC VIEWS */}
      {activeView === "cockpit" && (
        <CockpitGrid
          logs={logs}
          filteredLogs={filteredLogs}
          logFilter={logFilter}
          setLogFilter={setLogFilter}
          handleTriggerAction={handleTriggerAction}
        />
      )}
 {activeView === "career" && <CareerJobHuntView />}
 {activeView === "courses" && <CourseLabView />}
 {activeView === "mba" && <MBAStudyDashboard />}

 {/* Interactive Modals from Context */}
 <AntiProcrastinationRouletteModal />
 <MicroStartModal />
 <BreathworkModal />
 <CleanDevModal />
 <AdvisorModal />
 <DiagnosticReportModal />
 <ToastContainer />

 </div>
 );
}
