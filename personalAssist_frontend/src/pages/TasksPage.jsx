import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, User, Sparkles, LayoutDashboard, CheckSquare, 
    Calendar, Settings, BookOpen, AlertCircle, Clock, Trash2, CheckCircle2 
} from 'lucide-react';

export default function TasksPage() {
    const { user, logoutUser } = useAuth();
    const { 
        todayTasks, upcomingTasks, overdueTasks, loading, error, 
        fetchTasksPageData, updateTaskStatus, deleteTask 
    } = useTasks();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('today');

    useEffect(() => {
        if (user) {
            fetchTasksPageData();
        }
    }, [user, fetchTasksPageData]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTaskStatus(id, newStatus);
        } catch (err) {
            alert(err.message || 'Failed to update task status');
        }
    };

    const handleDeleteTask = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
            } catch (err) {
                alert(err.message || 'Failed to delete task');
            }
        }
    };

    if (!user) return null;

    const renderTaskList = (tasksList, isOverdueList = false) => {
        if (tasksList.length === 0) {
            return (
                <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[250px]">
                    <div className="h-12 w-12 bg-zinc-900 text-zinc-600 rounded-xl flex items-center justify-center mb-4">
                        <CheckSquare className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-white mb-1">No tasks in this queue</h3>
                    <p className="text-zinc-500 text-xs max-w-sm">
                        There are no tasks currently matching this schedule criteria.
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasksList.map((task) => (
                    <div 
                        key={task.id}
                        className={`bg-white/5 border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                            task.status === 'COMPLETED' 
                                ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30' 
                                : isOverdueList
                                ? 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30'
                                : 'border-white/10 hover:border-cyan-500/30'
                        }`}
                    >
                        <div className="flex justify-between items-start space-x-3">
                            <div className="min-w-0">
                                <h3 className={`text-sm font-semibold truncate ${
                                    task.status === 'COMPLETED' ? 'text-zinc-500 line-through' : 'text-white'
                                }`}>
                                    {task.title}
                                </h3>
                                <p className="text-[10px] text-zinc-400 truncate mt-1">
                                    {task.skillName} &bull; {task.subtopicName}
                                </p>
                                {task.description && (
                                    <p className="text-zinc-500 text-xs mt-2 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
                                title="Delete Task"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Badges and metadata */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-[10px] font-semibold text-zinc-400 inline-flex items-center mr-2">
                                <Clock className="h-3 w-3 mr-1" /> {task.estimatedMinutes}m
                            </span>

                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
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

                            {task.scheduledDate && (
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${
                                    isOverdueList
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-white/5 text-zinc-400 border-white/5'
                                }`}>
                                    Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {/* Status Select Controller */}
                        <div className="flex items-center justify-between space-x-3 pt-2">
                            <span className="text-xs text-zinc-500">Status</span>
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-950 border focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors ${
                                    task.status === 'COMPLETED'
                                        ? 'border-emerald-500/30 text-emerald-400'
                                        : task.status === 'IN_PROGRESS'
                                        ? 'border-cyan-500/30 text-cyan-400'
                                        : task.status === 'SKIPPED'
                                        ? 'border-zinc-700 text-zinc-500'
                                        : 'border-white/10 text-zinc-300'
                                }`}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="SKIPPED">Skipped</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

            {/* Sidebar Component */}
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
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <LayoutDashboard className="h-4.5 w-4.5 mr-3" /> Today Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/skills')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <BookOpen className="h-4.5 w-4.5 mr-3" /> Skills Catalog
                    </button>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <CheckSquare className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Tasks Manager
                    </button>
                    <button
                        onClick={() => navigate('/scheduler-settings')}
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <Settings className="h-4.5 w-4.5 mr-3" /> Scheduler Settings
                    </button>
                </nav>

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
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center">
                            <CheckSquare className="h-5 w-5 mr-2 text-cyan-400" /> Tasks Manager Console
                        </h1>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-white/10 mb-8 space-x-6 text-sm font-semibold">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={`pb-4 relative cursor-pointer ${
                                activeTab === 'today' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Today's Queue ({todayTasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('overdue')}
                            className={`pb-4 relative cursor-pointer ${
                                activeTab === 'overdue' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Overdue Queue ({overdueTasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`pb-4 relative cursor-pointer ${
                                activeTab === 'upcoming' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Upcoming Schedule ({upcomingTasks.length})
                        </button>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 flex items-center text-rose-300 text-sm font-semibold">
                            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Lists Render */}
                    <div className="flex-1">
                        {loading && todayTasks.length === 0 && overdueTasks.length === 0 ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
                            </div>
                        ) : activeTab === 'today' ? (
                            renderTaskList(todayTasks)
                        ) : activeTab === 'overdue' ? (
                            renderTaskList(overdueTasks, true)
                        ) : (
                            renderTaskList(upcomingTasks)
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
