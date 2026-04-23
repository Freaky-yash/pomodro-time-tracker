# Student Pomodoro Time Task Tracker

A simple, zero-dependency Pomodoro app for students to improve study productivity.

## Features
- 25/5/15 minute Pomodoro modes (Focus, Short Break, Long Break)
- Start / Pause / Reset / Skip timer controls
- Track completed focus sessions
- Add, complete, and delete study tasks
- Track Pomodoro count per task (`+1 Pomodoro`)
- Saves progress in browser `localStorage`

## Run locally
You **do not need Python** to use this app.

### Option 1 (recommended): Open directly
Open `index.html` in your browser.

### Option 2 (only if you prefer a local server)
Use any static server. Python is just one common built-in option:

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Project structure
- `index.html` – app UI
- `style.css` – styling and layout
- `app.js` – timer and task logic

## Student productivity tips
- Pick **1 clear task** before pressing Start.
- Put your phone away during each focus block.
- During breaks, stand up, hydrate, and avoid doom-scrolling.
- After every 4 focus sessions, take a longer break.
