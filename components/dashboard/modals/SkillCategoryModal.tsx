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

const SkillCategoryModal: React.FC<SkillCategoryModalProps> = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState<SkillCategory>(category);
  const [tempSkillInput, setTempSkillInput] = useState("");

  const handleAddSkill = () => {
    if (tempSkillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), tempSkillInput.trim()]
      });
      setTempSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skillToRemove) || []
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-lg max-h-[90vh] rounded-xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0 z-10">
          <h2 className="text-xl font-bold text-primary">
            {formData.isNew ? 'Create Skill Category' : 'Edit Skill Category'}
          </h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Category Name</label>
            <input 
              className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
              value={formData.title || ''} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Languages, Frameworks" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills?.map((skill: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-highlight rounded-full text-sm font-medium text-primary border border-border">
                  {skill} 
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 flex items-center ml-1">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
                placeholder="Add skill (e.g. React)"
                value={tempSkillInput}
                onChange={(e) => setTempSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <button 
                onClick={handleAddSkill}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg text-sm font-bold transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface shrink-0 z-10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm">
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryModal;

