import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  Sliders, 
  Shield, 
  FileText,
  Brain,
  Sun, 
  Moon, 
  LogOut,
  X,
  Award,
  Target,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { TOTAL_PROGRAM_CREDITS } from '../data/syllabus';
import { isAdminAccount } from '../services/authApi';

const NAV_SECTIONS = [
  {
    title: 'Academic Hub',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'advisor', label: 'ByteAI Advisor 🤖', icon: Brain },
      { id: 'semesters', label: 'Semesters & SGPA', icon: BookOpen },
      { id: 'predictor', label: 'Target Estimator', icon: TrendingUp },
      { id: 'pyqs', label: 'Syllabus & PYQs', icon: FileText },
    ]
  },
  {
    title: 'Student Life',
    items: [
      { id: 'focus', label: 'Focus Zone ⏱️', icon: Clock },
      { id: 'deadlines', label: 'Deadline Planner 📅', icon: Calendar },
      { id: 'expenses', label: 'Pocket Budget 💰', icon: DollarSign },
      { id: 'gradesim', label: 'Grade Simulator 📊', icon: Sliders },
    ]
  },
  {
    title: 'Career & Systems',
    items: [
      { id: 'career', label: 'Career Roadmap 🚀', icon: Briefcase },
      { id: 'admin', label: 'Admin Console ⚙️', icon: Shield, adminOnly: true },
    ]
  }
];

export default function Sidebar({
  studentId,
  studentName = '',
  handleLogout,
  theme,
  setTheme,
  currentCgpa,
  targetCgpa,
  earnedCredits = 0,
  calculatedAttendancePercent = 0,
  hasEndSemSubscription = false,
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) {
  const isAdmin = isAdminAccount({ loginId: studentId });
  const creditsPct = Math.min((earnedCredits / TOTAL_PROGRAM_CREDITS) * 100, 100);
  
  const getCgpaBadgeColor = (val) => {
    const num = parseFloat(val);
    if (!num) return 'from-slate-500 to-slate-700';
    if (num >= 8.5) return 'from-emerald-500 to-teal-600';
    if (num >= 7.5) return 'from-indigo-500 to-purple-600';
    if (num >= 6.5) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-80 bg-[#e6ecf5] dark:bg-[#0c0e1a] neu-flat
        border-r border-slate-300/30 dark:border-slate-800 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-6">
          
          {/* 1. Header / Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 neu-circle flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <GraduationCap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">ByteStudy</h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded neu-button text-indigo-600 dark:text-indigo-300">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">B.Tech CS & IT Navigator</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-xl neu-button text-slate-400 hover:text-slate-600"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2. STUDENT INFO CARD */}
          <div className="p-4 neu-flat relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 neu-circle flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs">
                  {studentName ? studentName.substring(0, 2).toUpperCase() : studentId ? studentId.substring(0, 2).toUpperCase() : 'ST'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">
                    {studentName || 'Student Scholar'}
                  </p>
                  <p className="text-[10px] font-mono font-semibold text-slate-400 truncate max-w-[130px]">
                    ID: {studentId}
                  </p>
                </div>
              </div>
              
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${isAdmin ? 'from-amber-500 to-rose-500' : 'from-indigo-500 to-purple-600'}`}>
                {isAdmin ? 'ADMIN' : 'CS & IT'}
              </span>
            </div>

            {/* CGPA & Target Metrics */}
            <div className="grid grid-cols-2 gap-2 my-2">
              <div className="p-2.5 rounded-xl neu-inset text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-slate-400 mb-0.5">
                  <Award size={11} className="text-indigo-500" /> Current
                </div>
                <div className="text-sm font-black text-indigo-600 dark:text-indigo-300">
                  {currentCgpa > 0 ? currentCgpa : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl neu-inset text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-slate-400 mb-0.5">
                  <Target size={11} className="text-amber-500" /> Target
                </div>
                <div className="text-sm font-black text-amber-500">
                  {targetCgpa || '8.50'}
                </div>
              </div>
            </div>

            {/* Credit Progress Meter */}
            <div className="space-y-1.5 pt-1 border-t border-slate-300/40 dark:border-slate-800">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Degree Progress</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">
                  {earnedCredits}/{TOTAL_PROGRAM_CREDITS} CR ({creditsPct.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${creditsPct}%` }}
                />
              </div>
            </div>

            {/* Attendance & Subscription indicators */}
            <div className="mt-2 space-y-1 pt-1.5 border-t border-slate-300/40 dark:border-slate-800 text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} className={calculatedAttendancePercent >= 75 ? "text-emerald-500" : "text-amber-500"} />
                  Attendance:
                </span>
                <span className={`font-bold ${calculatedAttendancePercent >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                  {calculatedAttendancePercent}%
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles size={12} className={hasEndSemSubscription ? "text-emerald-500" : "text-amber-500"} />
                  End-Sem Pass:
                </span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                  hasEndSemSubscription 
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-amber-500/20 text-amber-500"
                }`}>
                  {hasEndSemSubscription ? "VIP ACTIVE 🌟" : "UPGRADE (₹99)"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. GROUPED NAVIGATION SECTIONS */}
          <nav className="space-y-5" aria-label="Primary navigation">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                  {section.title}
                </p>
                
                <div className="space-y-1.5">
                  {section.items.map(({ id, label, icon: Icon, adminOnly }) => {
                    if (adminOnly && !isAdmin) return null;
                    const isActive = activeTab === id;

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveTab(id);
                          setIsOpen(false);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`
                          w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold
                          transition-all duration-200 cursor-pointer group relative overflow-hidden
                          ${isActive 
                            ? 'neu-button-active text-indigo-600 dark:text-indigo-300 font-bold' 
                            : 'neu-button text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={`
                            p-1.5 rounded-xl transition-colors
                            ${isActive 
                              ? 'text-indigo-600 dark:text-indigo-300' 
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'
                            }
                          `}>
                            <Icon size={15} />
                          </div>
                          <span>{label}</span>
                        </div>

                        {isActive && (
                          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 relative z-10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

        </div>

        {/* 4. SIDEBAR FOOTER (Theme & Logout) */}
        <div className="p-4 border-t border-slate-300/40 dark:border-slate-800 space-y-2 bg-[#e6ecf5] dark:bg-[#0c0e1a]">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl neu-button text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-500" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl neu-button text-xs font-semibold text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-1">
            ByteStudy Scholar Suite © 2026
          </div>
        </div>

      </aside>
    </>
  );
}
