import React, { useState } from 'react';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

interface HeaderProps {
  onGetStarted?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onGoDashboard?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onGetStarted,
  isAuthenticated = false,
  userEmail,
  onGoDashboard,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName =
    userEmail ||
    (typeof window !== 'undefined' ? new URL(window.location.href).hostname : '');
  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const handleCtaClick = () => {
    if (isAuthenticated && onGoDashboard) {
      onGoDashboard();
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/50 transition-colors duration-300">
      <div className="px-6 lg:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-xl">
            P
          </div>
          <h2 className="text-primary text-xl font-serif tracking-tight">Profolio</h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-text-muted hover:text-primary text-xs uppercase tracking-widest font-mono transition-colors" href="#how-it-works">How It Works</a>
          <a className="text-text-muted hover:text-primary text-xs uppercase tracking-widest font-mono transition-colors" href="#use-cases">Use Cases</a>
          <a className="text-text-muted hover:text-primary text-xs uppercase tracking-widest font-mono transition-colors" href="#showcase">Showcase</a>
          <a className="text-text-muted hover:text-primary text-xs uppercase tracking-widest font-mono transition-colors" href="#pricing">Pricing</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />

          <div className="flex items-center gap-3">
            {!isAuthenticated && (
              <button 
                onClick={handleCtaClick}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-5 bg-primary text-primary-foreground hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wide"
              >
                Get Started
              </button>
            )}

            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border border-border hover:bg-primary/15 transition-colors"
                >
                  {initials}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-background shadow-lg text-xs font-mono">
                    <div className="px-3 py-2 border-b border-border text-[10px] text-text-muted truncate">
                      {userEmail || 'Signed in'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onGoDashboard?.();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
