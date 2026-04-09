import { useState, useEffect } from 'react'
import './App.css'

const TOTAL_TIME = 15
const MAX_LIVES = 3

const TOPICS = [
  {
    id: 'js',
    label: 'JavaScript',
    icon: '⚡',
    desc: 'Types, closures, arrays & more',
    qs: [
      {
        q: 'What does `typeof null` return?',
        code: 'console.log(typeof null);',
        opts: ['"null"', '"undefined"', '"object"', '"boolean"'],
        ans: 2, xp: 10,
        why: 'A famous JS bug! typeof null returns "object" due to a legacy flaw in JavaScript\'s early design. null is a primitive value, not an object.',
      },
      {
        q: 'What will this log?',
        code: 'console.log(0.1 + 0.2 === 0.3);',
        opts: ['true', 'false', 'NaN', 'TypeError'],
        ans: 1, xp: 15,
        why: 'Floating-point precision! 0.1 + 0.2 = 0.30000000000000004 in JS, not exactly 0.3. Use Number.EPSILON or toFixed() when comparing decimals.',
      },
      {
        q: 'What does this expression return?',
        code: '[1, 2, 3].map(x => x * 2)',
        opts: ['[1, 4, 9]', '[2, 4, 6]', '[3, 6, 9]', 'undefined'],
        ans: 1, xp: 10,
        why: 'map() creates a new array by applying the callback to each element: 1×2=2, 2×2=4, 3×2=6. It never mutates the original array.',
      },
      {
        q: 'Which operator checks both value AND type?',
        code: null,
        opts: ['==', '!=', '===', '=>'],
        ans: 2, xp: 10,
        why: '=== is strict equality — checks value and type. "1" == 1 is true (type coercion), but "1" === 1 is false. Always prefer === in production code.',
      },
      {
        q: 'Does this code throw an error?',
        code: 'const arr = [1, 2, 3];\narr.push(4);',
        opts: ['Yes — TypeError', 'No — arr is now [1,2,3,4]', 'No — silently ignored', 'Yes — SyntaxError'],
        ans: 1, xp: 15,
        why: 'const prevents reassignment, not mutation. You can still push/pop items. You just can\'t do arr = [1,2,3,4].',
      },
      {
        q: 'What is a closure?',
        code: null,
        opts: [
          'A function with no parameters',
          'A way to close browser tabs',
          'An immediately invoked function',
          'A function that remembers its outer scope',
        ],
        ans: 3, xp: 20,
        why: 'A closure is a function that retains access to variables from its outer scope even after that scope has finished executing. Used in callbacks, encapsulation, and more.',
      },
      {
        q: 'What does `undefined == null` evaluate to?',
        code: 'console.log(undefined == null);',
        opts: ['false', 'true', 'TypeError', 'undefined'],
        ans: 1, xp: 15,
        why: 'With loose equality, undefined and null are only equal to each other (not to 0, "", or false). Useful for checking "nullish" values without being strict.',
      },
      {
        q: 'Which method removes the LAST element from an array?',
        code: 'const arr = [1, 2, 3];\nconst last = arr.___();',
        opts: ['shift()', 'pop()', 'splice(-1)', 'remove()'],
        ans: 1, xp: 10,
        why: 'pop() removes and returns the last element (mutates the array). shift() removes the first. splice(-1, 1) also works. slice(-1) returns a new array without mutating.',
      },
    ],
  },
  {
    id: 'html',
    label: 'HTML',
    icon: '🏗️',
    desc: 'Elements, attributes & semantics',
    qs: [
      {
        q: 'Which attribute opens a link in a new tab?',
        code: '<a href="/page" ___>Click me</a>',
        opts: ['tab="_new"', 'open="new"', 'target="_blank"', 'window="tab"'],
        ans: 2, xp: 10,
        why: 'target="_blank" opens a new tab. For security, also add rel="noopener noreferrer" to prevent the new page from accessing window.opener.',
      },
      {
        q: 'What is the correct HTML5 doctype?',
        code: null,
        opts: ['<!DOCTYPE HTML5>', '<!DOCTYPE html>', '<html doctype="5">', '<!DOCTYPE>'],
        ans: 1, xp: 10,
        why: '<!DOCTYPE html> tells browsers to use standards mode. Place it on the very first line of your HTML file, before any other content.',
      },
      {
        q: 'Which of these is a BLOCK-level element?',
        code: null,
        opts: ['<span>', '<a>', '<strong>', '<div>'],
        ans: 3, xp: 10,
        why: '<div> is block-level — takes full width and starts on a new line. <span>, <a>, and <strong> are inline elements that flow with surrounding text.',
      },
      {
        q: 'What does the `alt` attribute do on an image?',
        code: '<img src="logo.png" alt="Company logo">',
        opts: [
          'Shows a tooltip on hover',
          'Provides accessible text & fallback',
          'Defines image dimensions',
          'Sets image alignment',
        ],
        ans: 1, xp: 10,
        why: 'alt text is read by screen readers (accessibility) and shown when images fail to load. Always write meaningful alt text — required for WCAG compliance.',
      },
      {
        q: 'Which attribute makes a form field required?',
        code: '<input type="text" ___>',
        opts: ['mandatory', 'validate', 'required', 'must-fill'],
        ans: 2, xp: 10,
        why: 'required is a boolean attribute that prevents form submission if the field is empty, and shows a native browser validation message.',
      },
      {
        q: 'What does `<meta charset="UTF-8">` do?',
        code: null,
        opts: [
          'Sets the page language',
          'Adds a SEO description',
          'Defines character encoding',
          'Sets the responsive viewport',
        ],
        ans: 2, xp: 10,
        why: 'charset sets how text bytes are interpreted. UTF-8 handles all languages and symbols. Place it in <head> before any text content.',
      },
      {
        q: 'Which element is used for main page navigation?',
        code: null,
        opts: ['<menu>', '<navigation>', '<nav>', '<links>'],
        ans: 2, xp: 10,
        why: '<nav> is semantic HTML for navigation links. Semantic elements improve screen reader accessibility and signal structure to search engines.',
      },
      {
        q: "What's the key difference between <div> and <span>?",
        code: null,
        opts: [
          'No difference — they are identical',
          '<div> is for images; <span> is for text',
          '<div> is block-level; <span> is inline',
          '<div> needs a closing tag; <span> does not',
        ],
        ans: 2, xp: 15,
        why: '<div> is a block-level container (full width, new line). <span> is inline (flows with text). Use <div> for layout sections, <span> to style text inline.',
      },
    ],
  },
  {
    id: 'css',
    label: 'CSS',
    icon: '🎨',
    desc: 'Layout, selectors & the box model',
    qs: [
      {
        q: 'What does `display: flex` do?',
        code: '.container { display: flex; }',
        opts: [
          'Hides the element',
          'Creates a flexible box layout',
          'Floats all children left',
          'Fixes element to the viewport',
        ],
        ans: 1, xp: 10,
        why: 'Flexbox arranges items in rows or columns with powerful alignment and spacing controls. It replaced most float-based layouts.',
      },
      {
        q: 'Which property controls space INSIDE the border?',
        code: null,
        opts: ['margin', 'gap', 'padding', 'inset'],
        ans: 2, xp: 10,
        why: 'padding is the space between content and border (inside the element). margin is outside the border. Padding "puffs up" the element; margin pushes others away.',
      },
      {
        q: '`position: absolute` places the element relative to...',
        code: null,
        opts: [
          'The browser window always',
          'The nearest positioned ancestor',
          'The document <body>',
          'The previous sibling element',
        ],
        ans: 1, xp: 15,
        why: 'Absolute positioning is relative to the nearest ancestor with position: relative/absolute/fixed/sticky. If none exists, it falls back to the viewport.',
      },
      {
        q: 'What is the CSS box model order from OUTSIDE to INSIDE?',
        code: null,
        opts: [
          'padding → border → margin → content',
          'content → padding → border → margin',
          'margin → border → padding → content',
          'border → margin → padding → content',
        ],
        ans: 2, xp: 15,
        why: 'From outside in: margin → border → padding → content. margin creates space outside, border wraps the element, padding cushions the content.',
      },
      {
        q: 'How do you select ALL <p> descendants inside a <div>?',
        code: null,
        opts: ['div + p', 'div.p', 'div > p', 'div p'],
        ans: 3, xp: 15,
        why: '"div p" (descendant combinator) matches any p inside div at any depth. "div > p" is direct children only. "div + p" is the adjacent sibling after div.',
      },
      {
        q: 'What does `box-sizing: border-box` do?',
        code: '* { box-sizing: border-box; }',
        opts: [
          'Adds a border to every element',
          'Makes overflow visible',
          'Includes padding & border in width/height',
          'Creates a drop shadow',
        ],
        ans: 2, xp: 20,
        why: 'With border-box, padding and border are included in declared width/height. A 200px div stays 200px total — much more predictable than the default content-box.',
      },
      {
        q: 'What does `z-index` control?',
        code: null,
        opts: [
          'Element zoom level',
          'Stacking order (which element is on top)',
          'Horizontal position',
          'Transparency / opacity',
        ],
        ans: 1, xp: 10,
        why: 'z-index controls layering when elements overlap. Higher values come to the front. It only works on positioned elements (not position: static).',
      },
      {
        q: "Which unit is relative to the ROOT element's font size?",
        code: null,
        opts: ['em', '%', 'vw', 'rem'],
        ans: 3, xp: 10,
        why: 'rem (root em) is relative to the <html> font size. em is relative to the parent — which can compound unexpectedly. Use rem for consistent, scalable typography.',
      },
    ],
  },
  {
    id: 'react',
    label: 'React',
    icon: '⚛️',
    desc: 'Components, hooks & state',
    qs: [
      {
        q: 'Which hook manages state in a function component?',
        code: 'const [count, setCount] = ___(0);',
        opts: ['useEffect', 'useRef', 'useContext', 'useState'],
        ans: 3, xp: 10,
        why: 'useState returns [currentValue, setter]. Calling the setter with a new value schedules a re-render. The argument is the initial state value.',
      },
      {
        q: 'What triggers a React component to re-render?',
        code: null,
        opts: [
          'Writing a comment in JSX',
          'Importing a new module',
          'State or prop changes',
          'Calling a regular function',
        ],
        ans: 2, xp: 10,
        why: 'React re-renders when state changes (via a setter) or when the parent passes new props. Context changes also trigger re-renders. This reactivity drives the UI.',
      },
      {
        q: 'Why is the `key` prop important in lists?',
        code: 'items.map(i => <li key={i.id}>{i.name}</li>)',
        opts: [
          'Required for JSX to compile',
          'Helps React identify which items changed',
          'Sets the element CSS id',
          'Only used for accessibility',
        ],
        ans: 1, xp: 15,
        why: "Keys help React's reconciler track which items were added, removed, or reordered. Without stable keys, you can get subtle bugs or unnecessary re-renders.",
      },
      {
        q: 'useEffect with an empty `[]` dependency array runs...',
        code: 'useEffect(() => { fetchData(); }, []);',
        opts: [
          'On every render',
          'Once after the initial render',
          'Before the component mounts',
          'Never',
        ],
        ans: 1, xp: 15,
        why: 'Empty [] means no dependencies — run once after mount. This is the functional equivalent of componentDidMount and is ideal for initial data fetching.',
      },
      {
        q: 'What is JSX?',
        code: 'return <div className="card">Hello!</div>;',
        opts: [
          'A newer JavaScript version',
          'A React CSS framework',
          'HTML inside a .css file',
          'Syntax for HTML-like code in JS',
        ],
        ans: 3, xp: 10,
        why: 'JSX is compiled by Babel into React.createElement() calls. It looks like HTML but lives in JS — note className instead of class, camelCase events, and {expressions}.',
      },
      {
        q: 'What is a "prop" in React?',
        code: 'function Greet({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}',
        opts: [
          'Internal component state',
          'A CSS property shorthand',
          'Data passed from parent to child',
          'A React lifecycle method',
        ],
        ans: 2, xp: 10,
        why: 'Props flow data down from parent to child components. They are read-only inside the child — think of them as arguments to the component function.',
      },
      {
        q: 'What does React.Fragment (or <>) do?',
        code: 'return (\n  <>\n    <h1>Title</h1>\n    <p>Body</p>\n  </>\n);',
        opts: [
          'Creates a hidden DOM element',
          'Lazily loads children',
          'Groups elements without a DOM node',
          'Splits into sub-components',
        ],
        ans: 2, xp: 15,
        why: 'Fragment lets you return multiple sibling elements without wrapping them in an extra <div>, avoiding unnecessary DOM nesting. <> is the shorthand syntax.',
      },
      {
        q: "What does calling useState's setter function do?",
        code: 'const [count, setCount] = useState(0);\nsetCount(count + 1);',
        opts: [
          'Nothing — state is immutable',
          'Throws an error',
          'Schedules a re-render with new value',
          'Updates but skips re-render',
        ],
        ans: 2, xp: 10,
        why: 'Calling the setter schedules a re-render with the new value. React batches multiple setter calls and re-renders efficiently. The component function runs again.',
      },
    ],
  },
]

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function CodeGame({ onHome }) {
  const [screen, setScreen] = useState('home')
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timer, setTimer] = useState(TOTAL_TIME)
  const [correctCount, setCorrectCount] = useState(0)
  const [earnedXP, setEarnedXP] = useState(0)

  useEffect(() => {
    if (screen !== 'playing' || selected !== null) return
    if (timer === 0) {
      setSelected(-1)
      setShowExp(true)
      setLives(l => l - 1)
      setStreak(0)
      setEarnedXP(0)
      return
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [screen, timer, selected])

  const q = questions[qIdx] ?? null

  function startGame(t) {
    setTopic(t)
    setQuestions([...t.qs].sort(() => Math.random() - 0.5))
    setQIdx(0)
    setSelected(null)
    setShowExp(false)
    setLives(MAX_LIVES)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTimer(TOTAL_TIME)
    setCorrectCount(0)
    setEarnedXP(0)
    setScreen('playing')
  }

  function handleAnswer(idx) {
    if (selected !== null) return
    const correct = idx === q.ans
    setSelected(idx)
    setShowExp(true)
    if (correct) {
      const newStreak = streak + 1
      const bonus = newStreak >= 2 ? Math.min(newStreak * 5, 25) : 0
      const xp = q.xp + bonus
      setEarnedXP(xp)
      setScore(s => s + xp)
      setStreak(newStreak)
      setMaxStreak(ms => Math.max(ms, newStreak))
      setCorrectCount(c => c + 1)
    } else {
      setEarnedXP(0)
      setStreak(0)
      setLives(l => l - 1)
    }
  }

  function next() {
    if (lives <= 0 || qIdx + 1 >= questions.length) {
      setScreen('finished')
      return
    }
    setQIdx(i => i + 1)
    setSelected(null)
    setShowExp(false)
    setTimer(TOTAL_TIME)
    setEarnedXP(0)
  }

  function optionState(i) {
    if (selected === null) return 'idle'
    if (i === q.ans) return 'correct'
    if (i === selected) return 'wrong'
    return 'idle'
  }

  const timerPct = (timer / TOTAL_TIME) * 100
  const timerColor = timer >= 8 ? 'green' : timer >= 4 ? 'yellow' : 'red'
  const isLastOrGameOver = !questions.length || qIdx + 1 >= questions.length || lives <= 0

  // ── HOME ─────────────────────────────────────────────────────────────────────
  if (screen === 'home') return (
    <div className="cq-root">
      <div className="cq-home">
        <div className="cq-logo">🎮</div>
        <h1 className="cq-title">Code Quest</h1>
        <p className="cq-subtitle">Level up your coding knowledge — one question at a time</p>
        <div className="cq-topic-grid">
          {TOPICS.map(t => (
            <button key={t.id} className="cq-topic-card" onClick={() => startGame(t)}>
              <span className="cq-topic-icon">{t.icon}</span>
              <span className="cq-topic-name">{t.label}</span>
              <span className="cq-topic-desc">{t.desc}</span>
              <span className="cq-topic-count">{t.qs.length} questions</span>
            </button>
          ))}
        </div>
        <div className="cq-rules">
          <span>❤️ {MAX_LIVES} lives</span>
          <span>⏱ {TOTAL_TIME}s per question</span>
          <span>🔥 Streak bonus XP</span>
        </div>
        {onHome && (
          <button className="cq-btn-ghost cq-home-back" onClick={onHome}>
            ← Back to Home
          </button>
        )}
      </div>
    </div>
  )

  // ── FINISHED ─────────────────────────────────────────────────────────────────
  if (screen === 'finished') {
    const accuracy = questions.length ? Math.round((correctCount / questions.length) * 100) : 0
    const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : accuracy >= 30 ? 1 : 0
    const outOfLives = lives <= 0
    return (
      <div className="cq-root">
        <div className="cq-finished">
          <div className="cq-finish-icon">{outOfLives ? '💀' : '🏆'}</div>
          <h2 className="cq-finish-title">{outOfLives ? 'Game Over!' : 'Quest Complete!'}</h2>
          <div className="cq-stars">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < stars ? 'star-on' : 'star-off'}>★</span>
            ))}
          </div>
          <div className="cq-stats">
            <div className="cq-stat">
              <span className="cq-stat-val">{score}</span>
              <span className="cq-stat-label">XP Earned</span>
            </div>
            <div className="cq-stat">
              <span className="cq-stat-val">{accuracy}%</span>
              <span className="cq-stat-label">Accuracy</span>
            </div>
            <div className="cq-stat">
              <span className="cq-stat-val">{correctCount}/{questions.length}</span>
              <span className="cq-stat-label">Correct</span>
            </div>
            <div className="cq-stat">
              <span className="cq-stat-val">{maxStreak}</span>
              <span className="cq-stat-label">Best Streak</span>
            </div>
          </div>
          <div className="cq-finish-btns">
            <button className="cq-btn-primary" onClick={() => startGame(topic)}>Play Again</button>
            <button className="cq-btn-ghost" onClick={() => setScreen('home')}>Change Topic</button>
          </div>
        </div>
      </div>
    )
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────────
  return (
    <div className="cq-root">
      <div className="cq-playing">

        <div className="cq-hud">
          <div className="cq-lives">
            {Array.from({ length: MAX_LIVES }, (_, i) => (
              <span key={i} className={i < lives ? 'heart-on' : 'heart-off'}>♥</span>
            ))}
          </div>
          <div className="cq-topic-badge">{topic.icon} {topic.label}</div>
          <div className="cq-score-badge">✨ {score} XP</div>
        </div>

        <div className="cq-timer-track">
          <div
            className={`cq-timer-fill cq-timer-${timerColor}`}
            style={{
              width: `${timerPct}%`,
              transition: timer === TOTAL_TIME ? 'none' : 'width 1s linear',
            }}
          />
        </div>

        <div className="cq-timer-meta">
          <span className="cq-qcount">Q {qIdx + 1} / {questions.length}</span>
          {streak >= 2 && <span className="cq-streak">🔥 {streak}× streak</span>}
          <span className="cq-timer-num" data-urgent={timer <= 4 ? 'true' : 'false'}>{timer}s</span>
        </div>

        <div className="cq-question-area">
          <p className="cq-question">{q.q}</p>
          {q.code && <pre className="cq-code"><code>{q.code}</code></pre>}
        </div>

        <div className="cq-options">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className="cq-option"
              data-state={optionState(i)}
              disabled={selected !== null}
              onClick={() => handleAnswer(i)}
            >
              <span className="cq-opt-label">{OPTION_LABELS[i]}</span>
              {opt}
            </button>
          ))}
        </div>

        {showExp && (
          <div className="cq-exp-panel" data-correct={selected === q.ans ? 'true' : 'false'}>
            <div className="cq-exp-header">
              {selected === q.ans
                ? `✅ Correct! +${earnedXP} XP${streak >= 2 ? ` 🔥 ${streak}× streak` : ''}`
                : selected === -1
                  ? `⏰ Time's up! The answer was: ${q.opts[q.ans]}`
                  : `❌ Not quite. Correct answer: ${q.opts[q.ans]}`}
            </div>
            <p className="cq-exp-text">{q.why}</p>
            <button className="cq-btn-primary" onClick={next}>
              {isLastOrGameOver ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
