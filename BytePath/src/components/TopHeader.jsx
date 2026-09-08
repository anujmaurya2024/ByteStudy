import React from 'react';
import { Menu, Sun, Moon, LogOut, Search, Sparkles } from 'lucide-react';

const TAB_TITLES = {
  dashboard: { title: 'Academic Dashboard', subtitle: 'CGPA trajectory, credit weightage, and semester analytics' },
  advisor: { title: 'ByteAI Advisor 🤖', subtitle: 'AI-powered course guidance & personalized study plans' },
  semesters: { title: 'Semesters & Attendance', subtitle: 'Log SGPAs, track course credits & lecture attendance %' },
  predictor: { title: 'Target CGPA Estimator', subtitle: 'Calculate required future SGPAs using the 196-credit formula' },
  pyqs: { title: 'Syllabus & PYQ Library', subtitle: 'Access course curriculum notes and previous year question papers' },
  focus: { title: 'Focus Zone ⏱️', subtitle: 'Pomodoro timer and deep study session manager' },
  deadlines: { title: 'Deadline Planner 📅', subtitle: 'Track assignments, lab reports, and exam dates' },
  expenses: { title: 'Pocket Budget 💰', subtitle: 'Manage student monthly expenses and budget limits' },
  gradesim: { title: 'Grade Simulator 📊', subtitle: 'Simulate course letter grades to project upcoming SGPAs' },
  career: { title: 'Career Roadmap 🚀', subtitle: 'Full-stack & CS career launchpad linked to course prerequisites' },
  admin: { title: 'Admin Portal ⚙️', subtitle: 'Publish question papers, manage resources, and configure syllabus' }
};

export default function TopHeader({
  activeTab,
  studentId,
  currentCgpa,
  theme,
  setTheme,
  handleLogout,
  onOpenSidebar,
  onOpenSearch
}) {
  const tabInfo = TAB_TITLES[activeTab] || { title: 'ByteStudy Hub', subtitle: 'CS & IT Scholar Portal' };

  return (
    <header className="sticky top-0 z-30 bg-[#e6ecf5]/90 dark:bg-[#0c0e1a]/90 backdrop-blur-xl border-b border-slate-300/30 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden w-10 h-10 neu-button flex items-center justify-center text-slate-600 dark:text-slate-200"
            aria-label="Open Sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                {tabInfo.title}
              </h1>
              {activeTab === 'advisor' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                  <Sparkles size={10} /> AI Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {tabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center/Right: Global Search Button & Quick Metrics */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 neu-button text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-semibold transition cursor-pointer"
          >
            <Search size={15} className="text-indigo-500" />
            <span className="hidden sm:inline">Search courses, tools...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded neu-inset text-slate-500 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Roll ID */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 neu-inset">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
              ID: {studentId}
            </span>
          </div>

          {/* Quick CGPA Pill */}
          {parseFloat(currentCgpa) > 0 && (
            <div className="px-3 py-1 neu-button text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">CGPA</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-300 leading-tight">{currentCgpa}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 neu-button flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-all cursor-pointer"
            title="Toggle Light/Dark Theme"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 neu-button text-rose-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer font-semibold"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>

      </div>
    </header>
  );
}


