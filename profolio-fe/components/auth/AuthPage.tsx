import React from 'react';

interface AuthPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  return (
    <div className="relative min-h-screen w-full bg-background text-primary font-sans antialiased overflow-hidden flex flex-col items-center justify-center py-12 px-6 lg:px-8">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-60 pointer-events-none"></div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-mono uppercase tracking-widest group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back
      </button>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center group">
        
        {/* Logo Section - also acts as home link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-3 mb-8 transition-transform group-hover:scale-105 duration-300 cursor-pointer outline-none"
        >
          <div className="size-10 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-2xl">
            P
          </div>
          <h2 className="text-primary text-2xl font-serif tracking-tight">Profolio</h2>
        </button>

        {/* Title */}
        <h2 className="text-center text-4xl font-serif leading-9 text-primary mb-3">
          Access your AI Twin
        </h2>

        {/* Status Pill */}
        <div className="flex items-center gap-2 text-sm text-text-muted font-mono bg-surface border border-border px-3 py-1 rounded-full shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Status: Online
        </div>

        {/* Auth Card */}
        <div className="mt-10 w-full">
          <div className="bg-surface px-6 py-12 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-border sm:rounded-xl sm:px-10 relative overflow-hidden">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
            
            <div className="mb-8 text-center space-y-2">
              <h3 className="font-serif text-xl text-primary">Welcome back</h3>
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                Choose a provider to continue
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Google Button */}
              <button 
                onClick={onLogin}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-background border border-border px-3 py-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-surface-highlight transition-all group relative overflow-hidden"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-[11px] font-mono uppercase tracking-wide">Continue with Google</span>
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  <span className="material-symbols-outlined text-sm text-text-muted">arrow_forward</span>
                </div>
              </button>

              {/* GitHub Button */}
              <button 
                onClick={onLogin}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-primary px-3 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all group relative overflow-hidden"
              >
                <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                <span className="text-[11px] font-mono uppercase tracking-wide">Continue with GitHub</span>
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  <span className="material-symbols-outlined text-sm text-primary-foreground/80">arrow_forward</span>
                </div>
              </button>

            </div>

            <p className="mt-8 text-center text-xs text-text-muted">
              Not a member?
              <button className="font-semibold leading-6 text-primary hover:underline font-mono ml-1" onClick={onLogin}>
                Deploy new twin
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest opacity-60">
              Secured by Profolio Identity
            </p>
            <div className="flex justify-center gap-4 text-[10px] text-text-muted opacity-40 hover:opacity-100 transition-opacity">
              <a className="hover:text-primary cursor-pointer">Terms</a>
              <a className="hover:text-primary cursor-pointer">Privacy</a>
              <a className="hover:text-primary cursor-pointer">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;