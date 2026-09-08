import React from 'react';
import { Target, AlertTriangle, CheckCircle, TrendingUp, Info, Sliders } from 'lucide-react';
import { TOTAL_PROGRAM_CREDITS, SYLLABUS } from '../data/syllabus';

function RequiredSGPAMeter({ value }) {
  if (value === null) return null;
  const numVal = parseFloat(value);
  const isValid = numVal <= 10;
  const pct = Math.min((numVal / 10) * 100, 100);
  const color = numVal > 10 
    ? 'from-rose-500 to-red-600' 
    : numVal > 9 
    ? 'from-orange-500 to-amber-400' 
    : numVal > 8 
    ? 'from-indigo-500 to-purple-500' 
    : 'from-emerald-500 to-teal-400';

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>0</span>
        <span className="font-bold text-slate-700 dark:text-slate-355">Required SGPA: {numVal.toFixed(2)}</span>
        <span>10</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-surface-600 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${isValid ? pct : 100}%` }}
        />
      </div>
      {!isValid && (
        <div className="mt-1 text-xs text-rose-500 text-center font-bold">
          Exceeds 10.0 — Mathematically Unreachable
        </div>
      )}
    </div>
  );
}

function BreakdownTable({ pastSgpas, targetCgpa }) {
  const rows = SYLLABUS.map((semInfo) => {
    const sgpaVal = pastSgpas[semInfo.semester];
    const sgpa = sgpaVal !== '' && sgpaVal !== undefined ? parseFloat(sgpaVal) : null;
    return {
      sem: semInfo.semester,
      credits: semInfo.totalCredits,
      sgpa,
      status: sgpa !== null ? 'complete' : 'pending',
      weighted: sgpa !== null ? (sgpa * semInfo.totalCredits).toFixed(1) : '—',
    };
  });

  const totalWeighted = rows.reduce(
    (acc, r) => acc + (r.sgpa !== null ? r.sgpa * r.credits : 0),
    0
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-indigo-950/20 text-[10px] uppercase font-bold text-slate-500 bg-slate-50 dark:bg-surface-700/10">
            <th className="py-3 px-4">Semester</th>
            <th className="py-3 px-4 text-center">Credits</th>
            <th className="py-3 px-4 text-center">SGPA</th>
            <th className="py-3 px-4 text-center">Quality Points</th>
            <th className="py-3 px-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-indigo-950/10">
          {rows.map((r) => (
            <tr key={r.sem} className="hover:bg-slate-50/50 dark:hover:bg-surface-700/5 transition-colors">
              <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Sem {r.sem}</td>
              <td className="py-3 px-4 text-center font-mono text-slate-500">{r.credits} cr</td>
              <td className={`py-3 px-4 text-center font-mono font-bold ${
                r.sgpa !== null
                  ? r.sgpa >= 8.5 ? 'text-emerald-500' : r.sgpa >= 7 ? 'text-indigo-500' : 'text-orange-500'
                  : 'text-slate-400'
              }`}>
                {r.sgpa !== null ? r.sgpa.toFixed(2) : '—'}
              </td>
              <td className="py-3 px-4 text-center font-mono text-slate-500">{r.weighted}</td>
              <td className="py-3 px-4 text-right">
                <span className={`badge text-[9px] px-2 py-0.5 rounded font-bold border ${
                  r.status === 'complete' 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-slate-100 dark:bg-surface-600/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-surface-500/10'
                }`}>
                  {r.status === 'complete' ? 'Logged' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-250 dark:border-indigo-950/30 bg-slate-100/50 dark:bg-surface-700/20 font-bold">
            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">Total Portfolio</td>
            <td className="py-3 px-4 text-center font-mono text-indigo-500">{TOTAL_PROGRAM_CREDITS} cr</td>
            <td className="py-3 px-4" />
            <td className="py-3 px-4 text-center font-mono text-indigo-500">{totalWeighted.toFixed(1)}</td>
            <td className="py-3 px-4" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function PredictorPanel({
  currentCgpa,
  targetCgpa,
  setTargetCgpa,
  cgpaPredictor,
  earnedCredits,
  remainingCredits,
  pastSgpas
}) {
  const isUnreachable = cgpaPredictor.valid && !cgpaPredictor.achievable && cgpaPredictor.requiredSGPA;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target configuration panel */}
        <div className="glass-card p-6 space-y-6 border border-slate-200 dark:border-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Target size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Proportional Goal Configurator</h2>
              <p className="text-xs text-slate-500">Configure target outcomes and calculate remaining credit points</p>
            </div>
          </div>

          <div>
            <label htmlFor="target-cgpa-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-1.5">
              Desired Cumulative CGPA Target
            </label>
            <div className="relative">
              <input
                id="target-cgpa-input"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(e.target.value)}
                className="app-input text-xl font-extrabold font-mono pr-14 shadow-sm"
                placeholder="8.50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">/ 10</span>
            </div>
          </div>

          {/* Target presets */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-2">Preset Presets</p>
            <div className="flex gap-2 flex-wrap">
              {['7.5', '8.0', '8.5', '9.0', '9.2', '9.5'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTargetCgpa(t)}
                  className={`
                    px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer
                    ${targetCgpa === t 
                      ? 'sem-btn-active' 
                      : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Formula helper info */}
          <div className="bg-slate-50 dark:bg-surface-700/20 rounded-xl p-3.5 border border-slate-200 dark:border-indigo-950/10 flex gap-3">
            <Info size={15} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Credit Proportional Formula</p>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-1">
                Required SGPA = (Target × 196 − Σ(SGPA × Credits)) / Remaining Credits
              </p>
            </div>
          </div>
        </div>

        {/* Prediction report panel */}
        <div className="glass-card p-6 space-y-6 border border-slate-200 dark:border-indigo-950/20 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Outcome Evaluation Report</h2>
              <p className="text-xs text-slate-500">Heuristics derived based on completed vs remaining credits</p>
            </div>
          </div>

          {/* Stats matrix grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Current CGPA', value: currentCgpa, color: 'text-indigo-550 dark:text-indigo-400' },
              { label: 'Target CGPA', value: targetCgpa || '—', color: 'text-orange-550 dark:text-orange-400' },
              { label: 'Credits Left', value: remainingCredits, color: 'text-emerald-550 dark:text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-surface-700/30 border border-slate-200 dark:border-indigo-950/15 p-3 rounded-xl text-center">
                <div className={`text-lg font-extrabold font-mono tracking-tight ${color}`}>{value}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Evaluation result box */}
          {cgpaPredictor.valid && (
            <div className={`
              rounded-xl p-4.5 border transition-all duration-300
              ${isUnreachable
                ? 'bg-rose-500/5 border-rose-500/20'
                : cgpaPredictor.requiredSGPA === null && cgpaPredictor.achievable
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-indigo-500/5 border-indigo-500/20'
              }
            `}>
              {isUnreachable ? (
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">Mathematically Unreachable</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      To reach your target of <strong className="text-slate-700 dark:text-slate-300">{targetCgpa}</strong>, you need a future average SGPA of <strong className="text-rose-500 font-mono">{cgpaPredictor.requiredSGPA}</strong>. This exceeds the perfect 10.0 grading system.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                      💡 Suggestions: Consider lowering your target CGPA, or logging extra credits (NPTEL, MOOC courses) to enhance your grade weight.
                    </p>
                  </div>
                </div>
              ) : cgpaPredictor.requiredSGPA === null ? (
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{cgpaPredictor.message}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      All credits completed! Your final cumulative standing is <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{currentCgpa}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Sliders size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-wider">Required average SGPA</p>
                      <p className="text-4xl font-black gradient-text font-mono tracking-tight mt-1">{cgpaPredictor.requiredSGPA}</p>
                    </div>
                  </div>
                  <RequiredSGPAMeter value={cgpaPredictor.requiredSGPA} />
                  <p className="text-[11px] text-slate-500 leading-snug">{cgpaPredictor.message}</p>
                </div>
              )}
            </div>
          )}

          {!cgpaPredictor.valid && (
            <div className="bg-slate-50 dark:bg-surface-700/20 rounded-xl p-4 border border-dashed border-slate-200 dark:border-indigo-950/20 text-center py-6 text-slate-500 text-xs">
              Enter a valid target CGPA scale between 0.00 and 10.00.
            </div>
          )}
        </div>
      </div>

      {/* Breakdown table list */}
      <div className="glass-card p-6 border border-slate-200 dark:border-indigo-950/20">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Sliders size={15} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Portfolio Breakdown Grid</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-surface-750 px-2.5 py-1 rounded">
            Total Credits: {TOTAL_PROGRAM_CREDITS} cr
          </span>
        </div>
        <BreakdownTable pastSgpas={pastSgpas} targetCgpa={targetCgpa} />
      </div>
    </div>
  );
}
