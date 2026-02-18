import { useState } from 'react';
import { useAuth } from '../context/AppContext';
import { X, BookOpen, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ onClose }) {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Email is required'); return; }
        if (!isLogin && !name.trim()) { setError('Name is required'); return; }
        login(isLogin ? email.split('@')[0] : name, email);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/10 rounded-2xl p-8 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isLogin ? 'Welcome Back!' : 'Join StudyBuddy'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Samarth Yete"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
