import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, Volume2, VolumeX, Sparkles, Smile, Trophy, ListCollapse } from 'lucide-react';

export default function FocusZone({ focusSessions, setFocusSessions }) {
  // Pomodoro states
  const [sessionLength, setSessionLength] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  
  // Audio synthesis states
  const [soundActive, setSoundActive] = useState({ rain: false, breeze: false, crackle: false });
  const [volumes, setVolumes] = useState({ rain: 0.5, breeze: 0.5, crackle: 0.5 });
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Mood Tracker states
  const [mood, setMood] = useState(null);
  const [affirmation, setAffirmation] = useState('');

  // Audio references
  const audioCtxRef = useRef(null);
  const rainNodeRef = useRef(null);
  const breezeNodeRef = useRef(null);
  const crackleIntervalRef = useRef(null);
  const crackleGainRef = useRef(null);

  // Timer Ref
  const timerIntervalRef = useRef(null);

  // Affirmations pool
  const moodAffirmations = {
    stressed: [
      "Deep breaths. I am capable of mastering complex problems step-by-step.",
      "My grades do not define my intelligence or worth. I am doing my best.",
      "Stressing is natural, but I am in control of my study routine."
    ],
    tired: [
      "Progress is progress, no matter how small. Short study beats zero study.",
      "It is okay to rest. Taking care of my energy is part of my academic preparation.",
      "Let's focus for a short burst, then recharge with a well-deserved break."
    ],
    motivated: [
      "I am building my future self today. Let's make this study session count!",
      "I love learning new concepts and bridging computer science to real-world applications.",
      "My potential is limitless. Let's crush this academic task!"
    ],
    overwhelmed: [
      "Let's focus on just one line of code, one course topic at a time. The rest can wait.",
      "I do not have to finish everything today. I just need to make a small step forward.",
      "Let's break this syllabus chunk down. I can handle small tasks with ease."
    ],
    calm: [
      "I am focused, relaxed, and fully present in this moment of learning.",
      "Learning flows easily when my mind is quiet and aligned.",
      "I appreciate this time to improve my skills and expand my knowledge base."
    ]
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    const pool = moodAffirmations[selectedMood];
    const randomIdx = Math.floor(Math.random() * pool.length);
    setAffirmation(pool[randomIdx]);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsRunning(false);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, mode]);

  // Handle mode transitions
  const handleSessionEnd = () => {
    // Play native synth notification beep
    playNotificationBeep();

    if (mode === 'focus') {
      // Log session
      const newSession = {
        id: Date.now().toString(),
        duration: sessionLength,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'Focus Session'
      };
      setFocusSessions(prev => [newSession, ...prev]);

      alert("🔥 Focus session complete! Time for a short break.");
      setMode('break');
      setTimeLeft(5 * 60); // 5 min break
      setIsRunning(true);
    } else {
      alert("⏱️ Break finished. Ready to focus again?");
      setMode('focus');
      setTimeLeft(sessionLength * 60);
      setIsRunning(false);
    }
  };

  // Trigger audio beeps using Web Audio oscillator
  const playNotificationBeep = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5 note
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5 note
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // Audio blocker
    }
  };

  // Get or initialize AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Web Audio Synth loops
  const startRainSynth = (ctx) => {
    // Generate 2 seconds of white noise buffer
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filters for rain aesthetic (bandpass + lowpass)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.0, ctx.currentTime);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volumes.rain * (isAudioMuted ? 0 : 1), ctx.currentTime);

    // Dynamic sweeping of filter to simulate rain gusts
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // very slow sweep
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime); // sweep width

    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency); // modulate bandpass center frequency
    lfo.start();

    source.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();

    rainNodeRef.current = { source, gainNode, lfo };
  };

  const startBreezeSynth = (ctx) => {
    // Low frequency brownian-like noise for deep wind breeze
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian accumulator filter
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // boost amplitude
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(180, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volumes.breeze * (isAudioMuted ? 0 : 1), ctx.currentTime);

    // Modulate breeze amplitude slowly (wind gust simulation)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // 16-sec cycles
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.15, ctx.currentTime);

    lfo.connect(lfoGain);
    // bias wind volume by summing LFO offset to gain
    const dcOffset = ctx.createGain();
    dcOffset.gain.setValueAtTime(0.1, ctx.currentTime);

    // Using gain node parameters to multiply volume
    lfoGain.connect(gainNode.gain);

    source.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
    lfo.start();

    breezeNodeRef.current = { source, gainNode, lfo };
  };

  const startCrackleSynth = (ctx) => {
    // Crackle is simulated by schedule-triggering short impulse pop clicks
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volumes.crackle * (isAudioMuted ? 0 : 1), ctx.currentTime);
    gainNode.connect(ctx.destination);
    crackleGainRef.current = gainNode;

    crackleIntervalRef.current = setInterval(() => {
      // Trigger random cracks (lo-fi vinyl pops)
      if (Math.random() > 0.4) {
        try {
          const osc = ctx.createOscillator();
          const popGain = ctx.createGain();
          osc.type = 'triangle';
          // Low freq snap
          osc.frequency.setValueAtTime(Math.random() * 400 + 100, ctx.currentTime);
          
          popGain.gain.setValueAtTime(Math.random() * 0.04 + 0.005, ctx.currentTime);
          popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

          osc.connect(popGain);
          popGain.connect(gainNode);
          osc.start();
          osc.stop(ctx.currentTime + 0.03);
        } catch {
          // bypass errors
        }
      }
    }, 180); // pop scheduler
  };

  // Toggle synthesizers
  const toggleSound = (type) => {
    const active = !soundActive[type];
    setSoundActive(prev => ({ ...prev, [type]: active }));

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (active) {
        if (type === 'rain') startRainSynth(ctx);
        if (type === 'breeze') startBreezeSynth(ctx);
        if (type === 'crackle') startCrackleSynth(ctx);
      } else {
        if (type === 'rain' && rainNodeRef.current) {
          rainNodeRef.current.source.stop();
          rainNodeRef.current.lfo.stop();
          rainNodeRef.current = null;
        }
        if (type === 'breeze' && breezeNodeRef.current) {
          breezeNodeRef.current.source.stop();
          breezeNodeRef.current.lfo.stop();
          breezeNodeRef.current = null;
        }
        if (type === 'crackle' && crackleIntervalRef.current) {
          clearInterval(crackleIntervalRef.current);
          crackleIntervalRef.current = null;
          crackleGainRef.current = null;
        }
      }
    } catch {
      alert("Audio context blocked by browser gesture. Start timer first to allow synthesis.");
    }
  };

  // Update volume nodes
  const handleVolumeChange = (type, val) => {
    setVolumes(prev => ({ ...prev, [type]: val }));
    try {
      if (type === 'rain' && rainNodeRef.current) {
        rainNodeRef.current.gainNode.gain.setValueAtTime(val * (isAudioMuted ? 0 : 1), audioCtxRef.current.currentTime);
      }
      if (type === 'breeze' && breezeNodeRef.current) {
        breezeNodeRef.current.gainNode.gain.setValueAtTime(val * (isAudioMuted ? 0 : 1), audioCtxRef.current.currentTime);
      }
      if (type === 'crackle' && crackleGainRef.current) {
        crackleGainRef.current.gain.setValueAtTime(val * (isAudioMuted ? 0 : 1), audioCtxRef.current.currentTime);
      }
    } catch {
      // Context closed
    }
  };

  // Mute audio
  useEffect(() => {
    try {
      const m = isAudioMuted ? 0 : 1;
      if (rainNodeRef.current) rainNodeRef.current.gainNode.gain.setValueAtTime(volumes.rain * m, audioCtxRef.current.currentTime);
      if (breezeNodeRef.current) breezeNodeRef.current.gainNode.gain.setValueAtTime(volumes.breeze * m, audioCtxRef.current.currentTime);
      if (crackleGainRef.current) crackleGainRef.current.gain.setValueAtTime(volumes.crackle * m, audioCtxRef.current.currentTime);
    } catch {
      //
    }
  }, [isAudioMuted]);

  // Clean audio synth nodes on unmounting
  useEffect(() => {
    return () => {
      if (rainNodeRef.current) {
        try { rainNodeRef.current.source.stop(); rainNodeRef.current.lfo.stop(); } catch {}
      }
      if (breezeNodeRef.current) {
        try { breezeNodeRef.current.source.stop(); breezeNodeRef.current.lfo.stop(); } catch {}
      }
      if (crackleIntervalRef.current) clearInterval(crackleIntervalRef.current);
    };
  }, []);

  const selectLength = (len) => {
    setSessionLength(len);
    setTimeLeft(len * 60);
    setIsRunning(false);
  };

  const handleStartStop = () => {
    // Audio activation check (browser requirement: gesture resumes context)
    getAudioContext();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setMode('focus');
  };

  // Timer values formatting
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Radial timer circle computations
  const totalSecs = mode === 'focus' ? sessionLength * 60 : 5 * 60;
  const strokeDashoffset = totalSecs > 0 ? 251.2 * (timeLeft / totalSecs) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Pomodoro Timer Visualizer */}
        <div className="glass-card p-6 flex flex-col items-center justify-between border border-slate-200 dark:border-indigo-950/20 text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500">Pomodoro Clock</span>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border 
              ${mode === 'focus' 
                ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              }
            `}>
              {mode === 'focus' ? '🎯 Focus Session' : '☕ Relaxing Break'}
            </span>
          </div>

          {/* Radial Timer Wheel */}
          <div className="relative w-44 h-44 flex items-center justify-center my-4">
            {/* Glowing backdrop shadow when active */}
            <div className={`absolute inset-6 rounded-full blur-2xl opacity-20 dark:opacity-25 transition-all duration-1000 ${
              isRunning 
                ? (mode === 'focus' ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)]' : 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.6)]') 
                : 'bg-transparent'
            }`} />
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 dark:text-surface-600/50"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={`pomodoro-ring-circle transition-all duration-1000
                  ${mode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'}
                `}
                strokeWidth="6"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-black font-mono tracking-tight text-slate-800 dark:text-white leading-none">
                {formatTime(timeLeft)}
              </p>
              <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mt-1">{mode}</p>
            </div>
          </div>

          {/* Length Presets */}
          <div className="flex gap-2 justify-center my-3 flex-wrap">
            {[15, 25, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => selectLength(mins)}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all disabled:opacity-50
                  ${sessionLength === mins 
                    ? 'sem-btn-active' 
                    : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'
                  }
                `}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4 w-full">
            <button
              onClick={handleStartStop}
              className="flex-1 py-3 btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isRunning ? <Pause size={15} /> : <Play size={15} />}
              <span>{isRunning ? 'Pause Study' : 'Start Focus'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-400 bg-white/50 dark:bg-surface-700 text-slate-500 dark:text-slate-300 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Middle: Web Audio Synthesizer Controls */}
        <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500">Ambient audio synthesis</span>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="text-slate-400 hover:text-slate-650 p-1 rounded-lg"
                title="Mute sounds"
              >
                {isAudioMuted ? <VolumeX size={15} className="text-rose-500" /> : <Volume2 size={15} />}
              </button>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Natively synthesize continuous offline-first focus beats directly in your browser. Swept noise filters help calm study stress.
            </p>

            <div className="space-y-4">
              {/* Rain Sound */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-surface-750/30 border border-slate-100 dark:border-indigo-950/10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSound('rain')}
                    className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer
                      ${soundActive.rain 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                        : 'bg-white dark:bg-surface-700 border-slate-200 dark:border-surface-400 text-slate-600 dark:text-slate-300'
                      }
                    `}
                  >
                    🌧️ {soundActive.rain ? 'Mute Monsoon Grind' : 'Monsoon Lab Exam Grind'}
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Volume: {Math.round(volumes.rain * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05"
                  value={volumes.rain}
                  onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 rounded-full cursor-pointer bg-slate-200 dark:bg-surface-600"
                  disabled={!soundActive.rain}
                />
              </div>

              {/* Forest Breeze */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-surface-750/30 border border-slate-100 dark:border-indigo-950/10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSound('breeze')}
                    className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer
                      ${soundActive.breeze 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                        : 'bg-white dark:bg-surface-700 border-slate-200 dark:border-surface-400 text-slate-600 dark:text-slate-300'
                      }
                    `}
                  >
                    🍃 {soundActive.breeze ? 'Mute Midnight Coding' : 'Midnight Coding Session'}
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Volume: {Math.round(volumes.breeze * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05"
                  value={volumes.breeze}
                  onChange={(e) => handleVolumeChange('breeze', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 rounded-full cursor-pointer bg-slate-200 dark:bg-surface-600"
                  disabled={!soundActive.breeze}
                />
              </div>

              {/* Lo-Fi Crackle */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-surface-750/30 border border-slate-100 dark:border-indigo-950/10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSound('crackle')}
                    className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer
                      ${soundActive.crackle 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                        : 'bg-white dark:bg-surface-700 border-slate-200 dark:border-surface-400 text-slate-600 dark:text-slate-300'
                      }
                    `}
                  >
                    📻 {soundActive.crackle ? 'Mute Library Vinyl' : 'Library Vinyl Beats'}
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Volume: {Math.round(volumes.crackle * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05"
                  value={volumes.crackle}
                  onChange={(e) => handleVolumeChange('crackle', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 rounded-full cursor-pointer bg-slate-200 dark:bg-surface-600"
                  disabled={!soundActive.crackle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mood Affirmations & Stress Buster */}
        <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500">Mindfulness Mood Hub</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Feeling exam stress or deadline anxiety? Choose a mood below to unlock positive academic affirmations and focus directives.
            </p>

            {/* Mood buttons grid */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { key: 'stressed', emoji: '😣', label: 'Stress' },
                { key: 'tired', emoji: '🥱', label: 'Tired' },
                { key: 'motivated', emoji: '🎯', label: 'Inpsire' },
                { key: 'overwhelmed', emoji: '🤯', label: 'Chaos' },
                { key: 'calm', emoji: '😌', label: 'Calm' }
              ].map(({ key, emoji, label }) => (
                <button
                  key={key}
                  onClick={() => handleMoodSelect(key)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer
                    ${mood === key 
                      ? 'bg-indigo-500/10 border-indigo-500/35 scale-105' 
                      : 'bg-slate-50 dark:bg-surface-700/30 border-slate-200 dark:border-surface-500/10 hover:border-slate-350 hover:bg-slate-100 dark:hover:bg-surface-700/50'
                    }
                  `}
                  title={label}
                >
                  <span className="text-xl leading-none mb-1">{emoji}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 leading-none">{label}</span>
                </button>
              ))}
            </div>

            {/* Affirmation Output Box */}
            {affirmation && (
              <div className="bg-indigo-500/5 border border-indigo-550/25 p-4 rounded-xl space-y-2 animate-slide-up">
                <p className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles size={11} /> Positive Affirmation
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{affirmation}"
                </p>
                <div className="pt-2 border-t border-slate-200/50 dark:border-indigo-950/15 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="font-bold">Directive: Try Box Breathing (4s In, 4s Hold, 4s Out)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Focus registry ledger */}
      <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" />
          Focus Session Logbook ({focusSessions.length})
        </h4>

        {focusSessions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-indigo-950/10 rounded-2xl">
            No study sessions logged today. Set the clock and complete a focus session to see it logged here!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {focusSessions.map(session => (
              <div key={session.id} className="bg-slate-50 dark:bg-surface-700/25 border border-slate-150 dark:border-surface-600/10 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{session.date} • {session.timestamp}</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-300 mt-0.5">{session.mode}</p>
                </div>
                <span className="text-sm font-extrabold text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-lg font-mono">
                  +{session.duration}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
