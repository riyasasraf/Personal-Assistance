import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Sparkles, BookOpen, Download, LayoutDashboard, FolderGit2, FileEdit, AlertCircle, Search, Filter, Layers
} from 'lucide-react';
import { getTemplates, importTemplateAsDraft } from '../services/api';

export default function TemplatesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [importingId, setImportingId] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const data = await getTemplates();
            setTemplates(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (id) => {
        setImportingId(id);
        try {
            await importTemplateAsDraft(id);
            alert('Template successfully imported as a Draft! You can view it in the Drafts manager.');
            navigate('/drafts');
        } catch (err) {
            alert(err.message || 'Failed to import template');
        } finally {
            setImportingId(null);
        }
    };

    // Derived categories
    const categories = ['All', ...new Set(templates.map(t => t.category).filter(Boolean))];

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                              (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

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
                    <button className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <BookOpen className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Templates
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
                            Template Library
                        </h1>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between backdrop-blur-sm">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                            <Filter className="h-4 w-4 text-zinc-500 mr-2 shrink-0" />
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                        categoryFilter === cat 
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-transparent'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-400">{error}</div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
                            <Layers className="h-12 w-12 text-zinc-500 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Templates Found</h3>
                            <p className="text-zinc-400 text-sm">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map(template => (
                                <div key={template.id} className="bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col transition-all group backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border bg-zinc-800 text-zinc-400 border-white/10">
                                            {template.category || 'General'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{template.name}</h3>
                                    <p className="text-xs text-zinc-400 mb-6 flex-1 line-clamp-3">{template.description}</p>
                                    
                                    <button 
                                        onClick={() => handleImport(template.id)}
                                        disabled={importingId === template.id}
                                        className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
                                    >
                                        {importingId === template.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                                        ) : (
                                            <Download className="h-4 w-4 mr-1.5" />
                                        )}
                                        {importingId === template.id ? 'Importing...' : 'Import as Draft'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
