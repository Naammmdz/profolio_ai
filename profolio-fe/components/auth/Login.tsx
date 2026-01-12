import React, { useState } from 'react';
import { authService } from '../../src/services/authService';

interface LoginProps {
    onBack: () => void;
    onLogin: () => void;
    onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login({ email, password });
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = (provider: 'google' | 'linkedin') => {
        // OAuth login will be handled separately
        onLogin();
    };

    return (
        <div className="relative min-h-screen w-full bg-background text-primary font-sans antialiased overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="w-full py-2 px-6 md:px-12 flex justify-between items-center z-50 relative">
                <button onClick={onBack} className="flex items-center gap-3 group">
                    <div className="size-10 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-2xl group-hover:scale-105 transition-transform duration-300">
                        P
                    </div>
                    <span className="text-xl font-serif tracking-tight text-primary font-medium group-hover:opacity-80 transition-opacity">Profolio</span>
                </button>
                <button onClick={onBack} className="text-sm font-mono text-text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                    <span>// Return Home</span>
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-md">
                    <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-serif text-primary mb-2 tracking-tight">Log In</h1>
                            <p className="text-sm text-text-muted font-light">Enter your credentials to continue.</p>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-surface-highlight border border-border hover:border-primary/20 rounded text-sm text-primary transition-all duration-200 font-medium"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Google
                            </button>
                            <button
                                onClick={() => handleOAuthLogin('linkedin')}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-surface-highlight border border-border hover:border-primary/20 rounded text-sm text-primary transition-all duration-200 font-medium"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                                GitHub
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                                <span className="bg-surface px-2 text-text-muted font-mono">OR SIGN IN WITH EMAIL</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded font-mono">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-mono text-text-muted font-bold uppercase tracking-wide ml-1">EMAIL OR USERNAME</label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-background border border-border rounded px-4 py-3 pr-10 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                                        placeholder="name@company.com"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted/50 text-sm group-focus-within:text-primary transition-colors pointer-events-none">person</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-xs font-mono text-text-muted font-bold uppercase tracking-wide">PASSWORD</label>
                                    <button type="button" className="text-xs text-primary/80 hover:text-primary transition-colors font-mono" onClick={() => {/* Handle forgot password */ }}>Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-background border border-border rounded px-4 py-3 pr-20 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute right-10 top-3 text-text-muted/50 text-sm group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-text-muted/50 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3.5 rounded shadow-sm transition-all flex items-center justify-center gap-2 group font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isLoading ? 'SIGNING IN...' : 'LOG IN'}</span>
                                {!isLoading && (
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-border">
                            <p className="text-sm text-text-muted">
                                Don't have an account?{' '}
                                <button onClick={onSwitchToSignUp} className="text-primary hover:opacity-80 font-semibold font-mono transition-opacity underline decoration-primary/20 underline-offset-4 hover:decoration-primary/50">Sign Up</button>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-6 text-xs text-text-muted/60 font-mono">
                        <a className="hover:text-text-muted transition-colors cursor-pointer">Terms of Service</a>
                        <span className="text-text-muted/30">|</span>
                        <a className="hover:text-text-muted transition-colors cursor-pointer">Privacy Policy</a>
                        <span className="text-text-muted/30">|</span>
                        <a className="hover:text-text-muted transition-colors cursor-pointer">Help</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
