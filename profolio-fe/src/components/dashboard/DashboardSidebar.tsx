import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardSidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentTab, onTabChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    await auth.signoutRedirect();
    navigate('/');
  };

  return (
    <aside className="w-72 bg-background border-r border-border flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="size-8 flex items-center justify-center text-primary-foreground bg-primary border border-primary rounded-md font-serif italic text-lg shadow-sm">P</div>
            <span className="text-primary font-serif text-2xl tracking-tight">Profolio</span>
          </button>
          <AnimatedThemeToggler />
        </div>
        <nav className="space-y-1 mb-10">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'dashboard' 
                ? 'bg-surface text-primary border border-border' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Dashboard
          </button>
          <button 
            onClick={() => onTabChange('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'analytics' 
                ? 'bg-surface text-primary border border-border' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            Analytics
          </button>
          <button 
            onClick={() => onTabChange('publish')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'publish' 
                ? 'bg-surface text-primary border border-border' 
                : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Publish
          </button>
        </nav>
        <div>
          <h3 className="px-3 text-xs font-medium text-text-muted uppercase tracking-widest mb-3 font-mono">Configure</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => onTabChange('basic-info')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'basic-info' 
                  ? 'bg-surface text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">globe</span>
                Basic Info
              </div>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('ai-personality')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'ai-personality' 
                  ? 'bg-surface text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                AI Personality
              </div>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('tools')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'tools' 
                  ? 'bg-surface text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">construction</span>
                Tools
              </div>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
            <button 
              onClick={() => onTabChange('questions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                currentTab === 'questions' 
                  ? 'bg-surface text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">help</span>
                Questions
              </div>
              <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </button>
          </nav>
        </div>
        <button className="mt-8 w-full bg-background border border-border text-primary hover:border-primary/20 hover:shadow-sm transition-all rounded-lg py-2.5 text-sm font-medium shadow-sm">
          Share Portfolio
        </button>
      </div>
      <div className="p-6 border-t border-border bg-background">
        <a className="flex items-center gap-2 text-xs text-text-muted hover:text-primary mb-6 group transition-colors font-mono" href="#">
          Suggest a feature
          <span className="material-symbols-outlined text-[10px] group-hover:translate-x-0.5 transition-transform">arrow_outward</span>
        </a>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-primary">Usage</span>
            <span className="text-xs text-text-muted font-mono">6/50</span>
          </div>
          <div className="h-1 w-full bg-surface-highlight rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[12%] rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="size-9 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs font-serif italic text-text-muted shrink-0">
            gn
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">Giang Nam</p>
            <p className="text-xs text-text-muted truncate">tagiangnamttg@gmail.com</p>
          </div>
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="material-symbols-outlined text-text-muted text-[18px] cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-surface-highlight"
          >
            more_vert
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full right-0 mb-2 w-56 bg-surface rounded-lg shadow-lg border border-border overflow-hidden z-50"
            >
              {/* User Info Section */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs font-serif italic text-text-muted shrink-0">
                    gn
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">Giang Nam</p>
                    <p className="text-xs text-text-muted truncate">tagiangnamttg@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Handle upgrade to pro
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  <span>Upgrade to Pro</span>
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Handle billing
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  <span>Billing</span>
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Handle settings
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  <span>Settings</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

