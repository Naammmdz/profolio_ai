import React, { useState } from 'react';

interface Question {
  id?: string;
  isNew: boolean;
  question?: string;
  category?: string;
  isDefault?: boolean;
}

interface QuestionModalProps {
  question: Question;
  categories: string[];
  onClose: () => void;
  onSave: (question: Question) => void;
}

const INPUT_CLS = 'w-full py-2.5 px-4 rounded-lg border border-border bg-surface text-sm text-primary placeholder:text-text-subtle shadow-sm transition-shadow focus:outline-none focus:ring-1 focus:border-[var(--accent-blue)]';

const QuestionModal: React.FC<QuestionModalProps> = ({ question, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState<Question>(question);

  const handleSubmit = () => {
    if (!formData.question?.trim()) {
      alert('Please enter a question');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined text-[18px]">help_center</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                {formData.isNew ? 'Add Question' : 'Edit Question'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Create a suggested question for visitors.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-muted hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 flex-1">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category</label>
            <div className="relative">
              <select
                className={`${INPUT_CLS} appearance-none pr-10`}
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Question</label>
            <input
              type="text"
              className={INPUT_CLS}
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your question..."
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
            style={{ background: 'var(--accent-blue)' }}
          >
            {formData.isNew ? 'Add Question' : 'Update Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
