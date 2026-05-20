import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, CheckCircle, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
    const { resetPasswordUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Missing password reset token. Please request a new link.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await resetPasswordUser(token, password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link may have expired or is invalid.');
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
                            Password Updated
                        </h2>
                        <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                            Your password has been successfully configured. You may now sign in using your new credentials.
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="mt-8 w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                        >
                            Log In <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-sm text-zinc-400">
                                Set a strong and secure new password
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                                {error}
                            </div>
                        )}

                        {!token && (
                            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
                                Warning: No reset token was detected in the URL. If you came from a link, please copy and paste the entire URL.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
