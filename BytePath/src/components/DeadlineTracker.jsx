import React, { useState } from 'react';
import { Calendar, AlertCircle, Plus, CheckCircle, Clock, Trash2, Tag, ArrowRight } from 'lucide-react';

export default function DeadlineTracker({ deadlines, setDeadlines }) {
  // Input fields
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('assignment'); // 'assignment' | 'exam' | 'lab' | 'project' | 'other'
  const [priority, setPriority] = useState('high'); // 'critical' | 'high' | 'medium' | 'low'

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'in-progress' | 'completed'

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert("Please enter a title and a valid due date.");
      return;
    }

    const newDeadline = {
      id: Date.now().toString(),
      title: title.trim(),
      dueDate,
      category,
      priority,
      status: 'pending' // default status
    };

    setDeadlines(prev => [...prev, newDeadline]);
    
    // reset form
    setTitle('');
    setDueDate('');
    setCategory('assignment');
    setPriority('high');
  };

  const handleStatusChange = (id, newStatus) => {
    setDeadlines(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleDelete = (id) => {
    if (confirm("Delete this deadline planner task?")) {
      setDeadlines(prev => prev.filter(item => item.id !== id));
    }
  };

  // Helper to compute remaining days
  const getDaysRemaining = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Priority color config
  const PRIORITY_CFG = {
    critical: { label: 'Critical', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
    high: { label: 'High', bg: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    medium: { label: 'Medium', bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    low: { label: 'Low', bg: 'bg-slate-100 dark:bg-surface-600 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-surface-500/10' }
  };

  // Category label config
  const CATEGORY_LABELS = {
    assignment: '📝 Assignment',
    exam: '📖 Exam Test',
    lab: '🧪 Lab File',
    project: '💻 CS/IT Project',
    other: '📌 Other Task'
  };

  const filteredDeadlines = deadlines.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Left Column: Form Loader */}
      <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20 h-fit space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Calendar size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Log New Deadline</h2>
            <p className="text-xs text-slate-500">Record assignment submissions and lab vivas</p>
          </div>
        </div>

        <form onSubmit={handleAddDeadline} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
              Task/Syllabus Subject Title
            </label>
            <input 
              type="text"
              placeholder="e.g., Mathematics Assignment 2 / OS Lab File"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="app-input shadow-sm text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
                Target Due Date
              </label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="app-input shadow-sm font-semibold text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
                Classification Type
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-surface-700/50 border-slate-200 dark:border-surface-600/20 text-slate-855 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam Paper</option>
                <option value="lab">Lab File</option>
                <option value="project">Course Project</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
              Priority Degree
            </label>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'critical'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer capitalize
                    ${priority === p 
                      ? 'sem-btn-active' 
                      : 'bg-slate-50 dark:bg-surface-700/50 border-slate-250 dark:border-surface-500/10 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-indigo-950/20'
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus size={15} />
            <span>Create Planner Deadline</span>
          </button>
        </form>
      </div>

      {/* Middle & Right: List Panels */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filters */}
        <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4 border border-slate-200 dark:border-indigo-950/20">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { value: 'all', label: 'All Open Tasks' },
              { value: 'pending', label: 'Pending Only' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`
                  px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer
                  ${activeFilter === value 
                    ? 'sem-btn-active' 
                    : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-bold font-mono">
            Log: {deadlines.filter(d => d.status !== 'completed').length} Pending
          </span>
        </div>

        {/* Deadlines list registry */}
        <div className="space-y-3">
          {filteredDeadlines.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-indigo-950/10 rounded-2xl">
              No academic deadlines registered matching filters.
            </div>
          ) : (
            filteredDeadlines.map(item => {
              const daysLeft = getDaysRemaining(item.dueDate);
              const pcfg = PRIORITY_CFG[item.priority] || PRIORITY_CFG.low;
              
              // Countdown alerts styling
              let alertMsg = '';
              let alertColor = 'text-slate-500';
              
              if (item.status === 'completed') {
                alertMsg = '✓ Task Completed';
                alertColor = 'text-emerald-500 dark:text-emerald-450';
              } else if (daysLeft < 0) {
                alertMsg = '⚠️ Overdue!';
                alertColor = 'text-rose-500 font-bold';
              } else if (daysLeft === 0) {
                alertMsg = '🔥 Due Today!';
                alertColor = 'text-rose-600 dark:text-rose-400 font-black';
              } else if (daysLeft === 1) {
                alertMsg = '⏰ Due Tomorrow!';
                alertColor = 'text-orange-500 font-bold animate-pulse';
              } else {
                alertMsg = `${daysLeft} days remaining`;
                alertColor = daysLeft <= 3 ? 'text-orange-500 font-bold' : 'text-slate-500';
              }

              return (
                <div 
                  key={item.id} 
                  className={`glass-card p-4.5 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 float-card
                    ${item.status === 'completed' 
                      ? 'border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/5 opacity-70' 
                      : 'border-slate-200 dark:border-indigo-950/15'
                    }
                  `}
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Tag size={10} />
                        {CATEGORY_LABELS[item.category]}
                      </span>
                      <span className={`badge text-[8px] px-1.5 py-0.5 rounded font-bold border ${pcfg.bg}`}>
                        {pcfg.label}
                      </span>
                    </div>

                    <h4 className={`font-bold text-base leading-tight text-slate-800 dark:text-slate-200 
                      ${item.status === 'completed' ? 'line-through text-slate-400' : ''}
                    `}>
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="font-semibold">Due: {item.dueDate}</span>
                      <span>•</span>
                      <span className={`font-bold uppercase tracking-wider ${alertColor}`}>{alertMsg}</span>
                    </div>
                  </div>

                  {/* Kanban operations */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {item.status !== 'completed' && (
                      <div className="flex gap-1.5">
                        {item.status === 'pending' ? (
                          <button
                            onClick={() => handleStatusChange(item.id, 'in-progress')}
                            className="px-2.5 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-[10px] font-bold text-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                            title="Move to In-Progress"
                          >
                            <Clock size={10} />
                            <span>In Progress</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(item.id, 'completed')}
                            className="px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-[10px] font-bold text-emerald-600 transition-all flex items-center gap-1 cursor-pointer"
                            title="Mark Completed"
                          >
                            <CheckCircle size={10} />
                            <span>Done</span>
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all border border-slate-200/50 dark:border-surface-500/10 bg-slate-50 dark:bg-surface-700/30 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
