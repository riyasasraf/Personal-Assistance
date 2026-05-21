import { useState } from 'react';
import { 
    X, CheckSquare, Clock, AlertCircle, Plus, 
    Trash2, Calendar, CheckCircle2, Zap
} from 'lucide-react';
import { useSkills } from '../../context/SkillsContext';

const PRIORITY_CONFIG = {
    CRITICAL: { label: 'Critical', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    HIGH:     { label: 'High',     color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    MEDIUM:   { label: 'Medium',   color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    LOW:      { label: 'Low',      color: 'bg-zinc-800 text-zinc-400 border-white/5' },
};

export default function SubtopicDrawer({ subtopic, onClose }) {
    const { 
        tasksMap, toggleSubtopic, addTask, toggleTask, removeTask 
    } = useSkills();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState('PRACTICE');
    const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
    const [newTaskMinutes, setNewTaskMinutes] = useState(30);
    const [newTaskDate, setNewTaskDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    
    const [adding, setAdding] = useState(false);
    const [taskError, setTaskError] = useState('');
    const [animatingTaskId, setAnimatingTaskId] = useState(null);

    if (!subtopic) return null;

    const subtopicTasks = tasksMap[subtopic.id] || [];

    const handleSubtopicToggle = async () => {
        try {
            await toggleSubtopic(subtopic.id, subtopic.topicId, !subtopic.completed);
        } catch (err) {
            console.error('Failed to toggle subtopic completion:', err);
        }
    };

    const handleTaskToggle = async (taskId, currentStatus) => {
        const completed = currentStatus !== 'COMPLETED';
        // Trigger animation
        setAnimatingTaskId(taskId);
        setTimeout(() => setAnimatingTaskId(null), 600);
        try {
            await toggleTask(taskId, subtopic.id, completed);
        } catch (err) {
            console.error('Failed to toggle task:', err);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setTaskError('');

        if (!newTaskTitle.trim()) {
            setTaskError('Task title is required');
            return;
        }

        setAdding(true);
        try {
            await addTask({
                title: newTaskTitle,
                description: '',
                subtopicId: subtopic.id,
                taskType: newTaskType,
                status: 'TODO',
                scheduledDate: newTaskDate,
                priority: newTaskPriority,
                estimatedMinutes: Number(newTaskMinutes),
            });
            setNewTaskTitle('');
        } catch (err) {
            setTaskError(err.message || 'Failed to add task');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (confirm('Delete this task?')) {
            try {
                await removeTask(taskId, subtopic.id);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    // Progress calculations
    const completedTasksCount = subtopicTasks.filter((t) => t.status === 'COMPLETED').length;
    const totalTasksCount = subtopicTasks.length;
    const taskPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    const totalEstimatedMinutes = subtopicTasks.reduce((s, t) => s + (t.estimatedMinutes || 0), 0);
    const completedMinutes = subtopicTasks.filter(t => t.status === 'COMPLETED').reduce((s, t) => s + (t.estimatedMinutes || 0), 0);

    // SVG circular progress
    const circleRadius = 38;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const circleOffset = circleCircumference - (taskPercent / 100) * circleCircumference;

    return (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl flex flex-col backdrop-blur-xl bg-zinc-900/95 animate-slideInRight">
            {/* Top Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                        Active Subtopic Detail
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight truncate max-w-[280px]">
                        {subtopic.title}
                    </h3>
                </div>
                <button 
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Content Drawer Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Progress Gauge + Meta Panel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center space-x-5">
                        {/* Circular Progress Gauge */}
                        <div className="relative shrink-0">
                            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                                <circle
                                    cx="48" cy="48" r={circleRadius}
                                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
                                />
                                <circle
                                    cx="48" cy="48" r={circleRadius}
                                    fill="none"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={circleOffset}
                                    className="transition-all duration-700 ease-out"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-white leading-none">{taskPercent}%</span>
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Done</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 flex-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-medium">Tasks</span>
                                <span className="text-zinc-200 font-bold">{completedTasksCount}/{totalTasksCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-medium">Time Invested</span>
                                <span className="flex items-center text-zinc-200 font-bold">
                                    <Clock className="h-3 w-3 mr-1 text-zinc-400" /> {completedMinutes}/{totalEstimatedMinutes}m
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-medium">Difficulty</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                    subtopic.difficulty === 'HARD'
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : subtopic.difficulty === 'MEDIUM'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {subtopic.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Master subtopic complete button */}
                    <button
                        onClick={handleSubtopicToggle}
                        className={`w-full mt-4 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 ${
                            subtopic.completed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10'
                        }`}
                    >
                        <CheckCircle2 className={`h-4 w-4 ${subtopic.completed ? 'text-emerald-400' : 'text-cyan-400'}`} />
                        <span>{subtopic.completed ? 'Completed (Mark Active)' : 'Mark Subtopic Complete'}</span>
                    </button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Module Explanation
                    </h4>
                    <p className="text-zinc-300 text-xs leading-relaxed bg-zinc-950/40 p-4 border border-white/5 rounded-xl">
                        {subtopic.description || "Learn the concepts of this module, study key documentation, and solve practice problems using the checklist below."}
                    </p>
                </div>

                {/* Checklist (Tasks) */}
                <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Learning Checklist ({completedTasksCount}/{totalTasksCount})
                        </h4>
                        {totalTasksCount > 0 && (
                            <span className="text-[10px] text-cyan-400 font-semibold">{taskPercent}% done</span>
                        )}
                    </div>

                    {subtopicTasks.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/5 bg-zinc-950/20 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
                            <p className="text-zinc-500 text-[11px]">No tasks scheduled for this subtopic.</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {subtopicTasks.map((task) => {
                                const isAnimating = animatingTaskId === task.id;
                                const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                                return (
                                    <div 
                                        key={task.id}
                                        className={`p-3 bg-zinc-950/50 border hover:border-white/10 rounded-xl transition-all duration-300 flex items-start justify-between ${
                                            task.status === 'COMPLETED' ? 'border-emerald-500/10 bg-emerald-500/[0.005]' : 'border-white/5'
                                        } ${isAnimating ? 'scale-[1.02] shadow-lg shadow-cyan-500/10' : ''}`}
                                    >
                                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                                            <button
                                                type="button"
                                                onClick={() => handleTaskToggle(task.id, task.status)}
                                                className="mt-0.5 text-zinc-500 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                                            >
                                                <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all duration-300 ${
                                                    task.status === 'COMPLETED' 
                                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                                                        : 'border-zinc-700 hover:border-cyan-500/50'
                                                }`}>
                                                    {task.status === 'COMPLETED' && (
                                                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                    )}
                                                </div>
                                            </button>
                                            
                                            <div className="min-w-0 flex-1">
                                                <span className={`text-[11px] font-bold block leading-tight transition-all duration-300 ${
                                                    task.status === 'COMPLETED' ? 'text-zinc-500 line-through' : 'text-zinc-200'
                                                }`}>
                                                    {task.title}
                                                </span>
                                                
                                                {/* Task metadata badges */}
                                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] bg-zinc-800 text-zinc-400 font-bold tracking-wider uppercase border border-white/5">
                                                        {task.taskType}
                                                    </span>
                                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${priorityCfg.color}`}>
                                                        {task.priority || 'MEDIUM'}
                                                    </span>
                                                    {task.estimatedMinutes > 0 && (
                                                        <span className="flex items-center text-[8px] text-zinc-500 font-semibold">
                                                            <Clock className="h-2.5 w-2.5 mr-0.5" /> {task.estimatedMinutes}m
                                                        </span>
                                                    )}
                                                    {task.scheduledDate && (
                                                        <span className="flex items-center text-[8px] text-zinc-500">
                                                            <Calendar className="h-2.5 w-2.5 mr-0.5" /> {task.scheduledDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete task */}
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-zinc-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer shrink-0 ml-2"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add task inline form */}
                <div className="border-t border-white/5 pt-5 space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-cyan-400" /> Insert Checklist Task
                    </h4>
                    <form onSubmit={handleAddTask} className="space-y-3 bg-zinc-950/20 p-4 border border-white/5 rounded-xl">
                        {taskError && (
                            <div className="text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                                {taskError}
                            </div>
                        )}

                        <div>
                            <input
                                type="text"
                                placeholder="What task needs to be completed?..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">
                                    Activity Type
                                </label>
                                <select
                                    value={newTaskType}
                                    onChange={(e) => setNewTaskType(e.target.value)}
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                                >
                                    <option value="PRACTICE">Practice</option>
                                    <option value="READING">Reading</option>
                                    <option value="PROJECT">Project</option>
                                    <option value="REVISION">Revision</option>
                                    <option value="QUIZ">Quiz</option>
                                    <option value="NOTES">Notes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">
                                    Priority
                                </label>
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value)}
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">
                                    Est. Minutes
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="480"
                                    value={newTaskMinutes}
                                    onChange={(e) => setNewTaskMinutes(e.target.value)}
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 pl-1">
                                    Target Date
                                </label>
                                <input
                                    type="date"
                                    value={newTaskDate}
                                    onChange={(e) => setNewTaskDate(e.target.value)}
                                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-2.5 py-1 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={adding}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-xs disabled:opacity-50 transition-all cursor-pointer inline-flex items-center shadow-lg shadow-cyan-500/10"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> {adding ? 'Adding...' : 'Add checklist item'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
