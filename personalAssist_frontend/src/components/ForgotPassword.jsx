import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Loader2, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';

export default function ForgotPassword() {
    const { forgotPasswordUser } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPasswordUser(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-zinc-950 to-black px-4 relative overflow-hidden">
            {/* Background Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:border-white/25">
                {success ? (
                    <div className="text-center">
                        <div className="flex justify-center mb-6 text-emerald-400">
                            <CheckCircle className="h-16 w-16 stroke-[1.5]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">
                            Check Your Inbox
                        </h2>
                        <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                            If the email <span className="font-semibold text-cyan-400">{email}</span> is registered, a password reset link has been dispatched.
                        </p>

                        <div className="mt-8 p-4 bg-cyan-950/30 border border-cyan-800/30 rounded-xl text-left">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center">
                                Local Development Testing
                            </h4>
                            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                                Because we are running local Mailpit, you can inspect and open the generated email immediately in your browser:
                            </p>
                            <a
                                href="http://localhost:8025"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-full py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all"
                            >
                                Open Mailpit Inbox <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                            </a>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Forgot Password
                            </h2>
                            <p className="mt-2 text-sm text-zinc-400">
                                Enter your email to receive a password reset link
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                               ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <Link
                                to="/login"
                                className="inline-flex items-center font-semibold text-zinc-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
