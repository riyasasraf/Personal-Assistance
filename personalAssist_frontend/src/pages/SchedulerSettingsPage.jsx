import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useSkills } from '../context/SkillsContext';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, User, Sparkles, LayoutDashboard, CheckSquare, 
    Calendar, Settings, BookOpen, AlertCircle, Save, Sliders 
} from 'lucide-react';

export default function SchedulerSettingsPage() {
    const { user, logoutUser } = useAuth();
    const { 
        preferences, loading, error, fetchPreferences, savePreference 
    } = useTasks();
    const { skills, fetchSkills } = useSkills();
    const navigate = useNavigate();

    // Global settings form
    const [globalTasks, setGlobalTasks] = useState(5);
    const [globalMinutes, setGlobalMinutes] = useState(120);
    const [globalDays, setGlobalDays] = useState('ALL');

    // Override settings form
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [overrideTasks, setOverrideTasks] = useState(3);
    const [overrideDays, setOverrideDays] = useState('ALL');

    const [saveSuccess, setSaveSuccess] = useState('');

    useEffect(() => {
        if (user) {
            fetchPreferences();
            fetchSkills();
        }
    }, [user, fetchPreferences, fetchSkills]);

    // Update global state fields when preference records load
    useEffect(() => {
        const globalPref = preferences.find(p => p.skillId === null);
        if (globalPref) {
            setGlobalTasks(globalPref.tasksPerDay);
            setGlobalMinutes(globalPref.studyMinutesPerDay);
            setGlobalDays(globalPref.preferredDays);
        }
    }, [preferences]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleSaveGlobal = async (e) => {
        e.preventDefault();
        setSaveSuccess('');
        try {
            await savePreference({
                skillId: null,
                tasksPerDay: parseInt(globalTasks),
                studyMinutesPerDay: parseInt(globalMinutes),
                preferredDays: globalDays
            });
            setSaveSuccess('Global settings saved successfully!');
            setTimeout(() => setSaveSuccess(''), 3000);
        } catch (err) {
            alert(err.message || 'Failed to save settings');
        }
    };

    const handleSaveOverride = async (e) => {
        e.preventDefault();
        if (!selectedSkillId) {
            alert('Please select a skill to override');
            return;
        }
        setSaveSuccess('');
        try {
            await savePreference({
                skillId: selectedSkillId,
                tasksPerDay: parseInt(overrideTasks),
                studyMinutesPerDay: 120, // Default for override, since study minutes limit is global
                preferredDays: overrideDays
            });
            setSaveSuccess('Skill preference override saved!');
            setSelectedSkillId('');
            setTimeout(() => setSaveSuccess(''), 3000);
        } catch (err) {
            alert(err.message || 'Failed to save preference override');
        }
    };

    if (!user) return null;

    const skillOverrides = preferences.filter(p => p.skillId !== null);

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
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <CheckSquare className="h-4.5 w-4.5 mr-3" /> Tasks Manager
                    </button>
                    <button
                        onClick={() => navigate('/scheduler-settings')}
                        className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <Settings className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Scheduler Settings
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
                            <Settings className="h-5 w-5 mr-2 text-cyan-400" /> Scheduler Preferences
                        </h1>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    {saveSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6 text-emerald-400 text-sm font-semibold">
                            {saveSuccess}
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 flex items-center text-rose-300 text-sm font-semibold">
                            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Global Config Form */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-md">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                                <Sliders className="h-5 w-5 mr-2 text-cyan-400" /> Global Limits Configuration
                            </h2>
                            <form onSubmit={handleSaveGlobal} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                        Max Tasks Per Day
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={globalTasks}
                                        onChange={(e) => setGlobalTasks(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                    />
                                    <span className="text-[10px] text-zinc-500 mt-1 block">
                                        Default daily budget limit for any skill without specific override rules.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                        Max Study Minutes Per Day
                                    </label>
                                    <input
                                        type="number"
                                        min="15"
                                        max="600"
                                        value={globalMinutes}
                                        onChange={(e) => setGlobalMinutes(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                    />
                                    <span className="text-[10px] text-zinc-500 mt-1 block">
                                        Overall daily studying time allowance limit across all scheduled items.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                        Preferred Learning Days
                                    </label>
                                    <select
                                        value={globalDays}
                                        onChange={(e) => setGlobalDays(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                                    >
                                        <option value="ALL">All Days</option>
                                        <option value="WEEKDAYS">Weekdays Only</option>
                                        <option value="WEEKENDS">Weekends Only</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg cursor-pointer"
                                >
                                    <Save className="h-4 w-4 mr-2" /> Save Global Configuration
                                </button>
                            </form>
                        </div>

                        {/* Skill Specific Override Form */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-md flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                                    <Sliders className="h-5 w-5 mr-2 text-violet-400" /> Skill-Specific Rules Override
                                </h2>
                                <form onSubmit={handleSaveOverride} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                            Select Skill
                                        </label>
                                        <select
                                            value={selectedSkillId}
                                            onChange={(e) => setSelectedSkillId(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                                        >
                                            <option value="">-- Choose a skill --</option>
                                            {skills.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                            Max Tasks Per Day (Override)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={overrideTasks}
                                            onChange={(e) => setOverrideTasks(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                            Preferred Days (Override)
                                        </label>
                                        <select
                                            value={overrideDays}
                                            onChange={(e) => setOverrideDays(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                                        >
                                            <option value="ALL">All Days</option>
                                            <option value="WEEKDAYS">Weekdays Only</option>
                                            <option value="WEEKENDS">Weekends Only</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg cursor-pointer"
                                    >
                                        <Save className="h-4 w-4 mr-2" /> Add/Save Override Rule
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Override list */}
                    {skillOverrides.length > 0 && (
                        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-md">
                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-4">
                                Active Override Rule Cards
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {skillOverrides.map((p) => (
                                    <div key={p.id} className="bg-zinc-950/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">{p.skillName || 'Unknown Skill'}</h4>
                                            <div className="space-y-1 text-xs text-zinc-400">
                                                <p>Max Tasks: <span className="text-cyan-400 font-semibold">{p.tasksPerDay} per day</span></p>
                                                <p>Preferred Days: <span className="text-violet-400 font-semibold">{p.preferredDays}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
