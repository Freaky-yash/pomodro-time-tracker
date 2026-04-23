# FocusForge (ReactJS)

FocusForge is a student productivity app with a timer-first home screen, a cleaner workspace, and a dedicated settings section.

## Updated flow

- **Sign-in page**: centered FocusForge title and tagline.
- **Home page after sign in**:
  - Big study timer centered on the page.
  - Floating music player at the bottom-right corner.
  - Floating study-session video link at bottom-left.
  - Full-screen toggle button visible on the first page.
- **Workspace page**:
  - Dashboard tab (tasks)
  - Reports tab (daily / weekly / monthly)
  - Settings tab (theme, wallpaper, tune, fullscreen, logout)

## Settings included

- Theme picker (Violet default, Aurora, Sunset, Midnight, Forest)
- Custom wallpaper upload from local computer
- Custom Focus / Short Break / Long Break minute limits
- 5 session-end tunes with preview option
- Full-screen toggle for immersive mode
- Logout action inside Settings

## Core features

- Pomodoro timer modes (Focus / Short Break / Long Break)
- End-of-session sound for both focus and break completion
- Task management with per-task Pomodoro increments
- Daily/weekly/monthly focus session reporting
- Music panel with provider choice and simulated sign-in
- Music auto-stops when break ends

## Run locally

1. Open `index.html` in a modern browser with internet access (for React/Babel CDN scripts).
2. Sign up or sign in to enter FocusForge.

> Note: Music provider sign-in is simulated in this front-end demo and does not yet use real OAuth APIs.

## Visual defaults

- Sign-in page always uses a clean default violet theme.
- After logout, the sign-in page does not reuse the previously selected in-app wallpaper.
