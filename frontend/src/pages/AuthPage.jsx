import React, { useState } from 'react';
import { auth } from '../services/auth';
import { api } from '../services/api';

/**
 * Auth page:
 *   1. Login (email + password)
 *   2. Signup -> backend emails a real OTP via SMTP
 *   3. OTP verification (user types the code from their inbox)
 *
 * If SMTP isn't configured on the server the backend returns the OTP in
 * the response as a fallback so signup still works during local dev.
 */
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const persistAndContinue = (res) => {
    localStorage.setItem('dd_token', res.access_token);
    localStorage.setItem('dd_user', JSON.stringify(res.user));
    onAuth(res.user);
  };

  const applyRegisterResponse = (res) => {
    setMessage(res.message || `Verification code sent to ${email}`);
    setShowOtp(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setMessage(''); setLoading(true);
    try {
      if (mode === 'login') {
        const user = await auth.login(email, password);
        onAuth(user);
      } else {
        const res = await api.register(email, password, name);
        applyRegisterResponse(res);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message);
    } finally { setLoading(false); }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await api.verifyOtp(email, otp);
      persistAndContinue(res);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message);
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setError(null); setMessage(''); setResending(true);
    try {
      const res = await api.resendOtp(email);
      applyRegisterResponse(res);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message);
    } finally { setResending(false); }
  };

  if (showOtp) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand-big">
            <div className="logo">✉</div>
            <h2>Verify your email</h2>
            <p className="tagline">
              A 6-digit code was sent to <strong>{email}</strong>.<br />
              Open your inbox (and check spam) to get it.
            </p>
          </div>

          <form onSubmit={submitOtp}>
            <div className="field">
              <label>Enter Code</label>
              <input
                className="mono"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="000000"
                required
                autoFocus
                maxLength={6}
                inputMode="numeric"
              />
            </div>
            <button className="primary" disabled={loading}>
              {loading ? <span className="loader" /> : 'Verify & Create Account'}
            </button>
            {error && <div className="error">⚠ {error}</div>}
            {message && (
              <div
                className="message"
                style={{ color: '#4facfe', marginTop: 10, textAlign: 'center' }}
              >
                {message}
              </div>
            )}
          </form>
          <div className="switch" style={{ textAlign: 'center' }}>
            <span onClick={handleResend} style={{ cursor: 'pointer' }}>
              {resending ? 'Resending…' : 'Resend code'}
            </span>
            {' · '}
            <span onClick={() => {
              setShowOtp(false); setOtp(''); setMessage('');
            }}>
              Back
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-big">
          <div className="logo">⚗</div>
          <h2>DrugDisco AI</h2>
          <p className="tagline">AI-powered drug discovery SaaS · ChemBERTa · BioGPT</p>
        </div>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="primary" disabled={loading}>
            {loading ? <span className="loader" /> : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>
          {error && <div className="error">⚠ {error}</div>}
        </form>
        <div className="switch">
          {mode === 'login'
            ? <>No account? <span onClick={() => setMode('register')}>Sign up</span></>
            : <>Have an account? <span onClick={() => setMode('login')}>Sign in</span></>}
          {' · '}
          <span onClick={() => onAuth({ email: 'guest@local', tier: 'free', guest: true })}>
            Continue as guest
          </span>
        </div>
      </div>
    </div>
  );
}
