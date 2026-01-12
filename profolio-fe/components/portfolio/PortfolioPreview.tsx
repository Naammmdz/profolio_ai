import React from 'react';

interface PortfolioPreviewProps {
  onBack: () => void;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ onBack }) => {
  return (
    <div className="bg-background text-primary font-sans min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300">
      {/* Banner */}
      <div className="bg-yellow-200/80 dark:bg-yellow-500/20 w-full py-3 px-4 flex justify-center items-center gap-4 text-sm font-medium border-b border-yellow-300/50 text-yellow-800 dark:text-yellow-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>This portfolio is unpublished—only you can see it</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-1 hover:underline decoration-current underline-offset-2 font-bold cursor-pointer bg-transparent border-0 p-0 text-inherit">
            Back to Dashboard
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center pt-16 pb-20 px-4 relative max-w-5xl mx-auto w-full">
        {/* Info Button */}
        <button className="absolute top-8 right-8 text-text-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">info</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-primary">
                Hey, I'm Giang Nam <span className="text-2xl">👋</span>
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-12 font-serif">
                Backend Developer
          </h1>
          
          {/* Avatar SVG */}
          <div className="mb-10 flex justify-center">
            <div className="w-48 h-48 md:w-56 md:h-56 relative">
              <svg className="w-full h-full text-primary transition-colors duration-300" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 140C125 140 145 130 145 100C145 70 125 40 100 40C75 40 55 70 55 100C55 130 75 140 100 140Z" fill="var(--background)" stroke="currentColor" strokeWidth="3"></path>
                <path d="M70 100C70 100 80 105 100 105C120 105 130 100 130 100" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                <circle cx="80" cy="85" fill="currentColor" r="5"></circle>
                <circle cx="120" cy="85" fill="currentColor" r="5"></circle>
                <path d="M100 140V180" stroke="currentColor" strokeWidth="3"></path>
                <path d="M60 180H140" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="65" y="75"></rect>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="105" y="75"></rect>
                <path d="M95 85H105" stroke="currentColor" strokeWidth="2"></path>
                <path d="M55 90C55 90 50 60 70 50C80 45 90 55 100 50C110 45 130 40 145 60C150 70 145 90 145 90" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                <path d="M40 200C40 160 60 150 100 150C140 150 160 160 160 200" stroke="currentColor" strokeWidth="3"></path>
                <path d="M100 150L100 165L90 180L100 190L110 180L100 165" fill="currentColor"></path>
                <path d="M100 165L80 160M100 165L120 160" stroke="currentColor" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-12 relative z-20">
          <div className="relative group">
            <input className="w-full pl-6 pr-14 py-4 rounded-full border border-border shadow-sm focus:border-primary/50 focus:ring-0 text-base placeholder:text-text-muted transition-shadow hover:shadow-md bg-surface text-primary outline-none" placeholder="Ask me anything..." type="text"/>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-colors flex items-center justify-center size-10">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="w-full max-w-3xl relative z-20">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {['Me', 'Projects', 'Skills', 'Contact'].map((item, i) => (
                <button key={i} className="bg-surface hover:bg-surface-highlight border border-border hover:border-primary/20 rounded-xl w-32 h-24 flex flex-col items-center justify-center gap-2 transition-all shadow-sm hover:shadow group text-primary">
                    <span className="material-symbols-outlined text-text-muted group-hover:scale-110 transition-transform group-hover:text-primary">
                        {item === 'Me' ? 'face' : item === 'Projects' ? 'work' : item === 'Skills' ? 'layers' : 'person_search'}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             {['Fun', 'Video', 'Location', 'Resume'].map((item, i) => (
                <button key={i} className="bg-surface hover:bg-surface-highlight border border-border hover:border-primary/20 rounded-xl w-32 h-24 flex flex-col items-center justify-center gap-2 transition-all shadow-sm hover:shadow group text-primary">
                    <span className="material-symbols-outlined text-text-muted group-hover:scale-110 transition-transform group-hover:text-primary">
                        {item === 'Fun' ? 'celebration' : item === 'Video' ? 'videocam' : item === 'Location' ? 'location_on' : 'description'}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                </button>
            ))}
          </div>
        </div>

        {/* Watermark */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none -z-0 opacity-[0.03] overflow-hidden">
          <h1 className="text-[20vw] font-bold leading-none tracking-tighter whitespace-nowrap text-primary select-none font-serif">
                Giang Nam
          </h1>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPreview;