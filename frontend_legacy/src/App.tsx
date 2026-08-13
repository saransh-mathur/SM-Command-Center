import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { ControlHub } from './components/ControlHub';
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
import { WorkspaceDashboard } from './components/dashboard/WorkspaceDashboard';
import { Omnibar } from './components/omnibar/Omnibar';

export const App: React.FC = () => {
  const { activeView, isDevMode } = useDashboard();

  return (
    <div className="min-h-screen bg-stone-50 bg-grid-pattern font-sans antialiased text-stone-800 flex flex-col justify-between relative pb-28">
      
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {activeView === 'cockpit' && (
          <motion.div layout className="flex flex-col gap-6">
            {isDevMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ControlHub />
              </motion.div>
            )}
            <motion.div layout>
              <WorkspaceDashboard />
            </motion.div>
          </motion.div>
        )}

        {activeView === 'career' && <CareerJobHuntView />}

        {activeView === 'courses' && <CourseLabView />}

        {activeView === 'mba' && <MBAStudyDashboard />}

      </main>

      {/* Floating Advisor Navigation Dock */}
      <FloatingDock />

      {/* Global Command Palette */}
      <Omnibar />

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
