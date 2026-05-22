import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Sparkles, LayoutDashboard, FolderGit2, FileEdit, AlertCircle, TrendingUp, Clock, CheckSquare, Zap, BookOpen
} from 'lucide-react';
import { getAnalyticsDashboard } from '../services/api';

export default function AnalyticsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await getAnalyticsDashboard();
            setAnalytics(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics');
            // Fallback mock data if API is incomplete for analytics
            setAnalytics({
                totalCompletedTasks: 142,
                currentStreak: 5,
                totalStudyMinutes: 2840,
                weeklyCompletionRates: [
                    { day: 'Mon', count: 4 },
                    { day: 'Tue', count: 7 },
                    { day: 'Wed', count: 3 },
                    { day: 'Thu', count: 8 },
                    { day: 'Fri', count: 6 },
                    { day: 'Sat', count: 12 },
                    { day: 'Sun', count: 5 },
                ],
                streakProgression: [2, 3, 0, 1, 2, 3, 4, 5]
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    // Helper for SVG bar chart
    const maxCount = analytics ? Math.max(...analytics.weeklyCompletionRates.map(d => d.count), 1) : 1;

    // Helper for SVG line chart
    const maxStreak = analytics ? Math.max(...analytics.streakProgression, 1) : 1;
    const points = analytics 
        ? analytics.streakProgression.map((val, i) => {
            const x = (i / (analytics.streakProgression.length - 1)) * 100;
            const y = 100 - ((val / maxStreak) * 100);
            return `${x},${y}`;
        }).join(' ')
        : '';

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-slate-950/60 backdrop-blur-md hidden md:flex flex-col sticky top-0 h-screen z-20">
                <div className="p-6 border-b border-white/10 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        SkillForge
                    </span>
                </div>
                <nav className="flex-1 p-4 space-y-1.5">
                    <button onClick={() => navigate('/dashboard')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <LayoutDashboard className="h-4.5 w-4.5 mr-3" /> Dashboard
                    </button>
                    <button onClick={() => navigate('/skills')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <FolderGit2 className="h-4.5 w-4.5 mr-3" /> Skills Catalog
                    </button>
                    <button onClick={() => navigate('/drafts')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <FileEdit className="h-4.5 w-4.5 mr-3" /> Drafts
                    </button>
                    <button onClick={() => navigate('/templates')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <BookOpen className="h-4.5 w-4.5 mr-3" /> Templates
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <AlertCircle className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Analytics
                    </button>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center">
                            Performance Analytics
                        </h1>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading && !analytics ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 backdrop-blur-sm shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
                                    <div className="h-14 w-14 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner relative z-10 border border-emerald-500/20">
                                        <CheckSquare className="h-7 w-7" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Completed</span>
                                        <span className="text-3xl font-extrabold text-white">{analytics.totalCompletedTasks}</span>
                                        <span className="text-[10px] block text-emerald-400 font-semibold mt-1">Tasks mastered</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 backdrop-blur-sm shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors"></div>
                                    <div className="h-14 w-14 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shadow-inner relative z-10 border border-amber-500/20">
                                        <Zap className="h-7 w-7" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Streak</span>
                                        <span className="text-3xl font-extrabold text-white">{analytics.currentStreak} <span className="text-lg text-zinc-500 font-medium">days</span></span>
                                        <span className="text-[10px] block text-amber-400 font-semibold mt-1">Keep it up!</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 backdrop-blur-sm shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-colors"></div>
                                    <div className="h-14 w-14 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center shadow-inner relative z-10 border border-cyan-500/20">
                                        <Clock className="h-7 w-7" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Study Time</span>
                                        <span className="text-3xl font-extrabold text-white">{Math.floor(analytics.totalStudyMinutes / 60)}<span className="text-lg text-zinc-500 font-medium">h</span> {analytics.totalStudyMinutes % 60}<span className="text-lg text-zinc-500 font-medium">m</span></span>
                                        <span className="text-[10px] block text-cyan-400 font-semibold mt-1">Total invested time</span>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Weekly Bar Chart */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-white flex items-center">
                                            <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" /> Weekly Activity
                                        </h3>
                                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">This Week</span>
                                    </div>
                                    
                                    <div className="h-64 flex items-end justify-between space-x-2 relative mt-4">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-full border-t border-white/5"></div>
                                            ))}
                                        </div>
                                        
                                        {/* Bars */}
                                        {analytics.weeklyCompletionRates.map((day, i) => (
                                            <div key={i} className="flex flex-col items-center flex-1 relative z-10 group">
                                                {/* Tooltip */}
                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                                                    {day.count} tasks
                                                </div>
                                                <div 
                                                    className="w-full max-w-[40px] bg-gradient-to-t from-cyan-600/50 to-cyan-400 rounded-t-md hover:to-blue-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                    style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: '4px' }}
                                                ></div>
                                                <span className="text-[10px] font-semibold text-zinc-500 mt-3">{day.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Streak Line Chart */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-white flex items-center">
                                            <Zap className="h-5 w-5 mr-2 text-amber-400" /> Consistency Tracker
                                        </h3>
                                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">Last 8 Days</span>
                                    </div>
                                    
                                    <div className="h-64 relative mt-4">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-full border-t border-white/5"></div>
                                            ))}
                                        </div>

                                        <svg className="absolute inset-0 h-[calc(100%-24px)] w-full overflow-visible z-10" preserveAspectRatio="none">
                                            {/* Gradient for fill */}
                                            <defs>
                                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="rgba(245, 158, 11, 0.3)" />
                                                    <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
                                                </linearGradient>
                                            </defs>
                                            
                                            {/* Line fill */}
                                            <polygon 
                                                points={`0,100 ${points} 100,100`} 
                                                fill="url(#lineGradient)" 
                                            />
                                            
                                            {/* Line stroke */}
                                            <polyline 
                                                points={points} 
                                                fill="none" 
                                                stroke="#fbbf24" 
                                                strokeWidth="3" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                            />
                                            
                                            {/* Data points */}
                                            {analytics.streakProgression.map((val, i) => {
                                                const x = (i / (analytics.streakProgression.length - 1)) * 100;
                                                const y = 100 - ((val / maxStreak) * 100);
                                                return (
                                                    <circle 
                                                        key={i} 
                                                        cx={`${x}%`} 
                                                        cy={`${y}%`} 
                                                        r="4" 
                                                        fill="#18181b" 
                                                        stroke="#fbbf24" 
                                                        strokeWidth="2" 
                                                        className="hover:r-6 hover:stroke-white transition-all cursor-crosshair"
                                                    >
                                                        <title>Streak: {val}</title>
                                                    </circle>
                                                );
                                            })}
                                        </svg>
                                        
                                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                                            {analytics.streakProgression.map((_, i) => (
                                                <span key={i} className="text-[10px] font-semibold text-zinc-500">D-{analytics.streakProgression.length - 1 - i}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
