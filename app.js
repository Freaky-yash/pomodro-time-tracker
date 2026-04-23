const DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const timerDisplay = document.getElementById('timerDisplay');
const sessionCountEl = document.getElementById('sessionCount');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const modeButtons = [...document.querySelectorAll('.mode-btn')];
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let mode = 'focus';
let remaining = DURATIONS[mode];
let intervalId = null;

const state = {
  completedFocusSessions: 0,
  tasks: [],
};

function saveState() {
  localStorage.setItem('pomodoro-student-tracker', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('pomodoro-student-tracker');
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.completedFocusSessions = Number(parsed.completedFocusSessions) || 0;
    state.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
  } catch {
    // Ignore malformed storage.
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(remaining);
  document.title = `${timerDisplay.textContent} • Pomodoro`;
}

function renderStats() {
  sessionCountEl.textContent = String(state.completedFocusSessions);
}

function renderTasks() {
  taskList.innerHTML = '';

  if (state.tasks.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No tasks yet. Add one to start studying!';
    empty.className = 'task-item';
    taskList.appendChild(empty);
    return;
  }

  state.tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'completed' : ''}`;

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as done`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveState();
      renderTasks();
    });

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    left.append(checkbox, text);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const focusBtn = document.createElement('button');
    focusBtn.type = 'button';
    focusBtn.textContent = '+1 Pomodoro';
    focusBtn.addEventListener('click', () => {
      task.pomodoros = (task.pomodoros || 0) + 1;
      text.textContent = `${task.text} (${task.pomodoros})`;
      saveState();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      state.tasks = state.tasks.filter((t) => t.id !== task.id);
      saveState();
      renderTasks();
    });

    if (task.pomodoros) {
      text.textContent = `${task.text} (${task.pomodoros})`;
    }

    actions.append(focusBtn, deleteBtn);
    li.append(left, actions);
    taskList.appendChild(li);
  });
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  startPauseBtn.textContent = 'Start';
}

function switchMode(nextMode) {
  mode = nextMode;
  remaining = DURATIONS[nextMode];

  modeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === nextMode);
  });

  stopTimer();
  renderTimer();
}

function finishCurrentSession() {
  if (mode === 'focus') {
    state.completedFocusSessions += 1;
    saveState();
    renderStats();
    alert('Great work! Focus session completed. Take a break now.');
  } else {
    alert('Break done! Ready for the next focus session?');
  }

  switchMode('focus');
}

function startTimer() {
  if (intervalId) return;

  startPauseBtn.textContent = 'Pause';
  intervalId = setInterval(() => {
    remaining -= 1;
    renderTimer();

    if (remaining <= 0) {
      stopTimer();
      finishCurrentSession();
    }
  }, 1000);
}

function pauseTimer() {
  stopTimer();
}

startPauseBtn.addEventListener('click', () => {
  if (intervalId) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', () => {
  remaining = DURATIONS[mode];
  stopTimer();
  renderTimer();
});

skipBtn.addEventListener('click', () => {
  finishCurrentSession();
});

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  state.tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
    pomodoros: 0,
  });

  taskInput.value = '';
  saveState();
  renderTasks();
});

loadState();
renderTimer();
renderStats();
renderTasks();
