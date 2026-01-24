import React from 'react';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardSidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentTab, onTabChange }) => {
  return (
    <aside className="w-72 bg-background dark:bg-zinc-900 border-r border-border flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center text-primary-foreground bg-primary border border-primary rounded-md font-serif italic text-lg shadow-sm dark:bg-primary dark:border-primary">P</div>
            <span className="text-primary dark:text-white font-serif text-2xl tracking-tight">Profolio</span>
          </div>
          <AnimatedThemeToggler />
        </div>
        <nav className="space-y-1 mb-10">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'dashboard' 
                ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white border border-border' 
                : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Dashboard
          </button>
          <button 
            onClick={() => onTabChange('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'analytics' 
                ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white border border-border' 
                : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            Analytics
          </button>
          <button 
            onClick={() => onTabChange('publish')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'publish' 
                ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white border border-border' 
                : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Publish
          </button>
        </nav>
        <div>
          <h3 className="px-3 text-xs font-medium text-text-muted dark:text-zinc-400 uppercase tracking-widest mb-3 font-mono">Configure</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => onTabChange('basic-info')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'basic-info' 
                  ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white' 
                  : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">globe</span>
                Basic Info
              </div>
              <span className="material-symbols-outlined text-primary dark:text-white text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('ai-personality')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'ai-personality' 
                  ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white' 
                  : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                AI Personality
              </div>
              <span className="material-symbols-outlined text-primary dark:text-white text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('tools')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'tools' 
                  ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white' 
                  : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">construction</span>
                Tools
              </div>
              <span className="material-symbols-outlined text-primary dark:text-white text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('questions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'questions' 
                  ? 'bg-surface dark:bg-zinc-800 text-primary dark:text-white' 
                  : 'text-text-muted hover:bg-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">help</span>
                Questions
              </div>
              <span className="material-symbols-outlined text-primary dark:text-white text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
          </nav>
        </div>
        <button className="mt-8 w-full bg-background dark:bg-zinc-800 border border-border text-primary dark:text-white hover:border-primary/20 dark:hover:border-zinc-700 hover:shadow-sm transition-all rounded-lg py-2.5 text-sm font-medium shadow-sm">
          Share Portfolio
        </button>
      </div>
      <div className="p-6 border-t border-border bg-background dark:bg-zinc-900">
        <a className="flex items-center gap-2 text-xs text-text-muted hover:text-primary dark:hover:text-white mb-6 group transition-colors font-mono" href="#">
          Suggest a feature
          <span className="material-symbols-outlined text-[10px] group-hover:translate-x-0.5 transition-transform">arrow_outward</span>
        </a>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-primary dark:text-white">Usage</span>
            <span className="text-xs text-text-muted font-mono">6/50</span>
          </div>
          <div className="h-1 w-full bg-surface-highlight dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary dark:bg-zinc-600 w-[12%] rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-surface-highlight dark:bg-zinc-800 border border-border flex items-center justify-center text-xs font-serif italic text-text-muted shrink-0">
            gn
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary dark:text-white truncate">Giang Nam</p>
            <p className="text-xs text-text-muted truncate">tagiangnamttg@gmail.com</p>
          </div>
          <span className="material-symbols-outlined text-text-muted text-[18px] cursor-pointer hover:text-primary dark:hover:text-white">more_vert</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

