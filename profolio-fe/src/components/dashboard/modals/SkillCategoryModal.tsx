import React, { useState } from 'react';

interface SkillCategory {
  isNew: boolean;
  title?: string;
  skills?: string[];
}

interface SkillCategoryModalProps {
  category: SkillCategory;
  onClose: () => void;
  onSave: (category: SkillCategory) => void;
}

const INPUT_CLS = 'w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm text-primary placeholder:text-text-subtle shadow-sm transition-shadow focus:outline-none focus:ring-1 focus:border-[var(--accent-blue)]';
const FOCUS_RING = { '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties;

const SkillCategoryModal: React.FC<SkillCategoryModalProps> = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState<SkillCategory>(category);
  const [tempSkillInput, setTempSkillInput] = useState('');

  const handleAddSkill = () => {
    if (tempSkillInput.trim()) {
      setFormData({ ...formData, skills: [...(formData.skills || []), tempSkillInput.trim()] });
      setTempSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter((s) => s !== skillToRemove) || [] });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <h2 className="text-lg font-semibold text-primary">
              {formData.isNew ? 'Create Skill Category' : 'Edit Skill Category'}
            </h2>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* Category name */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Category Name</label>
            <input
              className={INPUT_CLS}
              style={FOCUS_RING}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Languages, Frameworks"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">Skills</label>

            {/* Chips */}
            {(formData.skills?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills?.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-primary border"
                    style={{ background: 'rgba(59,111,235,0.06)', borderColor: 'rgba(59,111,235,0.2)' }}
                  >
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 flex items-center ml-1 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                className={INPUT_CLS}
                style={FOCUS_RING}
                placeholder="Add skill (e.g. React)"
                value={tempSkillInput}
                onChange={(e) => setTempSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <button
                onClick={handleAddSkill}
                className="px-4 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
                style={{ background: 'var(--accent-blue)' }}
              >
                Add
              </button>
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
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryModal;
