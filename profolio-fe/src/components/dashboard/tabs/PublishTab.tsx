import React from 'react';
import { usePortfolio, useUpdatePortfolio } from '../../../hooks/usePortfolio';
import { usePersonality } from '../../../hooks/usePersonality';
import { useQuestions } from '../../../hooks/useQuestions';
import DashboardTopBar from '../DashboardTopBar';

interface PublishTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const PublishTab: React.FC<PublishTabProps> = ({ onPreview, onNavigate }) => {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: personality } = usePersonality();
  const { data: questions = [] } = useQuestions();
  const updatePortfolio = useUpdatePortfolio();

  const isPublished = portfolio?.status === 'PUBLISHED';

  const handlePublish = () => {
    updatePortfolio.mutate({ status: 'PUBLISHED' });
  };

  const handleUnpublish = () => {
    updatePortfolio.mutate({ status: 'DRAFT' });
  };

  const checklist = [
    {
      label: 'Basic Information',
      done: !!(portfolio?.tagline && portfolio?.headline),
      tab: 'basic-info',
    },
    {
      label: 'AI Personality',
      done: !!(personality?.professionalBio),
      tab: 'ai-personality',
    },
    {
      label: 'Tools',
      done: true,
      tab: 'tools',
    },
    {
      label: 'Suggested Questions',
      done: questions.length > 0,
      count: questions.length,
      tab: 'questions',
    },
  ];

  const allDone = checklist.every(item => item.done);

  if (portfolioLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-surface-highlight rounded-lg w-1/3" />
          <div className="h-64 bg-surface-highlight rounded-xl" />
          <div className="h-32 bg-surface-highlight rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <DashboardTopBar onPreview={onPreview} onPublish={() => onNavigate('dashboard')} />
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-normal text-primary tracking-tight mb-2">Preview &amp; Publish</h1>
        <p className="text-text-muted text-sm font-light">Review your settings and launch your portfolio.</p>
      </div>
      <div className="grid gap-6">
        {/* Portfolio Checklist */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-0 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-primary">Portfolio Checklist</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {allDone ? 'Your portfolio is ready to publish' : 'Complete all items before publishing'}
              </p>
            </div>
            {allDone && (
              <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
            )}
          </div>
          <div className="p-2">
            <div className="space-y-1">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-surface-highlight rounded-lg transition-colors cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className={`size-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'text-white' : 'bg-border text-text-subtle'}`} style={item.done ? { background: 'var(--accent-blue)' } : {}}>
                      <span className="material-symbols-outlined text-[14px] font-bold">{item.done ? 'check' : 'remove'}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="bg-surface-highlight text-text-muted text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 border border-border">{item.count}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate(item.tab)}
                    className="text-xs font-medium text-text-subtle opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[20px] text-text-subtle">language</span>
              <h2 className="text-base font-semibold text-primary">Custom Domain</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide" style={{ color: 'var(--accent-blue)', background: 'rgba(59,111,235,0.1)', border: '1px solid rgba(59,111,235,0.2)' }}>
                Pro
              </span>
            </div>
            <p className="text-sm text-text-muted mb-3">Use your own domain instead of profol.io/{portfolio?.slug}</p>
            <div className="inline-flex items-center bg-surface-highlight border border-border rounded-md px-3 py-1.5 text-xs text-text-subtle font-mono">
              <span>https://yourdomain.com</span>
            </div>
          </div>
          <button className="shrink-0 py-2.5 px-5 rounded-lg text-sm font-medium transition-all" style={{ color: 'var(--accent-blue)', background: 'rgba(59,111,235,0.08)', border: '1px solid rgba(59,111,235,0.25)' }}>
            Upgrade to Pro
          </button>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-primary mb-1">Portfolio Preview</h2>
            <div className="mt-1">
              <h3 className="text-sm font-medium text-primary">Show Profolio Badge</h3>
              <p className="text-xs text-text-muted mt-0.5">Required for free plan</p>
            </div>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-not-allowed opacity-60" htmlFor="badge-toggle">
              <input checked className="sr-only peer" disabled id="badge-toggle" type="checkbox" />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Publish Section */}
        <div className="bg-surface border border-border rounded-xl p-0 overflow-hidden shadow-md relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-highlight/50 via-surface to-surface pointer-events-none"></div>
          <div className="relative z-10 p-10 text-center">
            <div className="size-12 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg text-white" style={{ background: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined text-[24px]">{isPublished ? 'public' : 'rocket_launch'}</span>
            </div>
            <h2 className="text-2xl font-serif text-primary mb-2">
              {isPublished ? 'Your portfolio is live!' : 'Your portfolio is ready!'}
            </h2>
            <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto leading-relaxed">
              {isPublished
                ? `Visitors can find your portfolio at profol.io/${portfolio?.slug}`
                : 'Everything looks great. You are just one click away from launching your AI portfolio.'}
            </p>
            {isPublished ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.open(`/p/${portfolio?.slug}`, '_blank')}
                  className="min-w-[160px] text-white py-3 px-6 rounded-lg text-sm font-medium transition-all shadow-lg hover:opacity-90"
                  style={{ background: 'var(--accent-blue)' }}
                >
                  View Live Portfolio
                </button>
                <button
                  onClick={handleUnpublish}
                  disabled={updatePortfolio.isPending}
                  className="min-w-[160px] bg-surface hover:bg-surface-highlight text-text-muted border border-border py-3 px-6 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {updatePortfolio.isPending ? 'Updating...' : 'Unpublish'}
                </button>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={updatePortfolio.isPending}
                className="w-full sm:w-auto min-w-[200px] text-white py-3 px-6 rounded-lg text-sm font-medium transition-all shadow-lg hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--accent-blue)' }}
              >
                {updatePortfolio.isPending ? 'Publishing...' : 'Publish now'}
              </button>
            )}
          </div>
        </div>

        {/* Go to Dashboard Link */}
        <div className="flex justify-center pt-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-medium text-text-muted hover:text-primary transition-colors border-b border-transparent hover:border-border pb-0.5"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishTab;
