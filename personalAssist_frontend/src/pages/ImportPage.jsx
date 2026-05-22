import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Sparkles, UploadCloud, FileJson, AlertTriangle, CheckCircle2, LayoutDashboard, FolderGit2, FileEdit, ArrowLeft, Send
} from 'lucide-react';
import { validateRoadmapPreview, importRoadmapAsDraft } from '../services/api';

export default function ImportPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length) handleFiles(files[0]);
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length) handleFiles(e.target.files[0]);
    };

    const handleFiles = (file) => {
        if (file.type !== "application/json" && !file.name.endsWith('.json')) {
            alert('Please upload a valid JSON file.');
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            setFileContent(content);
            await validateContent(content);
        };
        reader.readAsText(file);
    };

    const validateContent = async (content) => {
        setLoading(true);
        setValidationResult(null);
        try {
            const result = await validateRoadmapPreview(content);
            setValidationResult(result);
        } catch (err) {
            setValidationResult({ isValid: false, errors: [err.message || 'Invalid JSON format'] });
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!fileContent) return;
        setImportLoading(true);
        try {
            await importRoadmapAsDraft(fileContent);
            alert('Roadmap successfully imported as a Draft!');
            navigate('/drafts');
        } catch (err) {
            alert(err.message || 'Failed to import roadmap');
        } finally {
            setImportLoading(false);
        }
    };

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
                    <button onClick={() => navigate('/drafts')} className="w-full flex items-center px-4 py-3 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl transition-all font-medium text-sm cursor-pointer">
                        <FileEdit className="h-4.5 w-4.5 mr-3 text-cyan-400" /> Drafts
                    </button>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

                <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                        <button onClick={() => navigate('/drafts')} className="mr-4 text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Import JSON Roadmap
                        </h1>
                    </div>
                </header>

                <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
                    
                    {/* Drag and Drop Zone */}
                    <div 
                        className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                            isDragging 
                                ? 'border-cyan-500 bg-cyan-500/10 scale-105' 
                                : 'border-white/20 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-cyan-400' : 'text-zinc-500'}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Drop your JSON file here
                        </h2>
                        <p className="text-zinc-400 text-sm mb-8 text-center max-w-sm">
                            Import a SkillForge compliant JSON roadmap file to create a new draft.
                        </p>
                        <input 
                            type="file" 
                            accept=".json" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors border border-white/10 cursor-pointer"
                        >
                            Browse Files
                        </button>
                    </div>

                    {/* Validation Results Panel */}
                    {(loading || validationResult) && (
                        <div className="w-full max-w-2xl mt-8 bg-zinc-900/80 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/5">
                                <FileJson className="h-6 w-6 text-cyan-400" />
                                <div>
                                    <h3 className="font-bold text-white">{fileName}</h3>
                                    <p className="text-xs text-zinc-500">Validation Status</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-cyan-500 mr-3"></div>
                                    <span className="text-sm text-zinc-400">Analyzing JSON structure...</span>
                                </div>
                            ) : validationResult && (
                                <div className="space-y-4">
                                    {validationResult.isValid ? (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-emerald-400 mb-1">Valid Roadmap Structure</h4>
                                                <p className="text-xs text-emerald-400/80">The JSON schema perfectly matches the SkillForge engine requirements.</p>
                                                
                                                {/* Meta Preview */}
                                                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <span className="text-zinc-500 block mb-1">Extracted Title</span>
                                                        <span className="text-white font-semibold">{validationResult.previewName || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-500 block mb-1">Complexity</span>
                                                        <span className="text-white font-semibold">{validationResult.topicCount} Topics</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start">
                                            <AlertTriangle className="h-5 w-5 text-rose-400 mr-3 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-rose-400 mb-2">Validation Errors Found</h4>
                                                <ul className="text-xs text-rose-400/80 space-y-1 list-disc list-inside">
                                                    {validationResult.errors?.map((err, i) => <li key={i}>{err}</li>) || <li>Invalid format</li>}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {validationResult.warnings && validationResult.warnings.length > 0 && (
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                            <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1.5" /> Warnings
                                            </h4>
                                            <ul className="text-xs text-amber-400/80 space-y-1 list-disc list-inside">
                                                {validationResult.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleImport}
                                            disabled={!validationResult.isValid || importLoading}
                                            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-all"
                                        >
                                            {importLoading ? 'Importing...' : <><Send className="h-4 w-4 mr-1.5" /> Save as Draft</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
