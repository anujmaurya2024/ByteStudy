import React from 'react';
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart
} from 'recharts';
import { Award, BookOpen, Target, TrendingUp, Star, Brain, Landmark, ArrowUpRight, CalendarDays, ClipboardCheck, SlidersHorizontal, Timer } from 'lucide-react';
import { TOTAL_PROGRAM_CREDITS, SYLLABUS } from '../data/syllabus';

// ---- Custom Chart Tooltip ----
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#0f0f1c] border border-slate-200 dark:border-indigo-950/40 p-4 rounded-xl shadow-xl backdrop-blur-md">
      <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
      {payload.map((entry) => {
        if (entry.value === null) return null;
        const color = entry.dataKey === 'sgpa' ? '#6366f1' : entry.dataKey === 'cgpa' ? '#10b981' : '#f97316';
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs py-0.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---- Stat Card Component ----
function StatCard({ icon: Icon, label, value, sub, colorClass, borderClass, onClick }) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`glass-card glass-card-hover shine-effect p-5 flex flex-col justify-between border text-left ${borderClass} ${onClick ? 'cursor-pointer w-full' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight tabular-nums">{value}</p>
        <p className="text-xs text-slate-500 mt-1.5 truncate">{sub}</p>
      </div>
      {onClick && <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">View details <ArrowUpRight size={14} /></span>}
    </Component>
  );
}

export default function Dashboard({
  chartData,
  currentCgpa,
  targetCgpa,
  earnedCredits,
  remainingCredits,
  calculatedAttendancePercent,
  focusSessions,
  expenses,
  monthlyBudget,
  setActiveTab
}) {
  const creditsPct = Math.min((earnedCredits / TOTAL_PROGRAM_CREDITS) * 100, 100);

  // Focus Stats
  const totalFocusMin = focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const focusHrs = (totalFocusMin / 60).toFixed(1);

  // Expense Stats
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthExpenses = expenses
    .filter(e => e.date.substring(0, 7) === currentMonth)
    .reduce((acc, e) => acc + e.amount, 0);

  const budgetProgress = monthlyBudget > 0 ? (thisMonthExpenses / monthlyBudget) * 100 : 0;

  // Check if there is completed semester data
  const hasData = chartData.some(d => d.sgpa !== null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Award}
          label="Current CGPA"
          value={currentCgpa}
          sub={`Across ${earnedCredits} completed credits`}
          colorClass="bg-gradient-to-br from-indigo-500 to-purple-600"
          borderClass="border-indigo-500/10 dark:border-indigo-500/20"
          onClick={() => setActiveTab('semesters')}
        />
        <StatCard
          icon={Target}
          label="Target CGPA"
          value={targetCgpa}
          sub="Predict required future SGPAs"
          colorClass="bg-gradient-to-br from-orange-500 to-amber-500"
          borderClass="border-orange-500/10 dark:border-orange-500/20"
          onClick={() => setActiveTab('predictor')}
        />
        <StatCard
          icon={BookOpen}
          label="Completed Credits"
          value={`${earnedCredits} / ${TOTAL_PROGRAM_CREDITS}`}
          sub={`${remainingCredits} program credits left`}
          colorClass="bg-gradient-to-br from-emerald-500 to-teal-500"
          borderClass="border-emerald-500/10 dark:border-emerald-500/20"
          onClick={() => setActiveTab('semesters')}
        />
        <StatCard
          icon={TrendingUp}
          label="Logged Attendance"
          value={calculatedAttendancePercent !== 'N/A' ? `${calculatedAttendancePercent}%` : 'N/A'}
          sub="Requires >= 75% for examinations"
          colorClass={
            calculatedAttendancePercent !== 'N/A'
              ? parseFloat(calculatedAttendancePercent) >= 75
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-rose-500 to-red-600'
              : 'bg-gradient-to-br from-slate-500 to-slate-600'
          }
          borderClass="border-slate-500/10 dark:border-slate-500/20"
          onClick={() => setActiveTab('semesters')}
        />
      </div>

      {/* Main Charts & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CGPA & SGPA Timeline Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Academic Growth Timeline</h3>
              <p className="text-xs text-slate-500">Visualization of SGPA vs running CGPA across B.Tech semesters</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-indigo-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> SGPA
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> CGPA
              </span>
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                <span className="w-4 h-0.5 bg-orange-500 border-dashed" /> Target ({targetCgpa})
              </span>
            </div>
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-slate-200 dark:border-indigo-950/20 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/10">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Semester Grades Entered Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Head over to the <span className="text-indigo-500 font-bold cursor-pointer" onClick={() => setActiveTab('semesters')}>Semesters</span> tab and enter some SGPAs to generate your growth charts.
              </p>
              <button type="button" onClick={() => setActiveTab('semesters')} className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Add semester grades <ArrowUpRight size={15} className="inline" />
              </button>
            </div>
          ) : (
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    axisLine={{ stroke: 'rgba(99,102,241,0.1)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    axisLine={{ stroke: 'rgba(99,102,241,0.1)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {targetCgpa && (
                    <ReferenceLine 
                      y={parseFloat(targetCgpa)} 
                      stroke="#f97316" 
                      strokeDasharray="5 5" 
                      strokeWidth={1.5}
                    />
                  )}
                  <Area 
                    name="SGPA"
                    type="monotone" 
                    dataKey="sgpa" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSgpa)"
                  />
                  <Line 
                    name="CGPA"
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#34d399', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Credit Tracker & Student Life Snapshot */}
        <div className="space-y-6">
          {/* Credit Progress */}
          <div className="glass-card p-6 border border-emerald-500/10 dark:border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-500" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Degree Credits Path</h4>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {creditsPct.toFixed(0)}% Completed
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-surface-600 h-3 rounded-full overflow-hidden">
                <div 
                  className="progress-bar-fill h-full"
                  style={{ width: `${creditsPct}%`, background: 'var(--gradient-success)' }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0 Credits</span>
                <span className="font-bold text-slate-600 dark:text-slate-400">{earnedCredits} Completed</span>
                <span>{TOTAL_PROGRAM_CREDITS} cr</span>
              </div>
            </div>

            {/* Semester checklist bar */}
            <div className="grid grid-cols-8 gap-1.5 mt-6 pt-4 border-t border-slate-100 dark:border-indigo-950/20">
              {SYLLABUS.map(sem => {
                const cumulative = SYLLABUS.slice(0, sem.semester).reduce((acc, s) => acc + s.totalCredits, 0);
                const isCompleted = earnedCredits >= cumulative;
                return (
                  <div key={sem.semester} className="flex flex-col items-center">
                    <div 
                      className={`w-full h-1.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-200 dark:bg-surface-500'}`}
                    />
                    <span className="text-[11px] font-bold text-slate-500 mt-1">S{sem.semester}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Life Widgets snapshot */}
          <div className="glass-card p-6 border border-indigo-500/10 dark:border-indigo-500/20 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star size={15} className="text-indigo-500" />
              Focus & Budget Status
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Focus snapshot */}
              <button type="button" className="bg-slate-50 dark:bg-surface-700/30 border border-slate-150 dark:border-indigo-950/10 p-3.5 rounded-xl text-center cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={() => setActiveTab('focus')}>
                <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
                  <Brain size={12} className="text-purple-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Mind Focus</span>
                </div>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white font-mono">{focusHrs} hrs</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Total study sessions</p>
              </button>

              {/* Expense snapshot */}
              <button type="button" className="bg-slate-50 dark:bg-surface-700/30 border border-slate-150 dark:border-indigo-950/10 p-3.5 rounded-xl text-center cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={() => setActiveTab('expenses')}>
                <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
                  <Landmark size={12} className="text-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Expense</span>
                </div>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white font-mono">₹{thisMonthExpenses}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{budgetProgress.toFixed(0)}% of monthly</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Ref Scale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick action navigators */}
        <div className="glass-card p-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span>✨</span> Quick Student Operations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Check Study Focus Zone', tab: 'focus', icon: '⏱️', desc: 'Pomodoro study session logs' },
              { label: 'Log Class Attendance', tab: 'semesters', icon: '📅', desc: 'Log daily present/absent classes' },
              { label: 'Check Semester Deadlines', tab: 'deadlines', icon: '📝', desc: 'Assignment and exam deadlines' },
              { label: 'Simulate Final GPA', tab: 'gradesim', icon: '📊', desc: 'Predict grades for active subjects' },
            ].map(({ label, tab, icon, desc }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-surface-700/25 border border-slate-150 dark:border-surface-600/10 hover:border-indigo-500/30 hover:bg-slate-100 dark:hover:bg-surface-700/40 transition-all text-left group cursor-pointer"
              >
                <span className="text-xl bg-white dark:bg-surface-600 p-2 rounded-lg shrink-0 shadow-sm">{icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Grade Reference Guide */}
        <div className="glass-card p-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span>💡</span> SGPA Grade Value Scale
          </h4>
          <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
            The SGPA and CGPA metrics operate on a standard 10-point credit scaling methodology. Select grades map to points:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[
              { grade: 'O', point: '10', label: 'Outstanding', color: 'text-emerald-500 bg-emerald-500/10' },
              { grade: 'A+', point: '9', label: 'Excellent', color: 'text-teal-500 bg-teal-500/10' },
              { grade: 'A', point: '8', label: 'Very Good', color: 'text-sky-500 bg-sky-500/10' },
              { grade: 'B+', point: '7', label: 'Good', color: 'text-indigo-500 bg-indigo-500/10' },
              { grade: 'B', point: '6', label: 'Above Avg', color: 'text-yellow-500 bg-yellow-500/10' },
              { grade: 'C', point: '5', label: 'Average', color: 'text-orange-500 bg-orange-500/10' },
              { grade: 'P', point: '4', label: 'Pass', color: 'text-pink-500 bg-pink-500/10' },
              { grade: 'F', point: '0', label: 'Fail', color: 'text-rose-500 bg-rose-500/10' }
            ].map(({ grade, point, label, color }) => (
              <div key={grade} className={`rounded-xl p-2.5 text-center ${color} border border-transparent hover:border-current/10 transition-all flex flex-col justify-center min-w-0`} title={label}>
                <div className="font-extrabold text-sm leading-none">{grade}</div>
                <div className="text-[9px] font-bold opacity-80 mt-1">{point} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Handcrafted developer credit note */}
      <div className="glass-card p-4 text-center border border-slate-200 dark:border-indigo-950/10 bg-slate-50/20 dark:bg-surface-800/5 mt-4 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Project Status:</span>
        <span className="badge bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">ByteStudy Beta v1.2</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">•</span>
        <span className="text-[10px] text-slate-500 font-medium">Built by Anuj</span>
      </div>
    </div>
  );
}
