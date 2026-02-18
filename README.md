# 🎓 StudyBuddy AI

> An AI-powered personal study companion that helps students understand complex concepts, summarize notes, generate quizzes, and study with flashcards — all in one beautiful app.

![StudyBuddy AI](https://img.shields.io/badge/StudyBuddy-AI%20Powered-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-FF6B35?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Concept Explainer** | Get simple, clear AI explanations for any topic with real-world analogies |
| 📄 **Smart Summarizer** | Paste your notes and get concise bullet-point summaries instantly |
| ❓ **Quiz Generator** | Auto-generate 5 interactive MCQs on any subject with instant scoring |
| 🃏 **Flashcard Mode** | 3D flip flashcards with dot navigation for spaced repetition study |
| 💾 **Study History** | All sessions auto-saved to localStorage — review anytime |
| 📤 **Export to PDF** | Download explanations, summaries, and quiz results as PDF |
| 🌙 **Light / Dark Mode** | Toggle between dark and light themes — preference saved |
| 🔐 **User Login** | Simple local auth — sign in with name & email, saved to localStorage |

---

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 3 + Framer Motion animations
- **Icons**: Lucide React
- **AI**: [OpenRouter API](https://openrouter.ai) — `mistralai/mistral-7b-instruct`
- **Routing**: React Router DOM v7
- **PDF Export**: jsPDF
- **State**: React Context API + localStorage

---

## 📸 Pages

- `/` — Home / Landing page
- `/explain` — Concept Explainer
- `/summarize` — Smart Summarizer
- `/quiz` — Quiz Generator
- `/flashcards` — Flashcard Mode
- `/history` — Study History

---

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

> 🔑 Get your **free** API key at [https://openrouter.ai](https://openrouter.ai) — no billing required!

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
study-buddy-ai/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navigation with theme toggle & auth
│   │   └── AuthModal.jsx     # Login / Signup modal
│   ├── context/
│   │   └── AppContext.jsx    # Theme, Auth & History context providers
│   ├── lib/
│   │   └── gemini.js         # OpenRouter AI API integration
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with feature cards
│   │   ├── Explain.jsx       # Concept explainer + PDF export
│   │   ├── Summarize.jsx     # Note summarizer + PDF export
│   │   ├── Quiz.jsx          # Quiz generator + scoring + PDF export
│   │   ├── Flashcards.jsx    # 3D flip flashcard generator
│   │   └── History.jsx       # Study session history
│   ├── App.jsx               # Root app with routing
│   └── index.css             # Global styles + light/dark mode
├── .env.example              # Environment variable template
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🤝 Contributing

Pull requests are welcome! Feel free to open an issue for bugs or feature requests.

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ by <a href="https://github.com/SamarthYete">Samarth Yete</a></p>
