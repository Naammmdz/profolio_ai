import React from 'react';

interface DashboardTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="hidden sm:block">
          <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-orange-500"></span>
            Draft
          </div>
          <button 
            onClick={onPreview}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            View portfolio
          </button>
          <button 
            onClick={() => onNavigate('publish')}
            className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            Publish
          </button>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Hello Giang!</h1>
        <div className="flex items-center gap-2 text-sm text-text-muted font-mono">
          <span>https://www.profol.io/giang-nam</span>
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-xl p-8 mb-8 h-96 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none blur-sm scale-110">
          <div className="text-[120px] font-serif italic font-bold leading-none text-primary">I Cooked Apple</div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-3">Portfolio in Draft Mode</h2>
          <p className="text-text-muted mb-8 leading-relaxed">Your portfolio is not published yet. Publish to make it accessible to everyone.</p>
          <button 
            onClick={onPreview}
            className="inline-flex items-center gap-2 bg-background hover:bg-surface-highlight border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Try it
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-bold text-primary">6</span>
            <span className="text-lg text-text-muted font-medium mb-1">/50</span>
          </div>
          <p className="text-sm text-text-muted">Total messages used</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-bold text-primary">0</span>
          </div>
          <p className="text-sm text-text-muted">Messages today</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors group cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-primary">Unlock Analytics</span>
            <span className="material-symbols-outlined text-indigo-600 text-[18px]">crown</span>
          </div>
          <p className="text-sm text-text-muted group-hover:text-primary transition-colors">Upgrade to access</p>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-primary">Recent Visitor Questions</h3>
            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <a className="flex items-center gap-1 text-xs font-medium text-primary hover:text-indigo-600 transition-colors" href="#">
            View all
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </a>
        </div>
        <div className="space-y-4">
          <div className="bg-surface-highlight rounded-lg p-4 hover:bg-border transition-colors border border-transparent hover:border-border cursor-pointer">
            <p className="font-medium text-primary text-sm mb-2">Can you show me your resume or CV?</p>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>1d ago</span>
              <span className="size-1 rounded-full bg-text-muted"></span>
              <span>Ho Chi Minh City, Vietnam</span>
            </div>
          </div>
          <div className="bg-surface-highlight rounded-lg p-4 hover:bg-border transition-colors border border-transparent hover:border-border cursor-pointer">
            <p className="font-medium text-primary text-sm mb-2">What are your passions?</p>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>2d ago</span>
              <span className="size-1 rounded-full bg-text-muted"></span>
              <span>London, UK</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-sm text-text-muted font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => onNavigate('basic-info')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
            <span className="material-symbols-outlined text-teal-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">globe</span>
            <span className="text-sm font-medium text-primary">Basic Info</span>
          </button>
          <button onClick={() => onNavigate('ai-personality')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
            <span className="material-symbols-outlined text-green-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">smart_toy</span>
            <span className="text-sm font-medium text-primary">AI Personality</span>
          </button>
          <button onClick={() => onNavigate('tools')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
            <span className="material-symbols-outlined text-purple-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">construction</span>
            <span className="text-sm font-medium text-primary">Tools</span>
          </button>
          <button onClick={() => onNavigate('questions')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
            <span className="material-symbols-outlined text-rose-500 text-[24px] mb-2 group-hover:scale-110 transition-transform">help</span>
            <span className="text-sm font-medium text-primary">Questions</span>
          </button>
        </div>
      </div>
      <footer className="mt-auto border-t border-border pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Profolio</span>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="hover:text-primary transition-colors" href="#">Billing</a>
            <a className="hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardTab;

