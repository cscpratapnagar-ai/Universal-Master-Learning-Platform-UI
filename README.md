# Universal Master Learning Platform UI

## Prerequisites

- Node.js 18.13+ or 20+
- npm
- Angular CLI is optional because the project uses the local CLI

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Open:

```
http://localhost:4200
```

## Build

```bash
npm run build
```

## Current routes

- `/auth/login`
- `/auth/register`

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
