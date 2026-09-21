import React, { useState, useEffect } from 'react';
import { useAcademicStore } from './hooks/useAcademicStore';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import SemestersPanel from './components/SemestersPanel';
import PredictorPanel from './components/PredictorPanel';
import SyllabusPanel from './components/SyllabusPanel';
import FocusZone from './components/FocusZone';
import DeadlineTracker from './components/DeadlineTracker';
import ExpenseTracker from './components/ExpenseTracker';
import GradeSimulator from './components/GradeSimulator';
import CareerPanel from './components/CareerPanel';
import AdminPortal from './components/AdminPortal';
import AdvisorPanel from './components/AdvisorPanel';
import OnboardingModal from './components/OnboardingModal';
import LoginPage from './components/LoginPage';
import SearchModal from './components/SearchModal';
import { getActiveSession } from './services/authApi';

export default function App() {
  const store = useAcademicStore();
  const [bgParticles, setBgParticles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Generate floating background particles on mount
  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 6 + 2, // size in px
      left: Math.random() * 100, // left %
      bottom: -10, // starts from bottom
      delay: Math.random() * 8, // animation delay
      duration: Math.random() * 15 + 10, // speed
      opacity: Math.random() * 0.3 + 0.1
    }));
    setBgParticles(generated);
  }, []);

  // Restore a previously authenticated account, including after a browser refresh.
  useEffect(() => {
    const session = getActiveSession();
    if (!store.studentId && session?.loginId) {
      store.handleLogin(session);
    }
  }, [store.handleLogin, store.studentId]);

  if (!store.studentId) {
    return <LoginPage onLoginSuccess={(account) => store.handleLogin(account)} />;
  }

  // 2. MAIN HUB APPARATUS WITH LEFT SIDEBAR LAYOUT
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#05050a] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden flex">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {/* Ambient glowing background blobs */}
      <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>

      {/* Floating particles */}
      {bgParticles.map(p => (
        <div
          key={p.id}
          className="bg-particle bg-indigo-500/10 dark:bg-indigo-500/5 pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity
          }}
        />
      ))}

      {/* Pinned Left Sidebar Container (Holds ALL Student Info & Nav) */}
      <Sidebar 
        studentId={store.studentId}
        studentName={store.studentName}
        handleLogout={store.handleLogout}
        theme={store.theme}
        setTheme={store.setTheme}
        currentCgpa={store.currentCgpa}
        targetCgpa={store.targetCgpa}
        earnedCredits={store.earnedCredits}
        calculatedAttendancePercent={store.calculatedAttendancePercent}
        hasEndSemSubscription={store.hasEndSemSubscription}
        activeTab={store.activeTab}
        setActiveTab={store.setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Right Content Workspace */}
      <div className="flex-1 md:pl-80 flex flex-col min-h-screen relative z-10 transition-all duration-300 w-full">
        {/* Top Header */}
        <TopHeader 
          activeTab={store.activeTab}
          studentId={store.studentId}
          currentCgpa={store.currentCgpa}
          theme={store.theme}
          setTheme={store.setTheme}
          handleLogout={store.handleLogout}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Workspace Container */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-6" tabIndex="-1">
          {store.activeTab === 'dashboard' && (
            <Dashboard 
              chartData={store.chartData}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              earnedCredits={store.earnedCredits}
              remainingCredits={store.remainingCredits}
              calculatedAttendancePercent={store.calculatedAttendancePercent}
              focusSessions={store.focusSessions}
              expenses={store.expenses}
              monthlyBudget={store.monthlyBudget}
              setActiveTab={store.setActiveTab}
            />
          )}

          {store.activeTab === 'advisor' && (
            <AdvisorPanel 
              advisorChat={store.advisorChat}
              addUserChat={store.addUserChat}
              clearChatLogs={store.clearChatLogs}
              currentSemester={store.currentSemester}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              calculatedAttendancePercent={store.calculatedAttendancePercent}
            />
          )}

          {store.activeTab === 'semesters' && (
            <SemestersPanel 
              pastSgpas={store.pastSgpas}
              updateSemesterSGPA={store.updateSemesterSGPA}
              attendanceLogs={store.attendanceLogs}
              setAttendanceLogs={store.setAttendanceLogs}
            />
          )}

          {store.activeTab === 'predictor' && (
            <PredictorPanel 
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              setTargetCgpa={store.setTargetCgpa}
              cgpaPredictor={store.cgpaPredictor}
              earnedCredits={store.earnedCredits}
              remainingCredits={store.remainingCredits}
              pastSgpas={store.pastSgpas}
            />
          )}

          {store.activeTab === 'pyqs' && (
            <SyllabusPanel 
              uploadedPyqs={store.uploadedPyqs}
              hasEndSemSubscription={store.hasEndSemSubscription}
              activateEndSemSubscription={store.activateEndSemSubscription}
              studentId={store.studentId}
            />
          )}

          {store.activeTab === 'focus' && (
            <FocusZone 
              focusSessions={store.focusSessions}
              setFocusSessions={store.setFocusSessions}
            />
          )}

          {store.activeTab === 'deadlines' && (
            <DeadlineTracker 
              deadlines={store.deadlines}
              setDeadlines={store.setDeadlines}
            />
          )}

          {store.activeTab === 'expenses' && (
            <ExpenseTracker 
              expenses={store.expenses}
              setExpenses={store.setExpenses}
              monthlyBudget={store.monthlyBudget}
              setMonthlyBudget={store.setMonthlyBudget}
            />
          )}

          {store.activeTab === 'gradesim' && (
            <GradeSimulator 
              currentSemester={store.currentSemester}
              simulatedGrades={store.simulatedGrades}
              setSimulatedGrades={store.setSimulatedGrades}
              simulatedSgpa={store.simulatedSgpa}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
            />
          )}

          {store.activeTab === 'career' && (
            <CareerPanel 
              careerPhase={store.careerPhase}
              currentSemester={store.currentSemester}
            />
          )}

          {store.activeTab === 'admin' && (
            <AdminPortal 
              uploadedPyqs={store.uploadedPyqs}
              setUploadedPyqs={store.setUploadedPyqs}
              studentId={store.studentId}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 dark:border-indigo-950/30 py-6 text-center text-xs text-slate-400 relative z-10 shrink-0 mt-auto">
          <p>Built by Anuj</p>
        </footer>
      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={store.setActiveTab}
      />

      {/* First-Time Login Onboarding Modal */}
      <OnboardingModal
        isOpen={!!store.studentId && !store.isOnboarded}
        studentId={store.studentId}
        initialTargetCgpa={store.targetCgpa}
        onComplete={store.saveOnboardingProfile}
      />
    </div>
  );
}

