const { useEffect, useMemo, useState } = React;

const DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const STORAGE_KEY = 'student-productivity-hub-v2';

function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function App() {
  const saved = loadStorage();

  const [accounts, setAccounts] = useState(saved?.accounts || []);
  const [session, setSession] = useState(saved?.session || null);
  const [tasks, setTasks] = useState(saved?.tasks || []);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(saved?.completedFocusSessions || 0);
  const [sessionHistory, setSessionHistory] = useState(saved?.sessionHistory || {});
  const [mode, setMode] = useState('focus');
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState(saved?.theme || 'aurora');
  const [backgroundImage, setBackgroundImage] = useState(saved?.backgroundImage || '');
  const [workspaceTab, setWorkspaceTab] = useState('dashboard');
  const [page, setPage] = useState('home');
  const [music, setMusic] = useState(saved?.music || {
    provider: 'spotify',
    connected: false,
    lastTrackUrl: '',
    nowPlaying: false,
  });

  useEffect(() => {
    saveStorage({
      accounts,
      session,
      tasks,
      completedFocusSessions,
      sessionHistory,
      theme,
      backgroundImage,
      music,
    });
  }, [accounts, session, tasks, completedFocusSessions, sessionHistory, theme, backgroundImage, music]);

  useEffect(() => {
    let id;
    if (isRunning) {
      id = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            finishSession(mode);
            return DURATIONS.focus;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isRunning, mode]);

  useEffect(() => {
    document.title = `${formatTime(remaining)} • FocusForge`;
  }, [remaining]);

  function finishSession(currentMode) {
    if (currentMode === 'focus') {
      setCompletedFocusSessions((s) => s + 1);
      setSessionHistory((prev) => {
        const key = getDateKey();
        return { ...prev, [key]: (prev[key] || 0) + 1 };
      });
      setMode('shortBreak');
      setRemaining(DURATIONS.shortBreak);
      alert('Great focus block complete. Take a short break.');
    } else {
      setMusic((m) => ({ ...m, nowPlaying: false }));
      setMode('focus');
      setRemaining(DURATIONS.focus);
      alert('Break ended. Music stopped, back to focus mode.');
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setRemaining(DURATIONS[nextMode]);
    setIsRunning(false);
  }

  function addTask(text) {
    setTasks((prev) => [{ id: crypto.randomUUID(), text, done: false, pomodoros: 0 }, ...prev]);
  }

  function updateTask(id, patch) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleWallpaperUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackgroundImage(reader.result?.toString() || '');
    reader.readAsDataURL(file);
  }

  function signUp(email, password, name) {
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      alert('Email already exists. Please sign in.');
      return;
    }
    const newAccount = { id: crypto.randomUUID(), name, email, password };
    setAccounts((prev) => [...prev, newAccount]);
    setSession({ id: newAccount.id, name: newAccount.name, email: newAccount.email });
    setPage('home');
  }

  function signIn(email, password) {
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!account) {
      alert('Invalid email or password.');
      return;
    }
    setSession({ id: account.id, name: account.name, email: account.email });
    setPage('home');
  }

  const report = useMemo(() => {
    const entries = Object.entries(sessionHistory);
    const daily = sessionHistory[getDateKey()] || 0;

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);

    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 29);

    let weekly = 0;
    let monthly = 0;

    entries.forEach(([date, count]) => {
      const d = new Date(`${date}T00:00:00`);
      if (d >= weekAgo) weekly += count;
      if (d >= monthAgo) monthly += count;
    });

    return { daily, weekly, monthly, entries: entries.sort((a, b) => b[0].localeCompare(a[0])) };
  }, [sessionHistory]);

  const rootStyle = {
    backgroundImage: backgroundImage
      ? `linear-gradient(rgba(8,12,20,.62), rgba(8,12,20,.62)), url(${backgroundImage})`
      : undefined,
  };

  return (
    <div className={`app theme-${theme}`} style={rootStyle}>
      {!session ? (
        <AuthCard onSignIn={signIn} onSignUp={signUp} />
      ) : (
        <>
          <header className="brand-header">
            <div className="brand-left">
              <div className="logo-badge" aria-hidden="true">⏱️</div>
              <div>
                <h1>FocusForge</h1>
                <p>Build elite study focus, one session at a time.</p>
              </div>
            </div>
            <div className="row">
              <button onClick={() => setPage('home')}>Home</button>
              <button onClick={() => setPage('workspace')}>Workspace</button>
              <button onClick={() => { setSession(null); setPage('home'); }}>Sign out</button>
            </div>
          </header>

          {page === 'home' && (
            <section className="card home-card">
              <h2>Study Session Timer</h2>
              <div className="timer">{formatTime(remaining)}</div>
              <div className="modes">
                <button className={mode === 'focus' ? 'active' : ''} onClick={() => switchMode('focus')}>Focus</button>
                <button className={mode === 'shortBreak' ? 'active' : ''} onClick={() => switchMode('shortBreak')}>Short Break</button>
                <button className={mode === 'longBreak' ? 'active' : ''} onClick={() => switchMode('longBreak')}>Long Break</button>
              </div>
              <div className="row">
                <button onClick={() => setIsRunning((v) => !v)}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={() => { setIsRunning(false); setRemaining(DURATIONS[mode]); }}>Reset</button>
                <button onClick={() => finishSession(mode)}>Skip</button>
              </div>
              <p>Completed Focus Sessions: <strong>{completedFocusSessions}</strong></p>

              <section className="music-block">
                <h3>Music Player</h3>
                <p>Just below your timer so you can control your sound without losing focus.</p>
                <label>
                  Provider
                  <select
                    value={music.provider}
                    onChange={(e) => setMusic((m) => ({ ...m, provider: e.target.value }))}
                  >
                    <option value="spotify">Spotify</option>
                    <option value="youtube">YouTube Music</option>
                    <option value="soundcloud">SoundCloud</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <div className="row">
                  <button onClick={() => setMusic((m) => ({ ...m, connected: !m.connected }))}>
                    {music.connected ? 'Disconnect' : `Sign in to ${music.provider}`}
                  </button>
                  <button
                    disabled={!music.connected || !music.lastTrackUrl}
                    onClick={() => setMusic((m) => ({ ...m, nowPlaying: !m.nowPlaying }))}
                  >
                    {music.nowPlaying ? 'Stop music' : 'Play last track'}
                  </button>
                </div>
                <input
                  placeholder="Paste track/share URL"
                  value={music.lastTrackUrl}
                  onChange={(e) => setMusic((m) => ({ ...m, lastTrackUrl: e.target.value }))}
                />
                {music.nowPlaying && music.lastTrackUrl && (
                  <iframe title="music" src={music.lastTrackUrl} className="music-frame" allow="autoplay; encrypted-media" />
                )}
              </section>

              <button className="workspace-cta" onClick={() => setPage('workspace')}>Go to Dashboard & Reports</button>
            </section>
          )}

          {page === 'workspace' && (
            <>
              <nav className="tabs card">
                <button className={workspaceTab === 'dashboard' ? 'active' : ''} onClick={() => setWorkspaceTab('dashboard')}>Dashboard</button>
                <button className={workspaceTab === 'reports' ? 'active' : ''} onClick={() => setWorkspaceTab('reports')}>Reports</button>
                <button className={workspaceTab === 'study' ? 'active' : ''} onClick={() => setWorkspaceTab('study')}>Study</button>
              </nav>

              {workspaceTab === 'dashboard' && (
                <section className="card">
                  <h2>Dashboard & Task Planner</h2>
                  <TaskSection tasks={tasks} onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask} />
                </section>
              )}

              {workspaceTab === 'reports' && (
                <section className="card">
                  <h2>Student Reports</h2>
                  <div className="stats-grid">
                    <article><h3>Daily</h3><p>{report.daily} focus sessions</p></article>
                    <article><h3>Weekly</h3><p>{report.weekly} focus sessions</p></article>
                    <article><h3>Monthly</h3><p>{report.monthly} focus sessions</p></article>
                  </div>
                  <h3>Recent Daily Logs</h3>
                  <ul className="report-list">
                    {report.entries.length === 0 && <li>No sessions yet.</li>}
                    {report.entries.map(([date, count]) => (
                      <li key={date}><span>{date}</span><strong>{count} sessions</strong></li>
                    ))}
                  </ul>
                </section>
              )}

              {workspaceTab === 'study' && (
                <section className="card controls-grid">
                  <label>
                    Theme
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                      <option value="aurora">Aurora</option>
                      <option value="sunset">Sunset</option>
                      <option value="midnight">Midnight</option>
                    </select>
                  </label>
                  <label>
                    Upload Wallpaper (from your computer)
                    <input type="file" accept="image/*" onChange={handleWallpaperUpload} />
                  </label>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function AuthCard({ onSignIn, onSignUp }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit(e) {
    e.preventDefault();
    if (isSignup) {
      onSignUp(email.trim(), password, name.trim() || 'Student');
    } else {
      onSignIn(email.trim(), password);
    }
  }

  return (
    <main className="auth-wrap">
      <section className="card auth-card">
        <h1 className="auth-title">FocusForge</h1>
        <p className="auth-tagline">Forge deep focus. Turn study hours into unstoppable progress.</p>
        <h2>{isSignup ? 'Create account' : 'Sign in'}</h2>
        <form onSubmit={submit} className="auth-form">
          {isSignup && (
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
          <button type="submit">{isSignup ? 'Sign up' : 'Sign in'}</button>
        </form>
        <button className="link" onClick={() => setIsSignup((v) => !v)}>
          {isSignup ? 'Already have an account? Sign in' : 'New student? Create an account'}
        </button>
      </section>
    </main>
  );
}

function TaskSection({ tasks, onAdd, onUpdate, onDelete }) {
  const [text, setText] = useState('');

  function submit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText('');
  }

  return (
    <>
      <form onSubmit={submit} className="task-form">
        <input
          value={text}
          maxLength={120}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a study task"
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.length === 0 && <li className="empty">No tasks yet.</li>}
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={(e) => onUpdate(task.id, { done: e.target.checked })}
              />
              <span>{task.text} {task.pomodoros > 0 ? `(${task.pomodoros})` : ''}</span>
            </label>
            <div className="row">
              <button onClick={() => onUpdate(task.id, { pomodoros: task.pomodoros + 1 })}>+1 Pomodoro</button>
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
