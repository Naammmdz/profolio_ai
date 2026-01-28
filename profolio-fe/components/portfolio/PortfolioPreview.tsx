import React from 'react';

interface PortfolioPreviewProps {
  onBack: () => void;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ onBack }) => {
  // Sample data - should come from props or API in real app
  const userName = "fsdfsff"; // This should come from user data
  const userTitle = "Backend Developer";

  return (
    <div className="bg-background text-primary font-sans h-screen flex flex-col relative overflow-hidden dark:bg-zinc-950 transition-colors duration-300">
      {/* Banner Warning */}
      <div className="bg-[#FEFCE8] dark:bg-yellow-900/20 w-full py-2.5 px-4 flex justify-center items-center gap-4 text-xs tracking-wide font-medium border-b border-[#FEF08A] dark:border-yellow-800/30 text-yellow-900/80 dark:text-yellow-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-yellow-600 dark:text-yellow-400">lock</span>
          <span>This portfolio is unpublished—only you can see it</span>
        </div>
        <div className="h-4 w-px bg-yellow-900/10 dark:bg-yellow-200/20"></div>
        <a 
          onClick={onBack}
          className="flex items-center gap-1 hover:text-yellow-950 dark:hover:text-yellow-100 transition-colors cursor-pointer"
        >
          Back to Dashboard
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col items-center pt-4 pb-8 px-4 relative max-w-5xl mx-auto w-full">
        {/* Info Button */}
        <button className="absolute top-4 right-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-surface dark:hover:bg-zinc-800 p-2">
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-4 relative z-10 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif italic text-black/70 dark:text-white/70 mb-2 flex items-center justify-center gap-2">
            Hey, I'm {userName} <span className="text-2xl not-italic grayscale opacity-80">👋</span>
          </h2>
          <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-primary dark:text-white mb-4 leading-[1.1]">
            {userTitle}
          </h1>
          
          {/* Avatar SVG */}
          <div className="mb-4 flex justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
              <svg className="w-full h-full text-black dark:text-white drop-shadow-sm" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 140C125 140 145 130 145 100C145 70 125 40 100 40C75 40 55 70 55 100C55 130 75 140 100 140Z" fill="white" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M70 100C70 100 80 105 100 105C120 105 130 100 130 100" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="80" cy="85" fill="currentColor" r="4"></circle>
                <circle cx="120" cy="85" fill="currentColor" r="4"></circle>
                <path d="M100 140V180" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M60 180H140" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="65" y="75"></rect>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="105" y="75"></rect>
                <path d="M95 85H105" stroke="currentColor" strokeWidth="2"></path>
                <path d="M55 90C55 90 50 60 70 50C80 45 90 55 100 50C110 45 130 40 145 60C150 70 145 90 145 90" fill="black" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <path d="M40 200C40 160 60 150 100 150C140 150 160 160 160 200" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M100 150L100 165L90 180L100 190L110 180L100 165" fill="black"></path>
                <path d="M100 165L80 160M100 165L120 160" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="w-full max-w-xl mb-6 relative z-20">
          <div className="relative group">
            <input 
              className="custom-input w-full pl-6 pr-14 py-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)] focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-light transition-all text-gray-800 dark:text-white" 
              placeholder="Ask me anything..." 
              type="text"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:bg-black dark:hover:bg-gray-100 transition-all flex items-center justify-center size-9 shadow-sm hover:shadow-md active:scale-95">
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="w-full max-w-3xl relative z-20">
          {/* First Row - 5 buttons */}
          <div className="grid grid-cols-5 gap-3 md:gap-4 justify-items-center mb-3 md:mb-4">
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">face</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Me</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">work</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Projects</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">layers</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Skills</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">celebration</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Fun</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">person_search</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Contact</span>
            </button>
          </div>
          {/* Second Row - 3 buttons */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 justify-items-center max-w-[60%] mx-auto">
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">videocam</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Video</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">location_on</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Location</span>
            </button>
            <button className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-white/20 dark:border-zinc-800/50 hover:border-gray-200/50 dark:hover:border-zinc-700/50 rounded-xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">description</span>
              <span className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">Resume</span>
            </button>
          </div>
        </div>

        {/* Background Watermark */}
        <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-0 pointer-events-none -z-0 opacity-[0.04] dark:opacity-[0.02] overflow-hidden select-none">
          <h1 className="text-[18vw] font-serif italic leading-[0.8] tracking-tight whitespace-nowrap text-black dark:text-white">
            {userName}
          </h1>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPreview;
