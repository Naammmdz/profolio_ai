import React from 'react';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

interface HeaderProps {
  onGetStarted?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
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

          <button 
            onClick={onGetStarted}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-5 bg-primary text-primary-foreground hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wide"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;