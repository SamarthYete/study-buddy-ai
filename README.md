# 🎓 StudyBuddy AI

An AI-powered study companion built with React + Vite that helps students understand complex concepts, summarize notes, and generate quizzes on demand.

## ✨ Features

- 🧠 **Concept Explainer** — Get simple, clear explanations for any topic with real-world analogies
- 📄 **Smart Summarizer** — Paste your notes and get concise bullet-point summaries instantly
- ❓ **Quiz Generator** — Generate interactive multiple-choice quizzes on any subject with instant feedback

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion animations
- **Icons**: Lucide React
- **AI**: OpenRouter API (Mistral 7B Instruct)
- **Routing**: React Router DOM

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/SamarthYete/study-buddy-ai.git
cd study-buddy-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the root directory:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your free API key at [https://openrouter.ai](https://openrouter.ai)

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   └── Header.jsx        # Navigation header
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Explain.jsx       # Concept explainer
│   ├── Summarize.jsx     # Note summarizer
│   └── Quiz.jsx          # Quiz generator
├── lib/
│   └── gemini.js         # AI API integration (OpenRouter)
├── App.jsx               # Main app with routing
└── index.css             # Global styles
```

## 🌐 Live Demo

Coming soon...

## 📄 License

MIT License — feel free to use and modify!
