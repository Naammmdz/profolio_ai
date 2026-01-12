import React from 'react';

interface AnalyticsTabProps {
  onNavigate: (tab: string) => void;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="size-16 bg-surface-highlight rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-text-muted text-3xl">bar_chart</span>
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">Analytics Coming Soon</h2>
      <p className="text-text-muted mb-8">Track your portfolio performance in the upcoming release.</p>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AnalyticsTab;

