import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Check, Copy,
  CheckCircle2, ArrowRight, X, Github, Twitter,
  Sparkles, BookOpen, BarChart3, Brain, GraduationCap,
} from 'lucide-react';
import { registerAccount, signIn, signInWithGoogleProfile, signInWithGoogleCredential } from '../services/authApi';

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      className="flex items-start gap-3 p-3 rounded-xl backdrop-blur-sm transition-all duration-300">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</p>
        <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
      </div>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, #8b5cf6)', top: '-10%', right: '-10%', animation: 'orbFloat 12s ease-in-out infinite' }} />
      <div className="absolute w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #db2777, #f97316)', bottom: '5%', left: '-8%', animation: 'orbFloat 16s ease-in-out infinite reverse' }} />
      <div className="absolute w-48 h-48 rounded-full opacity-10 blur-2xl"
        style={{ background: 'radial-gradient(circle, #0ea5e9, #6366f1)', top: '50%', left: '30%', animation: 'orbFloat 20s ease-in-out infinite 4s' }} />
    </div>
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const googleButtonRef = useRef(null);
  const [authMode, setAuthMode] = useState('signin');
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedAccount, setIssuedAccount] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return undefined;
    let initialized = false;
    const initializeGoogle = () => {
      if (initialized || !window.google?.accounts?.id) return;
      initialized = true;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          setIsSubmitting(true);
          setAuthError('');
          try {
            const session = await signInWithGoogleCredential(response.credential);
            onLoginSuccess(session);
          } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        },
      });
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'icon',
        theme: 'outline',
        size: 'large',
        shape: 'circle',
      });
    };
    initializeGoogle();
    const retryTimer = window.setInterval(initializeGoogle, 100);
    window.addEventListener('load', initializeGoogle);
    return () => {
      window.clearInterval(retryTimer);
      window.removeEventListener('load', initializeGoogle);
    };
  }, [onLoginSuccess]);

  const switchAuthMode = (mode) => {
    setAuthMode(mode); setAuthError(''); setIssuedAccount(null); setPassword('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setAuthError(''); setIsSubmitting(true);
    try {
      if (authMode === 'signup') {
        const account = await registerAccount({ name, email, password });
        setIssuedAccount(account);
      } else {
        const account = await signIn({ identity, password });
        onLoginSuccess(account);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  const handleSimulatedGoogleLogin = async (profile) => {
    setIsSubmitting(true); setAuthError('');
    try {
      const session = await signInWithGoogleProfile({ name: profile.name, email: profile.email, picture: profile.picture });
      onLoginSuccess(session);
    } catch (err) {
      setAuthError(err.message || 'Google Auth login failed.');
    } finally { setIsSubmitting(false); }
  };

  const copyUniqueId = async () => {
    if (!issuedAccount?.loginId) return;
    try {
      await navigator.clipboard.writeText(issuedAccount.loginId);
      setIsCopied(true); setTimeout(() => setIsCopied(false), 2000);
    } catch { setAuthError('Copy your unique ID manually.'); }
  };

  const CSS = `
    @keyframes orbFloat {
      0%,100%{transform:translate(0,0) scale(1)}
      33%{transform:translate(15px,-20px) scale(1.05)}
      66%{transform:translate(-10px,10px) scale(0.97)}
    }
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulseGlow{
      0%,100%{box-shadow:0 0 20px rgba(99,102,241,.4),0 0 40px rgba(139,92,246,.2)}
      50%{box-shadow:0 0 40px rgba(99,102,241,.6),0 0 80px rgba(139,92,246,.3)}
    }
    .lp-hero{animation:slideInLeft .7s cubic-bezier(.16,1,.3,1) both}
    .lp-right{animation:slideInRight .7s cubic-bezier(.16,1,.3,1) .1s both}
    .lp-field{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both}
    .shimmer-btn{
      background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#4f46e5 100%);
      background-size:200% auto;
      transition:background-position .5s ease,transform .2s ease,box-shadow .2s ease;
    }
    .shimmer-btn:hover:not(:disabled){
      background-position:right center;transform:translateY(-2px);
      box-shadow:0 12px 28px rgba(99,102,241,.5);
    }
    .shimmer-btn:active:not(:disabled){transform:translateY(0)}
    .lp-input{
      background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
      border-radius:14px;display:flex;align-items:center;padding:0 16px;gap:12px;
      transition:all .2s ease;
    }
    .lp-input:focus-within{
      background:rgba(255,255,255,.07);border-color:rgba(99,102,241,.55);
      box-shadow:0 0 0 3px rgba(99,102,241,.18);
    }
    .lp-social{
      height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.1);
      background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;
      transition:all .2s ease;cursor:pointer;
    }
    .lp-social:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);transform:translateY(-2px)}
    .glow-logo{animation:pulseGlow 3s ease-in-out infinite}
  `;

  return (
    <>
      <style>{CSS}</style>
      <div className="min-h-screen flex overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#080a18 0%,#0f1127 50%,#0a0c1e 100%)' }}>

        {/* LEFT HERO PANEL */}
        <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden lp-hero">
          <FloatingOrbs />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/15 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-logo"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">Byte</span>
              <span className="text-xl font-black tracking-tight"
                style={{ background:'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Path</span>
            </div>
          </div>

          {/* Hero copy */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{ background:'rgba(99,102,241,.15)', borderColor:'rgba(99,102,241,.35)', color:'#a5b4fc' }}>
                <Sparkles size={12} /> Your Academic Co-pilot
              </div>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
                Master your<br />
                <span style={{ background:'linear-gradient(90deg,#818cf8,#c084fc,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  B.Tech journey
                </span>
              </h1>
              <p className="text-base leading-relaxed max-w-sm" style={{ color:'rgba(255,255,255,.45)' }}>
                Track grades, predict CGPA, manage deadlines, and stay focused � all in one place built for students.
              </p>
            </div>
            <div className="space-y-3">
              <FeatureCard icon={BarChart3} title="Smart CGPA Predictor" desc="Simulate outcomes before your exams hit" color="bg-indigo-500/60" />
              <FeatureCard icon={Brain} title="AI Study Advisor" desc="Personalized guidance from your AI mentor" color="bg-purple-500/60" />
              <FeatureCard icon={BookOpen} title="Syllabus & PYQs" desc="All previous year papers in one place" color="bg-pink-500/60" />
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-xs" style={{ color:'rgba(255,255,255,.2)' }}>Built with ❤️ for B.Tech scholars � BytePath v1.0</p>
          </div>
        </div>

        {/* RIGHT AUTH PANEL */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative lp-right">
          <div className="absolute inset-0"
            style={{ background:'linear-gradient(180deg,rgba(12,14,30,.97) 0%,rgba(8,10,24,.99) 100%)' }} />

          {/* Mobile logo */}
          <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden z-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="text-base font-black text-white">
              Byte<span style={{ background:'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Path</span>
            </span>
          </div>

          <div className="relative z-10 w-full max-w-[400px] space-y-6">

            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">
                {authMode === 'signin' ? 'Welcome back 👋' : 'Create account'}
              </h2>
              <p className="text-sm" style={{ color:'rgba(255,255,255,.4)' }}>
                {authMode === 'signin'
                  ? 'Sign in to continue your academic journey'
                  : 'Join thousands of B.Tech scholars on BytePath'}
              </p>
            </div>

            {/* Social */}
            <div className="grid grid-cols-3 gap-3">
              <div ref={googleButtonRef} title="Sign in with Google" className="lp-social" />
              <button type="button"
                onClick={() => handleSimulatedGoogleLogin({ name: 'GitHub Developer', email: 'dev.scholar@github.com' })}
                title="Sign in with GitHub" className="lp-social" style={{ color:'rgba(255,255,255,.65)' }}>
                <Github size={19} />
              </button>
              <button type="button"
                onClick={() => handleSimulatedGoogleLogin({ name: 'Twitter Scholar', email: 'scholar@twitter.com' })}
                title="Sign in with Twitter / X" className="lp-social" style={{ color:'rgba(255,255,255,.65)' }}>
                <Twitter size={19} />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,.08)' }} />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color:'rgba(255,255,255,.22)' }}>or</span>
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,.08)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3">

              {authMode === 'signup' && (
                <div className="lp-input lp-field" style={{ animationDelay:'0ms' }}>
                  <User size={16} className="shrink-0" style={{ color:'rgba(255,255,255,.3)' }} />
                  <input type="text" required placeholder="Full Name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-3.5 bg-transparent text-sm font-medium text-white placeholder-white/25 focus:outline-none" />
                </div>
              )}

              <div className="lp-input lp-field" style={{ animationDelay:'50ms' }}>
                <Mail size={16} className="shrink-0" style={{ color:'rgba(255,255,255,.3)' }} />
                <input type="text" required
                  placeholder={authMode === 'signup' ? 'Email address' : 'Email or Unique ID'}
                  value={authMode === 'signup' ? email : identity}
                  onChange={(e) => authMode === 'signup' ? setEmail(e.target.value) : setIdentity(e.target.value)}
                  className="w-full py-3.5 bg-transparent text-sm font-medium text-white placeholder-white/25 focus:outline-none" />
              </div>

              <div className="lp-input lp-field relative" style={{ animationDelay:'100ms' }}>
                <Lock size={16} className="shrink-0" style={{ color:'rgba(255,255,255,.3)' }} />
                <input type={showPassword ? 'text' : 'password'} required minLength={8}
                  placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 bg-transparent text-sm font-medium text-white placeholder-white/25 focus:outline-none pr-8" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 transition-colors"
                  style={{ color:'rgba(255,255,255,.28)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {authMode === 'signin' && (
                <div className="flex items-center justify-between pt-0.5 px-0.5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button type="button" onClick={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 rounded-[5px] flex items-center justify-center transition-all border"
                      style={{
                        background: rememberMe ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,.06)',
                        borderColor: rememberMe ? 'transparent' : 'rgba(255,255,255,.15)',
                      }}>
                      {rememberMe && <Check size={10} className="text-white" />}
                    </button>
                    <span className="text-[12px] font-medium" style={{ color:'rgba(255,255,255,.4)' }}>Remember me</span>
                  </label>
                  <button type="button"
                    onClick={() => setAuthError('Password reset link has been sent to your email.')}
                    className="text-[12px] font-semibold" style={{ color:'#818cf8' }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {authError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl text-xs font-medium border"
                  style={{ background:'rgba(239,68,68,.1)', borderColor:'rgba(239,68,68,.25)', color:'#fca5a5' }}>
                  <X size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{authError}</span>
                </div>
              )}

              <button type="submit" disabled={isSubmitting}
                className="shimmer-btn w-full py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ borderRadius:'14px' }}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing�
                  </>
                ) : (
                  <>{authMode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Success card */}
            {issuedAccount && (
              <div className="p-4 rounded-2xl border space-y-3"
                style={{ background:'rgba(16,185,129,.08)', borderColor:'rgba(16,185,129,.25)' }}>
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color:'#34d399' }}>
                  <CheckCircle2 size={16} /> <span>Account Created!</span>
                </div>
                <div>
                  <p className="text-xs mb-1.5" style={{ color:'rgba(255,255,255,.38)' }}>Your Unique BytePath ID:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-black" style={{ color:'#a5b4fc' }}>{issuedAccount.loginId}</code>
                    <button onClick={copyUniqueId} className="p-1.5 rounded-lg transition-colors"
                      title="Copy ID" style={{ color: isCopied ? '#34d399' : 'rgba(255,255,255,.3)' }}>
                      {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color:'rgba(255,255,255,.28)' }}>
                    Save this ID � it's your alternative login credential.
                  </p>
                </div>
                <button onClick={() => onLoginSuccess(issuedAccount)}
                  className="w-full py-2.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background:'linear-gradient(135deg,#059669,#10b981)', borderRadius:'12px' }}>
                  Continue to Portal <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Toggle */}
            <p className="text-center text-sm" style={{ color:'rgba(255,255,255,.32)' }}>
              {authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => switchAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="font-bold" style={{ color:'#818cf8' }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
