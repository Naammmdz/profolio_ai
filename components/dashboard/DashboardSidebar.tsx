import React from 'react';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardSidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentTab, onTabChange }) => {
  return (
    <aside className="w-72 bg-surface border-r border-border flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="size-6 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-sm">P</div>
            <span className="text-primary font-serif text-lg tracking-tight font-medium">Profolio</span>
          </div>
          <AnimatedThemeToggler />
        </div>
        <nav className="space-y-1 mb-8">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'dashboard' 
                ? 'bg-surface-highlight text-primary' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${currentTab === 'dashboard' ? 'filled' : ''}`}>home</span>
            Dashboard
          </button>
          <button 
            onClick={() => onTabChange('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'analytics' 
                ? 'bg-surface-highlight text-primary' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${currentTab === 'analytics' ? 'filled' : ''}`}>bar_chart</span>
            Analytics
          </button>
          <button 
            onClick={() => onTabChange('publish')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'publish' 
                ? 'bg-surface-highlight text-primary' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${currentTab === 'publish' ? 'filled' : ''}`}>rocket_launch</span>
            Publish
          </button>
        </nav>
        <div>
          <h3 className="px-3 text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Configure</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => onTabChange('basic-info')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                currentTab === 'basic-info' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${currentTab === 'basic-info' ? 'filled' : ''}`}>globe</span>
                Basic Info
              </div>
              <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
            </button>
            <button 
              onClick={() => onTabChange('ai-personality')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                currentTab === 'ai-personality' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${currentTab === 'ai-personality' ? 'filled' : ''}`}>smart_toy</span>
                AI Personality
              </div>
              <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
            </button>
            <button 
              onClick={() => onTabChange('tools')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                currentTab === 'tools' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${currentTab === 'tools' ? 'filled' : ''}`}>construction</span>
                Tools
              </div>
              <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
            </button>
            <button 
              onClick={() => onTabChange('questions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                currentTab === 'questions' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${currentTab === 'questions' ? 'filled' : ''}`}>help</span>
                Questions
              </div>
              <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
            </button>
          </nav>
        </div>
        <button className="mt-8 w-full border border-border bg-background text-primary hover:bg-surface-highlight transition-colors rounded-lg py-2 text-sm font-medium shadow-sm">
          Share Portfolio
        </button>
      </div>
      <div className="p-6 border-t border-border bg-surface">
        <a className="flex items-center gap-2 text-xs text-text-muted hover:text-primary mb-4 group transition-colors" href="#">
          Suggest a feature
          <span className="material-symbols-outlined text-[10px] group-hover:translate-x-0.5 transition-transform">arrow_outward</span>
        </a>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-primary">Usage</span>
            <span className="text-xs text-text-muted">7/50</span>
          </div>
          <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[14%] rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-medium text-text-muted shrink-0">
            GN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">Giang Nam</p>
            <p className="text-xs text-text-muted truncate">tagiangnamttg@gmail.com</p>
          </div>
          <span className="material-symbols-outlined text-text-muted text-[16px] cursor-pointer hover:text-primary">unfold_more</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

