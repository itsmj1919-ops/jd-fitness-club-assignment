# JD Fitness Club Training Desk

Training Desk is the separate assignment application for COMSATS University Islamabad, Wah Campus, Software Engineering Assignment 01. It is intentionally implemented with plain HTML, CSS, and JavaScript so the application remains easy to inspect and deploy as a static site.

## Purpose

The app helps a gym member capture a small list of training tasks and save one short practice note. Tasks can be added, completed, deleted, and filtered. The note title and reflection are saved in the browser with `localStorage`, so no backend is required.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server. From the repository root, run:

```bash
pnpm verify:assignment
```

## DevOps flow

The repository workflow runs on pushes and pull requests targeting `main`. It verifies the assignment structure, runs the existing project tests, performs TypeScript validation, and creates a production build. A second workflow deploys the `assignment-app/` folder to GitHub Pages after CI succeeds on `main`.

## Features

- Add, complete, delete, and filter training tasks.
- Persist tasks and the practice note in local browser storage.
- Responsive layout for desktop and mobile screens.
- Keyboard-accessible controls with visible focus states.
- Reduced-motion fallback for visitors who request less animation.
