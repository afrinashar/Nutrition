# NutriAI

An Enterprise AI Nutrition Platform built as a resume-ready portfolio project.

## Overview

NutriAI is an AI-powered nutrition assistant that creates contextual meal guidance based on a user's profile, health focus, regional cuisine, budget, pantry, and feedback. The public dashboard is usable without login and currently runs without a paid AI API.

## Why Recruiters Will Like This Project

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, REST APIs, WebSockets
- AI: Local command-based assistant with an Ollama integration path
- RAG: Vector Database, Semantic Search
- ML: Recommendation Engine
- Database: PostgreSQL, Redis
- DevOps: Docker, GitHub Actions, AWS
- Authentication: JWT, OAuth
- Analytics: Interactive Dashboards
- Architecture: Microservices, Clean Architecture
- Cloud: AWS Deployment
- Testing: Unit, Integration, E2E

## Project Structure

```
NutriAI/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
├── .env.example
├── Makefile
├── docs/
├── frontend/
├── backend/
├── ai/
├── datasets/
├── scripts/
├── infrastructure/
├── monitoring/
├── nginx/
├── tests/
└── .github/
```

## Implemented MVP

- Public dashboard at `/dashboard`; login is optional
- Profile inputs for age, gender, height, weight, activity, goal, cuisine, and budget
- Automatic BMI, BMR, calorie, protein, carbohydrate, fat, fiber, and water calculations
- Weight goals: maintain, lose, and gain
- Health-focus guidance for diabetes, hypertension, PCOS, and high cholesterol
- Food allergy input and recommendation notice
- Regional meal examples for Tamil Nadu, Maharashtra, Punjab, and Kerala
- Pantry-based meal filtering with comma-separated ingredients
- Budget guidance and smart ingredient substitutions
- Local AI assistant that updates only the requested meal
- Water tracker and browser-local progress tracking
- Explanations for meal and substitution decisions

Example assistant commands:

```text
Replace today's dinner
Increase protein
Reduce calories
I am traveling tomorrow
```

## Planned Modules

- Authentication
- Nutrition Calculator
- AI Meal Planner
- Pantry Intelligence
- Budget AI
- Restaurant Intelligence
- Progress Tracking
- Recommendation Engine
- RAG Nutrition Assistant
- Smart Food Substitution
- Seasonal Intelligence
- Grocery list generation
- Open-ended local LLM chat through Ollama
- OCR, barcode scanning, image calorie estimation, and voice input
- Progress charts, reports, smartwatch integrations, and clinician dashboards

## Getting Started

### Frontend MVP

Run commands from the `frontend` directory, where `package.json` is located:

```powershell
cd C:\Users\afrin\NutriAI\frontend
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`. If port 3000 is busy, Next.js selects another available port.

### Full Docker stack

The repository also contains backend and infrastructure services. Copy the environment template, then start Docker Compose from the repository root:

```powershell
cd C:\Users\afrin\NutriAI
Copy-Item .env.example .env
docker compose up --build
```

The frontend MVP does not require Docker, a database, authentication, or an AI API key.

### Free local MVP

The current assistant uses transparent browser rules for supported meal updates. For an open-ended free local model later, install [Ollama](https://ollama.com/), download a supported model, and connect it through a backend endpoint rather than exposing model credentials in the browser.

Nutrition estimates are for general educational use and are not medical advice. Users with diabetes, kidney disease, pregnancy, hypertension, allergies, or other medical conditions should review plans with a qualified clinician.

## Documentation

See `docs/Architecture.md`, `docs/API.md`, `docs/Database.md`, `docs/AI.md`, `docs/Deployment.md`, `docs/DeveloperGuide.md`, `docs/PromptEngineering.md`, and `docs/Security.md`.
