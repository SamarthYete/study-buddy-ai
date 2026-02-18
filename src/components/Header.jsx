import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BrainCircuit, FileSearch, HelpCircle, History, Layers, Sun, Moon, User, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { useTheme, useAuth } from '../context/AppContext';
import AuthModal from './AuthModal';
import { AnimatePresence } from 'framer-motion';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function Header() {
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [showAuth, setShowAuth] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { name: 'Explain', path: '/explain', icon: BrainCircuit },
        { name: 'Summarize', path: '/summarize', icon: FileSearch },
        { name: 'Quiz', path: '/quiz', icon: HelpCircle },
        { name: 'Flashcards', path: '/flashcards', icon: Layers },
        { name: 'History', path: '/history', icon: History },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 dark:bg-white/5 light:bg-slate-100/80 border-b border-white/10 dark:border-white/10 light:border-slate-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg group-hover:scale-105 transition-transform duration-300">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            StudyBuddy AI
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                    location.pathname === item.path
                                        ? "bg-white/10 text-white shadow-lg shadow-indigo-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Auth */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-all text-sm font-medium text-white"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline">{user.name}</span>
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 top-12 bg-slate-800 border border-white/10 rounded-xl p-2 shadow-xl min-w-[160px]">
                                        <p className="px-3 py-1 text-xs text-gray-500">{user.email}</p>
                                        <button
                                            onClick={() => { logout(); setShowUserMenu(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all"
                            >
                                <User className="w-4 h-4" /> Sign In
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile nav */}
                <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                                location.pathname === item.path
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </header>

            <AnimatePresence>
                {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            </AnimatePresence>
        </>
    );
}
