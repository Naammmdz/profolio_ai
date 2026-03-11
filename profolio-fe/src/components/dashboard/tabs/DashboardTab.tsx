import React from 'react';
import { usePortfolio } from '../../../hooks/usePortfolio';
import { useQuestions } from '../../../hooks/useQuestions';
import DashboardFooter from '../DashboardFooter';
import DashboardTopBar from '../DashboardTopBar';

interface DashboardTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onPreview, onNavigate }) => {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: questions = [] } = useQuestions();

  const isPublished = portfolio?.status === 'PUBLISHED';

  if (isLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
        <div className="animate-pulse space-y-6">
          <div className="h-14 bg-surface-highlight rounded-lg w-1/3" />
          <div className="h-80 bg-surface-highlight rounded-lg" />
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-surface-highlight rounded-lg" />
            <div className="h-32 bg-surface-highlight rounded-lg" />
            <div className="h-32 bg-surface-highlight rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <DashboardTopBar onPreview={onPreview} onPublish={() => onNavigate('publish')} />
      <div className="mb-10">
        <h1 className="text-5xl font-serif text-primary mb-3 tracking-tight">
          Hello{portfolio?.tagline ? `, ${portfolio.tagline.split(' ')[0]}` : ''}!
        </h1>
        <div className="flex items-center gap-3 text-sm text-text-muted font-mono bg-surface inline-flex px-3 py-1.5 rounded-md border border-border">
          <span>profol.io/{portfolio?.slug}</span>
          <button
            onClick={() => navigator.clipboard.writeText(`profol.io/${portfolio?.slug}`)}
            className="hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {isPublished ? (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 rounded-lg p-10 mb-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
          <div className="relative z-10 text-center max-w-md">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">public</span>
            </div>
            <h2 className="text-3xl font-serif text-primary mb-3">Portfolio is Live</h2>
            <p className="text-text-muted mb-8 leading-relaxed font-light">Your portfolio is accessible to the world at profol.io/{portfolio?.slug}</p>
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-2 bg-background hover:bg-surface-highlight border border-border hover:border-primary/20 text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm group"
            >
              View Portfolio
              <span className="material-symbols-outlined text-[16px] text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg p-10 mb-10 h-80 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
          <div className="relative z-10 text-center max-w-md">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-surface border border-border">
              <span className="material-symbols-outlined text-text-muted">edit_note</span>
            </div>
            <h2 className="text-3xl font-serif text-primary mb-3">Portfolio in Draft Mode</h2>
            <p className="text-text-muted mb-8 leading-relaxed font-light">Your portfolio is not yet accessible to the world. <br />Publish it to share your work.</p>
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-2 bg-background hover:bg-surface-highlight border border-border hover:border-primary/20 text-primary px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm group"
            >
              View Draft
              <span className="material-symbols-outlined text-[16px] text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-muted">Questions configured</p>
            <span className="material-symbols-outlined text-text-muted/50">help</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-serif text-primary">{questions.length}</span>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-muted">Status</p>
            <span className="material-symbols-outlined text-text-muted/50">{isPublished ? 'public' : 'edit_note'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-serif text-primary">{isPublished ? 'Published' : 'Draft'}</span>
          </div>
        </div>
        <div className="rounded-lg p-6 shadow-sm cursor-pointer group relative overflow-hidden border transition-all duration-300 hover:shadow-md" style={{ background: 'rgba(59,111,235,0.06)', borderColor: 'rgba(59,111,235,0.2)' }}>
          <div className="absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <span className="material-symbols-outlined text-6xl" style={{ color: 'var(--accent-blue)' }}>analytics</span>
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-sm font-medium text-text-muted">Analytics</p>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--accent-blue)' }}>lock</span>
          </div>
          <div className="relative z-10">
            <span className="block text-xl font-serif text-primary mb-1">Unlock Analytics</span>
            <p className="text-xs text-text-muted">Upgrade to see visitor insights</p>
          </div>
          <div className="mt-4 relative z-10">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--accent-blue)' }}>Upgrade →</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h3 className="text-xl font-serif text-primary mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tab: 'basic-info', icon: 'globe', label: 'Basic Info', sub: 'Edit details' },
            { tab: 'ai-personality', icon: 'smart_toy', label: 'AI Personality', sub: 'Adjust tone' },
            { tab: 'tools', icon: 'construction', label: 'Tools', sub: 'Integrations' },
            { tab: 'questions', icon: 'help', label: 'Questions', sub: 'Manage Q&A' },
          ].map(({ tab, icon, label, sub }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="flex flex-col items-center justify-center py-8 px-4 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-[var(--accent-blue)]"
            >
              <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:bg-[var(--accent-blue)] group-hover:border-[var(--accent-blue)] transition-colors">
                <span className="material-symbols-outlined text-text-muted text-[20px] group-hover:text-white transition-colors">{icon}</span>
              </div>
              <span className="text-sm font-medium text-primary">{label}</span>
              <span className="text-[10px] text-text-muted mt-1 font-mono">{sub}</span>
            </button>
          ))}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default DashboardTab;
