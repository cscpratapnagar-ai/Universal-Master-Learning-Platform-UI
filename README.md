# Universal Master Learning Platform UI

Angular 17 frontend for the Universal Master Learning Platform.

## Prerequisites

- Node.js 20 LTS (recommended; Angular 17 supports Node.js 18.13+ or 20.9+)
- npm
- Backend available at `http://localhost:8080` for live API-backed features

## Install dependencies

Run from the UI repository root:

```bash
npm ci
```

Use `npm ci` for reproducible installs from the committed lockfile.

## Run locally

```bash
npm start
```

Open http://localhost:4200.

## Verify changes

Production build:

```bash
npm run build
```

Run unit tests in a headless browser:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

GitHub Actions runs the production build and unit tests on pushes to `main` and pull requests targeting `main`.

## Backend URL

The local API base URL is configured in `src/app/core/config/api.config.ts` and defaults to `http://localhost:8080/api/v1`. Start the backend before testing login, registration, subscription plans, or the platform status indicator.

## Current routes

- `/` — landing page
- `/auth/login`
- `/auth/register`
- Lazy-loaded learner, teacher, admin, super-admin, organization, academy, examiner, and exam-portal areas

## Structure

```
src/app/
├── core/
├── shared/
├── features/
│   └── auth/
│       ├── auth.module.ts
│       ├── auth-routing.module.ts
│       └── pages/
│           ├── login/
│           └── register/
├── app-routing.module.ts
├── app.module.ts
└── app.component.ts
```

The application uses classic Angular NgModules and lazy-loaded feature modules.
