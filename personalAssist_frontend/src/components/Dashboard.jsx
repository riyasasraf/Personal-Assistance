import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Sparkles, CheckSquare, FileText, Bot } from 'lucide-react';

export default function Dashboard() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

            {/* Premium Glassmorphic Header */}
            <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            Personal Assist
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-semibold text-white">
                                {user.firstName} {user.lastName || ''}
                            </span>
                            <span className="text-xs text-zinc-400">{user.email}</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                            <User className="h-4 w-4" />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 rounded-xl text-sm font-medium transition-all cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 mr-2" /> Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Welcoming Banner Section */}
                <section className="mb-10 p-8 bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="h-40 w-40 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Welcome, {user.firstName}!
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Your personal control center is active. Access your security logs, manage tools, or chat with your AI assistant using the cards below.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-zinc-400">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Shield className="h-3.5 w-3.5 mr-1.5" /> Session Authenticated (JWT)
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            PostgreSQL Connected
                        </span>
                    </div>
                </section>

                {/* Features Cards Grid */}
                <h2 className="text-lg font-bold text-zinc-300 uppercase tracking-widest mb-6">
                    Available Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Task Card */}
                    <div className="bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 group cursor-pointer shadow-lg">
                        <div className="h-12 w-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">To-Do Manager</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Structure and organize your day-to-day operations with categorized lists and status tags.
                        </p>
                        <span className="text-cyan-400 text-xs font-semibold group-hover:underline flex items-center">
                            Launch Module &rarr;
                        </span>
                    </div>

                    {/* Notes Card */}
                    <div className="bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 group cursor-pointer shadow-lg">
                        <div className="h-12 w-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Notes Organizer</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Scribble clean rich-text logs, meeting agendas, and code snippets, stored safely under your profile.
                        </p>
                        <span className="text-violet-400 text-xs font-semibold group-hover:underline flex items-center">
                            Launch Module &rarr;
                        </span>
                    </div>

                    {/* AI Chat Card */}
                    <div className="bg-white/5 border border-white/10 hover:border-fuchsia-500/30 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 group cursor-pointer shadow-lg">
                        <div className="h-12 w-12 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Bot className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">AI Copilot</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Engage with an intelligent agent to query information, draft reports, or solve logic scripts.
                        </p>
                        <span className="text-fuchsia-400 text-xs font-semibold group-hover:underline flex items-center">
                            Launch Module &rarr;
                        </span>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="border-t border-white/5 py-6 bg-slate-950/20">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-500">
                    &copy; 2026 Personal Assist. Securely stored with PostgreSQL and JWT.
                </div>
            </footer>
        </div>
    );
}
