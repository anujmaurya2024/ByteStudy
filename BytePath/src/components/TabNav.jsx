import React from 'react';
import { 
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
  Brain
} from 'lucide-react';
import { isAdminAccount } from '../services/authApi';

const TABS = [
  // Academic Group
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Academic' },
  { id: 'advisor', label: 'ByteAI Advisor 🤖', icon: Brain, category: 'Academic' },
  { id: 'semesters', label: 'Semesters & Attendance', icon: BookOpen, category: 'Academic' },
  { id: 'predictor', label: 'Target Estimator', icon: TrendingUp, category: 'Academic' },
  { id: 'pyqs', label: 'Syllabus & PYQs', icon: FileText, category: 'Academic' },
  // Student Life Group
  { id: 'focus', label: 'Focus Zone ⏱️', icon: Clock, category: 'Student Life' },
  { id: 'deadlines', label: 'Deadline Planner 📅', icon: Calendar, category: 'Student Life' },
  { id: 'expenses', label: 'Pocket Budget 💰', icon: DollarSign, category: 'Student Life' },
  { id: 'gradesim', label: 'Grade Simulator 📊', icon: Sliders, category: 'Student Life' },
  // Career & Control
  { id: 'career', label: 'Career Roadmap 🚀', icon: Briefcase, category: 'Career' },
  { id: 'admin', label: 'Admin Console ⚙️', icon: Shield, category: 'Control', adminOnly: true },
];

export default function TabNav({ activeTab, setActiveTab, studentId }) {
  const isAdmin = isAdminAccount({ loginId: studentId });

  return (
    <nav className="sticky top-[73px] z-40 bg-white/90 dark:bg-[#0a0a12]/90 backdrop-blur-lg border-b border-slate-200 dark:border-indigo-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {TABS.map(({ id, label, icon: Icon, adminOnly }) => {
              if (adminOnly && !isAdmin) return null;
              
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold
                    whitespace-nowrap transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'tab-active' 
                      : 'tab-inactive border-slate-100 dark:border-surface-600/10'
                    }
                  `}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
