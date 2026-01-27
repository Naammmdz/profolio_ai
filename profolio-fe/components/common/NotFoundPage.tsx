import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const goDashboard = () => {
    if (auth.isAuthenticated) navigate('/dashboard');
    else navigate('/');
  };

  return (
    <div className="bg-background text-primary overflow-hidden selection:bg-black/10 flex flex-col min-h-screen relative">
      <style>{`
        .nf-bg-grid {
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
        }
      `}</style>

      <div className="fixed inset-0 z-0 bg-grid nf-bg-grid opacity-60 pointer-events-none"></div>

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-md">
        <div className="px-6 lg:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center text-black dark:text-white border border-black/10 dark:border-white/10 rounded bg-black/5 dark:bg-white/5 font-serif italic text-xl">
              p
            </div>
            <h2 className="text-black dark:text-white text-xl font-serif tracking-tight">Profolio</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              className="text-text-muted hover:text-black dark:hover:text-white text-xs uppercase tracking-widest font-mono transition-colors"
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              className="text-text-muted hover:text-black dark:hover:text-white text-xs uppercase tracking-widest font-mono transition-colors"
              onClick={goDashboard}
            >
              Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {!auth.isAuthenticated && (
              <button
                className="hidden sm:block text-text-muted hover:text-black dark:hover:text-white text-xs font-mono uppercase tracking-wide"
                onClick={() => auth.signinRedirect()}
              >
                Log in
              </button>
            )}
            <button
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all text-xs font-bold uppercase tracking-wide"
              onClick={goDashboard}
            >
              {auth.isAuthenticated ? 'Back to Dashboard' : 'Visit Homepage'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pb-20">
        <div className="relative mb-8 group cursor-default">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative transform transition-transform duration-500 group-hover:-translate-y-2">
            <span className="material-symbols-outlined text-[140px] text-gray-100 dark:text-zinc-800 rotate-[-10deg]">
              chat_bubble
            </span>
            <div className="absolute inset-0 flex items-center justify-center pb-8 pl-2 rotate-[-10deg]">
              <div className="flex gap-2">
                <span className="size-3 bg-gray-300 dark:bg-zinc-700 rounded-full"></span>
                <span className="size-3 bg-gray-300 dark:bg-zinc-700 rounded-full"></span>
                <span className="size-3 bg-gray-300 dark:bg-zinc-700 rounded-full"></span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-white dark:bg-zinc-900 rounded-full p-1 border border-gray-100 dark:border-zinc-800 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-accent rotate-12">question_mark</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl lg:text-6xl font-serif text-black dark:text-white mb-6 text-center leading-tight">
          404 - Your AI twin is <br />
          <span className="italic text-text-muted font-normal">lost in thought</span>
        </h1>
        <p className="text-text-muted max-w-lg text-center mb-12 font-light leading-relaxed text-lg">
          We couldn&apos;t find the page you&apos;re looking for. Maybe it&apos;s a hallucination?
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={goDashboard}
            className="h-12 px-8 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-100 font-medium text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/5"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-black dark:hover:text-white border-b border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all pb-1"
          >
            Visit our Homepage
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
          <p className="font-mono text-[10px] text-text-muted text-center">
            ERR_content_hallucination_detected <br />
            retrying_connection...
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;

