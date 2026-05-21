import { useState } from 'react';
import { 
    ChevronDown, ChevronRight, CheckCircle2, Circle, 
    Clock, Award, HelpCircle, BookOpen, Plus, Trash2 
} from 'lucide-react';
import { useSkills } from '../../context/SkillsContext';

export default function RoadmapTree({ onSubtopicClick, onAddTopic, onAddSubtopic }) {
    const { topics, subtopicsMap, toggleSubtopic, removeTopic, removeSubtopic } = useSkills();
    const [expandedTopics, setExpandedTopics] = useState({});

    const toggleTopicExpand = (topicId) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [topicId]: !prev[topicId],
        }));
    };

    const handleSubtopicCheck = async (e, subtopic) => {
        e.stopPropagation(); // Avoid opening drawer
        try {
            await toggleSubtopic(subtopic.id, subtopic.topicId, !subtopic.completed);
        } catch (err) {
            console.error('Failed to toggle completion:', err);
        }
    };

    const handleDeleteTopic = async (e, topicId) => {
        e.stopPropagation();
        if (confirm('Delete this topic and all its nested subtopics?')) {
            try {
                await removeTopic(topicId);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDeleteSubtopic = async (e, subtopicId, topicId) => {
        e.stopPropagation();
        if (confirm('Delete this subtopic?')) {
            try {
                await removeSubtopic(subtopicId, topicId);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (topics.length === 0) {
        return (
            <div className="text-center py-10 bg-white/5 border border-white/10 border-dashed rounded-2xl p-6 backdrop-blur-sm">
                <BookOpen className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-200">No Learning Path Generated</h4>
                <p className="text-zinc-500 text-xs mt-1 mb-4">You can manually insert topics and subtopics using the actions above.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {topics.map((topic, topicIdx) => {
                const subtopics = subtopicsMap[topic.id] || [];
                const isExpanded = expandedTopics[topic.id] !== false; // Default expanded
                const completedCount = subtopics.filter((s) => s.completed).length;
                const totalCount = subtopics.length;
                const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                    <div 
                        key={topic.id} 
                        className="bg-white/5 border border-white/10 hover:border-white/15 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors"
                    >
                        {/* Topic Header Accordion */}
                        <div 
                            onClick={() => toggleTopicExpand(topic.id)}
                            className="p-5 flex items-center justify-between cursor-pointer select-none border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                                <div className="h-8 w-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center font-bold text-xs text-zinc-400">
                                    {topicIdx + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-400">
                                        {topic.title}
                                    </h4>
                                    <p className="text-zinc-500 text-xs truncate mt-0.5 max-w-lg">
                                        {topic.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 pl-4">
                                {/* Progress badge */}
                                {totalCount > 0 && (
                                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        {completedCount}/{totalCount} Completed ({percent}%)
                                    </span>
                                )}

                                {/* Expand/Collapse icon */}
                                <div className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors">
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </div>

                                {/* Delete Topic */}
                                <button
                                    onClick={(e) => handleDeleteTopic(e, topic.id)}
                                    className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Topic"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Subtopics Nested Container */}
                        {isExpanded && (
                            <div className="p-4 bg-zinc-950/20 relative">
                                
                                {/* Vertical tree connector line */}
                                {subtopics.length > 1 && (
                                    <div className="absolute left-[31px] top-6 bottom-8 w-0.5 bg-zinc-800 -z-10"></div>
                                )}

                                {subtopics.length === 0 ? (
                                    <div className="text-center py-6 text-zinc-500 text-xs">
                                        No subtopics in this topic yet.
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onAddSubtopic(topic.id); }}
                                            className="text-cyan-400 hover:underline block mx-auto mt-2 font-bold cursor-pointer"
                                        >
                                            + Add Subtopic
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {subtopics.map((sub, subIdx) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => onSubtopicClick(sub)}
                                                className={`flex items-start justify-between p-3.5 bg-white/5 border hover:bg-white/10 rounded-xl cursor-pointer transition-all ${
                                                    sub.completed 
                                                        ? 'border-emerald-500/20 bg-emerald-500/[0.01]' 
                                                        : 'border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                {/* Left side: Checklist & Title */}
                                                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                                                    {/* Completion check circle */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleSubtopicCheck(e, sub)}
                                                        className="mt-0.5 text-zinc-500 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                                                    >
                                                        {sub.completed ? (
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                                        ) : (
                                                            <Circle className="h-5 w-5 shrink-0" />
                                                        )}
                                                    </button>

                                                    <div className="min-w-0 flex-1">
                                                        <h5 className={`text-xs font-bold truncate ${
                                                            sub.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
                                                        }`}>
                                                            {sub.title}
                                                        </h5>
                                                        <p className="text-zinc-500 text-[11px] truncate mt-0.5 max-w-md">
                                                            {sub.description || 'No explanation mapped yet.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right side: Metadata Badges */}
                                                <div className="flex items-center space-x-3 pl-4">
                                                    {/* Estimated time */}
                                                    <span className="flex items-center text-[10px] text-zinc-500 whitespace-nowrap">
                                                        <Clock className="h-3 w-3 mr-1 text-zinc-500" /> {sub.estimatedMinutes}m
                                                    </span>

                                                    {/* Difficulty badge */}
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                        sub.difficulty === 'HARD'
                                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                                                            : sub.difficulty === 'MEDIUM'
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                                    }`}>
                                                        {sub.difficulty.toLowerCase()}
                                                    </span>

                                                    {/* Quick Delete */}
                                                    <button
                                                        onClick={(e) => handleDeleteSubtopic(e, sub.id, topic.id)}
                                                        className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                                        title="Delete Subtopic"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Inline Add subtopic helper */}
                                        <div className="pt-1 flex justify-end">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAddSubtopic(topic.id); }}
                                                className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                                            >
                                                <Plus className="h-3 w-3 mr-1" /> Add Subtopic
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
