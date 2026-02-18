import { useHistory } from '../context/AppContext';
import { BrainCircuit, FileSearch, HelpCircle, Layers, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const typeConfig = {
    explain: { icon: BrainCircuit, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Explanation', path: '/explain' },
    summarize: { icon: FileSearch, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Summary', path: '/summarize' },
    quiz: { icon: HelpCircle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Quiz', path: '/quiz' },
    flashcard: { icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Flashcards', path: '/flashcards' },
};

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function History() {
    const { history, clearHistory } = useHistory();

    return (
        <div className="pt-28 pb-12 container mx-auto px-4 max-w-3xl min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent mb-2">
                        Study History
                    </h1>
                    <p className="text-gray-400">{history.length} session{history.length !== 1 ? 's' : ''} recorded</p>
                </div>
                {history.length > 0 && (
                    <button onClick={clearHistory}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-24 text-gray-600">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No history yet.</p>
                    <p className="text-sm mt-1">Start studying to see your sessions here!</p>
                    <Link to="/explain" className="inline-block mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all">
                        Start Learning
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item, i) => {
                        const cfg = typeConfig[item.type] || typeConfig.explain;
                        const Icon = cfg.icon;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`flex items-start gap-4 p-4 rounded-xl border ${cfg.bg} transition-all hover:scale-[1.01]`}
                            >
                                <div className={`p-2 rounded-lg bg-slate-800 ${cfg.color} flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                                        <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                                    </div>
                                    <p className="text-white font-medium truncate">{item.topic}</p>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.content?.slice(0, 120)}...</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
