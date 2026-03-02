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
            onClick={() => onNavigate('publish')}
            className="bg-primary dark:bg-zinc-700 hover:opacity-90 dark:hover:bg-zinc-600 text-primary-foreground dark:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-normal text-primary dark:text-white mb-2 tracking-tight">Portfolio Settings</h1>
        <p className="text-text-muted text-sm font-light">Customize your portfolio's appearance and settings</p>
      </div>

      {/* Preview Section with Browser Mockup */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-0 mb-8 flex flex-col items-center justify-center min-h-[400px] relative shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Browser Header */}
        <div className="absolute top-0 left-0 right-0 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400/20 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40"></div>
            <div className="size-3 rounded-full bg-amber-400/20 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40"></div>
            <div className="size-3 rounded-full bg-green-400/20 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40"></div>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">portfolio-preview.profolio.ai</span>
          <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[18px]">refresh</span>
        </div>

        {/* Preview Content */}
        <div className="w-full h-full flex flex-col items-center justify-center pt-20 pb-12 px-6">
          <div className="text-center mb-8 relative z-0">
            <div className="inline-flex items-center gap-2 text-xl font-medium text-gray-600 dark:text-gray-400 mb-2 font-serif italic">
              Hello everyone <span className="not-italic">👋</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-primary dark:text-white tracking-tight mb-8">James Martin</h2>
            <div className="size-32 bg-primary dark:bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center mb-10 shadow-2xl shadow-black/10 dark:shadow-white/5 relative group cursor-pointer transition-transform hover:scale-[1.02] duration-300">
              <span className="text-primary-foreground/80 dark:text-white/70 font-serif text-2xl italic">JM</span>
              <div className="absolute inset-0 border border-primary-foreground/10 dark:border-white/20 rounded-2xl"></div>
            </div>
            <div className="w-full max-w-md mx-auto relative group">
              <input 
                className="w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm transition-all shadow-sm group-hover:shadow-md placeholder:text-gray-400 dark:placeholder:text-gray-500 text-primary dark:text-white" 
                disabled 
                placeholder="Ask me anything..." 
                type="text"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center bg-primary dark:bg-white rounded-full text-primary-foreground dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-serif text-primary dark:text-white mb-1">Avatar</h2>
              <p className="text-sm text-text-muted font-light">Configure your profile picture for the chat interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked className="sr-only peer toggle-switch-input" type="checkbox"/>
              <div className="w-10 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer toggle-switch-label transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-zinc-900 after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="flex bg-gray-50 dark:bg-zinc-800 rounded-lg p-1 border border-gray-100 dark:border-zinc-700">
              <button className="px-5 py-2 bg-white dark:bg-zinc-900 shadow-sm rounded-md text-sm font-medium text-black dark:text-white border border-gray-200/50 dark:border-zinc-700 transition-all">Squared</button>
              <button className="px-5 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Rounded</button>
            </div>
            <div className="flex items-center gap-5">
              <div className="size-20 bg-gray-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[32px] text-gray-300 dark:text-gray-600">image</span>
              </div>
              <div>
                <button className="text-sm font-medium text-black dark:text-white border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors mb-2 bg-white dark:bg-zinc-900 shadow-sm">Upload Avatar</button>
                <p className="text-xs text-text-muted">Min 200x200px • JPG, PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary dark:text-white mb-1">Appearance</h2>
            <p className="text-sm text-text-muted font-light">Choose a visual theme for your portfolio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">Theme</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm shadow-sm transition-shadow">
                    <option value="default">Default - Clean and minimal</option>
                    <option value="dark">Dark - Professional and sleek</option>
                    <option value="playful">Playful - Colorful and friendly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary dark:text-white mb-2">Cursor Animation</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm shadow-sm transition-shadow">
                    <option value="fluid">Fluid</option>
                    <option value="solid">Solid</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="h-full min-h-[120px] rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 dark:from-indigo-900/20 via-gray-50 dark:via-zinc-800 to-gray-50 dark:to-zinc-800 blur-xl"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="size-8 rounded-full bg-black/5 dark:bg-white/10 animate-pulse"></div>
                <span className="text-xs text-text-muted font-medium tracking-wide uppercase">Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary dark:text-white mb-1">Landing Page</h2>
            <p className="text-sm text-text-muted font-light">Customize the first impression visitors have of your portfolio</p>
          </div>
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                Portfolio Headline <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(Optional)</span>
              </label>
              <input 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-shadow" 
                placeholder="Leave empty to use default: Hey, I'm {name} 👋" 
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-white mb-2">Welcome Tagline</label>
              <input 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm shadow-sm transition-shadow" 
                type="text" 
                defaultValue="Backend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-white mb-2">Chat Input Placeholder</label>
              <input 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm shadow-sm transition-shadow" 
                type="text" 
                defaultValue="Ask me anything..."
              />
            </div>
            <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
              <div className="flex justify-between items-center mb-6">
                <label className="block text-sm font-medium text-primary dark:text-white">Welcome Modal</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked className="sr-only peer toggle-switch-input" type="checkbox"/>
                  <div className="w-10 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer toggle-switch-label transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-zinc-900 after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
                </label>
              </div>
              <div className="space-y-4 p-5 bg-gray-50/50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Modal Title</label>
                  <input 
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm shadow-sm transition-shadow" 
                    type="text" 
                    defaultValue="Welcome to AI Portfolio"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Modal Content</label>
                  <textarea 
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-black dark:text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white text-sm min-h-[100px] resize-y shadow-sm transition-shadow" 
                    defaultValue="This is an AI-powered portfolio that adapts to your questions. Ask me anything about my work, skills, or experience!"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="w-full sm:w-auto bg-primary dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-100 text-primary-foreground dark:text-black py-2.5 px-8 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-zinc-800 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-primary dark:text-white">Profolio</span>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Dashboard</a>
            <a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Billing</a>
            <a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Support</a>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Terms</a>
            <a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BasicInfoTab;

