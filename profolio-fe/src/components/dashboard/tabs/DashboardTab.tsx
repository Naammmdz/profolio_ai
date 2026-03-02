import React from 'react';

interface DashboardTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="hidden sm:block">
          <button className="p-2 -ml-2 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface-highlight">
            <span className="material-symbols-outlined">dock_to_left</span>
          </button>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-background border border-border text-text-muted px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="size-1.5 rounded-full bg-orange-500"></span>
            Draft Mode
          </div>
          <button 
            onClick={onPreview}
            className="bg-background hover:bg-surface-highlight border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Preview
          </button>
          <button 
            onClick={() => onNavigate('publish')}
            className="bg-primary hover:opacity-90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            Publish Changes
          </button>
        </div>
      </div>
      <div className="mb-10">
        <h1 className="text-5xl font-serif text-primary mb-3 tracking-tight">Hello Giang!</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted font-mono bg-surface inline-flex px-3 py-1.5 rounded-md border border-border">
          <span>profol.io/giang-nam</span>
          <button className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        </div>
      </div>
      <div className="bg-background border border-border rounded-lg p-10 mb-10 h-80 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-surface border border-border">
            <span className="material-symbols-outlined text-text-muted">edit_note</span>
          </div>
          <h2 className="text-3xl font-serif text-primary mb-3">Portfolio in Draft Mode</h2>
          <p className="text-text-muted mb-8 leading-relaxed font-light">Your portfolio is not yet accessible to the world. <br/>Publish it to share your work.</p>
          <button 
            onClick={onPreview}
            className="inline-flex items-center gap-2 bg-background hover:bg-surface-highlight border border-border hover:border-primary/20 text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm group"
          >
            View Draft
            <span className="material-symbols-outlined text-[16px] text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-muted">Messages used</p>
            <span className="material-symbols-outlined text-text-muted/50">forum</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-serif text-primary">6</span>
            <span className="text-lg text-text-muted font-serif">/50</span>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-muted">Messages today</p>
            <span className="material-symbols-outlined text-text-muted/50">today</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-serif text-primary">0</span>
          </div>
        </div>
        <div className="bg-primary border border-primary rounded-lg p-6 shadow-md cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-primary-foreground text-6xl">analytics</span>
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-sm font-medium text-text-muted group-hover:text-primary-foreground transition-colors">Analytics</p>
            <span className="material-symbols-outlined text-text-muted group-hover:text-primary-foreground transition-colors">lock</span>
          </div>
          <div className="relative z-10">
            <span className="block text-xl font-serif text-primary-foreground mb-1">Unlock Analytics</span>
            <p className="text-xs text-text-muted group-hover:text-primary-foreground/80 transition-colors">Upgrade to see visitor insights</p>
          </div>
        </div>
      </div>
      <div className="bg-background border border-border rounded-lg p-8 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-serif text-primary">Recent Visitor Questions</h3>
            <div className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono font-medium text-text-muted">New</div>
          </div>
          <a className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5" href="#">
            View all history
          </a>
        </div>
        <div className="space-y-3">
          <div className="group flex items-center justify-between p-4 rounded-md border border-border hover:border-primary/20 hover:bg-surface-highlight transition-all cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1 size-2 rounded-full bg-text-muted group-hover:bg-primary transition-colors"></div>
              <div>
                <p className="text-sm font-medium text-primary mb-1 group-hover:underline decoration-border underline-offset-4">"Can you show me your resume or CV?"</p>
                <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                  <span>1d ago</span>
                  <span>•</span>
                  <span>Ho Chi Minh City, VN</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-muted group-hover:text-primary text-[18px] transition-colors">chevron_right</span>
          </div>
          <div className="group flex items-center justify-between p-4 rounded-md border border-border hover:border-primary/20 hover:bg-surface-highlight transition-all cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="mt-1 size-2 rounded-full bg-text-muted group-hover:bg-primary transition-colors"></div>
              <div>
                <p className="text-sm font-medium text-primary mb-1 group-hover:underline decoration-border underline-offset-4">"What are your passions?"</p>
                <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                  <span>2d ago</span>
                  <span>•</span>
                  <span>London, UK</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-muted group-hover:text-primary text-[18px] transition-colors">chevron_right</span>
          </div>
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-xl font-serif text-primary mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => onNavigate('basic-info')} className="flex flex-col items-center justify-center py-8 px-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
            <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:bg-primary group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-text-muted text-[20px] group-hover:text-primary-foreground transition-colors">globe</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:text-primary">Basic Info</span>
            <span className="text-[10px] text-text-muted mt-1 font-mono">Edit details</span>
          </button>
          <button onClick={() => onNavigate('ai-personality')} className="flex flex-col items-center justify-center py-8 px-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
            <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:bg-primary group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-text-muted text-[20px] group-hover:text-primary-foreground transition-colors">smart_toy</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:text-primary">AI Personality</span>
            <span className="text-[10px] text-text-muted mt-1 font-mono">Adjust tone</span>
          </button>
          <button onClick={() => onNavigate('tools')} className="flex flex-col items-center justify-center py-8 px-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
            <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:bg-primary group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-text-muted text-[20px] group-hover:text-primary-foreground transition-colors">construction</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:text-primary">Tools</span>
            <span className="text-[10px] text-text-muted mt-1 font-mono">Integrations</span>
          </button>
          <button onClick={() => onNavigate('questions')} className="flex flex-col items-center justify-center py-8 px-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
            <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:bg-primary group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-text-muted text-[20px] group-hover:text-primary-foreground transition-colors">help</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:text-primary">Questions</span>
            <span className="text-[10px] text-text-muted mt-1 font-mono">Manage Q&A</span>
          </button>
        </div>
      </div>
      <footer className="mt-auto border-t border-border pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary font-sans">Profolio</span>
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

