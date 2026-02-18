import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BrainCircuit, FileSearch, HelpCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Header() {
    const location = useLocation();

    const navItems = [
        { name: 'Explain', path: '/explain', icon: BrainCircuit },
        { name: 'Summarize', path: '/summarize', icon: FileSearch },
        { name: 'Quiz', path: '/quiz', icon: HelpCircle },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        StudyBuddy AI
                    </span>
                </Link>
                <nav className="flex items-center gap-1 md:gap-2">
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
                            <span className="hidden md:inline">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
