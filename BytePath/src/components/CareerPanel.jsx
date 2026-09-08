import React, { useState } from 'react';
import { ArrowRight, Lightbulb, Rocket, Target, ExternalLink } from 'lucide-react';
import { CAREER_INSIGHTS } from '../data/syllabus';

const PHASE_MAP = {
  '1-2': { sems: [1, 2], label: 'Semesters 1–2' },
  '3-4': { sems: [3, 4], label: 'Semesters 3–4' },
  '5-6': { sems: [5, 6], label: 'Semesters 5–6' },
  '7-8': { sems: [7, 8], label: 'Semesters 7–8' },
};

function InsightCard({ insight, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="glass-card glass-card-hover shine-effect p-5 float-card cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
      id={`insight-card-${index}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 border border-indigo-500/10 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
          <Lightbulb size={14} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{insight.headline}</h4>
            <span className="text-xs text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5">
              {expanded ? '▲' : '▼'}
            </span>
          </div>

          {expanded && (
            <div className="mt-3 space-y-3 animate-slide-up">
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">{insight.body}</p>
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-700/30 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Target size={13} className="text-orange-500 dark:text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">{insight.actionLabel}: </span>
                    <span className="text-xs text-slate-650 dark:text-slate-400">{insight.action}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ phaseKey, data, isActive, onSelect }) {
  const meta = PHASE_MAP[phaseKey];
  return (
    <button
      id={`phase-btn-${phaseKey}`}
      onClick={() => onSelect(phaseKey)}
      className={`
        glass-card p-4 text-left w-full transition-all duration-200 cursor-pointer
        ${isActive
          ? `border-2 ${data.borderColor.replace('border-', 'border-')} bg-gradient-to-br ${data.color}`
          : 'glass-card-hover'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{data.icon}</span>
        <span className="text-xs text-slate-500 font-medium">{meta.label}</span>
      </div>
      <p className={`text-sm font-bold ${isActive ? data.accentColor : 'text-slate-600 dark:text-slate-400'}`}>
        {data.phase}
      </p>
      {isActive && (
        <div className="mt-1.5 flex items-center gap-1 text-xs text-indigo-650 dark:text-indigo-400">
          <span>Current phase</span>
          <ArrowRight size={10} />
        </div>
      )}
    </button>
  );
}

// ---- Roadmap timeline ----
const ROADMAP_STEPS = [
  { phase: '1-2', milestone: 'HTML/CSS + JavaScript Basics', tech: ['HTML5', 'CSS3', 'Vanilla JS', 'DOM APIs'] },
  { phase: '3-4', milestone: 'React + Node.js Fundamentals', tech: ['React.js', 'Node.js', 'Express', 'npm/Git'] },
  { phase: '7-8', milestone: 'Cloud, AI & Enterprise Scale', tech: ['AWS/Docker', 'Next.js', 'CI/CD', 'ML APIs'] },
];

function RoadmapTimeline({ currentPhase }) {
  const phaseOrder = ['1-2', '3-4', '5-6', '7-8'];
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Rocket size={15} className="text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Web Dev Career Roadmap</h3>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-surface-500 z-0" />

        <div className="space-y-4 relative z-10">
          {ROADMAP_STEPS.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step.phase} className="flex items-start gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 text-sm font-bold
                  ${isDone
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white animate-pulse-glow'
                    : 'bg-slate-100 dark:bg-surface-700 border-slate-200 dark:border-surface-500 text-slate-400 dark:text-slate-500'
                  }
                `}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${isCurrent ? 'text-indigo-600 dark:text-indigo-300' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {step.milestone}
                    </p>
                    {isCurrent && (
                      <span className="badge bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-700/40">You are here</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {step.tech.map((t) => (
                      <span key={t} className={`
                        text-[10px] px-2 py-0.5 rounded-md font-mono font-medium border
                        ${isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-300 border-indigo-100 dark:border-indigo-700/30'
                          : isDone
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-800/30'
                          : 'bg-slate-50 dark:bg-surface-600/30 text-slate-500 dark:text-slate-500 border-slate-150 dark:border-surface-500/20'
                        }
                      `}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Resource links ----
const RESOURCES = [
  { label: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: 'Full web dev curriculum', phase: '1-2' },
  { label: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Hands-on full-stack path', phase: '1-2' },
  { label: 'React Official Docs', url: 'https://react.dev', desc: 'Component architecture deep-dive', phase: '3-4' },
  { label: 'Node.js Official', url: 'https://nodejs.org', desc: 'Server-side JavaScript runtime', phase: '3-4' },
  { label: 'MongoDB University', url: 'https://university.mongodb.com', desc: 'NoSQL free certification', phase: '5-6' },
  { label: 'Vercel', url: 'https://vercel.com', desc: 'Deploy full-stack apps instantly', phase: '5-6' },
  { label: 'AWS Free Tier', url: 'https://aws.amazon.com/free', desc: 'Cloud infrastructure practice', phase: '7-8' },
  { label: 'Docker Docs', url: 'https://docs.docker.com', desc: 'Containerization essentials', phase: '7-8' },
];

// ============================================================
export default function CareerPanel({ careerPhase, currentSemester }) {
  const [selectedPhase, setSelectedPhase] = useState(careerPhase);
  const insightData = CAREER_INSIGHTS[selectedPhase];
  const phaseOrder = ['1-2', '3-4', '5-6', '7-8'];

  // Sync selected phase with active academic phase when mounting or changing semesters
  React.useEffect(() => {
    setSelectedPhase(careerPhase);
  }, [careerPhase]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Phase selector */}
      <div className="glass-card p-5 border border-slate-200 dark:border-indigo-950/20">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Rocket size={16} className="text-orange-400 animate-bounce" />
            Career Phase Explorer
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Academic Standing:</span>
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
              Semester {currentSemester}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {phaseOrder.map((phase) => (
            <PhaseCard
              key={phase}
              phaseKey={phase}
              data={CAREER_INSIGHTS[phase]}
              isActive={selectedPhase === phase}
              onSelect={setSelectedPhase}
            />
          ))}
        </div>
      </div>

      {/* Active phase insights */}
      {insightData && (
        <div>
          <div className={`glass-card p-5 mb-4 border bg-gradient-to-br ${insightData.color} ${insightData.borderColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{insightData.icon}</span>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{insightData.phase}</p>
                <h3 className={`text-xl font-bold ${insightData.accentColor}`}>{insightData.title}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insightData.insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Resources + Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink size={15} className="text-indigo-550 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Curated Resources</h3>
          </div>
          <div className="space-y-2">
            {RESOURCES.filter((r) => r.phase === selectedPhase).map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-surface-700/30 border border-slate-150 dark:border-surface-500/10 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 hover:bg-indigo-50/20 dark:hover:bg-surface-600/30 transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-300 transition-colors">{r.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</p>
                </div>
                <ExternalLink size={12} className="text-slate-400 dark:text-slate-650 group-hover:text-indigo-550 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
              </a>
            ))}
            {RESOURCES.filter((r) => r.phase === selectedPhase).length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No resources for this phase yet.</p>
            )}
          </div>
        </div>

        {/* Roadmap */}
        <RoadmapTimeline currentPhase={selectedPhase} />
      </div>
    </div>
  );
}
