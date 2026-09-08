import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Github, 
  Twitter 
} from 'lucide-react';
import { registerAccount, signIn, signInWithGoogleProfile, signInWithGoogleCredential } from '../services/authApi';

// Official Google G SVG Logo
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage({ onLoginSuccess }) {
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
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

  // Auto-initialize Google One-Tap if client ID is configured
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
          try {
            const session = await signInWithGoogleCredential(response.credential);
            onLoginSuccess(session);
          } catch (err) {
            setAuthError(err.message || 'Google Auth failed');
          }
        }
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
    setAuthMode(mode);
    setAuthError('');
    setIssuedAccount(null);
    setPassword('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleSimulatedGoogleLogin = async (profile) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      const session = await signInWithGoogleProfile({
        name: profile.name,
        email: profile.email,
        picture: profile.picture
      });
      setShowGoogleModal(false);
      onLoginSuccess(session);
    } catch (err) {
      setAuthError(err.message || 'Google Auth login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUniqueId = async () => {
    if (!issuedAccount?.loginId) return;
    try {
      await navigator.clipboard.writeText(issuedAccount.loginId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setAuthError('Copy your unique ID manually.');
    }
  };



  return (
    <div className="min-h-screen bg-[#e6ecf5] dark:bg-[#0c0e1a] text-slate-700 dark:text-slate-200 flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 font-sans">
      
      {/* Central Neumorphic Card */}
      <div className="w-full max-w-md bg-[#e6ecf5] dark:bg-[#0c0e1a] neu-flat p-8 sm:p-10 rounded-[36px] shadow-2xl relative space-y-6 transition-all duration-300">
        
        {/* Top Neumorphic Circular Avatar Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 neu-circle flex items-center justify-center text-slate-500 dark:text-slate-400">
            <User size={28} />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {authMode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {authMode === 'signin' ? 'Please sign in to continue' : 'Enter your B.Tech scholar details'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {authMode === 'signup' && (
            <div className="neu-inset flex items-center px-4 py-3.5 space-x-3">
              <User size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
              />
            </div>
          )}

          {/* Email / Unique ID Input */}
          <div className="neu-inset flex items-center px-4 py-3.5 space-x-3">
            <Mail size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              required
              placeholder={authMode === 'signup' ? 'Email address' : 'Email address or Unique ID'}
              value={authMode === 'signup' ? email : identity}
              onChange={(e) => authMode === 'signup' ? setEmail(e.target.value) : setIdentity(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="neu-inset flex items-center px-4 py-3.5 space-x-3 relative">
            <Lock size={18} className="text-slate-400 shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none pr-8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Checkbox & Forgot Password */}
          {authMode === 'signin' && (
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-500 dark:text-slate-400 select-none">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded neu-button flex items-center justify-center transition-all ${
                    rememberMe ? 'neu-button-active text-indigo-500' : ''
                  }`}
                >
                  {rememberMe && <Check size={12} />}
                </button>
                <span className="font-medium text-[11px]">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setAuthError('Password reset link has been sent to your email.')}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
              >
                Forgot password?
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
              {authError}
            </div>
          )}

          {/* Main Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 neu-button text-slate-700 dark:text-slate-200 font-bold text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer mt-2"
          >
            {isSubmitting ? 'Processing...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Issued Account Card */}
        {issuedAccount && (
          <div className="p-4 neu-inset rounded-2xl text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>Account Issued!</span>
            </div>
            <p className="text-[11px] text-slate-500">Your Unique ByteStudy ID:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-300">{issuedAccount.loginId}</code>
              <button onClick={copyUniqueId} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button
              onClick={() => onLoginSuccess(issuedAccount)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 inline-flex items-center gap-1"
            >
              Continue to Portal <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* Social Dividers */}
        <div className="space-y-4 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-300/60 dark:border-slate-800" />
            <span className="bg-[#e6ecf5] dark:bg-[#0c0e1a] px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider relative z-10">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Social Neumorphic Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-12 h-12 neu-circle flex items-center justify-center transition cursor-pointer hover:scale-105"
              title="Sign in with Google"
            >
              <GoogleIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleSimulatedGoogleLogin({ name: 'GitHub Developer', email: 'dev.scholar@github.com' })}
              className="w-12 h-12 neu-circle flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer hover:scale-105"
              title="Sign in with GitHub"
            >
              <Github size={20} />
            </button>

            <button
              type="button"
              onClick={() => handleSimulatedGoogleLogin({ name: 'Twitter Scholar', email: 'scholar@twitter.com' })}
              className="w-12 h-12 neu-circle flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-500 transition cursor-pointer hover:scale-105"
              title="Sign in with Twitter/X"
            >
              <Twitter size={20} />
            </button>
          </div>
        </div>

        {/* Footer Toggle Text */}
        <div className="text-center pt-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}</span>
          <button
            type="button"
            onClick={() => switchAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {authMode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>



      </div>

      {/* Google Account Selector Modal for Testing */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#e6ecf5] dark:bg-[#0c0e1a] neu-flat p-6 rounded-3xl space-y-4 relative">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 neu-circle flex items-center justify-center shrink-0">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sign in with Google</h3>
                <p className="text-[11px] text-slate-400">Choose an account for ByteStudy</p>
              </div>
            </div>

            {/* Custom Google Email */}
            <form onSubmit={(e) => { e.preventDefault(); if (googleCustomEmail) handleSimulatedGoogleLogin({ name: googleCustomName || 'Google Scholar', email: googleCustomEmail }); }} className="pt-2 space-y-2">
              <input
                type="email"
                required
                placeholder="enter.custom.google@gmail.com"
                value={googleCustomEmail}
                onChange={(e) => setGoogleCustomEmail(e.target.value)}
                className="w-full px-3 py-2 neu-inset text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 neu-button text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
