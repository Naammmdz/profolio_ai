import React from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardFooter from '../shared/DashboardFooter';

interface BasicInfoTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader 
        onPreview={onPreview} 
        onPublish={() => onNavigate('publish')}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Portfolio Settings</h1>
        <p className="text-text-muted text-sm">Customize your portfolio's appearance and settings</p>
      </div>
      
      <div className="bg-surface border border-border rounded-xl p-8 mb-6 flex flex-col items-center justify-center min-h-[400px] relative shadow-sm">
        <div className="absolute top-4 right-4">
          <span className="material-symbols-outlined text-text-muted cursor-help" title="Preview Mode">info</span>
        </div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-1">
            Hello everyone <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8">James Martin</h2>
          <div className="size-32 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-10 shadow-lg relative group cursor-pointer transition-transform hover:scale-105">
            <span className="text-primary-foreground text-lg font-medium">Avatar</span>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
          </div>
          <div className="w-full max-w-md mx-auto relative">
            <input className="w-full pl-4 pr-10 py-3 rounded-full border border-border bg-background focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-shadow shadow-sm text-primary" disabled placeholder="Ask me anything..." type="text"/>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-bold text-primary mb-1">Avatar</h2>
              <p className="text-sm text-text-muted">Configure your profile picture for the chat interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox"/>
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex bg-surface-highlight rounded-lg p-1">
              <button className="px-4 py-1.5 bg-background shadow-sm rounded-md text-sm font-medium text-primary">Squared</button>
              <button className="px-4 py-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors">Rounded</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-surface-highlight rounded-lg overflow-hidden border border-border">
                <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface">
                  <span className="material-symbols-outlined text-[32px]">person</span>
                </div>
              </div>
              <div>
                <button className="text-sm font-medium text-primary hover:text-indigo-600 transition-colors mb-1">Upload Avatar</button>
                <p className="text-xs text-text-muted">Click to upload • Square crop • Min 200x200px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-primary mb-1">Appearance</h2>
            <p className="text-sm text-text-muted">Choose a visual theme for your portfolio</p>
          </div>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Theme</label>
              <div className="relative">
                <select className="w-full appearance-none bg-background border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                  <option value="default">Default - Clean and minimal</option>
                  <option value="dark">Dark - Professional and sleek</option>
                  <option value="playful">Playful - Colorful and friendly</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Cursor Animation</label>
              <div className="relative">
                <select className="w-full appearance-none bg-background border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                  <option value="fluid">Fluid</option>
                  <option value="solid">Solid</option>
                  <option value="none">None</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
            <div className="h-24 w-full rounded-lg bg-surface-highlight border border-border flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 via-purple-200/40 to-indigo-200/40 blur-xl opacity-70"></div>
              <span className="text-xs text-text-muted relative z-10">Animation Preview</span>
            </div>
          </div>
        </div>

        {/* Landing Page Section */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-primary mb-1">Landing Page</h2>
            <p className="text-sm text-text-muted">Customize the first impression visitors have of your portfolio</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Portfolio Headline (optional)</label>
              <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-text-muted" placeholder="Leave empty to use default: Hey, I'm {name} 👋" type="text"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Welcome Tagline</label>
              <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Backend Developer"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Chat Input Placeholder</label>
              <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Ask me anything..."/>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <div className="flex justify-between items-center mb-4 mt-4">
                <label className="block text-sm font-medium text-primary">Welcome Modal</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox"/>
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Modal Title</label>
                  <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Welcome to AI Portfolio"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Modal Content</label>
                  <textarea className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm min-h-[100px] resize-y" defaultValue="This is an AI-powered portfolio that adapts to your questions. Ask me anything about my work, skills, or experience!"></textarea>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm mt-4">
            Save
          </button>
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default BasicInfoTab;

