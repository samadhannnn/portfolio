# Samadhan Bodkhe — AI & Machine Learning Engineer Portfolio

A premium, recruiter-focused production-ready portfolio website representing **Samadhan Bodkhe** as an **AI & Machine Learning Engineer, Software Engineer, and Full Stack Developer**.

---

## 🌟 Key Features

1. **Sleek, Premium Design**: Inspired by OpenAI, Anthropic, Stripe, and Linear. Responsive glassmorphic layout supporting system, light, and dark modes with fluid micro-animations.
2. **SAM AI Assistant (RAG Pipeline)**: Floating chatbot widget responding to recruiter questions (Who is Samadhan? What projects has he built? etc.). Utilizes a RAG pipeline (OpenAI API) with a custom, high-fidelity local keyword search engine fallback if no API key is configured.
3. **Dynamic Repository Showcase**: Search, sort, and filter repository cards showing live metrics (languages, stars, forks, update dates) directly linked to Samadhan's actual GitHub repos.
4. **GitHub Insights**: Visual SVG graph showing language breakdowns and a contribution calendar grid modeled on live API records.
5. **Secret Admin Dashboard (`/admin-dashboard`)**: Hidden dashboard display tracking unique visitors, resume downloads, chatbot questions, project clicks, and contact inbox submissions.
   - **How to access**: Double-click the period (`.`) at the end of "Samadhan Bodkhe" in the navigation bar, OR use the keyboard shortcut `Ctrl + Alt + A`.
   - **Default Decryption Password**: `samadhan123`
6. **Robust Data Fallbacks**: Automatic fallback from Supabase to a persistent local JSON database (`src/data/db.json`) for zero-dependency local runs.

---

## ⚙️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Services & AI**: LangChain integration, OpenAI API (configurable RAG), Local Vector Similarity Matcher
- **Database**: PostgreSQL / Supabase, fallback to persistent JSON storage
- **Deployment**: Docker, Docker Compose, GitHub Actions, Vercel

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `^18.20.0` or `>=20.9.0`
- NPM `^10.0.0`

### 2. Installation
Initialize the project dependencies:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file by copying the example file:
```bash
cp .env.example .env.local
```
Configure your keys inside `.env.local`:
- `OPENAI_API_KEY`: (Optional) Your OpenAI key to drive conversational RAG. If omitted, the chatbot runs on a high-fidelity local script.
- `ADMIN_PASSWORD`: Custom access password for the secret dashboard (defaults to `samadhan123`).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Optional) Credentials to persist visitor data to Supabase. If empty, the app writes to `./src/data/db.json`.

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

You can containerize the portfolio for production hosting:

1. **Build and start the container**:
   ```bash
   docker-compose up -d --build
   ```
2. The portfolio will be available at [http://localhost:3000](http://localhost:3000).
3. Analytics and messages are persisted in `./src/data/db.json` which is mapped to the host filesystem, preventing data loss when rebuilding containers.
