import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, User, Sparkles, LayoutDashboard, CheckSquare, 
    Calendar, Settings, Play, CheckCircle2, AlertCircle, Clock, BookOpen, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
    const { user, logoutUser } = useAuth();
    const { 
        todayTasks, overdueTasks, revisions, loading, error, 
        fetchDailyData, updateTaskStatus, completeRevision, triggerScheduler 
    } = useTasks();
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchDailyData();
        }
    }, [user, fetchDailyData]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleRunScheduler = async () => {
        setActionLoading(true);
        try {
            await triggerScheduler();
        } catch (err) {
            alert(err.message || 'Failed to run scheduler');
        } finally {
            setActionLoading(false);
        }
    };

    const handleTaskToggle = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        try {
            await updateTaskStatus(id, nextStatus);
        } catch (err) {
            alert(err.message || 'Failed to update task');
        }
    };

    const handleRevisionComplete = async (id) => {
        try {
            await completeRevision(id);
        } catch (err) {
            alert(err.message || 'Failed to complete revision');
        }
    };

    if (!user) return null;

    // Calculations
    const allTasksToday = [...overdueTasks, ...todayTasks];
    const completedTasksToday = allTasksToday.filter(t => t.status === 'COMPLETED');
    const completionRate = allTasksToday.length > 0 
        ? Math.round((completedTasksToday.length / allTasksToday.length) * 100) 
        : 0;

    const totalScheduledMinutes = allTasksToday.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const completedMinutes = completedTasksToday.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

            {/* Sidebar Component */}
            <aside className="w-64 border-r border-white/10 bg-slate-950/60 backdrop-blur-md hidden md:flex flex-col sticky top-0 h-screen z-20">
                {/* Brand */}
                <div className="p-6 border-b border-white/10 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        SkillForge
                    </span>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 p-4 space-y-1.5">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <LayoutDashboard className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Today Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/skills')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <BookOpen className="h-4.5 w-4.5 mr-3" /> Skills Catalog
                    </button>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <CheckSquare className="h-4.5 w-4.5 mr-3" /> Tasks Manager
                    </button>
                    <button
                        onClick={() => navigate('/scheduler-settings')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <Settings className="h-4.5 w-4.5 mr-3" /> Scheduler Settings
                    </button>
                </nav>

                {/* Footer User info */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 mb-3 px-2">
                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                            <User className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate">
                                {user.firstName} {user.lastName || ''}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate">{user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 border border-white/5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5 mr-2" /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
                {/* Mobile Header */}
                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10 md:hidden">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-base font-bold text-white">SkillForge</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    {/* Welcome Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                                Daily Learning OS
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                Welcome back, {user.firstName}. Here is your schedule for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}.
                            </p>
                        </div>
                        <button
                            onClick={handleRunScheduler}
                            disabled={actionLoading || loading}
                            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Play className="h-4 w-4 mr-1.5" /> 
                            {actionLoading ? 'Optimizing Slot...' : 'Run Daily Scheduler'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 flex items-center text-rose-300 text-sm font-semibold">
                            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Stats Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Task Progress */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center space-x-4 backdrop-blur-sm shadow-md">
                            <div className="h-12 w-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center shadow-inner">
                                <CheckSquare className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Tasks Today</span>
                                <span className="text-2xl font-bold text-white">{completedTasksToday.length}/{allTasksToday.length}</span>
                                <span className="text-[10px] block text-cyan-400 font-semibold">{completionRate}% Completed</span>
                            </div>
                        </div>

                        {/* Revisions Queue */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center space-x-4 backdrop-blur-sm shadow-md">
                            <div className="h-12 w-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center shadow-inner">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Revisions Pending</span>
                                <span className="text-2xl font-bold text-white">{revisions.length}</span>
                                <span className="text-[10px] block text-violet-400 font-semibold">Spaced Repetition active</span>
                            </div>
                        </div>

                        {/* Study Time */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center space-x-4 backdrop-blur-sm shadow-md">
                            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Study Duration</span>
                                <span className="text-2xl font-bold text-white">{completedMinutes}/{totalScheduledMinutes}m</span>
                                <span className="text-[10px] block text-emerald-400 font-semibold">Estimated commitment</span>
                            </div>
                        </div>

                        {/* Efficiency index */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center space-x-4 backdrop-blur-sm shadow-md">
                            <div className="h-12 w-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shadow-inner">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Focus State</span>
                                <span className="text-2xl font-bold text-white">{allTasksToday.length > 0 ? 'ON TRACK' : 'IDLE'}</span>
                                <span className="text-[10px] block text-amber-400 font-semibold">Consistent learning</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Sections: Tasks Checklist vs Revision Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                        
                        {/* Tasks Checklist (takes 2 cols) */}
                        <div className="lg:col-span-2 flex flex-col space-y-4">
                            <h2 className="text-lg font-bold text-zinc-300 flex items-center">
                                <CheckSquare className="h-5 w-5 mr-2 text-cyan-400" /> Today's Focus Queue
                            </h2>

                            {loading && allTasksToday.length === 0 ? (
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-12 flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                                </div>
                            ) : allTasksToday.length === 0 ? (
                                <div className="flex-1 bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="h-12 w-12 bg-zinc-900 text-zinc-500 rounded-xl flex items-center justify-center mb-4">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Queue is empty</h3>
                                    <p className="text-zinc-500 text-xs max-w-sm mb-6">
                                        No tasks scheduled for today. Run the daily scheduler to pull relevant tasks according to your priorities.
                                    </p>
                                    <button
                                        onClick={handleRunScheduler}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
                                    >
                                        <Play className="h-3.5 w-3.5 mr-1" /> Auto-Schedule Today
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Overdue Section */}
                                    {overdueTasks.length > 0 && (
                                        <div className="mb-2">
                                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center mb-2">
                                                <AlertCircle className="h-3 w-3 mr-1" /> Overdue Learning Items
                                            </span>
                                            <div className="space-y-2">
                                                {overdueTasks.map((task) => (
                                                    <div 
                                                        key={task.id}
                                                        className="bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-xl p-4 flex items-center justify-between transition-colors shadow-inner"
                                                    >
                                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                            <button
                                                                onClick={() => handleTaskToggle(task.id, task.status)}
                                                                className="h-5 w-5 rounded-md border border-rose-500/30 flex items-center justify-center text-transparent hover:text-rose-400 transition-colors shrink-0 cursor-pointer bg-slate-900"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </button>
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
                                                                <p className="text-[10px] text-zinc-400 truncate">
                                                                    {task.skillName} &bull; {task.subtopicName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3 shrink-0">
                                                            <span className="text-[10px] font-semibold text-zinc-400 inline-flex items-center">
                                                                <Clock className="h-3 w-3 mr-1" /> {task.estimatedMinutes}m
                                                            </span>
                                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Today Section */}
                                    <div>
                                        {overdueTasks.length > 0 && (
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 mt-4">
                                                Today's Schedule
                                            </span>
                                        )}
                                        <div className="space-y-2">
                                            {todayTasks.map((task) => (
                                                <div 
                                                    key={task.id}
                                                    className={`bg-white/5 border rounded-xl p-4 flex items-center justify-between transition-colors ${
                                                        task.status === 'COMPLETED' 
                                                            ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' 
                                                            : 'border-white/10 hover:border-cyan-500/20 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                        <button
                                                            onClick={() => handleTaskToggle(task.id, task.status)}
                                                            className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer bg-slate-900 ${
                                                                task.status === 'COMPLETED'
                                                                    ? 'border-emerald-500 text-emerald-400'
                                                                    : 'border-white/20 text-transparent hover:text-cyan-400 hover:border-cyan-400/40'
                                                            }`}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </button>
                                                        <div className="min-w-0 flex-1" onClick={() => navigate(`/skills/${task.skillId}`)}>
                                                            <h4 className={`text-sm font-semibold truncate cursor-pointer hover:underline ${
                                                                task.status === 'COMPLETED' ? 'text-zinc-500 line-through' : 'text-white'
                                                            }`}>
                                                                {task.title}
                                                            </h4>
                                                            <p className="text-[10px] text-zinc-500 truncate">
                                                                {task.skillName} &bull; {task.subtopicName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 shrink-0">
                                                        <span className="text-[10px] font-semibold text-zinc-500 inline-flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" /> {task.estimatedMinutes}m
                                                        </span>
                                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                                            task.priority === 'CRITICAL'
                                                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                                : task.priority === 'HIGH'
                                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                : task.priority === 'MEDIUM'
                                                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                                                : 'bg-zinc-800 text-zinc-400 border-white/5'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Revisions Spaced Repetition Queue (takes 1 col) */}
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-lg font-bold text-zinc-300 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-violet-400" /> Revision Queue
                            </h2>

                            {loading && revisions.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-violet-500"></div>
                                </div>
                            ) : revisions.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-8 text-center backdrop-blur-sm flex-1 flex flex-col justify-center items-center min-h-[200px]">
                                    <div className="h-10 w-10 bg-zinc-900 text-zinc-600 rounded-xl flex items-center justify-center mb-3">
                                        <CheckSquare className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-bold text-zinc-400 text-sm mb-1">Clear Queue!</h4>
                                    <p className="text-zinc-600 text-[10px] leading-relaxed max-w-[180px]">
                                        No revision items due today. As you complete daily tasks, spacing slots will dynamically generate.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {revisions.map((rev) => (
                                        <div 
                                            key={rev.id}
                                            className="bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-xl p-4 flex flex-col justify-between space-y-4 transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                                                        Revision Level {rev.revisionLevel}
                                                    </span>
                                                    <span className="text-[9px] font-semibold text-zinc-500">
                                                        Due today
                                                    </span>
                                                </div>
                                                <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                                                    {rev.task?.title || 'System Learning Session'}
                                                </h4>
                                                <p className="text-[9px] text-zinc-500 truncate mt-1">
                                                    {rev.task?.skillName} &bull; {rev.task?.subtopicName}
                                                </p>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRevisionComplete(rev.id)}
                                                className="w-full inline-flex items-center justify-center py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg cursor-pointer"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Revised
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
