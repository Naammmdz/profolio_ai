import React, { useState, useMemo } from 'react';
import QuestionModal from '../modals/QuestionModal';
import { useQuestions, useAddQuestion, useUpdateQuestion, useDeleteQuestion } from '../../../hooks/useQuestions';
import type { SuggestedQuestion } from '../../../types/portfolio';
import DashboardFooter from '../DashboardFooter';
import DashboardTopBar from '../DashboardTopBar';

interface QuestionCategory {
  title: string;
  count: number;
  questions: SuggestedQuestion[];
}

interface QuestionsTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ onPreview, onNavigate }) => {
  const { data: questions = [], isLoading } = useQuestions();
  const addQuestion = useAddQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  const [editingQuestion, setEditingQuestion] = useState<{
    id?: string;
    isNew: boolean;
    question: string;
    category: string;
    isDefault: boolean;
  } | null>(null);

  const questionCategories = useMemo<QuestionCategory[]>(() => {
    const categoryMap = new Map<string, SuggestedQuestion[]>();

    for (const q of questions) {
      const cat = q.category || 'Uncategorized';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(q);
    }

    return Array.from(categoryMap.entries()).map(([title, qs]) => ({
      title,
      count: qs.length,
      questions: qs,
    }));
  }, [questions]);

  const categories = questionCategories.map(cat => cat.title);

  const handleCreateQuestion = () => {
    setEditingQuestion({
      isNew: true,
      question: '',
      category: categories[0] || 'About Me',
      isDefault: false,
    });
  };

  const handleEditQuestion = (question: SuggestedQuestion) => {
    setEditingQuestion({
      id: question.id,
      isNew: false,
      question: question.question,
      category: question.category || 'Uncategorized',
      isDefault: question.isDefault,
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestionMutation.mutate(questionId);
  };

  const handleSaveQuestion = (q: { id?: string; question?: string; category?: string; isDefault?: boolean }) => {
    if (q.id) {
      updateQuestionMutation.mutate({
        id: q.id,
        question: q.question,
        category: q.category,
        isDefault: q.isDefault,
      });
    } else {
      addQuestion.mutate({
        question: q.question || '',
        category: q.category || 'About Me',
        isDefault: q.isDefault ?? false,
      });
    }
    setEditingQuestion(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-surface-highlight rounded-lg w-1/3" />
          <div className="h-[300px] bg-surface-highlight rounded-2xl" />
          <div className="h-48 bg-surface-highlight rounded-2xl" />
          <div className="h-48 bg-surface-highlight rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <DashboardTopBar onPreview={onPreview} onPublish={() => onNavigate('publish')} />

      {/* Title */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-serif text-primary mb-3 tracking-tight">Suggested Questions</h1>
        <p className="text-text-muted text-sm leading-relaxed">Customize the conversation starters visitors see when they open your AI chat. These help guide the interaction and showcase your best self.</p>
      </div>


      {/* Question Categories */}
      {questionCategories.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-text-subtle text-4xl mb-4 block">help_center</span>
          <h3 className="text-lg font-medium text-primary mb-2">No questions yet</h3>
          <p className="text-sm text-text-muted mb-6">Add suggested questions to help visitors start conversations with your AI.</p>
          <button
            onClick={handleCreateQuestion}
            className="text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:opacity-90"
            style={{ background: 'var(--accent-blue)' }}
          >
            Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questionCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-surface border border-border rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-border transition-colors">
              <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-lg font-medium text-primary">{category.title}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ color: 'var(--accent-blue)', background: 'rgba(59,111,235,0.08)', border: '1px solid rgba(59,111,235,0.2)' }}>{category.count} question{category.count !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-4">
                {category.questions.map((questionItem) => (
                  <div key={questionItem.id} className="relative group">
                    <input
                      className="w-full py-3 pl-4 pr-20 rounded-xl border border-border text-sm text-primary bg-surface placeholder:text-text-muted focus:outline-none focus:ring-1 focus:border-[var(--accent-blue)] transition-all shadow-sm"
                      readOnly
                      type="text"
                      value={questionItem.question}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {questionItem.isDefault && (
                        <span className="bg-surface-highlight text-text-muted text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded border border-border/50">Default</span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditQuestion(questionItem)}
                          className="p-1 hover:bg-surface-highlight rounded transition-colors"
                          title="Edit question"
                        >
                          <span className="material-symbols-outlined text-text-muted hover:text-primary text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(questionItem.id)}
                          className="p-1 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete question"
                        >
                          <span className="material-symbols-outlined text-text-muted hover:text-red-500 text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleCreateQuestion}
          className="flex-1 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-90"
          style={{ background: 'var(--accent-blue)' }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Question
        </button>
      </div>

      <DashboardFooter />

      {/* Question Modal */}
      {editingQuestion && (
        <QuestionModal
          question={editingQuestion}
          categories={categories}
          onClose={() => setEditingQuestion(null)}
          onSave={(q) => handleSaveQuestion(q)}
        />
      )}
    </div>
  );
};

export default QuestionsTab;
