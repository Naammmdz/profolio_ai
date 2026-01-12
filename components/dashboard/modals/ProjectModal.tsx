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

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<Project>(project);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0 z-10">
          <h2 className="text-xl font-bold text-primary">
            {formData.isNew ? 'Create Project' : 'Edit Project'}
          </h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Title <span className="text-red-500">*</span></label>
              <input 
                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
                value={formData.title || ''} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Project Title" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Category</label>
              <input 
                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
                value={formData.category || ''} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., WebApp, Mobile App" 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
            <textarea 
              className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary min-h-[100px] resize-y" 
              rows={4} 
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your project..." 
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Project Date</label>
            <div className="relative">
              <select 
                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary appearance-none" 
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
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
            <label className="block text-xs font-bold text-primary mb-1.5">Preview Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[160px]">
              <span className="material-symbols-outlined text-text-muted text-5xl mb-3">image</span>
              <p className="text-sm text-text-muted mb-1">Drop image here or <span className="text-indigo-600 font-medium hover:underline">browse</span></p>
              <p className="text-[10px] text-text-muted">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Tech Stack (or tags)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-highlight rounded-full text-xs font-bold text-primary border border-border">
                  {tag} 
                  <span 
                    className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => setFormData({
                      ...formData, 
                      tags: formData.tags?.filter((_, idx) => idx !== i)
                    })}
                  >close</span>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
                placeholder="React, Node.js, TypeScript..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setFormData({
                      ...formData,
                      tags: [...(formData.tags || []), e.currentTarget.value.trim()]
                    });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button 
                onClick={() => {
                  const input = document.querySelector('input[placeholder="React, Node.js, TypeScript..."]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    setFormData({
                      ...formData,
                      tags: [...(formData.tags || []), input.value.trim()]
                    });
                    input.value = '';
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg text-sm font-bold transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Links</label>
            <div className="space-y-3">
              <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Link name (e.g., GitHub)" />
              <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="https://..." />
              <button className="w-full bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 py-2.5 rounded-lg text-sm font-medium transition-colors">Add Link</button>
            </div>
          </div>

          {/* Project Images */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Project Images (Max 5)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[120px]">
              <span className="material-symbols-outlined text-text-muted text-4xl mb-2">upload</span>
              <p className="text-sm text-text-muted mb-1">Drop images here or <span className="text-indigo-600 font-medium hover:underline">browse</span></p>
              <p className="text-[10px] text-text-muted">5 images remaining</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface shrink-0 z-10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm">
            {formData.isNew ? 'Create Project' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

