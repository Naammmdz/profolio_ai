import React from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardFooter from '../shared/DashboardFooter';

interface PublishTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const PublishTab: React.FC<PublishTabProps> = ({ onPreview, onNavigate }) => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader 
        onPreview={onPreview} 
        onPublish={() => console.log('Publish')}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Preview &amp; Publish</h1>
        <p className="text-text-muted text-sm">Review your portfolio and make it live</p>
      </div>
      <div className="space-y-6">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-primary mb-1">Portfolio Checklist</h2>
            <p className="text-sm text-text-muted">Your portfolio is ready to publish!</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
              </div>
              <span className="text-sm font-medium text-primary">Basic Information</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
              </div>
              <span className="text-sm font-medium text-primary">AI Personality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
              </div>
              <span className="text-sm font-medium text-primary">Tools</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
              </div>
              <span className="text-sm font-medium text-primary">Suggested Questions</span>
              <span className="bg-surface-highlight text-text-muted text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">8</span>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[20px]">language</span>
            <h2 className="text-base font-bold text-primary">Custom Domain</h2>
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">crown</span> Pro
            </span>
          </div>
          <p className="text-sm text-text-muted mb-6">Use your own domain instead of profol.io/giang-nam</p>
          <div className="mb-6">
            <div className="bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-muted flex justify-between items-center bg-opacity-50 cursor-not-allowed">
              <span>Custom domains are available for Pro users.</span>
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Upgrade to Pro
          </button>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-primary mb-1">Portfolio Preview</h2>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-primary">Show Profolio Badge</h3>
              <p className="text-xs text-text-muted mt-1">Required for free plan</p>
            </div>
          </div>
          <div className="self-end mb-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" disabled={true} defaultChecked={true} type="checkbox" />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 opacity-60 cursor-not-allowed"></div>
            </label>
          </div>
        </div>
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-0 overflow-hidden shadow-sm relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/10 to-blue-500/5 pointer-events-none"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-base font-bold text-primary">Publish</h2>
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">crown</span> Pro
              </span>
            </div>
            <p className="text-sm text-text-muted mb-6">Your portfolio is ready!</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Publish now
            </button>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-medium text-primary hover:text-indigo-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default PublishTab;

