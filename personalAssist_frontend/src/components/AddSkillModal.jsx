import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function AddSkillModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('BEGINNER');
    const [goal, setGoal] = useState('');
    const [status, setStatus] = useState('PUBLISHED');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Skill name is required');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                name,
                description,
                level,
                goal,
                status,
            });
            setName('');
            setDescription('');
            setLevel('BEGINNER');
            setGoal('');
            setStatus('PUBLISHED');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create skill');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 transform scale-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Add New Skill Roadmap
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Skill Name */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Data Structures & Algorithms, React Native"
                            maxLength={100}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe what this skill entails..."
                            rows={3}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Skill Goal */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            Mastery Goal
                        </label>
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. Master tree algorithms or land software engineer role"
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    {/* Difficulty Level Selection */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            Skill Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setLevel(lvl)}
                                    className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                        level === lvl 
                                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                                            : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-300'
                                    }`}
                                >
                                    {lvl.toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status selection */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            State Configuration
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { val: 'DRAFT', label: 'Draft Mode' },
                                { val: 'PUBLISHED', label: 'Published' }
                            ].map((st) => (
                                <button
                                    key={st.val}
                                    type="button"
                                    onClick={() => setStatus(st.val)}
                                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        status === st.val 
                                            ? 'bg-violet-500/10 border-violet-500 text-violet-300 shadow-md shadow-violet-500/10'
                                            : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/10'
                                    }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/5 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center"
                        >
                            {submitting ? 'Creating...' : 'Create Skill'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
