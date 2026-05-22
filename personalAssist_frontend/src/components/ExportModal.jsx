import { useState, useEffect } from 'react';
import { X, Copy, Download, Check, Sparkles, FileText, CheckSquare, Calendar } from 'lucide-react';
import { exportRoadmap } from '../services/api';

export default function ExportModal({ isOpen, onClose, skillId, skillName }) {
    const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'tasks', 'revisions'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Data states
    const [roadmapData, setRoadmapData] = useState(null);
    const [tasksData, setTasksData] = useState([]);
    const [revisionsData, setRevisionsData] = useState([]);

    useEffect(() => {
        if (isOpen && skillId) {
            fetchExportData();
        }
    }, [isOpen, skillId]);

    const fetchExportData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await exportRoadmap(skillId);
            setRoadmapData(data);
            
            // Extract flattened tasks
            const tasks = [];
            const revisions = [];
            
            if (data && data.topics) {
                data.topics.forEach((topic) => {
                    if (topic.subtopics) {
                        topic.subtopics.forEach((subtopic) => {
                            if (subtopic.tasks) {
                                subtopic.tasks.forEach((task) => {
                                    const taskObj = {
                                        title: task.title,
                                        description: task.description || '',
                                        taskType: task.taskType || 'PRACTICE',
                                        priority: task.priority || 'MEDIUM',
                                        estimatedMinutes: task.estimatedMinutes || 30,
                                        topicTitle: topic.title,
                                        subtopicTitle: subtopic.title
                                    };
                                    tasks.push(taskObj);

                                    // Spaced Repetition Schedule for this task
                                    revisions.push({
                                        taskTitle: task.title,
                                        topicTitle: topic.title,
                                        subtopicTitle: subtopic.title,
                                        schedule: [
                                            { interval: "Day 1 (Immediate)", level: 1 },
                                            { interval: "Day 3 (Reinforcement)", level: 2 },
                                            { interval: "Day 7 (Spaced practice)", level: 3 },
                                            { interval: "Day 14 (Consolidation)", level: 4 },
                                            { interval: "Day 30 (Mastery)", level: 5 }
                                        ]
                                    });
                                });
                            }
                        });
                    }
                });
            }
            
            setTasksData(tasks);
            setRevisionsData(revisions);
        } catch (err) {
            setError(err.message || 'Failed to export roadmap data');
        } finally {
            setLoading(false);
        }
    };

    const getFormattedContent = () => {
        if (activeTab === 'roadmap') {
            return JSON.stringify(roadmapData, null, 2);
        } else if (activeTab === 'tasks') {
            return JSON.stringify(tasksData, null, 2);
        } else if (activeTab === 'revisions') {
            return JSON.stringify(revisionsData, null, 2);
        }
        return '';
    };

    const handleCopy = () => {
        const content = getFormattedContent();
        if (!content) return;
        
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const content = getFormattedContent();
        if (!content) return;

        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${skillName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${activeTab}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 transform scale-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Export Learning Assets
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="text-zinc-400 text-xs mb-4">
                    Export <span className="text-cyan-400 font-semibold">{skillName}</span> structured learning outline, task checklists, or spaced repetition logs.
                </p>

                {/* Tabs */}
                <div className="flex border-b border-white/5 mb-4 bg-zinc-950/40 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('roadmap')}
                        className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            activeTab === 'roadmap'
                                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                                : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Roadmap JSON
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            activeTab === 'tasks'
                                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                                : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                        Tasks List
                    </button>
                    <button
                        onClick={() => setActiveTab('revisions')}
                        className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            activeTab === 'revisions'
                                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                                : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Revisions Schedule
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-zinc-950 border border-white/5 rounded-xl overflow-hidden relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-rose-400 text-sm">
                            {error}
                        </div>
                    ) : (
                        <pre className="p-4 text-[10px] text-cyan-400/90 font-mono overflow-auto flex-1 select-all scrollbar-thin">
                            {getFormattedContent() || 'No data found'}
                        </pre>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4 shrink-0">
                    <span className="text-[10px] text-zinc-500">
                        {activeTab === 'roadmap' && 'Standard SkillForge Interchange Schema'}
                        {activeTab === 'tasks' && `${tasksData.length} tasks extracted`}
                        {activeTab === 'revisions' && `${revisionsData.length} active intervals mapped`}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCopy}
                            disabled={loading || error || !roadmapData}
                            className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                                    Copy Code
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={loading || error || !roadmapData}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
