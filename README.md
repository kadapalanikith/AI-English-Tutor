# 🚀 AI English Tutor

> A production-ready React + Vite application for learning English through AI-generated stories, typing practice, and pronunciation feedback.

**🌍 Live Demo:** [ai-english-tutor-rho.vercel.app](https://ai-english-tutor-rho.vercel.app/)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google)](https://ai.google.dev)

---

## ✨ Features

| Feature                       | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| 📖 **Learn Stories**          | AI-generated moral stories from Indian epics at your English level |
| 🌐 **Word Translation**       | Long-press any word for an instant Hindi/Telugu tooltip            |
| ⌨️ **Typing Practice**        | Real-time WPM and accuracy tracking                                |
| 🔊 **Pronunciation Practice** | Mic-based scoring with per-word feedback                           |
| 🤖 **LiftBot Chatbot**        | AI English tutor available at any time                             |
| 📊 **Progress Tracking**      | Streak, daily goals, and sparkline performance charts              |
| 🌏 **Bilingual Support**      | Hindi and Telugu translation support                               |

---

## 🏗️ Project Structure

```
ai-english-tutor/
├── public/                  # Static assets (favicon, og-image)
├── src/
│   ├── assets/              # App images & icons
│   ├── components/
│   │   ├── chatbot/         # ChatbotFab, ChatbotModal
│   │   ├── learn/           # LearnSection, WordPopup
│   │   ├── onboarding/      # OnboardingModal
│   │   ├── profile/         # ProfileModal
│   │   ├── pronounce/       # PronouncePractice
│   │   ├── type/            # TypingPractice
│   │   └── ui/              # Card, Icons, Notification, SparklineChart, ...
│   ├── data/                # initialData seed
│   ├── hooks/               # useLocalStorage, useGoals, useProgress
│   ├── layouts/             # RootLayout (header + mobile nav)
│   ├── pages/               # HomePage, LearnPage, TypePage, PronouncePage, HelpPage
│   ├── services/            # geminiService (Gemini AI API)
│   ├── styles/              # index.css (Tailwind + custom utilities)
│   ├── types/               # JSDoc type definitions
│   ├── utils/               # tokenizeWithSpaces, similarityPct, ...
│   ├── App.jsx              # Root component with routing & state
│   └── main.jsx             # Entry point
├── .env.example             # Environment variable template
├── .gitignore
├── index.html               # Vite HTML template with SEO meta
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-username/ai-english-tutor.git
cd ai-english-tutor
npm install
```

### 2. Set up API key

```bash
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_api_key_here
```

Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run locally

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🔨 Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server on port 3000 |
| `npm run build`   | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |
| `npm run format`  | Run Prettier formatter             |

---

## 🌍 Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Set `VITE_GEMINI_API_KEY` in Vercel's Environment Variables dashboard.

### Netlify

```bash
npm run build
# Deploy dist/ folder via Netlify UI or CLI
# Build command: npm run build  |  Publish dir: dist
```

Add `VITE_GEMINI_API_KEY` in Site Settings → Environment Variables.

### GitHub Pages

```bash
# 1. Install gh-pages
npm install -D gh-pages

# 2. Add to package.json scripts:
#    "predeploy": "npm run build",
#    "deploy": "gh-pages -d dist"

# 3. Set vite.config.js base to your repo name:
#    base: '/ai-english-tutor/'

npm run deploy
```

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "feat: production-ready React + Vite AI English Tutor"
git branch -M main
git remote add origin https://github.com/your-username/ai-english-tutor.git
git push -u origin main
```

---

## 🔑 Environment Variables

| Variable              | Description                           |
| --------------------- | ------------------------------------- |
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key (required) |

---

## 🛠️ Tech Stack

- **React 18** – UI library
- **Vite 5** – Build tool with HMR
- **TailwindCSS 3** – Utility-first styling
- **React Router 6** – Client-side routing
- **@google/genai** – Gemini AI SDK
- **GSAP** – Animation library (available for future enhancements)
- **Web Speech API** – TTS + speech recognition (browser native)

---

## 📄 Licence

MIT © 2026 AI English Tutor
