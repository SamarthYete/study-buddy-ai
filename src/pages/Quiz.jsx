import { useState } from 'react';
import { generateContent } from '../lib/gemini';
import { Loader2, CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz() {
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleGenerateQuiz = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setQuestions([]);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setIsCorrect(null);

        try {
            const prompt = `Generate 5 multiple-choice questions about "${topic}".
      Output strictly valid JSON array of objects with keys: 
      - "question" (string)
      - "options" (array of 4 strings)
      - "correctAnswer" (integer index 0-3)
      Do not include markdown formatting like \`\`\`json. Just the raw JSON array.`;

            let result = await generateContent(prompt);
            // Clean up potential markdown code blocks
            result = result.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(result);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setQuestions(parsed);
            } else {
                throw new Error("Invalid format");
            }
        } catch (e) {
            console.error(e);
            alert(`⚠️ Error: ${e.message || "Failed to generate quiz. Please try again."}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        const correct = index === questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setShowScore(true);
            }
        }, 1500);
    };

    return (
        <div className="pt-24 pb-12 container mx-auto px-4 max-w-2xl min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
                    Quiz Generator
                </h1>
                <p className="text-gray-400">
                    Test your knowledge on any topic instantly.
                </p>
            </div>

            {!questions.length && !loading && !showScore && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic (e.g., Photosynthesis)"
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-6 text-center text-lg"
                    />
                    <button
                        onClick={handleGenerateQuiz}
                        disabled={!topic.trim()}
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/20"
                    >
                        Start Quiz
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-orange-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-lg font-medium animate-pulse">Generating questions...</p>
                </div>
            )}

            {questions.length > 0 && !showScore && !loading && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, transition: 'width 0.5s ease' }} />

                    <div className="mb-6 flex justify-between items-center text-sm text-gray-400 font-medium uppercase tracking-wider">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>

                    <h3 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
                        {questions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => {
                            let stateClass = "border-white/10 hover:bg-white/5 hover:border-white/20";
                            if (selectedAnswer !== null) {
                                if (index === questions[currentQuestion].correctAnswer) {
                                    stateClass = "bg-green-500/20 border-green-500 text-green-200";
                                } else if (index === selectedAnswer) {
                                    stateClass = "bg-red-500/20 border-red-500 text-red-200";
                                } else {
                                    stateClass = "opacity-50 border-white/10";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 font-medium ${stateClass} flex justify-between items-center group`}
                                >
                                    <span>{option}</span>
                                    {selectedAnswer !== null && index === questions[currentQuestion].correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {showScore && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-xl text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        You scored <span className="text-orange-400 font-bold">{score}</span> out of <span className="text-white">{questions.length}</span>
                    </p>
                    <button
                        onClick={() => { setQuestions([]); setShowScore(false); setTopic(''); }}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all flex items-center gap-2 mx-auto border border-white/10"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Another Topic
                    </button>
                </div>
            )}
        </div>
    );
}
