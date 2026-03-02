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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {formData.isNew ? 'Add Question' : 'Edit Question'}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Create a suggested question for visitors.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="size-8 flex items-center justify-center rounded-full hover:bg-surface-highlight transition-colors text-text-muted hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full py-2.5 px-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary appearance-none shadow-sm transition-shadow"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
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

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Question
            </label>
            <input
              type="text"
              className="w-full py-2.5 px-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow"
              value={formData.question || ''}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              placeholder="Enter your question..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface shrink-0 z-10 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-lg border border-border bg-surface text-primary hover:bg-surface-highlight font-medium text-sm transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-colors shadow-sm"
          >
            {formData.isNew ? 'Add Question' : 'Update Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;

