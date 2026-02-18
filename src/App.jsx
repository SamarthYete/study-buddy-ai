import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Explain from './pages/Explain';
import Summarize from './pages/Summarize';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import History from './pages/History';

function App() {
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
          {/* Ambient background blobs */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <Header />

          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explain" element={<Explain />} />
              <Route path="/summarize" element={<Summarize />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProviders>
  );
}

export default App;
