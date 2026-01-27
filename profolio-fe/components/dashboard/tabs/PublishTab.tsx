import React from 'react';

interface PublishTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const PublishTab: React.FC<PublishTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="hidden sm:block">
          <button className="p-2 -ml-2 text-text-muted hover:text-primary dark:hover:text-white transition-colors rounded-md hover:bg-surface dark:hover:bg-zinc-800">
            <span className="material-symbols-outlined">dock_to_left</span>
          </button>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-background dark:bg-zinc-800 border border-border text-text-muted px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="size-1.5 rounded-full bg-orange-500"></span>
            Draft Mode
          </div>
          <button 
            onClick={onPreview}
            className="bg-background dark:bg-zinc-800 hover:bg-surface dark:hover:bg-zinc-700 border border-border text-primary dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Preview
          </button>
          <button 
            onClick={() => console.log('Publish Changes')}
            className="bg-primary dark:bg-zinc-700 hover:opacity-90 dark:hover:bg-zinc-600 text-primary-foreground dark:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            Publish Changes
          </button>
        </div>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-normal text-primary dark:text-white tracking-tight mb-2">Preview &amp; Publish</h1>
        <p className="text-text-muted text-sm font-light">Review your settings and launch your portfolio.</p>
      </div>
      <div className="grid gap-6">
        {/* Portfolio Checklist */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-border dark:border-zinc-800 rounded-xl p-0 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-primary dark:text-white">Portfolio Checklist</h2>
              <p className="text-xs text-text-muted mt-0.5">Your portfolio is ready to publish</p>
            </div>
            <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
          </div>
          <div className="p-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-primary dark:bg-white text-primary-foreground dark:text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <span className="text-sm font-medium text-primary dark:text-white">Basic Information</span>
                </div>
                <button className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-primary dark:hover:text-white transition-all">Edit</button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-primary dark:bg-white text-primary-foreground dark:text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <span className="text-sm font-medium text-primary dark:text-white">AI Personality</span>
                </div>
                <button className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-primary dark:hover:text-white transition-all">Edit</button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-primary dark:bg-white text-primary-foreground dark:text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <span className="text-sm font-medium text-primary dark:text-white">Tools</span>
                </div>
                <button className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-primary dark:hover:text-white transition-all">Edit</button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-default group">
                <div className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-primary dark:bg-white text-primary-foreground dark:text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <span className="text-sm font-medium text-primary dark:text-white">Suggested Questions</span>
                  <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 border border-border dark:border-zinc-700">8</span>
                </div>
                <button className="text-xs font-medium text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-primary dark:hover:text-white transition-all">Edit</button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-border dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[20px] text-gray-400 dark:text-gray-500">language</span>
              <h2 className="text-base font-semibold text-primary dark:text-white">Custom Domain</h2>
              <span className="bg-primary dark:bg-white text-primary-foreground dark:text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                Pro
              </span>
            </div>
            <p className="text-sm text-text-muted mb-3">Use your own domain instead of profol.io/giang-nam</p>
            <div className="inline-flex items-center bg-gray-50 dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-md px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 font-mono">
              <span>https://yourdomain.com</span>
            </div>
          </div>
          <button className="shrink-0 bg-primary dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-100 text-primary-foreground dark:text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Upgrade to Pro
          </button>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-border dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-primary dark:text-white mb-1">Portfolio Preview</h2>
            <div className="mt-1">
              <h3 className="text-sm font-medium text-primary dark:text-white">Show Profolio Badge</h3>
              <p className="text-xs text-text-muted mt-0.5">Required for free plan</p>
            </div>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-not-allowed opacity-60" htmlFor="badge-toggle">
              <input checked className="sr-only peer" disabled id="badge-toggle" type="checkbox"/>
              <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-zinc-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-white"></div>
            </label>
          </div>
        </div>

        {/* Publish Section */}
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-0 overflow-hidden shadow-md relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 dark:from-zinc-900/50 via-white dark:via-zinc-900 to-white dark:to-zinc-900 pointer-events-none"></div>
          <div className="relative z-10 p-10 text-center">
            <div className="size-12 mx-auto bg-primary dark:bg-white text-primary-foreground dark:text-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/10">
              <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
            </div>
            <h2 className="text-2xl font-serif text-primary dark:text-white mb-2">Your portfolio is ready!</h2>
            <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto leading-relaxed">Everything looks great. You are just one click away from launching your AI portfolio.</p>
            <button className="w-full sm:w-auto min-w-[200px] bg-primary dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-100 text-primary-foreground dark:text-primary py-3 px-6 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-gray-200 dark:shadow-zinc-800">
              Publish now
            </button>
          </div>
        </div>

        {/* Go to Dashboard Link */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors border-b border-transparent hover:border-gray-300 dark:hover:border-zinc-600 pb-0.5"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishTab;

