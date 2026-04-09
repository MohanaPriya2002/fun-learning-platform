import { useState } from 'react'
import CodeGame from './CodeGame.jsx'
import CoursesApp from './CoursesApp.jsx'

// Apply saved theme before first paint (no flash)
const INIT_THEME = localStorage.getItem('cq-theme') || 'dark'
document.documentElement.setAttribute('data-theme', INIT_THEME)

const THEMES = [
  { id: 'dark',     name: 'Dark',     dot: '#6366f1' },
  { id: 'light',    name: 'Light',    dot: '#e5e7eb' },
  { id: 'midnight', name: 'Midnight', dot: '#38bdf8' },
  { id: 'sunset',   name: 'Sunset',   dot: '#f97316' },
  { id: 'forest',   name: 'Forest',   dot: '#4ade80' },
  { id: 'candy',    name: 'Candy',    dot: '#e879f9' },
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
          />
        ))}
      </div>
    </div>
  )
}

function HomeScreen({ onQuiz, onCourses, theme, onTheme }) {
  return (
    <div className="home-root">
      <div className="home-wrap">

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
              <span className="home-card-meta">5 modules · 14 lessons</span>
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
  const [mode, setMode] = useState('home')
  const [theme, setTheme] = useState(INIT_THEME)

  function changeTheme(id) {
    setTheme(id)
    document.documentElement.setAttribute('data-theme', id)
    localStorage.setItem('cq-theme', id)
  }

  if (mode === 'quiz')    return <CodeGame   onHome={() => setMode('home')} />
  if (mode === 'courses') return <CoursesApp onHome={() => setMode('home')} />

  return (
    <HomeScreen
      onQuiz={() => setMode('quiz')}
      onCourses={() => setMode('courses')}
      theme={theme}
      onTheme={changeTheme}
    />
  )
}
