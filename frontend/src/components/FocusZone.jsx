import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import SpotifyPlayer from './SpotifyPlayer';

export default function FocusZone({ focusSessions, setFocusSessions }) {
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus');
  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playNotificationBeep = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.7);
    } catch { /* Browser audio is optional. */ }
  };

  const handleSessionEnd = () => {
    playNotificationBeep();
    if (mode === 'focus') {
      setFocusSessions((previous) => [{ id: Date.now().toString(), duration: sessionLength, date: new Date().toISOString().split('T')[0], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mode: 'Focus Session' }, ...previous]);
      alert('🔥 Focus session complete! Time for a short break.');
      setMode('break'); setTimeLeft(5 * 60); setIsRunning(true);
    } else {
      alert('⏱️ Break finished. Ready to focus again?');
      setMode('focus'); setTimeLeft(sessionLength * 60); setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isRunning) { clearInterval(timerIntervalRef.current); return undefined; }
    timerIntervalRef.current = setInterval(() => setTimeLeft((previous) => {
      if (previous <= 1) { clearInterval(timerIntervalRef.current); setIsRunning(false); handleSessionEnd(); return 0; }
      return previous - 1;
    }), 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, mode]);

  const selectLength = (length) => { setSessionLength(length); setTimeLeft(length * 60); setIsRunning(false); };
  const handleStartStop = () => { getAudioContext(); setIsRunning((running) => !running); };
  const handleReset = () => { setIsRunning(false); setMode('focus'); setTimeLeft(sessionLength * 60); };
  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const totalSeconds = mode === 'focus' ? sessionLength * 60 : 5 * 60;
  const strokeDashoffset = totalSeconds > 0 ? 251.2 * (timeLeft / totalSeconds) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-between border border-slate-200 dark:border-indigo-950/20 text-center">
          <div className="w-full flex items-center justify-between mb-4"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500">Pomodoro Clock</span><span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${mode === 'focus' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>{mode === 'focus' ? '🎯 Focus Session' : '☕ Relaxing Break'}</span></div>
          <div className="relative w-44 h-44 flex items-center justify-center my-4"><div className={`absolute inset-6 rounded-full blur-2xl opacity-20 transition-all duration-1000 ${isRunning ? (mode === 'focus' ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)]' : 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.6)]') : 'bg-transparent'}`} /><svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100"><circle className="text-slate-100 dark:text-surface-600/50" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" /><circle className={`pomodoro-ring-circle transition-all duration-1000 ${mode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'}`} strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" /></svg><div className="absolute text-center"><p className="text-3xl font-black font-mono tracking-tight text-slate-800 dark:text-white leading-none">{formatTime(timeLeft)}</p><p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mt-1">{mode}</p></div></div>
          <div className="flex gap-2 justify-center my-3 flex-wrap">{[15, 25, 45, 60].map((length) => <button key={length} onClick={() => selectLength(length)} disabled={isRunning} className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all disabled:opacity-50 ${sessionLength === length ? 'sem-btn-active' : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'}`}>{length}m</button>)}</div>
          <div className="flex items-center gap-3 mt-4 w-full"><button onClick={handleStartStop} className="flex-1 py-3 btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-lg">{isRunning ? <Pause size={15} /> : <Play size={15} />}<span>{isRunning ? 'Pause Study' : 'Start Focus'}</span></button><button onClick={handleReset} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-400 bg-white/50 dark:bg-surface-700 text-slate-500 dark:text-slate-300 hover:text-rose-500 transition-all cursor-pointer" title="Reset timer"><RotateCcw size={15} /></button></div>
        </div>
        <SpotifyPlayer />
      </div>
      <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20"><h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> Focus Session Logbook ({focusSessions.length})</h4>{focusSessions.length === 0 ? <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-indigo-950/10 rounded-2xl">No study sessions logged today. Set the clock and complete a focus session to see it logged here!</div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{focusSessions.map((session) => <div key={session.id} className="bg-slate-50 dark:bg-surface-700/25 border border-slate-150 dark:border-surface-600/10 p-3.5 rounded-xl flex items-center justify-between"><div><span className="text-[10px] font-mono text-slate-400">{session.date} • {session.timestamp}</span><p className="text-sm font-bold text-slate-800 dark:text-slate-300 mt-0.5">{session.mode}</p></div><span className="text-sm font-extrabold text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-lg font-mono">+{session.duration}m</span></div>)}</div>}</div>
    </div>
  );
}
