import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import AnimatedThemeToggler from '../common/AnimatedThemeToggler';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardSidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  onTriggerOnboarding: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentTab, onTabChange, onTriggerOnboarding }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const userProfile = auth.user?.profile;
  const userName = (userProfile?.name || userProfile?.preferred_username || userProfile?.email || 'User') as string;
  const userEmail = (userProfile?.email || '') as string;
  const userInitials = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toLowerCase() || '?';

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

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <aside className="w-72 bg-background border-r border-border flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="size-8 flex items-center justify-center text-white rounded-md font-serif italic text-lg shadow-sm" style={{ background: 'var(--accent-blue)' }}>P</div>
            <span className="text-primary font-serif text-2xl tracking-tight">Profolio</span>
          </button>
          <AnimatedThemeToggler />
        </div>
        <nav className="space-y-1 mb-10">
          {([
            { id: 'dashboard', icon: 'home', label: 'Dashboard' },
            { id: 'analytics', icon: 'bar_chart', label: 'Analytics' },
            { id: 'publish', icon: 'rocket_launch', label: 'Publish' },
          ] as { id: Tab; icon: string; label: string }[]).map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${currentTab === id
                ? 'font-semibold border-l-2'
                : 'border-transparent text-text-muted hover:bg-surface-highlight hover:text-primary'
                }`}
              style={currentTab === id ? {
                background: 'rgba(59,111,235,0.08)',
                color: 'var(--accent-blue)',
                borderColor: 'transparent',
                borderLeftColor: 'var(--accent-blue)',
              } : {}}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div>
          <h3 className="px-3 text-xs font-medium text-text-muted uppercase tracking-widest mb-3 font-mono">Configure</h3>
          <nav className="space-y-1">
            {([
              { id: 'basic-info', icon: 'globe', label: 'Basic Info' },
              { id: 'ai-personality', icon: 'smart_toy', label: 'AI Personality' },
              { id: 'tools', icon: 'construction', label: 'Tools' },
              { id: 'questions', icon: 'help', label: 'Questions' },
            ] as { id: Tab; icon: string; label: string }[]).map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group border ${currentTab === id
                  ? 'font-semibold border-l-2'
                  : 'border-transparent text-text-muted hover:bg-surface-highlight hover:text-primary'
                  }`}
                style={currentTab === id ? {
                  background: 'rgba(59,111,235,0.08)',
                  color: 'var(--accent-blue)',
                  borderColor: 'transparent',
                  borderLeftColor: 'var(--accent-blue)',
                } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </div>
                <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-60 transition-opacity">arrow_forward</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          className="mt-8 w-full py-2.5 text-sm font-medium rounded-lg border transition-all hover:opacity-80"
          style={{ color: 'var(--accent-blue)', borderColor: 'rgba(59,111,235,0.3)', background: 'rgba(59,111,235,0.06)' }}
        >
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
            <div className="h-full w-[12%] rounded-full" style={{ background: 'var(--accent-blue)' }}></div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="size-9 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs font-serif italic text-text-muted shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{userName}</p>
            <p className="text-xs text-text-muted truncate">{userEmail}</p>
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
                    {userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{userName}</p>
                    <p className="text-xs text-text-muted truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* Admin Panel - only visible for ADMIN role */}
                {(() => {
                  const profileRoles = (userProfile as any)?.roles;
                  let roles: string[] = [];
                  if (Array.isArray(profileRoles)) {
                    roles = profileRoles;
                  } else {
                    try {
                      const token = auth.user?.access_token;
                      if (token) {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        roles = payload.roles || [];
                      }
                    } catch {}
                  }
                  return roles.includes('ADMIN') ? (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/admin');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      <span>Admin Panel</span>
                    </button>
                  ) : null;
                })()}
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
                    onTriggerOnboarding();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-highlight transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Re-upload CV</span>
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

