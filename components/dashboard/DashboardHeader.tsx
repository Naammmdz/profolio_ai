import React from 'react';

interface DashboardHeaderProps {
  onPreview: () => void;
  onPublish?: () => void;
  showPublish?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onPreview, 
  onPublish,
  showPublish = true 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="hidden sm:block">
        <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-orange-500"></span>
          Draft
        </div>
        <button 
          onClick={onPreview}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          View portfolio
        </button>
        {showPublish && (
          <button 
            onClick={onPublish}
            className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

