import { useState } from 'react'
import jsCourse  from './data/jsCourse.js'
import oopCourse from './data/oopCourse.js'

const COURSES = [jsCourse, oopCourse]
const OPTION_LABELS = ['A', 'B', 'C', 'D']

// ── Helpers ────────────────────────────────────────────────────────────────────

function loadProgress() {
  try {
    const raw = localStorage.getItem('cq-course-progress')
    if (!raw) return { done: [], xp: 0 }
    return JSON.parse(raw)
  } catch {
    return { done: [], xp: 0 }
  }
}

function saveProgress(p) {
  localStorage.setItem('cq-course-progress', JSON.stringify(p))
}

// Convert backtick-delimited text to inline <code> elements and \n to <br>
function renderText(text) {
  if (!text) return null
  const html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="cs-ic">$1</code>')
    .replace(/\n/g, '<br/>')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

// Flatten all lessons in a course into a list [{lesson, module}]
function allLessons(course) {
  return course.modules.flatMap(mod =>
    mod.lessons.map(lesson => ({ lesson, mod }))
  )
}

// ── CoursesApp ────────────────────────────────────────────────────────────────

export default function CoursesApp({ onHome }) {
  const [view, setView]         = useState('list')   // 'list' | 'course' | 'lesson' | 'complete'
  const [course, setCourse]     = useState(null)
  const [lesson, setLesson]     = useState(null)
  const [stepIdx, setStepIdx]   = useState(0)
  const [answered, setAnswered] = useState(null)     // null | 0-3
  const [earnedXP, setEarnedXP] = useState(0)
  const [progress, setProgress] = useState(loadProgress)

  // ── Derived ──────────────────────────────────────────────────────────────────
  const step       = lesson ? lesson.steps[stepIdx] : null
  const totalSteps = lesson ? lesson.steps.length : 0
  const isLastStep = stepIdx === totalSteps - 1
  const isQuiz     = step?.type === 'quiz'
  const canContinue = !isQuiz || answered !== null

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openCourse(c) {
    setCourse(c)
    setView('course')
  }

  function openLesson(l) {
    setLesson(l)
    setStepIdx(0)
    setAnswered(null)
    setEarnedXP(0)
    setView('lesson')
  }

  function handleAnswer(idx) {
    if (answered !== null) return
    setAnswered(idx)
  }

  function handleContinue() {
    if (!canContinue) return

    if (isLastStep) {
      // Lesson complete — award XP only first time
      const isNew = !progress.done.includes(lesson.id)
      const xp    = isNew ? lesson.xp : 0
      const next  = { done: isNew ? [...progress.done, lesson.id] : progress.done, xp: progress.xp + xp }
      setEarnedXP(xp)
      setProgress(next)
      saveProgress(next)
      setView('complete')
    } else {
      setStepIdx(i => i + 1)
      setAnswered(null)
    }
  }

  // Find the lesson that follows the current one across all modules
  function findNextLesson() {
    if (!course || !lesson) return null
    const flat = allLessons(course)
    const idx  = flat.findIndex(e => e.lesson.id === lesson.id)
    return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1].lesson : null
  }

  // ── Option state helper ────────────────────────────────────────────────────
  function optionState(i) {
    if (answered === null) return 'idle'
    if (i === step.correct) return 'correct'
    if (i === answered)     return 'wrong'
    return 'idle'
  }

  // ── VIEW: COURSES LIST ─────────────────────────────────────────────────────
  if (view === 'list') {
    const totalDone  = progress.done.length
    const totalAll   = COURSES.reduce((s, c) => s + allLessons(c).length, 0)

    return (
      <div className="cq-root">
        <div className="cs-shell">

          <div className="cs-topbar">
            <button className="cs-back" onClick={onHome}>← Home</button>
            <span className="cs-xp">✨ {progress.xp} XP</span>
          </div>

          <h1 className="cq-title cs-page-title">Courses</h1>
          <p className="cq-subtitle">{totalDone} / {totalAll} lessons completed</p>

          <div className="cs-course-list">
            {COURSES.map(c => {
              const flat = allLessons(c)
              const done = flat.filter(e => progress.done.includes(e.lesson.id)).length
              const pct  = flat.length ? Math.round(done / flat.length * 100) : 0

              return (
                <button key={c.id} className="cs-course-card" onClick={() => openCourse(c)}>
                  <div className="cs-course-top">
                    <span className="cs-course-icon">{c.icon}</span>
                    <div className="cs-course-meta">
                      <div className="cs-course-title">{c.title}</div>
                      <div className="cs-course-sub">{c.modules.length} modules · {flat.length} lessons</div>
                    </div>
                    <span className="cs-pct">{pct}%</span>
                  </div>
                  <p className="cs-course-desc">{c.desc}</p>
                  <div className="cs-prog-track">
                    <div className="cs-prog-fill" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </div>
    )
  }

  // ── VIEW: COURSE (modules + lessons) ──────────────────────────────────────
  if (view === 'course') {
    const flat = allLessons(course)
    const done = flat.filter(e => progress.done.includes(e.lesson.id)).length
    const pct  = flat.length ? Math.round(done / flat.length * 100) : 0

    return (
      <div className="cq-root">
        <div className="cs-shell">

          <div className="cs-topbar">
            <button className="cs-back" onClick={() => setView('list')}>← Courses</button>
            <span className="cs-xp">✨ {progress.xp} XP</span>
          </div>

          <div className="cs-hero">
            <span className="cs-hero-icon">{course.icon}</span>
            <div>
              <h1 className="cq-title cs-hero-title">{course.title}</h1>
              <p className="cs-course-desc">{course.desc}</p>
            </div>
          </div>

          <div className="cs-overall-prog">
            <div className="cs-prog-track">
              <div className="cs-prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="cs-prog-label">{done}/{flat.length} lessons · {pct}% complete</span>
          </div>

          <div className="cs-modules">
            {course.modules.map((mod, mi) => {
              const modDone = mod.lessons.filter(l => progress.done.includes(l.id)).length
              return (
                <div key={mod.id} className="cs-module">
                  <div className="cs-mod-header">
                    <span className="cs-mod-num">{mi + 1}</span>
                    <span className="cs-mod-icon">{mod.icon}</span>
                    <div className="cs-mod-meta">
                      <span className="cs-mod-title">{mod.title}</span>
                      <span className="cs-mod-sub">{modDone}/{mod.lessons.length} done</span>
                    </div>
                  </div>

                  <div className="cs-lessons">
                    {mod.lessons.map((l, li) => {
                      const isDone = progress.done.includes(l.id)
                      return (
                        <button
                          key={l.id}
                          className={`cs-lesson-row${isDone ? ' cs-done' : ''}`}
                          onClick={() => openLesson(l)}
                        >
                          <span className={`cs-lesson-num${isDone ? ' cs-check' : ''}`}>
                            {isDone ? '✓' : li + 1}
                          </span>
                          <span className="cs-lesson-title">{l.title}</span>
                          <span className="cs-lesson-xp">+{l.xp} XP</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    )
  }

  // ── VIEW: LESSON COMPLETE ─────────────────────────────────────────────────
  if (view === 'complete') {
    const nextLesson = findNextLesson()
    return (
      <div className="cq-root">
        <div className="cs-shell cs-complete">
          <div className="cs-complete-icon">🎉</div>
          <h2 className="cq-finish-title">Lesson Complete!</h2>
          <p className="cs-complete-lesson">{lesson.title}</p>

          {earnedXP > 0
            ? <div className="cs-xp-badge-earned">+{earnedXP} XP earned!</div>
            : <div className="cs-xp-badge-earned cs-xp-repeat">Already completed — keep practising!</div>
          }

          <div className="cq-finish-btns">
            {nextLesson && (
              <button className="cq-btn-primary" onClick={() => openLesson(nextLesson)}>
                Next Lesson →
              </button>
            )}
            <button className="cq-btn-ghost" onClick={() => setView('course')}>
              Back to Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW: LESSON PLAYER ────────────────────────────────────────────────────
  if (view === 'lesson' && step) {
    const pct = ((stepIdx + 1) / totalSteps) * 100

    return (
      <div className="cq-root">
        <div className="cs-player">

          {/* Top bar */}
          <div className="cs-topbar cs-player-topbar">
            <button className="cs-back" onClick={() => setView('course')}>← {course.title}</button>
            <span className="cs-step-count">{stepIdx + 1} / {totalSteps}</span>
          </div>

          {/* Lesson progress bar */}
          <div className="cq-timer-track cs-lesson-bar">
            <div
              className="cs-lesson-fill"
              style={{ width: `${pct}%`, transition: 'width 0.35s ease' }}
            />
          </div>

          {/* Scrollable content */}
          <div className="cs-content">
            <div className="cs-lesson-tag">{lesson.title}</div>

            {/* INFO STEP */}
            {step.type === 'info' && (
              <div className="cs-info">
                <h2 className="cs-heading">{step.heading}</h2>
                <p className="cs-body">{renderText(step.content)}</p>
                {step.code && (
                  <pre className="cq-code cs-code-block"><code>{step.code}</code></pre>
                )}
                {step.tip && (
                  <div className="cs-tip">{step.tip}</div>
                )}
              </div>
            )}

            {/* QUIZ STEP */}
            {step.type === 'quiz' && (
              <div className="cs-quiz">
                <div className="cs-quiz-label">Quiz</div>
                <h2 className="cs-heading">{step.question}</h2>
                {step.code && (
                  <pre className="cq-code cs-code-block"><code>{step.code}</code></pre>
                )}

                <div className="cq-options cs-options">
                  {step.options.map((opt, i) => (
                    <button
                      key={i}
                      className="cq-option"
                      data-state={optionState(i)}
                      disabled={answered !== null}
                      onClick={() => handleAnswer(i)}
                    >
                      <span className="cq-opt-label">{OPTION_LABELS[i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {answered !== null && (
                  <div
                    className="cq-exp-panel cs-feedback"
                    data-correct={answered === step.correct ? 'true' : 'false'}
                  >
                    <div className="cq-exp-header">
                      {answered === step.correct
                        ? '✅ Correct!'
                        : `❌ Not quite. Answer: ${step.options[step.correct]}`}
                    </div>
                    <p className="cq-exp-text">{step.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky footer */}
          {canContinue && (
            <div className="cs-footer">
              <button className="cq-btn-primary cs-continue" onClick={handleContinue}>
                {isLastStep ? 'Complete Lesson ✓' : 'Continue →'}
              </button>
            </div>
          )}

        </div>
      </div>
    )
  }

  return null
}
