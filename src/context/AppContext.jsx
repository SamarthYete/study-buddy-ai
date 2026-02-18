import { createContext, useContext, useState, useEffect } from 'react';

// ─── Theme Context ───────────────────────────────────────────────────────────
const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

// ─── Auth Context ────────────────────────────────────────────────────────────
const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

// ─── History Context ─────────────────────────────────────────────────────────
const HistoryContext = createContext();
export function useHistory() { return useContext(HistoryContext); }

// ─── Combined Provider ───────────────────────────────────────────────────────
export function AppProviders({ children }) {
    // Theme
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });
    const toggleTheme = () => {
        setIsDark(prev => {
            localStorage.setItem('theme', !prev ? 'dark' : 'light');
            return !prev;
        });
    };

    // Auth (simple local auth — no backend)
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sb_user')) || null; }
        catch { return null; }
    });
    const login = (name, email) => {
        const u = { name, email, joinedAt: new Date().toISOString() };
        localStorage.setItem('sb_user', JSON.stringify(u));
        setUser(u);
    };
    const logout = () => {
        localStorage.removeItem('sb_user');
        setUser(null);
    };

    // History
    const [history, setHistory] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sb_history')) || []; }
        catch { return []; }
    });
    const addHistory = (entry) => {
        setHistory(prev => {
            const updated = [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...prev].slice(0, 50);
            localStorage.setItem('sb_history', JSON.stringify(updated));
            return updated;
        });
    };
    const clearHistory = () => {
        localStorage.removeItem('sb_history');
        setHistory([]);
    };

    // Apply theme class to html element
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <AuthContext.Provider value={{ user, login, logout }}>
                <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
                    {children}
                </HistoryContext.Provider>
            </AuthContext.Provider>
        </ThemeContext.Provider>
    );
}
