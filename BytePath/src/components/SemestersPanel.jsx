import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Circle, 
  BookOpen, 
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import { SYLLABUS, TYPE_COLORS } from '../data/syllabus';

function CourseBadge({ type }) {
  const cfg = TYPE_COLORS[type] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700/40' };
  return (
    <span className={`badge ${cfg.bg} ${cfg.text} border ${cfg.border} text-[9px] font-bold`}>
      {type}
    </span>
  );
}

function SemesterCard({ 
  semInfo, 
  sgpa, 
  onUpdateSgpa, 
  attendanceLogs, 
  onLogAttendance,
  isExpanded, 
  onToggle 
}) {
  const sgpaNum = parseFloat(sgpa);
  const hasSgpa = sgpa !== '' && sgpa !== undefined && !isNaN(sgpaNum);

  // Status mapping
  const status = hasSgpa ? 'complete' : 'upcoming'; // simplified status based on SGPA presence
  const statusColor = hasSgpa ? 'text-emerald-500' : 'text-slate-400';
  const StatusIcon = hasSgpa ? CheckCircle2 : Circle;

  // Grade color
  const gradeColor = hasSgpa
    ? sgpaNum >= 9 ? 'text-emerald-500 dark:text-emerald-400'
    : sgpaNum >= 8 ? 'text-teal-500 dark:text-teal-400'
    : sgpaNum >= 7 ? 'text-sky-500 dark:text-sky-400'
    : sgpaNum >= 6 ? 'text-yellow-500 dark:text-yellow-400'
    : 'text-orange-500'
    : 'text-slate-400';

  // Calculate dynamic attendance for subjects in this semester
  const semCourses = semInfo.courses;
  const semCourseCodes = semCourses.map(c => c.code);
  const semLogs = attendanceLogs.filter(log => semCourseCodes.includes(log.courseCode));
  
  const totalClasses = semLogs.length;
  const totalPresent = semLogs.filter(l => l.status === 'Present').length;
  const attendancePct = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(0) : null;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 border 
      ${hasSgpa ? 'border-emerald-500/10 dark:border-emerald-500/20' : 'border-slate-200 dark:border-indigo-950/20'}
    `}>
      {/* Header bar click to expand */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Semester circle indicator */}
          <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold text-xs
            ${hasSgpa 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
              : 'bg-slate-100 dark:bg-surface-650 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-indigo-950/20'
            }
          `}>
            <span className="text-[8px] opacity-70 font-semibold leading-none mb-0.5">SEM</span>
            <span className="text-base leading-none">{semInfo.semester}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusIcon size={12} className={statusColor} />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {hasSgpa ? 'Completed' : 'Upcoming / Active'}
              </span>
              <span className="text-xs text-slate-350 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 font-medium">{semInfo.totalCredits} Credits</span>
              <span className="text-xs text-slate-350 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 font-medium">{semInfo.courses.length} Courses</span>
            </div>

            {hasSgpa && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-500">Earned SGPA:</span>
                <span className={`text-base font-extrabold font-mono leading-none ${gradeColor}`}>{sgpaNum.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Attendance indicator pill */}
          {attendancePct !== null && (
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border
              ${parseInt(attendancePct) >= 75 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
              }
            `}>
              {attendancePct}% Attendance
            </div>
          )}

          <div className="text-slate-400 dark:text-slate-655 p-1 rounded-lg">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded Course logs details */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-indigo-950/20 px-4 py-4 space-y-4 animate-slide-up bg-slate-50/20 dark:bg-[#08080f]/10">
          {/* SGPA Input Form */}
          <div className="max-w-xs">
            <label htmlFor={`sgpa-input-${semInfo.semester}`} className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
              Grade SGPA (Leave empty if in-progress)
            </label>
            <input 
              id={`sgpa-input-${semInfo.semester}`}
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="e.g., 8.65"
              value={sgpa}
              onChange={(e) => onUpdateSgpa(semInfo.semester, e.target.value)}
              className="app-input font-mono text-sm"
            />
          </div>

          {/* Subjects Details */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-3">
              Courses & Attendance Loggers
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {semCourses.map(course => {
                const courseLogs = attendanceLogs.filter(log => log.courseCode === course.code);
                const present = courseLogs.filter(l => l.status === 'Present').length;
                const total = courseLogs.length;
                const pct = total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : null;
                const isShortage = pct !== null && pct < 75;

                // Attend recommendation
                let attendTip = '';
                if (pct !== null) {
                  if (pct < 75) {
                    const req = Math.ceil(3 * total - 4 * present);
                    attendTip = `Attend next ${req} class(es) to reach 75%`;
                  } else {
                    const skip = Math.floor((4 * present - 3 * total) / 3);
                    attendTip = skip > 0 ? `Safe to skip next ${skip} class(es)` : 'Limit reached! Do not skip.';
                  }
                }

                return (
                  <div key={course.code} className="bg-white dark:bg-surface-700/20 border border-slate-200 dark:border-surface-600/10 rounded-xl p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-indigo-950/30 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{course.code}</span>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-250 leading-tight truncate" title={course.title}>
                          {course.title}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-surface-600/30 px-2 py-0.5 rounded">
                          {course.credits}cr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CourseBadge type={course.type} />
                      {pct !== null && (
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border 
                          ${pct >= 75 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          }
                        `}>
                          {pct}% ({present}/{total})
                        </span>
                      )}
                    </div>

                    {/* Attendance logging panel for this course */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-indigo-950/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-semibold">Quick Attendance Logger:</span>
                        {pct !== null && (
                          <span className={`font-medium ${pct >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {attendTip}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onLogAttendance(course.code, 'Present')}
                          className="flex-1 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} /> Present
                        </button>
                        <button
                          onClick={() => onLogAttendance(course.code, 'Absent')}
                          className="flex-1 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Minus size={11} /> Absent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SemestersPanel({
  pastSgpas,
  updateSemesterSGPA,
  attendanceLogs,
  setAttendanceLogs
}) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSem, setExpandedSem] = useState(1);

  // Quick subject attendance log handler
  const handleQuickLog = (courseCode, status) => {
    let semNum = 1;
    for (let sem of SYLLABUS) {
      if (sem.courses.some(c => c.code === courseCode)) {
        semNum = sem.semester;
        break;
      }
    }

    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      date: new Date().toISOString().split('T')[0],
      semester: semNum,
      courseCode,
      status
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
  };

  const filteredSemesters = SYLLABUS.filter(sem => {
    const sgpaVal = pastSgpas[sem.semester];
    const isDone = sgpaVal !== '' && sgpaVal !== undefined;
    const matchesFilter = filter === 'all' || (filter === 'complete' && isDone) || (filter === 'upcoming' && !isDone);
    
    if (!matchesFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return sem.courses.some(c => c.title.toLowerCase().includes(term) || c.code.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category & Search Filter Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-indigo-950/20">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1">Filter:</span>
          {[
            { value: 'all', label: 'All Semesters' },
            { value: 'complete', label: 'Completed Only' },
            { value: 'upcoming', label: 'Active / Pending' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`
                px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer
                ${filter === value 
                  ? 'sem-btn-active' 
                  : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Live Course Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search course title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input text-xs font-medium py-1.5 px-3 rounded-xl max-w-xs"
          />
          <span className="text-xs text-slate-500 font-bold font-mono shrink-0">
            {Object.values(pastSgpas).filter(v => v !== '').length} / 8 Complete
          </span>
        </div>
      </div>

      {/* Expandable semester cards */}
      <div className="space-y-4">
        {filteredSemesters.map(semInfo => (
          <SemesterCard
            key={semInfo.semester}
            semInfo={semInfo}
            sgpa={pastSgpas[semInfo.semester]}
            onUpdateSgpa={updateSemesterSGPA}
            attendanceLogs={attendanceLogs}
            onLogAttendance={handleQuickLog}
            isExpanded={expandedSem === semInfo.semester}
            onToggle={() => setExpandedSem(expandedSem === semInfo.semester ? null : semInfo.semester)}
          />
        ))}
      </div>
    </div>
  );
}
