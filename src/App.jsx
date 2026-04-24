import { useState } from 'react';
import AuthApp from './AuthApp.jsx';
import CodeGame from './CodeGame.jsx';
import CodingPracticeApp from './CodingPracticeApp.jsx';
import CoursesApp from './CoursesApp.jsx';
import * as authStore from './authStore.js';

const INIT_THEME = localStorage.getItem('cq-theme') || 'dark';
document.documentElement.setAttribute('data-theme', INIT_THEME);

const THEMES = [
  { id: 'dark', name: 'Dark', dot: 'linear-gradient(135deg,#818cf8,#c084fc)' },
  { id: 'light', name: 'Light', dot: 'linear-gradient(135deg,#3852B4,#6366f1)' },
  { id: 'coral', name: 'Coral', dot: 'linear-gradient(135deg,#FF5A5A,#ff8fa3)' },
  { id: 'blush', name: 'Blush', dot: 'linear-gradient(135deg,#FFCEE3,#FF5A5A)' },
  { id: 'ocean', name: 'Ocean', dot: 'linear-gradient(135deg,#3852B4,#38bdf8)' },
  { id: 'midnight', name: 'Night', dot: 'linear-gradient(135deg,#38bdf8,#818cf8)' },
];

function ThemePicker({ current, onChange }) {
  return (
    <div className="tp-wrap">
      <span className="tp-label">Theme</span>
      <div className="tp-swatches">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            className={`tp-swatch${current === theme.id ? ' active' : ''}`}
            style={{ '--dot': theme.dot }}
            onClick={() => onChange(theme.id)}
            title={theme.name}
          >
            <span className="tp-dot" />
            <span className="tp-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeScreen({ onQuiz, onCourses, onPractice, theme, onTheme, user, onSignOut }) {
  return (
    <div className="home-root">
      <div className="home-wrap">
        <div className="home-user-bar">
          <div className="home-user-avatar">{user.username[0].toUpperCase()}</div>
          <span className="home-user-name">{user.username}</span>
          <button className="home-signout" onClick={onSignOut} title="Sign out">
            Sign out
          </button>
        </div>

        <div className="home-brand">
          <div className="home-icon">CQ</div>
          <h1 className="home-title">Code Quest</h1>
          <p className="home-tagline">Your interactive journey to learning code</p>
        </div>

        <div className="home-cards">
          <button className="home-card" onClick={onCourses}>
            <div className="home-card-icon">JS</div>
            <div className="home-card-body">
              <span className="home-card-name">Courses</span>
              <span className="home-card-desc">Step-by-step lessons from zero through JavaScript fundamentals and object-oriented thinking.</span>
              <span className="home-card-meta">2 courses · 32 lessons</span>
            </div>
            <span className="home-card-arrow">-&gt;</span>
          </button>

          <button className="home-card" onClick={onPractice}>
            <div className="home-card-icon">{'</>'}</div>
            <div className="home-card-body">
              <span className="home-card-name">Practice Lab</span>
              <span className="home-card-desc">Solve coding questions from basic to hard inside an editor with a side AI tutor for hints and theory.</span>
              <span className="home-card-meta">3 levels · 6 coding tasks · mentor chat</span>
            </div>
            <span className="home-card-arrow">-&gt;</span>
          </button>

          <button className="home-card" onClick={onQuiz}>
            <div className="home-card-icon">QZ</div>
            <div className="home-card-body">
              <span className="home-card-name">Quick Quiz</span>
              <span className="home-card-desc">Timed multiple-choice questions across JavaScript, HTML, CSS, and React topics.</span>
              <span className="home-card-meta">4 topics · 32 questions</span>
            </div>
            <span className="home-card-arrow">-&gt;</span>
          </button>
        </div>

        <ThemePicker current={theme} onChange={onTheme} />
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(() => authStore.getSession());
  const [mode, setMode] = useState('home');
  const [theme, setTheme] = useState(INIT_THEME);

  function changeTheme(id) {
    setTheme(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('cq-theme', id);
  }

  function handleSignOut() {
    authStore.signOut();
    setAuth(null);
    setMode('home');
  }

  if (!auth) return <AuthApp onAuth={setAuth} />;
  if (mode === 'practice') return <CodingPracticeApp onHome={() => setMode('home')} />;
  if (mode === 'quiz') return <CodeGame onHome={() => setMode('home')} />;
  if (mode === 'courses') return <CoursesApp onHome={() => setMode('home')} />;

  return (
    <HomeScreen
      onQuiz={() => setMode('quiz')}
      onCourses={() => setMode('courses')}
      onPractice={() => setMode('practice')}
      theme={theme}
      onTheme={changeTheme}
      user={auth.user}
      onSignOut={handleSignOut}
    />
  );
}
