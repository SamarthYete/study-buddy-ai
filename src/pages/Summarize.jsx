import { useState } from 'react';
import { generateContent } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { Loader2, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Summarize() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const prompt = `Summarize the following text concisely. Capture the main points and key takeaways. Format with bullet points:\n\n"${input}"`;
            const result = await generateContent(prompt);
            setOutput(result);
        } catch (e) {
            console.error(e);
            setOutput(`⚠️ Error: ${e.message || "Failed to generate summary. Please try again."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 container mx-auto px-4 max-w-4xl min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    Smart Summarizer
                </h1>
                <p className="text-gray-400">
                    Paste your notes or text here for a quick, organized summary.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-96 flex flex-col">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your text here..."
                        className="flex-1 bg-slate-800/30 border border-white/5 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
                    />
                    <button
                        onClick={handleSummarize}
                        disabled={loading || !input.trim()}
                        className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Summarize Notes
                    </button>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl h-96 overflow-y-auto relative">
                    <AnimatePresence mode="wait">
                        {output ? (
                            <motion.div
                                key="output"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <ReactMarkdown
                                    components={{
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-2 text-gray-300" {...props} />,
                                        li: ({ node, ...props }) => <li className="marker:text-purple-400" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="text-pink-300 font-medium" {...props} />,
                                    }}
                                >
                                    {output}
                                </ReactMarkdown>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 pointer-events-none p-8 text-center"
                            >
                                <FileText className="w-12 h-12 mb-4 opacity-20" />
                                <p>Summary will appear here...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
