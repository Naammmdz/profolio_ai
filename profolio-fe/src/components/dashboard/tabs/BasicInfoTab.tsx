import React from 'react';

interface BasicInfoTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      {/* Header with Draft Mode, Preview, Publish Changes */}
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

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-normal text-primary mb-2 tracking-tight">Portfolio Settings</h1>
        <p className="text-text-muted text-sm font-light">Customize your portfolio's appearance and settings</p>
      </div>

      {/* Preview Section with Browser Mockup */}
      <div className="bg-surface border border-border rounded-xl p-0 mb-8 flex flex-col items-center justify-center min-h-[400px] relative shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Browser Header */}
        <div className="absolute top-0 left-0 right-0 border-b border-border px-6 py-4 flex justify-between items-center bg-surface/50 backdrop-blur-sm z-10">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400/20 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40"></div>
            <div className="size-3 rounded-full bg-amber-400/20 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40"></div>
            <div className="size-3 rounded-full bg-green-400/20 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40"></div>
          </div>
          <span className="text-xs text-text-subtle font-mono">portfolio-preview.profolio.ai</span>
          <span className="material-symbols-outlined text-text-subtle text-[18px]">refresh</span>
        </div>

        {/* Preview Content */}
        <div className="w-full h-full flex flex-col items-center justify-center pt-20 pb-12 px-6">
          <div className="text-center mb-8 relative z-0">
            <div className="inline-flex items-center gap-2 text-xl font-medium text-text-muted mb-2 font-serif italic">
              Hello everyone <span className="not-italic">👋</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-primary tracking-tight mb-8">James Martin</h2>
            <div className="size-32 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-10 shadow-2xl shadow-black/10 relative group cursor-pointer transition-transform hover:scale-[1.02] duration-300">
              <span className="text-primary-foreground/80/70 font-serif text-2xl italic">JM</span>
              <div className="absolute inset-0 border border-primary-foreground/10 rounded-2xl"></div>
            </div>
            <div className="w-full max-w-md mx-auto relative group">
              <input 
                className="w-full pl-5 pr-12 py-3.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all shadow-sm group-hover:shadow-md placeholder:text-text-subtle text-primary" 
                disabled 
                placeholder="Ask me anything..." 
                type="text"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-serif text-primary mb-1">Avatar</h2>
              <p className="text-sm text-text-muted font-light">Configure your profile picture for the chat interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked className="sr-only peer toggle-switch-input" type="checkbox"/>
              <div className="w-10 h-6 bg-border peer-focus:outline-none rounded-full peer toggle-switch-label transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="flex bg-surface-highlight rounded-lg p-1 border border-border">
              <button className="px-5 py-2 bg-surface shadow-sm rounded-md text-sm font-medium text-primary border border-border/50 transition-all">Squared</button>
              <button className="px-5 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors">Rounded</button>
            </div>
            <div className="flex items-center gap-5">
              <div className="size-20 bg-surface-highlight rounded-2xl overflow-hidden border border-border flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[32px] text-text-subtle">image</span>
              </div>
              <div>
                <button className="text-sm font-medium text-primary border border-border px-4 py-2 rounded-lg hover:bg-surface-highlight transition-colors mb-2 bg-surface shadow-sm">Upload Avatar</button>
                <p className="text-xs text-text-muted">Min 200x200px • JPG, PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary mb-1">Appearance</h2>
            <p className="text-sm text-text-muted font-light">Choose a visual theme for your portfolio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Theme</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow">
                    <option value="default">Default - Clean and minimal</option>
                    <option value="dark">Dark - Professional and sleek</option>
                    <option value="playful">Playful - Colorful and friendly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Cursor Animation</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow">
                    <option value="fluid">Fluid</option>
                    <option value="solid">Solid</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="h-full min-h-[120px] rounded-xl bg-surface-highlight border border-border flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface-highlight to-surface-highlight blur-xl"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="size-8 rounded-full bg-primary/5 animate-pulse"></div>
                <span className="text-xs text-text-muted font-medium tracking-wide uppercase">Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary mb-1">Landing Page</h2>
            <p className="text-sm text-text-muted font-light">Customize the first impression visitors have of your portfolio</p>
          </div>
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Portfolio Headline <span className="text-text-subtle font-normal ml-1">(Optional)</span>
              </label>
              <input 
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm placeholder:text-text-subtle shadow-sm transition-shadow" 
                placeholder="Leave empty to use default: Hey, I'm {name} 👋" 
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Welcome Tagline</label>
              <input 
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow" 
                type="text" 
                defaultValue="Backend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Chat Input Placeholder</label>
              <input 
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow" 
                type="text" 
                defaultValue="Ask me anything..."
              />
            </div>
            <div className="pt-6 border-t border-border mt-6">
              <div className="flex justify-between items-center mb-6">
                <label className="block text-sm font-medium text-primary">Welcome Modal</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked className="sr-only peer toggle-switch-input" type="checkbox"/>
                  <div className="w-10 h-6 bg-border peer-focus:outline-none rounded-full peer toggle-switch-label transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="space-y-4 p-5 bg-surface-highlight/50 rounded-xl border border-border">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Modal Title</label>
                  <input 
                    className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow" 
                    type="text" 
                    defaultValue="Welcome to AI Portfolio"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Modal Content</label>
                  <textarea 
                    className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[100px] resize-y shadow-sm transition-shadow" 
                    defaultValue="This is an AI-powered portfolio that adapts to your questions. Ask me anything about my work, skills, or experience!"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-8 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-primary">Profolio</span>
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

export default BasicInfoTab;

