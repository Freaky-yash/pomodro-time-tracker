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
Because this is a plain HTML/CSS/JS app, you can run it in multiple ways:

### Option 1: Open directly
Open `index.html` in your browser.

### Option 2: Serve with Python
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
