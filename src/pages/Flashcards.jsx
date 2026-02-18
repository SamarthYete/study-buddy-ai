import { useState } from 'react';
import { generateContent } from '../lib/gemini';
import { Loader2, Layers, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from '../context/AppContext';

export default function Flashcards() {
    const [topic, setTopic] = useState('');
    const [cards, setCards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addHistory } = useHistory();

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setCards([]); setCurrentCard(0); setFlipped(false);
        try {
            const prompt = `Create 8 flashcards about "${topic}" for studying.
      Output strictly valid JSON array of objects with keys:
      - "front" (string: question or term, max 15 words)
      - "back" (string: answer or definition, max 50 words)
      Do not include markdown formatting. Just the raw JSON array.`;
            let result = await generateContent(prompt);
            result = result.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(result);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setCards(parsed);
                addHistory({ type: 'flashcard', topic, content: `${parsed.length} flashcards generated` });
            } else throw new Error("Invalid format");
        } catch (e) {
            alert(`⚠️ Error: ${e.message || "Failed to generate flashcards."}`);
        } finally {
            setLoading(false);
        }
    };

    const next = () => { setCurrentCard(c => (c + 1) % cards.length); setFlipped(false); };
    const prev = () => { setCurrentCard(c => (c - 1 + cards.length) % cards.length); setFlipped(false); };

    return (
        <div className="pt-28 pb-12 container mx-auto px-4 max-w-2xl min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                    Flashcard Generator
                </h1>
                <p className="text-gray-400">Generate spaced-repetition flashcards on any topic.</p>
            </div>

            {!cards.length && !loading && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center">
                    <input
                        type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="Enter a topic (e.g., Human Anatomy)"
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-6 text-center text-lg"
                    />
                    <button onClick={handleGenerate} disabled={!topic.trim()}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" /> Generate Flashcards
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-lg font-medium animate-pulse">Creating flashcards...</p>
                </div>
            )}

            {cards.length > 0 && !loading && (
                <div className="space-y-6">
                    {/* Progress */}
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>{currentCard + 1} / {cards.length}</span>
                        <div className="flex gap-1">
                            {cards.map((_, i) => (
                                <div key={i} onClick={() => { setCurrentCard(i); setFlipped(false); }}
                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === currentCard ? 'bg-emerald-400 w-4' : 'bg-slate-600 hover:bg-slate-500'}`} />
                            ))}
                        </div>
                        <button onClick={() => { setCards([]); setTopic(''); }} className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                            <RotateCcw className="w-3 h-3" /> New Topic
                        </button>
                    </div>

                    {/* Flip Card */}
                    <div className="relative h-72 cursor-pointer" onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px' }}>
                        <motion.div
                            className="relative w-full h-full"
                            style={{ transformStyle: 'preserve-3d' }}
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl"
                                style={{ backfaceVisibility: 'hidden' }}>
                                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Question / Term</div>
                                <p className="text-2xl font-semibold text-white text-center leading-relaxed">{cards[currentCard].front}</p>
                                <p className="text-xs text-gray-500 mt-6">Click to reveal answer</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/50 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4">Answer / Definition</div>
                                <p className="text-lg text-gray-200 text-center leading-relaxed">{cards[currentCard].back}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={prev} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full border border-white/10 transition-all text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setFlipped(f => !f)}
                            className="px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-full border border-emerald-500/30 text-sm font-medium transition-all">
                            {flipped ? 'Show Question' : 'Reveal Answer'}
                        </button>
                        <button onClick={next} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full border border-white/10 transition-all text-white">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
