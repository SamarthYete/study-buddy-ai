import { useState } from 'react';
import { generateContent } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from '../context/AppContext';
import jsPDF from 'jspdf';

export default function Explain() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const { addHistory } = useHistory();

    const handleExplain = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setOutput('');
        try {
            const prompt = `Explain the following concept like I'm a student: "${input}". 
      - Use simple language.
      - Provide real-world analogies.
      - Format with Markdown (headers, bullet points).`;
            const result = await generateContent(prompt);
            setOutput(result);
            addHistory({ type: 'explain', topic: input, content: result });
        } catch (error) {
            setOutput(`⚠️ Error: ${error.message || "Something went wrong."}`);
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`StudyBuddy AI — Explanation`, 14, 20);
        doc.setFontSize(13);
        doc.text(`Topic: ${input}`, 14, 32);
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(output.replace(/[#*`]/g, ''), 180);
        doc.text(lines, 14, 44);
        doc.save(`explanation-${input.slice(0, 20)}.pdf`);
    };

    return (
        <div className="pt-28 pb-12 container mx-auto px-4 max-w-4xl min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    Concept Explainer
                </h1>
                <p className="text-gray-400">Stuck on a tough topic? I'll break it down for you.</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl mb-8">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Quantum Entanglement, The French Revolution, Photosynthesis..."
                    className="w-full h-32 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none mb-4"
                />
                <div className="flex justify-end gap-2">
                    {output && (
                        <button
                            onClick={exportPDF}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 text-sm border border-white/10"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                    )}
                    <button
                        onClick={handleExplain}
                        disabled={loading || !input.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Explain It
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {(loading || output) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="prose prose-invert prose-lg max-w-none bg-slate-900/30 border border-white/5 rounded-2xl p-8 shadow-inner"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 text-gray-500">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p>Thinking deeply...</p>
                            </div>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-blue-300 mb-4" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-blue-200 mt-6 mb-3" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="text-cyan-300 font-semibold" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                                    p: ({ node, ...props }) => <p className="leading-relaxed mb-4 text-gray-300" {...props} />,
                                }}
                            >
                                {output}
                            </ReactMarkdown>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
