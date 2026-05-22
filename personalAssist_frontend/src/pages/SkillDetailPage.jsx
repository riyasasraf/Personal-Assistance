import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSkills } from '../context/SkillsContext';
import { useAuth } from '../context/AuthContext';
import { 
    Sparkles, ArrowLeft, LayoutDashboard, User, LogOut, 
    BookOpen, Award, CheckCircle2, AlertCircle, Plus, 
    Edit, Save, X, Calendar, FolderGit2, Download
} from 'lucide-react';
import RoadmapTree from '../features/skills/RoadmapTree';
import SubtopicDrawer from '../features/skills/SubtopicDrawer';
import ExportModal from '../components/ExportModal';

export default function SkillDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    const { 
        currentSkill, loading, error, fetchSkillDetail, 
        modifySkill, addTopic, addSubtopic 
    } = useSkills();

    const [activeSubtopic, setActiveSubtopic] = useState(null);
    
    // Inline Add Forms States
    const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicDesc, setNewTopicDesc] = useState('');

    const [isAddSubtopicOpen, setIsAddSubtopicOpen] = useState(false);
    const [subtopicTopicId, setSubtopicTopicId] = useState('');
    const [newSubTitle, setNewSubTitle] = useState('');
    const [newSubDesc, setNewSubDesc] = useState('');
    const [newSubDiff, setNewSubDiff] = useState('MEDIUM');
    const [newSubMinutes, setNewSubMinutes] = useState(45);

    // Edit Skill Details State
    const [isEditingSkill, setIsEditingSkill] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editGoal, setEditGoal] = useState('');
    const [editLevel, setEditLevel] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchSkillDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (currentSkill) {
            setEditName(currentSkill.name);
            setEditDesc(currentSkill.description || '');
            setEditGoal(currentSkill.goal || '');
            setEditLevel(currentSkill.level);
            setEditStatus(currentSkill.status);
        }
    }, [currentSkill]);

    // Handle subtopic click to open drawer
    const handleSubtopicClick = (subtopic) => {
        setActiveSubtopic(subtopic);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleSaveSkillEdit = async (e) => {
        e.preventDefault();
        try {
            await modifySkill(currentSkill.id, {
                name: editName,
                description: editDesc,
                goal: editGoal,
                level: editLevel,
                status: editStatus
            });
            setIsEditingSkill(false);
        } catch (err) {
            alert(err.message || 'Failed to update skill');
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (!newTopicTitle.trim()) return;

        try {
            await addTopic({
                title: newTopicTitle,
                description: newTopicDesc,
                skillId: currentSkill.id,
                orderIndex: 99
            });
            setNewTopicTitle('');
            setNewTopicDesc('');
            setIsAddTopicOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreateSubtopic = async (e) => {
        e.preventDefault();
        if (!newSubTitle.trim() || !subtopicTopicId) return;

        try {
            await addSubtopic({
                title: newSubTitle,
                description: newSubDesc,
                topicId: subtopicTopicId,
                difficulty: newSubDiff,
                estimatedMinutes: Number(newSubMinutes),
                orderIndex: 99
            });
            setNewSubTitle('');
            setNewSubDesc('');
            setNewSubDiff('MEDIUM');
            setNewSubMinutes(45);
            setIsAddSubtopicOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const triggerAddSubtopicModal = (topicId) => {
        setSubtopicTopicId(topicId);
        setIsAddSubtopicOpen(true);
    };

    if (loading && !currentSkill) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error && !currentSkill) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-10 w-10 text-rose-500 mb-4 animate-bounce" />
                <h2 className="text-xl font-bold text-white mb-2">Error loading learning roadmap</h2>
                <p className="text-zinc-500 text-sm max-w-sm mb-6">{error}</p>
                <button 
                    onClick={() => navigate('/skills')}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    if (!currentSkill) return null;

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

                {/* User footer */}
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden pr-0 lg:pr-[400px]">
                {/* Glow effects */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/skills')}
                            className="inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Catalog
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsExportOpen(true)}
                                className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
                            >
                                <Download className="h-3.5 w-3.5 mr-1" /> Export Roadmap
                            </button>
                            <button
                                onClick={() => setIsEditingSkill(!isEditingSkill)}
                                className="inline-flex items-center justify-center px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit Details
                            </button>
                        </div>
                    </div>
                </header>

                {/* Detail Content */}
                <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 overflow-y-auto">
                    
                    {/* Active Skill Edit Card Form */}
                    {isEditingSkill ? (
                        <form onSubmit={handleSaveSkillEdit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Modify Skill Configurations</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Description</label>
                                    <textarea
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Mastery Goal</label>
                                    <input
                                        type="text"
                                        value={editGoal}
                                        onChange={(e) => setEditGoal(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Level</label>
                                        <select
                                            value={editLevel}
                                            onChange={(e) => setEditLevel(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-zinc-300"
                                        >
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Status</label>
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-zinc-300"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="PUBLISHED">Published</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingSkill(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
                                >
                                    <Save className="h-3.5 w-3.5" /> <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Skill General info section */
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                                <BookOpen className="h-40 w-40 text-cyan-400" />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    currentSkill.level === 'ADVANCED' 
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        : currentSkill.level === 'INTERMEDIATE'
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                    <Award className="h-3 w-3 mr-1" /> {currentSkill.level}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                    currentSkill.status === 'PUBLISHED'
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                        : 'bg-zinc-800 text-zinc-400 border border-white/5'
                                }`}>
                                    {currentSkill.status.toLowerCase()}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                                {currentSkill.name}
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl mb-6">
                                {currentSkill.description || 'Set up topics and subtopics below to populate your active learning path.'}
                            </p>

                            {currentSkill.goal && (
                                <div className="border-t border-white/5 pt-4 flex items-start space-x-3.5">
                                    <div className="h-8 w-8 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0 text-cyan-400">
                                        <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Mastery Target</span>
                                        <p className="text-xs text-zinc-300 font-medium">{currentSkill.goal}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Progress dashboard bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Roadmap Outline</span>
                            <span className="text-2xl font-black text-white">{currentSkill.totalTopics} <span className="text-xs font-semibold text-zinc-400">topics mapped</span></span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Accomplishments</span>
                            <span className="text-2xl font-black text-white">{currentSkill.totalCompletedSubtopics} <span className="text-xs font-semibold text-zinc-400">subtopics checked</span></span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-center">
                            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                                <span>Core Completion</span>
                                <span className="text-cyan-400 text-xs font-bold">{currentSkill.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${currentSkill.progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Learning Roadmap header */}
                    <div className="flex justify-between items-center pt-4">
                        <div>
                            <h3 className="text-lg font-extrabold text-white">Learning Roadmap Outline</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Explore nested concepts, checklist tasks and review statuses.</p>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsAddTopicOpen(true)}
                                className="inline-flex items-center justify-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Topic
                            </button>
                        </div>
                    </div>

                    {/* Modals for Adding elements */}
                    {isAddTopicOpen && (
                        <form onSubmit={handleCreateTopic} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm animate-fadeIn">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Map New Roadmap Topic</h4>
                                <button type="button" onClick={() => setIsAddTopicOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="e.g. Memory Layout, Advanced Database Design"
                                        value={newTopicTitle}
                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Topic description or goals..."
                                        value={newTopicDesc}
                                        onChange={(e) => setNewTopicDesc(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsAddTopicOpen(false)} className="px-3 py-1.5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs font-semibold rounded-lg">Cancel</button>
                                <button type="submit" className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md shadow-cyan-500/10">Add Topic</button>
                            </div>
                        </form>
                    )}

                    {isAddSubtopicOpen && (
                        <form onSubmit={handleCreateSubtopic} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm animate-fadeIn">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Map New Subtopic</h4>
                                <button type="button" onClick={() => setIsAddSubtopicOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Subtopic title..."
                                        value={newSubTitle}
                                        onChange={(e) => setNewSubTitle(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Short description..."
                                        value={newSubDesc}
                                        onChange={(e) => setNewSubDesc(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1 pl-1">Difficulty</label>
                                        <select
                                            value={newSubDiff}
                                            onChange={(e) => setNewSubDiff(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-zinc-300"
                                        >
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1 pl-1">Est. Minutes</label>
                                        <input
                                            type="number"
                                            value={newSubMinutes}
                                            onChange={(e) => setNewSubMinutes(e.target.value)}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsAddSubtopicOpen(false)} className="px-3 py-1.5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs font-semibold rounded-lg">Cancel</button>
                                <button type="submit" className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md shadow-cyan-500/10">Add Subtopic</button>
                            </div>
                        </form>
                    )}

                    {/* The nested roadmap tree list */}
                    <RoadmapTree 
                        onSubtopicClick={handleSubtopicClick}
                        onAddTopic={() => setIsAddTopicOpen(true)}
                        onAddSubtopic={triggerAddSubtopicModal}
                    />

                </main>
            </div>

            {/* Subtopic Side drawer component */}
            {activeSubtopic && (
                <SubtopicDrawer 
                    subtopic={activeSubtopic}
                    onClose={() => setActiveSubtopic(null)}
                />
            )}

            {/* Export Roadmap Modal */}
            <ExportModal 
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                skillId={currentSkill.id}
                skillName={currentSkill.name}
            />
        </div>
    );
}
