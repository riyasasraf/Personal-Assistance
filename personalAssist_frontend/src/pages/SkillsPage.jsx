import { useState, useEffect, useRef } from 'react';
import { useSkills } from '../context/SkillsContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    Sparkles, Plus, Search, Filter, BookOpen, 
    Award, CheckCircle2, ChevronRight, LayoutDashboard, 
    User, LogOut, Trash2, Edit3, FolderGit2, Upload
} from 'lucide-react';
import AddSkillModal from '../components/AddSkillModal';
import { importRoadmapDirectly } from '../services/api';

export default function SkillsPage() {
    const { skills, loading, error, fetchSkills, addSkill, removeSkill } = useSkills();
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    // Filters and states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchSkills(search, statusFilter, levelFilter);
    }, [search, statusFilter, levelFilter]);

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImportLoading(true);
        try {
            const text = await file.text();
            // Validate it's JSON
            JSON.parse(text);
            
            await importRoadmapDirectly(text);
            alert('Skill imported successfully!');
            fetchSkills(search, statusFilter, levelFilter);
        } catch (err) {
            alert('Failed to import skill: ' + (err.message || err));
        } finally {
            setImportLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Avoid navigating
        if (confirm('Are you sure you want to delete this skill and all its roadmaps?')) {
            try {
                await removeSkill(id);
            } catch (err) {
                alert(err.message || 'Failed to delete skill');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar component */}
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
                        className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <LayoutDashboard className="h-4.5 w-4.5 mr-3" /> Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/skills')}
                        className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    >
                        <FolderGit2 className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Skill Operating OS
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
                                {user?.firstName} {user?.lastName || ''}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate">{user?.email}</span>
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
                {/* Glow effects */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center">
                            <FolderGit2 className="h-5 w-5 mr-2 text-cyan-400 md:hidden" /> Skills Dashboard
                        </h1>
                        <div className="flex items-center space-x-3">
                            <input 
                                type="file" 
                                accept=".json" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                            />
                            <button
                                onClick={handleImportClick}
                                disabled={importLoading}
                                className="inline-flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Upload className="h-4 w-4 mr-1.5" /> {importLoading ? 'Importing...' : 'Import Skill'}
                            </button>
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
                            >
                                <Plus className="h-4 w-4 mr-1.5" /> Add Skill
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    
                    {/* Toolbar (Search & Filter) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between backdrop-blur-sm">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search skills by name or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
                            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                <Filter className="h-3.5 w-3.5" /> Filters:
                            </div>
                            
                            {/* Level Filter */}
                            <select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                <option value="">All Levels</option>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Loader */}
                    {loading && skills.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
                            <p className="text-rose-300 text-sm font-semibold mb-2">Error Loading Skills</p>
                            <p className="text-zinc-500 text-xs">{error}</p>
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 border-dashed rounded-2xl text-center backdrop-blur-sm min-h-[300px]">
                            <div className="h-14 w-14 bg-zinc-900 text-zinc-500 rounded-2xl flex items-center justify-center mb-4">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No skills discovered</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mb-6">
                                You haven't added any skills to your learning catalog yet. Start by creating a custom learning roadmap!
                            </p>
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-cyan-500/20"
                            >
                                <Plus className="h-4.5 w-4.5 mr-1.5" /> Set Up First Skill
                            </button>
                        </div>
                    ) : (
                        /* Card Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    onClick={() => navigate(`/skills/${skill.id}`)}
                                    className="bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 rounded-2xl p-6 group cursor-pointer transition-all duration-300 flex flex-col h-full shadow-lg relative"
                                >
                                    {/* Action Buttons overlay */}
                                    <div className="absolute top-6 right-6 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDelete(e, skill.id)}
                                            className="h-8 w-8 bg-zinc-900 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                            title="Delete Skill"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Level & Status Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            skill.level === 'ADVANCED' 
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                : skill.level === 'INTERMEDIATE'
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            <Award className="h-3 w-3 mr-1" /> {skill.level}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                            skill.status === 'PUBLISHED'
                                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                : 'bg-zinc-800 text-zinc-400 border border-white/5'
                                        }`}>
                                            {skill.status.toLowerCase()}
                                        </span>
                                    </div>

                                    {/* Name & description */}
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors pr-10">
                                        {skill.name}
                                    </h3>
                                    <p className="text-zinc-400 text-xs leading-relaxed mb-6 line-clamp-2 flex-1">
                                        {skill.description || 'No description provided.'}
                                    </p>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mb-5 text-zinc-400">
                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Topics</span>
                                            <span className="text-sm font-bold text-zinc-200">{skill.totalTopics} loaded</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Completed</span>
                                            <span className="text-sm font-bold text-zinc-200">{skill.totalCompletedSubtopics} topics</span>
                                        </div>
                                    </div>

                                    {/* Progress Ring / Bar */}
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-semibold mb-2">
                                            <span className="text-zinc-500">Progress</span>
                                            <span className="text-cyan-400">{skill.progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${skill.progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Footer trigger */}
                                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-zinc-500 group-hover:text-cyan-400 transition-colors">
                                        <span>Outline Roadmap</span>
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Add Skill Modal component */}
            <AddSkillModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSubmit={addSkill}
            />
        </div>
    );
}
