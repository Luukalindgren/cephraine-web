# Cephraine

Cephraine is a prototype headache diary and 3D pain visualization app. Users can log daily headaches, select the location of pain on an interactive 3D head model, and export their logs for medical consultations. This monorepo contains both the backend (Node.js + Express + Prisma) and the frontend (React + TypeScript + Three.js + Vite).

## Project Structure

```
cephraine/
  ├── backend/
  │    ├── prisma/            # Prisma schema & migrations
  │    ├── src/               # Express application code
  │    ├── package.json
  │    ├── tsconfig.json
  │    └── ...
  ├── frontend/
  │    ├── src/               # React + Three.js application
  │    ├── package.json
  │    ├── tsconfig.json
  │    └── vite.config.ts
  ├── .gitignore
  └── README.md  (this file)
```

## Backend

Tech Stack: Node.js, Express, Prisma (SQLite by default), Passport (Google OAuth).

Core Features:

    - API endpoints to manage user headache logs (/api/logs, etc.).

    - Google OAuth authentication routes (/auth/google).

    - Database schemas and migrations via Prisma.


## Frontend

Tech Stack: React (TypeScript), Three.js, Vite.

Core Features:

    - Displays a 3D head model for pain area selection.

    - Users can log headache data, view logs, and export them.

    - Optionally integrates with the backend for user authentication and data storage.
