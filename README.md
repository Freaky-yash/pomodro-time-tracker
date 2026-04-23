# Student Productivity Hub (ReactJS)

This project is now an enhanced **ReactJS-based student productivity app** with login/signup, study sessions, reports, theming, wallpaper upload, and music controls.

## Major features

- **Auth pages**: Sign in and sign up flows (stored locally in browser storage for demo use).
- **Dashboard** with sections:
  - **Study Session**: Pomodoro timer with Focus / Short Break / Long Break modes.
  - **Task Planner**: Add, complete, delete tasks, and increment `+1 Pomodoro` per task.
  - **Reports**: Daily, weekly, and monthly focus-session summaries.
- **Music system**:
  - Choose provider (Spotify, YouTube Music, SoundCloud, Other).
  - Simulated provider sign-in/connect state.
  - Save/paste your last track URL and play/stop it in-app.
  - Auto-stop music when a break ends.
- **Personalization**:
  - Theme selector.
  - Upload custom wallpaper from your own computer.

## Run locally

1. Open `index.html` in a modern browser with internet access (for React/Babel CDN scripts).
2. Create an account and start using the dashboard.

> Note: This is a front-end demo app. Music "provider sign in" is simulated and does not yet perform OAuth with real provider APIs.

## Tech

- `index.html`: root file + CDN React/Babel setup
- `app.js`: React components and application state logic
- `style.css`: responsive styling and themes
