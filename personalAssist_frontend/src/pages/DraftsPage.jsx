import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Sparkles, Plus, FileEdit, Trash2, Send, LayoutDashboard, FolderGit2, BookOpen, Clock, AlertCircle, FileText, CheckCircle2
} from 'lucide-react';
import { getDrafts, deleteDraft, publishDraft, createDraft } from '../services/api';

export default function DraftsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newDraft, setNewDraft] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const data = await getDrafts();
            setDrafts(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch drafts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDraft = async (e) => {
        e.preventDefault();
        try {
            const created = await createDraft({
                name: newDraft.name,
                description: newDraft.description,
                status: 'DRAFT',
                version: 1,
                payload: { topics: [] }
            });
            setDrafts([...drafts, created]);
            setIsCreateModalOpen(false);
            setNewDraft({ name: '', description: '' });
        } catch (err) {
            alert(err.message || 'Failed to create draft');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this draft?')) {
            try {
                await deleteDraft(id);
                setDrafts(drafts.filter(d => d.id !== id));
            } catch (err) {
                alert(err.message || 'Failed to delete draft');
            }
        }
    };

    const handlePublish = async (id) => {
        try {
            await publishDraft(id);
            fetchDrafts(); // Refresh to see updated status
            alert('Draft published successfully! It is now a Skill in your catalog.');
        } catch (err) {
            alert(err.message || 'Failed to publish draft');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar (simplified for brevity, assume similar to Dashboard) */}
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
                    <button className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <FileEdit className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Drafts
                    </button>
                    <button onClick={() => navigate('/templates')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <BookOpen className="h-4.5 w-4.5 mr-3" /> Templates
                    </button>
                    <button onClick={() => navigate('/analytics')} className="w-full flex items-center px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <AlertCircle className="h-4.5 w-4.5 mr-3" /> Analytics
                    </button>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center">
                            Drafts Manager
                        </h1>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate('/import')}
                                className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
                            >
                                Import JSON
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                            >
                                <Plus className="h-4 w-4 mr-1.5" /> New Draft
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-400">{error}</div>
                    ) : drafts.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
                            <FileText className="h-12 w-12 text-zinc-500 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Drafts Found</h3>
                            <p className="text-zinc-400 text-sm mb-6 max-w-md">You haven't created any drafts yet. Start building your next learning roadmap from scratch or import one.</p>
                            <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-500 transition-colors">
                                Create Blank Draft
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drafts.map(draft => (
                                <div key={draft.id} className="bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col transition-all group backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                            draft.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            draft.status === 'REVIEWING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        }`}>
                                            {draft.status}
                                        </span>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete(draft.id)} className="text-zinc-500 hover:text-rose-400 p-1">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{draft.name}</h3>
                                    <p className="text-xs text-zinc-400 mb-4 flex-1 line-clamp-3">{draft.description}</p>
                                    <div className="flex items-center text-xs text-zinc-500 mb-4">
                                        <Clock className="h-3.5 w-3.5 mr-1" /> Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="border-t border-white/5 pt-4 flex space-x-3">
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                                            Edit Editor
                                        </button>
                                        {draft.status !== 'PUBLISHED' && (
                                            <button onClick={() => handlePublish(draft.id)} className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/20 text-xs font-semibold py-2 rounded-xl transition-colors inline-flex items-center justify-center">
                                                <Send className="h-3.5 w-3.5 mr-1" /> Publish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Create Draft Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Draft</h2>
                        <form onSubmit={handleCreateDraft}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Draft Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newDraft.name} 
                                        onChange={e => setNewDraft({...newDraft, name: e.target.value})}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="e.g. Advanced TypeScript"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={newDraft.description} 
                                        onChange={e => setNewDraft({...newDraft, description: e.target.value})}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                        placeholder="Brief description of this learning path..."
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20">Create Draft</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
