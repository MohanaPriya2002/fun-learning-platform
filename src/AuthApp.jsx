import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import * as store from './authStore.js'
import { generateSecret, generateRecoveryCodes, getOtpauthURL, verifyTOTP } from './totp.js'

// ── Google SVG icon ────────────────────────────────────────────────────────────
function GIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

// ── 6-box OTP input ────────────────────────────────────────────────────────────
function OTPInput({ value, onChange, autoFocus }) {
  const refs = useRef([])
  const cells = value.padEnd(6, ' ').split('')

  function set(i, digit) {
    const next = [...cells]
    next[i] = digit || ' '
    onChange(next.join('').trimEnd())
  }

  function onInput(i, e) {
    const v = e.target.value.replace(/\D/g, '')
    if (!v) return
    set(i, v[v.length - 1])
    if (i < 5) refs.current[i + 1]?.focus()
  }

  function onKey(i, e) {
    if (e.key === 'Backspace') {
      if (!cells[i]?.trim()) { if (i > 0) refs.current[i - 1]?.focus() }
      else set(i, '')
    }
    if (e.key === 'ArrowLeft'  && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus()
  }

  function onPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(text)
    refs.current[Math.min(text.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="otp-grid" autoComplete="one-time-code">
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          className={`otp-box${cells[i]?.trim() ? ' otp-filled' : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={cells[i]?.trim() || ''}
          onChange={e => onInput(i, e)}
          onKeyDown={e => onKey(i, e)}
          onPaste={onPaste}
          onFocus={e => e.target.select()}
          autoFocus={autoFocus && i === 0}
        />
      ))}
    </div>
  )
}

// ── Password strength ──────────────────────────────────────────────────────────
function pwStrength(p) {
  if (!p) return 0
  let s = 0
  if (p.length >= 8)  s++
  if (p.length >= 12) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p))   s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return Math.min(s, 4)
}
const STR_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STR_COLOR = ['', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

// ── TOTP countdown ring ────────────────────────────────────────────────────────
function TOTPTimer() {
  const [left, setLeft] = useState(30 - (Math.floor(Date.now() / 1000) % 30))
  useEffect(() => {
    const id = setInterval(() => setLeft(30 - (Math.floor(Date.now() / 1000) % 30)), 500)
    return () => clearInterval(id)
  }, [])
  const r = 13, circ = 2 * Math.PI * r
  const urgent = left <= 8
  return (
    <div className="totp-timer">
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r={r} fill="none" stroke="var(--cq-border)" strokeWidth="3"/>
        <circle cx="17" cy="17" r={r} fill="none"
          stroke={urgent ? 'var(--cq-danger)' : 'var(--cq-accent)'}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - left / 30)}
          strokeLinecap="round"
          transform="rotate(-90 17 17)"
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      <span className={`totp-secs${urgent ? ' totp-urgent' : ''}`}>{left}s</span>
    </div>
  )
}

// ── Mock Google accounts ───────────────────────────────────────────────────────
const GOOGLE_ACCOUNTS = [
  { email: 'demo@gmail.com',    name: 'Demo User',       ini: 'D', color: '#4285f4' },
  { email: 'learner@gmail.com', name: 'Code Learner',    ini: 'C', color: '#34a853' },
]

// ══════════════════════════════════════════════════════════════════════════════
export default function AuthApp({ onAuth }) {
  const [screen,       setScreen]       = useState('welcome')
  const [email,        setEmail]        = useState('')
  const [password,     setPwd]          = useState('')
  const [username,     setUsername]     = useState('')
  const [confirmPwd,   setConfirm]      = useState('')
  const [showPwd,      setShowPwd]      = useState(false)
  const [otp,          setOtp]          = useState('')
  const [useRecovery,  setUseRecovery]  = useState(false)
  const [recoveryCode, setRecoveryCode] = useState('')
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [mfaPending,   setMfaPending]   = useState(null)
  const [mfaSetup,     setMfaSetup]     = useState(null)
  const [qrImg,        setQrImg]        = useState('')
  const [codesOk,      setCodesOk]      = useState(false)
  const [pendingUser,  setPendingUser]  = useState(null)
  const [pendingSession, setPendingSession] = useState(null)

  function go(s) {
    setScreen(s); setError(''); setOtp(''); setUseRecovery(false); setRecoveryCode('')
  }

  useEffect(() => {
    if (mfaSetup?.qrUrl) {
      QRCode.toDataURL(mfaSetup.qrUrl, { width: 180, margin: 2, color: { dark: '#ffffff', light: '#0f1117' } })
        .then(setQrImg).catch(() => setQrImg(''))
    }
  }, [mfaSetup?.qrUrl])

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSignup(e) {
    e.preventDefault(); setError('')
    if (username.trim().length < 2) return setError('Username must be at least 2 characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPwd) return setError('Passwords do not match.')
    setLoading(true)
    try {
      const res = await store.signUp({ username, email, password })
      setPendingUser(res.user); setPendingSession(res.session)
      go('mfa-prompt')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleLogin(e) {
    e.preventDefault(); setError('')
    if (!email || !password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      const res = await store.signIn({ email, password })
      if (res.requiresMFA) { setMfaPending({ userId: res.userId }); go('mfa-verify') }
      else onAuth({ user: res.user, session: res.session })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleGooglePick(account) {
    setLoading(true)
    try {
      const res = await store.signInGoogle({ email: account.email, name: account.name })
      if (res.requiresMFA) { setMfaPending({ userId: res.userId }); go('mfa-verify') }
      else { setPendingUser(res.user); setPendingSession(res.session); go('mfa-prompt') }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleMFAVerify(e) {
    e?.preventDefault(); setError('')
    const token = useRecovery ? recoveryCode.trim() : otp.replace(/\s/g, '')
    if (!token || (!useRecovery && token.length < 6)) return setError('Please enter a valid code.')
    setLoading(true)
    try {
      const res = await store.completeMFA({ userId: mfaPending.userId, token })
      onAuth({ user: res.user, session: res.session })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  function startMFASetup() {
    const secret = generateSecret()
    const codes = generateRecoveryCodes()
    setMfaSetup({ secret, qrUrl: getOtpauthURL(secret, pendingUser.email), recoveryCodes: codes })
    setCodesOk(false)
    go('mfa-setup')
  }

  async function handleMFAEnable(e) {
    e?.preventDefault(); setError('')
    if (otp.replace(/\s/g, '').length < 6) return setError('Enter all 6 digits.')
    setLoading(true)
    try {
      const valid = await verifyTOTP(mfaSetup.secret, otp.replace(/\s/g, ''))
      if (!valid) throw new Error('Code not recognized. Make sure your authenticator time is correct.')
      store.setupMFA(pendingUser.id, mfaSetup.secret, mfaSetup.recoveryCodes)
      go('mfa-codes')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  function finishAuth() {
    onAuth({ user: pendingUser, session: pendingSession })
  }

  async function handleGoogleCustom(e) {
    e.preventDefault(); setError('')
    if (!email) return setError('Enter an email address.')
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    await handleGooglePick({ email, name })
  }

  // ── Layout wrapper ─────────────────────────────────────────────────────────
  function Card({ children, wide }) {
    return (
      <div className="auth-root">
        <div className={`auth-card${wide ? ' auth-card-wide' : ''}`}>{children}</div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WELCOME
  if (screen === 'welcome') return (
    <Card>
      <div className="auth-logo">🎮</div>
      <h1 className="auth-brand-title">Code Quest</h1>
      <p className="auth-subtitle">Sign in to save your progress and unlock achievements</p>
      <div className="auth-actions">
        <button className="auth-btn-google" onClick={() => go('google')}>
          <GIcon /> Continue with Google
        </button>
        <div className="auth-divider"><span>or</span></div>
        <button className="auth-btn auth-btn-full" onClick={() => go('login')}>Sign in with email</button>
        <button className="auth-btn-outline auth-btn-full" onClick={() => go('signup')}>Create an account</button>
      </div>
      <p className="auth-fine-print">By continuing you agree to our Terms &amp; Privacy Policy.</p>
    </Card>
  )

  // LOGIN
  if (screen === 'login') return (
    <Card>
      <button className="auth-back" onClick={() => go('welcome')}>← Back</button>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subtitle">Sign in to continue your journey</p>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
        </div>
        <div className="auth-field">
          <label className="auth-label">
            Password
            <button type="button" className="auth-link" onClick={() => setShowPwd(s => !s)}>
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </label>
          <input className="auth-input" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={e => setPwd(e.target.value)} required />
        </div>
        <button className="auth-btn auth-btn-full" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </form>
      <div className="auth-switch">
        No account? <button className="auth-link" onClick={() => go('signup')}>Create one</button>
      </div>
    </Card>
  )

  // SIGNUP
  if (screen === 'signup') return (
    <Card>
      <button className="auth-back" onClick={() => go('welcome')}>← Back</button>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subtitle">Start your coding journey today</p>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <input className="auth-input" type="text" placeholder="codewizard"
            value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
        </div>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label className="auth-label">
            Password
            <button type="button" className="auth-link" onClick={() => setShowPwd(s => !s)}>
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </label>
          <input className="auth-input" type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters"
            value={password} onChange={e => setPwd(e.target.value)} required />
          {password && (
            <div className="pw-meter">
              <div className="pw-bar">
                {[1,2,3,4].map(i => (
                  <div key={i} className="pw-seg"
                    style={{ background: i <= pwStrength(password) ? STR_COLOR[pwStrength(password)] : 'var(--cq-border)' }} />
                ))}
              </div>
              <span className="pw-label" style={{ color: STR_COLOR[pwStrength(password)] }}>
                {STR_LABEL[pwStrength(password)]}
              </span>
            </div>
          )}
        </div>
        <div className="auth-field">
          <label className="auth-label">Confirm password</label>
          <input className="auth-input" type={showPwd ? 'text' : 'password'} placeholder="Repeat password"
            value={confirmPwd} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <button className="auth-btn auth-btn-full" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
      </form>
      <div className="auth-switch">
        Already have an account? <button className="auth-link" onClick={() => go('login')}>Sign in</button>
      </div>
    </Card>
  )

  // GOOGLE PICKER
  if (screen === 'google') return (
    <Card>
      <button className="auth-back" onClick={() => go('welcome')}>← Back</button>
      <div className="google-header">
        <GIcon />
        <span>Sign in with Google</span>
      </div>
      <p className="auth-subtitle" style={{ textAlign: 'center' }}>Choose an account to continue to Code Quest</p>
      {error && <div className="auth-error">{error}</div>}
      <div className="google-accounts">
        {GOOGLE_ACCOUNTS.map(acc => (
          <button key={acc.email} className="google-row" onClick={() => handleGooglePick(acc)} disabled={loading}>
            <div className="google-avatar" style={{ background: acc.color }}>{acc.ini}</div>
            <div className="google-info">
              <span className="google-name">{acc.name}</span>
              <span className="google-email">{acc.email}</span>
            </div>
            <span className="google-chevron">›</span>
          </button>
        ))}
      </div>
      <div className="auth-divider" style={{ margin: '14px 0' }}><span>or use another account</span></div>
      <form className="auth-form" style={{ gap: 10 }} onSubmit={handleGoogleCustom}>
        <input className="auth-input" type="email" placeholder="Enter email address"
          value={email} onChange={e => setEmail(e.target.value)} />
        <button className="auth-btn-google auth-btn-full" type="submit" disabled={loading || !email}>
          <GIcon /> {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
    </Card>
  )

  // MFA VERIFY (during login)
  if (screen === 'mfa-verify') return (
    <Card>
      <div className="auth-mfa-icon">🔐</div>
      <h2 className="auth-heading">Two-factor verification</h2>
      <p className="auth-subtitle">
        {useRecovery ? 'Enter one of your 10-character recovery codes.' : 'Open your authenticator app and enter the 6-digit code.'}
      </p>
      {error && <div className="auth-error">{error}</div>}

      {!useRecovery && (
        <div className="mfa-timer-row">
          <TOTPTimer />
          <span className="mfa-timer-hint">Code refreshes every 30s</span>
        </div>
      )}

      <form onSubmit={handleMFAVerify} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {useRecovery ? (
          <input className="auth-input auth-mono" type="text" placeholder="e.g. 2A3F9B1C4E"
            value={recoveryCode} onChange={e => setRecoveryCode(e.target.value.toUpperCase())} autoFocus />
        ) : (
          <OTPInput value={otp} onChange={setOtp} autoFocus />
        )}
        <button className="auth-btn auth-btn-full" type="submit"
          disabled={loading || (!useRecovery && otp.replace(/\s/g,'').length < 6)}>
          {loading ? 'Verifying…' : 'Verify →'}
        </button>
      </form>

      <div className="auth-switch" style={{ marginTop: 4 }}>
        {useRecovery
          ? <><button className="auth-link" onClick={() => { setUseRecovery(false); setRecoveryCode('') }}>← Use authenticator code</button></>
          : <>Lost your device? <button className="auth-link" onClick={() => setUseRecovery(true)}>Use a recovery code</button></>
        }
      </div>
    </Card>
  )

  // MFA PROMPT (after signup / google auth)
  if (screen === 'mfa-prompt') return (
    <Card>
      <div className="auth-mfa-icon">🛡️</div>
      <h2 className="auth-heading">Secure your account</h2>
      <p className="auth-subtitle">Add two-factor authentication for an extra layer of protection.</p>
      <div className="mfa-features">
        {['Blocks unauthorized access even if your password leaks',
          'Works with Google Authenticator, Authy, 1Password & more',
          'Recovery codes keep you covered if you lose your device'].map(f => (
          <div key={f} className="mfa-feature">
            <span className="mfa-feature-check">✓</span> {f}
          </div>
        ))}
      </div>
      <div className="auth-actions" style={{ marginTop: 20 }}>
        <button className="auth-btn auth-btn-full" onClick={startMFASetup}>Enable 2FA now</button>
        <button className="auth-btn-outline auth-btn-full" onClick={finishAuth}>Skip for now</button>
      </div>
    </Card>
  )

  // MFA SETUP — QR + verify
  if (screen === 'mfa-setup') return (
    <Card wide>
      <button className="auth-back" onClick={() => go('mfa-prompt')}>← Back</button>
      <h2 className="auth-heading">Set up authenticator</h2>
      <p className="auth-subtitle">Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.</p>

      <div className="mfa-setup-layout">
        <div className="mfa-qr-frame">
          {qrImg
            ? <img src={qrImg} alt="QR code for 2-factor auth" className="mfa-qr-img" />
            : <div className="mfa-qr-placeholder">Generating…</div>}
        </div>
        <div className="mfa-setup-meta">
          <p className="mfa-meta-label">Can't scan? Enter this key manually:</p>
          <div className="mfa-secret-key">{mfaSetup?.secret.match(/.{1,4}/g)?.join(' ')}</div>
          <p className="mfa-meta-apps">Works with Google Authenticator, Authy, Microsoft Authenticator, 1Password, and more.</p>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleMFAEnable} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
        <OTPInput value={otp} onChange={setOtp} />
        <button className="auth-btn auth-btn-full" type="submit"
          disabled={loading || otp.replace(/\s/g,'').length < 6}>
          {loading ? 'Enabling…' : 'Enable two-factor authentication ✓'}
        </button>
      </form>
    </Card>
  )

  // MFA CODES — recovery codes
  if (screen === 'mfa-codes') return (
    <Card wide>
      <div className="auth-mfa-icon">🔑</div>
      <h2 className="auth-heading">Save your recovery codes</h2>
      <p className="auth-subtitle">
        Store these somewhere safe. Each code can only be used once if you lose your authenticator.
      </p>
      <div className="recovery-grid">
        {mfaSetup?.recoveryCodes.map(code => (
          <div key={code} className="recovery-code">{code}</div>
        ))}
      </div>
      <div className="recovery-actions">
        <button className="auth-btn-outline" onClick={() => {
          const blob = new Blob([mfaSetup.recoveryCodes.join('\n')], { type: 'text/plain' })
          const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'codequest-recovery-codes.txt' })
          a.click()
        }}>⬇ Download</button>
        <button className="auth-btn-outline" onClick={() => navigator.clipboard.writeText(mfaSetup.recoveryCodes.join('\n'))}>
          ⎘ Copy all
        </button>
      </div>
      <label className="auth-checkbox-row">
        <input type="checkbox" checked={codesOk} onChange={e => setCodesOk(e.target.checked)} />
        I've saved my recovery codes in a safe place
      </label>
      <button className="auth-btn auth-btn-full" disabled={!codesOk} onClick={finishAuth} style={{ marginTop: 12 }}>
        Done — Start learning! 🚀
      </button>
    </Card>
  )

  return null
}
