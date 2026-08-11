import React from 'react';
import { Header } from './components/Header';
import { ControlHub } from './components/ControlHub';
import { Q1ControllableInputs } from './components/quadrants/Q1ControllableInputs';
import { Q2KnowledgeGym } from './components/quadrants/Q2KnowledgeGym';
import { Q3HardwareWatchdog } from './components/quadrants/Q3HardwareWatchdog';
import { Q4CognitiveEnergy } from './components/quadrants/Q4CognitiveEnergy';
import { FloatingDock } from './components/FloatingDock';
import { ToastContainer } from './components/ToastContainer';
import { MicroStartModal } from './components/modals/MicroStartModal';
import { BreathworkModal } from './components/modals/BreathworkModal';
import { CleanDevModal } from './components/modals/CleanDevModal';
import { AdvisorModal } from './components/modals/AdvisorModal';
import { DiagnosticReportModal } from './components/modals/DiagnosticReportModal';
import { AntiProcrastinationRouletteModal } from './components/modals/AntiProcrastinationRouletteModal';

import { CareerJobHuntView } from './components/career/CareerJobHuntView';
import { CourseLabView } from './components/courses/CourseLabView';
import { MBAStudyDashboard } from './components/mba/MBAStudyDashboard';
import { useDashboard } from './context/DashboardContext';

export const App: React.FC = () => {
  const { activeView } = useDashboard();

  return (
    <div className="min-h-screen bg-[#0B0F17] bg-grid-pattern text-slate-100 flex flex-col justify-between relative pb-28">
      
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {activeView === 'cockpit' && (
          <>
            {/* Master Control Deck: AGY Dashboard & Laptop Health */}
            <ControlHub />

            {/* 4-Quadrant 2x2 Equal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Quadrant 1: 🎯 Tri-Track Daily Controllable Inputs (@Tsuna) */}
              <div className="h-full">
                <Q1ControllableInputs />
              </div>

              {/* Quadrant 2: 🧠 Dual-Track Knowledge & Drill Gym (@Ren) */}
              <div className="h-full">
                <Q2KnowledgeGym />
              </div>

              {/* Quadrant 3: 🖥️ Hardware & Dev Environment (Thermals / NBFC / Docker) */}
              <div className="h-full">
                <Q3HardwareWatchdog />
              </div>

              {/* Quadrant 4: ⚡ Cognitive Energy & Nervous System (@Sky) */}
              <div className="h-full">
                <Q4CognitiveEnergy />
              </div>

            </div>
          </>
        )}

        {activeView === 'career' && <CareerJobHuntView />}

        {activeView === 'courses' && <CourseLabView />}

        {activeView === 'mba' && <MBAStudyDashboard />}

      </main>

      {/* Floating Advisor Navigation Dock */}
      <FloatingDock />

      {/* Interactive Modals */}
      <AntiProcrastinationRouletteModal />
      <MicroStartModal />
      <BreathworkModal />
      <CleanDevModal />
      <AdvisorModal />
      <DiagnosticReportModal />

      {/* Toasts Feedback Container */}
      <ToastContainer />

    </div>
  );
};

export default App;
