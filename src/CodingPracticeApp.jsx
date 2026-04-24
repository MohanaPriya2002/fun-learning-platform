import { useMemo, useState } from 'react';
import { CODING_CHALLENGES, LEVEL_META, LEVEL_ORDER } from './data/codingChallenges.js';

const COMPLETION_KEY = 'cq-practice-progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETION_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(COMPLETION_KEY, JSON.stringify(progress));
}

function buildTutorReply(challenge, message) {
  const input = message.toLowerCase();

  if (input.includes('solution') || input.includes('answer')) {
    return `Here is the full reference solution:\n\n${challenge.solution}\n\nRead it line by line and compare it with your starter code so you can see where the missing logic belongs.`;
  }

  if (input.includes('theory') || input.includes('concept') || input.includes('explain')) {
    return `The core theory for "${challenge.title}" is:\n- ${challenge.theory.join('\n- ')}\n\nA strong next step is to explain the approach in plain English before you type more code.`;
  }

  if (input.includes('test') || input.includes('case')) {
    return `Use these sample checks while you work:\n- ${challenge.tests.join('\n- ')}\n\nEdge cases to keep in mind:\n- ${challenge.edgeCases.join('\n- ')}`;
  }

  if (input.includes('edge')) {
    return `The main edge cases for this problem are:\n- ${challenge.edgeCases.join('\n- ')}\n\nIf your function handles those, the overall logic is usually in good shape.`;
  }

  if (input.includes('hint') || input.includes('stuck') || input.includes('start')) {
    return `Try this hint path:\n- ${challenge.hints.join('\n- ')}\n\nIf you want, ask me for "theory" or "tests" next and I will narrow the guidance even more.`;
  }

  if (input.includes('time') || input.includes('complexity') || input.includes('performance')) {
    if (challenge.id === 'group-anagrams') {
      return 'This version spends most of its time sorting each word to build a stable key. The grouping step is fast after that because object lookups are direct.';
    }
    if (challenge.id === 'flatten-array') {
      return 'The function visits every value in the nested structure, so the work grows with the total number of items. The main complexity comes from how deeply nested the input can become.';
    }
    return 'For this challenge, focus first on getting the logic correct. The solution is already efficient enough for learning because it walks through the data in a direct way.';
  }

  return `A good plan for "${challenge.title}" is:\n- ${challenge.approach.join('\n- ')}\n\nKeep your first version simple, then compare it against the sample tests before refining it.`;
}

function TutorMessage({ role, text }) {
  return (
    <div className={`cp-chat-msg ${role === 'assistant' ? 'cp-chat-ai' : 'cp-chat-user'}`}>
      <div className="cp-chat-role">{role === 'assistant' ? 'AI tutor' : 'You'}</div>
      <pre className="cp-chat-text">{text}</pre>
    </div>
  );
}

export default function CodingPracticeApp({ onHome }) {
  const [selectedLevel, setSelectedLevel] = useState('basic');
  const [selectedId, setSelectedId] = useState(CODING_CHALLENGES[0].id);
  const [editorCode, setEditorCode] = useState(CODING_CHALLENGES[0].starterCode);
  const [chatInput, setChatInput] = useState('');
  const [completed, setCompleted] = useState(loadProgress);
  const [showSolution, setShowSolution] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text:
        'Pick a challenge and ask for a hint, theory, edge cases, or a testing plan. I will stay focused on the current question.',
    },
  ]);

  const challengesByLevel = useMemo(() => {
    return LEVEL_ORDER.reduce((groups, level) => {
      groups[level] = CODING_CHALLENGES.filter((challenge) => challenge.level === level);
      return groups;
    }, {});
  }, []);

  const activeChallenge = useMemo(() => {
    return CODING_CHALLENGES.find((challenge) => challenge.id === selectedId) ?? CODING_CHALLENGES[0];
  }, [selectedId]);

  function selectChallenge(level, id) {
    const nextChallenge =
      CODING_CHALLENGES.find((challenge) => challenge.id === id) ?? CODING_CHALLENGES[0];
    setSelectedLevel(level);
    setSelectedId(nextChallenge.id);
    setEditorCode(nextChallenge.starterCode);
    setShowSolution(false);
    setMessages([
      {
        role: 'assistant',
        text: `We are working on "${nextChallenge.title}". Ask for a hint, theory, testing ideas, or the full solution whenever you need it.`,
      },
    ]);
  }

  function markComplete() {
    const next = {
      ...completed,
      [activeChallenge.id]: true,
    };
    setCompleted(next);
    saveProgress(next);
  }

  function sendMessage(nextMessage) {
    const trimmed = nextMessage.trim();
    if (!trimmed) return;

    const reply = buildTutorReply(activeChallenge, trimmed);
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: reply },
    ]);
    setChatInput('');
  }

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="cq-root">
      <div className="cp-shell">
        <div className="cp-topbar">
          <button className="cs-back" onClick={onHome}>{"<- Home"}</button>
          <div className="cp-topbar-copy">
            <div className="cp-topbar-title">Practice Lab</div>
            <div className="cp-topbar-subtitle">{completedCount} challenges marked complete</div>
          </div>
        </div>

        <div className="cp-layout">
          <aside className="cp-sidebar">
            <div className="cp-panel cp-sidebar-panel">
              <div className="cp-panel-label">Learning path</div>
              {LEVEL_ORDER.map((level) => (
                <div key={level} className="cp-level-block">
                  <button
                    className={`cp-level-tab${selectedLevel === level ? ' active' : ''}`}
                    onClick={() => selectChallenge(level, challengesByLevel[level][0].id)}
                  >
                    <span>{LEVEL_META[level].label}</span>
                    <span>{challengesByLevel[level].length} tasks</span>
                  </button>
                  <p className="cp-level-desc">{LEVEL_META[level].description}</p>
                  {selectedLevel === level && (
                    <div className="cp-challenge-list">
                      {challengesByLevel[level].map((challenge) => (
                        <button
                          key={challenge.id}
                          className={`cp-challenge-item${selectedId === challenge.id ? ' active' : ''}`}
                          onClick={() => selectChallenge(level, challenge.id)}
                        >
                          <div className="cp-challenge-head">
                            <span>{challenge.title}</span>
                            {completed[challenge.id] && <span className="cp-done-badge">Done</span>}
                          </div>
                          <span className="cp-challenge-meta">{challenge.topic}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <main className="cp-main">
            <section className="cp-panel cp-main-panel">
              <div className="cp-hero">
                <div>
                  <div className="cp-kicker">{LEVEL_META[activeChallenge.level].label} challenge</div>
                  <h1 className="cp-title">{activeChallenge.title}</h1>
                  <p className="cp-summary">{activeChallenge.summary}</p>
                </div>
                <button className="cq-btn-ghost cp-complete-btn" onClick={markComplete}>
                  {completed[activeChallenge.id] ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              <div className="cp-grid">
                <div className="cp-card">
                  <div className="cp-card-label">Question</div>
                  <p className="cp-prompt">{activeChallenge.prompt}</p>
                </div>

                <div className="cp-card">
                  <div className="cp-card-label">How to think about it</div>
                  <ul className="cp-list">
                    {activeChallenge.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="cp-card">
                  <div className="cp-card-label">Theory</div>
                  <ul className="cp-list">
                    {activeChallenge.theory.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="cp-card">
                  <div className="cp-card-label">Sample checks</div>
                  <ul className="cp-list">
                    {activeChallenge.tests.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="cp-editor-block">
                <div className="cp-editor-top">
                  <div>
                    <div className="cp-card-label">Code editor</div>
                    <div className="cp-editor-help">Edit the starter code, compare ideas, and use the tutor for hints.</div>
                  </div>
                  <div className="cp-editor-actions">
                    <button className="cq-btn-ghost" onClick={() => setEditorCode(activeChallenge.starterCode)}>
                      Reset Starter
                    </button>
                    <button className="cq-btn-primary" onClick={() => setShowSolution((current) => !current)}>
                      {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>
                </div>

                <textarea
                  className="cp-editor"
                  value={editorCode}
                  onChange={(event) => setEditorCode(event.target.value)}
                  spellCheck="false"
                />

                {showSolution && (
                  <div className="cp-solution">
                    <div className="cp-card-label">Reference solution</div>
                    <pre className="cq-code cp-solution-code"><code>{activeChallenge.solution}</code></pre>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className="cp-chat">
            <section className="cp-panel cp-chat-panel">
              <div className="cp-chat-header">
                <div>
                  <div className="cp-panel-label">Side AI chatbot</div>
                  <p className="cp-chat-subtitle">Ask about theory, hints, edge cases, or how to begin.</p>
                </div>
              </div>

              <div className="cp-chat-shortcuts">
                {['Give me a hint', 'Explain the theory', 'How should I test this?', 'Show edge cases'].map((prompt) => (
                  <button
                    key={prompt}
                    className="cp-chat-chip"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="cp-chat-log">
                {messages.map((message, index) => (
                  <TutorMessage key={`${message.role}-${index}`} role={message.role} text={message.text} />
                ))}
              </div>

              <form
                className="cp-chat-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(chatInput);
                }}
              >
                <textarea
                  className="auth-input cp-chat-input"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask about this challenge or the underlying theory..."
                />
                <button className="auth-btn auth-btn-full" type="submit">Send</button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
