import { useState } from 'react'
import CodeGame from './CodeGame.jsx'
import CoursesApp from './CoursesApp.jsx'
import AuthApp from './AuthApp.jsx'
import * as authStore from './authStore.js'

// Apply saved theme before first paint (no flash)
const INIT_THEME = localStorage.getItem('cq-theme') || 'dark'
document.documentElement.setAttribute('data-theme', INIT_THEME)

const THEMES = [
  { id: 'dark',     name: 'Dark',     dot: 'linear-gradient(135deg,#818cf8,#c084fc)' },
  { id: 'light',    name: 'Light',    dot: 'linear-gradient(135deg,#3852B4,#6366f1)' },
  { id: 'coral',    name: 'Coral',    dot: 'linear-gradient(135deg,#FF5A5A,#ff8fa3)' },
  { id: 'blush',    name: 'Blush',    dot: 'linear-gradient(135deg,#FFCEE3,#FF5A5A)' },
  { id: 'ocean',    name: 'Ocean',    dot: 'linear-gradient(135deg,#3852B4,#38bdf8)' },
  { id: 'midnight', name: 'Night',    dot: 'linear-gradient(135deg,#38bdf8,#818cf8)' },
]

function ThemePicker({ current, onChange }) {
  return (
    <div className="tp-wrap">
      <span className="tp-label">Theme</span>
      <div className="tp-swatches">
        {THEMES.map(t => (
          <button
            key={t.id}
            className={`tp-swatch${current === t.id ? ' active' : ''}`}
            style={{ '--dot': t.dot }}
            onClick={() => onChange(t.id)}
            title={t.name}
          >
            <span className="tp-dot" />
            <span className="tp-name">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function HomeScreen({ onQuiz, onCourses, theme, onTheme, user, onSignOut }) {
  return (
    <div className="home-root">
      <div className="home-wrap">

        {/* User bar */}
        <div className="home-user-bar">
          <div className="home-user-avatar">{user.username[0].toUpperCase()}</div>
          <span className="home-user-name">{user.username}</span>
          <button className="home-signout" onClick={onSignOut} title="Sign out">Sign out</button>
        </div>

        <div className="home-brand">
          <div className="home-icon">🎮</div>
          <h1 className="home-title">Code Quest</h1>
          <p className="home-tagline">Your interactive journey to learning code</p>
        </div>

        <div className="home-cards">
          <button className="home-card" onClick={onCourses}>
            <div className="home-card-icon">📚</div>
            <div className="home-card-body">
              <span className="home-card-name">Courses</span>
              <span className="home-card-desc">Step-by-step lessons from zero — JS variables, loops, functions & more</span>
              <span className="home-card-meta">2 courses · 32 lessons</span>
            </div>
            <span className="home-card-arrow">→</span>
          </button>

          <button className="home-card" onClick={onQuiz}>
            <div className="home-card-icon">⚡</div>
            <div className="home-card-body">
              <span className="home-card-name">Quick Quiz</span>
              <span className="home-card-desc">Timed questions with streak bonuses across 4 coding topics</span>
              <span className="home-card-meta">4 topics · 32 questions</span>
            </div>
            <span className="home-card-arrow">→</span>
          </button>
        </div>

        <ThemePicker current={theme} onChange={onTheme} />

      </div>
    </div>
  )
}

export default function App() {
  const [auth,  setAuth]  = useState(() => authStore.getSession())
  const [mode,  setMode]  = useState('home')
  const [theme, setTheme] = useState(INIT_THEME)

  function changeTheme(id) {
    setTheme(id)
    document.documentElement.setAttribute('data-theme', id)
    localStorage.setItem('cq-theme', id)
  }

  function handleSignOut() {
    authStore.signOut()
    setAuth(null)
    setMode('home')
  }

  if (!auth) return <AuthApp onAuth={setAuth} />
  if (mode === 'quiz')    return <CodeGame   onHome={() => setMode('home')} />
  if (mode === 'courses') return <CoursesApp onHome={() => setMode('home')} />

  return (
    <HomeScreen
      onQuiz={() => setMode('quiz')}
      onCourses={() => setMode('courses')}
      theme={theme}
      onTheme={changeTheme}
      user={auth.user}
      onSignOut={handleSignOut}
    />
  )
}
