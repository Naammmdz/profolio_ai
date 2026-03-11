import React from 'react';

interface DashboardTopBarProps {
    onPreview: () => void;
    onPublish: () => void;
}

/**
 * Shared top action bar used across all dashboard tabs.
 * Contains: Draft Mode indicator · Preview · Publish Changes
 */
const DashboardTopBar: React.FC<DashboardTopBarProps> = ({ onPreview, onPublish }) => {
    return (
        <div className="flex items-center justify-end gap-2 mb-10">
            {/* Draft badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
                style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.25)', color: 'rgba(161,122,0,1)' }}>
                <span className="size-1.5 rounded-full" style={{ background: 'rgba(234,179,8,0.9)' }} />
                Draft Mode
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-border mx-1" />

            {/* Preview */}
            <button
                onClick={onPreview}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface text-primary text-xs font-medium hover:bg-surface-highlight transition-all shadow-sm"
            >
                <span className="material-symbols-outlined text-[15px]">visibility</span>
                Preview
            </button>

            {/* Publish */}
            <button
                onClick={onPublish}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: 'var(--accent-blue)' }}
            >
                <span className="material-symbols-outlined text-[15px]">rocket_launch</span>
                Publish
            </button>
        </div>
    );
};

export default DashboardTopBar;
