import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Trash2, ShieldAlert, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

export default function AdvisorPanel({ 
  advisorChat, 
  addUserChat, 
  clearChatLogs, 
  currentSemester, 
  currentCgpa, 
  targetCgpa, 
  calculatedAttendancePercent 
}) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [advisorChat, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addUserChat(inputText);
    setInputText('');
    setIsTyping(true);

    // Typing effect mimic
    setTimeout(() => {
      setIsTyping(false);
    }, 550);
  };

  const handlePresetClick = (presetText) => {
    addUserChat(presetText);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 550);
  };

  // Find active subjects
  const currentSemInfo = SYLLABUS.find(s => s.semester === currentSemester);
  const courses = currentSemInfo ? currentSemInfo.courses : [];

  // Generate localized audit highlights
  const auditPoints = [];
  const attVal = parseFloat(calculatedAttendancePercent);
  
  if (isNaN(attVal)) {
    auditPoints.push({
      type: 'info',
      text: "No attendance data logged yet. Add daily classes in the Semesters panel."
    });
  } else if (attVal < 75) {
    auditPoints.push({
      type: 'warning',
      text: `Critical attendance shortage (${attVal}%). Go to class to avoid examinations block!`
    });
  } else {
    auditPoints.push({
      type: 'success',
      text: `Attendance is safe at ${attVal}%. Keep up the attendance streak!`
    });
  }

  // Suggest key subjects to target based on credit counts
  const highCreditCourses = courses.filter(c => c.credits >= 4);
  if (highCreditCourses.length > 0) {
    auditPoints.push({
      type: 'tip',
      text: `Focus on ${highCreditCourses.slice(0, 2).map(c => c.title).join(' and ')} - they have high credit weights (4cr) and impact your CGPA the most.`
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Left: Dynamic Audit Status */}
      <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20 h-fit space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center text-white shadow-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Dynamic Study Audit</h3>
            <p className="text-[10px] text-slate-500">RAG guidance grounded in your portfolio metrics</p>
          </div>
        </div>

        {/* Audit elements list */}
        <div className="space-y-3">
          {auditPoints.map((pt, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex gap-2.5
                ${pt.type === 'warning' 
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400' 
                  : pt.type === 'success' 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                  : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-700 dark:text-indigo-400'
                }
              `}
            >
              {pt.type === 'warning' ? (
                <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              ) : (
                <MessageSquare size={15} className="shrink-0 mt-0.5" />
              )}
              <span>{pt.text}</span>
            </div>
          ))}
        </div>

        {/* Informative tips */}
        <div className="bg-slate-50 dark:bg-surface-750/30 border border-slate-200 dark:border-indigo-950/10 p-4 rounded-xl space-y-2 text-xs text-slate-500 leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <AlertCircle size={13} className="text-indigo-500" /> How does ByteAI work?
          </p>
          <p className="text-[11px]">
            ByteAI uses your academic context to ground answers from the configured RAG knowledge base. If the remote service is unavailable, the local academic advisor keeps the panel usable.
          </p>
        </div>
      </div>

      {/* Middle & Right: Chat Interface Container */}
      <div className="lg:col-span-2 glass-card border border-slate-200 dark:border-indigo-950/20 flex flex-col h-[520px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-150 dark:border-indigo-950/20 flex justify-between items-center bg-slate-50/50 dark:bg-surface-800/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center text-white">
              <Brain size={16} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">ByteAI Academic Co-Pilot</h4>
              <p className="text-[10px] text-emerald-650 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online RAG Advisor
              </p>
            </div>
          </div>
          
          <button
            onClick={clearChatLogs}
            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-surface-700 hover:text-rose-500 transition-all cursor-pointer"
            title="Clear Chat Logs"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 dark:bg-[#07070e]/20">
          {advisorChat.map(msg => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-550 dark:text-indigo-400">
                    <Brain size={12} />
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-sm
                  ${isAi 
                    ? 'bg-white dark:bg-surface-800 border border-slate-150 dark:border-indigo-950/15 text-slate-800 dark:text-slate-250 rounded-tl-none' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                  }
                `}>
                  {/* Handle markdown bold formatting locally */}
                  <p className="whitespace-pre-line">
                    {msg.text.split('\n').map((line, lIdx) => {
                      // Simple regex bold matching **text**
                      const parts = line.split('**');
                      return (
                        <span key={lIdx} className="block mt-1 first:mt-0">
                          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{part}</strong> : part)}
                        </span>
                      );
                    })}
                  </p>
                  <span className={`block text-[9px] text-right mt-1.5 opacity-60 font-mono`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-550 dark:text-indigo-455">
                <Brain size={12} className="animate-spin" />
              </div>
              <div className="bg-white dark:bg-surface-800 border border-slate-150 dark:border-indigo-950/15 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Shortcuts */}
        <div className="px-5 py-3 border-t border-slate-150 dark:border-indigo-950/10 bg-slate-50/30 dark:bg-surface-800/5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preset Quick Actions:</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { label: '📅 Study Plan', query: 'Generate a study plan for my subjects' },
              { label: '🚦 Attendance check', query: 'Check my attendance status' },
              { label: '🎯 Target check', query: 'Can I reach my target CGPA?' },
              { label: '🚀 Placement guide', query: 'Give me placement strategy' }
            ].map(p => (
              <button
                key={p.label}
                onClick={() => handlePresetClick(p.query)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-650 bg-white dark:bg-surface-700 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-surface-600 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all whitespace-nowrap cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-150 dark:border-indigo-950/20 flex gap-2 bg-slate-50/50 dark:bg-surface-800/10 shrink-0">
          <input 
            type="text"
            placeholder="Ask ByteAI Study Advisor (e.g. 'Generate study plan' or 'target check')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="app-input shadow-sm text-sm"
          />
          <button 
            type="submit"
            className="btn-primary py-2.5 px-4 flex items-center justify-center shrink-0 cursor-pointer shadow-md"
          >
            <Send size={14} />
          </button>
        </form>

      </div>

    </div>
  );
}
