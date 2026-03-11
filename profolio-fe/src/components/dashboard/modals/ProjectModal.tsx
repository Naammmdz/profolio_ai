import React from 'react';

interface Project {
  isNew: boolean;
  title?: string;
  category?: string;
  description?: string;
  date?: string;
  tags?: string[];
  links?: string[];
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const INPUT_CLS = 'w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm text-primary placeholder:text-text-subtle shadow-sm transition-shadow focus:outline-none focus:ring-1 focus:border-[var(--accent-blue)]';
const FOCUS_RING = { '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties;

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<Project>(project);
  const tagInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const addTag = () => {
    const v = tagInputRef.current?.value.trim();
    if (v) {
      setFormData({ ...formData, tags: [...(formData.tags || []), v] });
      if (tagInputRef.current) tagInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
            </div>
            <h2 className="text-lg font-semibold text-primary">
              {formData.isNew ? 'Create Project' : 'Edit Project'}
            </h2>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                className={INPUT_CLS}
                style={FOCUS_RING}
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project Title"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Category</label>
              <input
                className={INPUT_CLS}
                style={FOCUS_RING}
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., WebApp, Mobile App"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Description</label>
            <textarea
              className={`${INPUT_CLS} min-h-[100px] resize-y`}
              style={FOCUS_RING}
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Project Date</label>
            <div className="relative">
              <select
                className={`${INPUT_CLS} appearance-none pr-10`}
                style={FOCUS_RING}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              >
                <option>November 1st, 2025</option>
                <option>October 2025</option>
                <option>September 2025</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Preview Image */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Preview Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[140px]">
              <span className="material-symbols-outlined text-text-muted text-5xl mb-3">image</span>
              <p className="text-sm text-text-muted mb-1">Drop image here or <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>browse</span></p>
              <p className="text-[10px] text-text-muted">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Tech Stack (or tags)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-primary border" style={{ background: 'rgba(59,111,235,0.06)', borderColor: 'rgba(59,111,235,0.2)' }}>
                  {tag}
                  <span
                    className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => setFormData({ ...formData, tags: formData.tags?.filter((_, idx) => idx !== i) })}
                  >close</span>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                ref={tagInputRef}
                className={INPUT_CLS}
                style={FOCUS_RING}
                placeholder="React, Node.js, TypeScript..."
                onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
              />
              <button
                onClick={addTag}
                className="px-4 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
                style={{ background: 'var(--accent-blue)' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Links</label>
            <div className="space-y-2.5">
              <input className={INPUT_CLS} style={FOCUS_RING} placeholder="Link name (e.g., GitHub)" />
              <input className={INPUT_CLS} style={FOCUS_RING} placeholder="https://..." />
              <button className="w-full py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90" style={{ background: 'rgba(59,111,235,0.08)', color: 'var(--accent-blue)', border: '1px solid rgba(59,111,235,0.2)' }}>
                Add Link
              </button>
            </div>
          </div>

          {/* Project Images */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Project Images (Max 5)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[120px]">
              <span className="material-symbols-outlined text-text-muted text-4xl mb-2">upload</span>
              <p className="text-sm text-text-muted mb-1">Drop images here or <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>browse</span></p>
              <p className="text-[10px] text-text-muted">5 images remaining</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
            style={{ background: 'var(--accent-blue)' }}
          >
            {formData.isNew ? 'Create Project' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
