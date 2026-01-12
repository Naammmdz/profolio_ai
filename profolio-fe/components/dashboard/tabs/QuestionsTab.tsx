import React, { useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardFooter from '../shared/DashboardFooter';
import QuestionModal from '../modals/QuestionModal';

interface Question {
  id?: string;
  question: string;
  category: string;
  isDefault?: boolean;
}

interface QuestionsTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ onPreview, onNavigate }) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionCategories, setQuestionCategories] = useState([
    {
      title: "About Me",
      count: 2,
      questions: [
        { id: '1', question: "Who are you?", category: "About Me", isDefault: true },
        { id: '2', question: "What are your passions?", category: "About Me", isDefault: true }
      ]
    },
    {
      title: "Professional",
      count: 2,
      questions: [
        { id: '3', question: "Can I see your resume?", category: "Professional", isDefault: true },
        { id: '4', question: "Why should I hire you?", category: "Professional", isDefault: true }
      ]
    },
    {
      title: "Projects",
      count: 1,
      questions: [
        { id: '5', question: "What projects are you most proud of?", category: "Projects", isDefault: true }
      ]
    },
    {
      title: "Skills",
      count: 1,
      questions: [
        { id: '6', question: "What are your skills?", category: "Skills", isDefault: true }
      ]
    },
    {
      title: "Fun & Personal",
      count: 1,
      questions: [
        { id: '7', question: "What's the craziest thing you've ever done?", category: "Fun & Personal", isDefault: true }
      ]
    },
    {
      title: "Contact",
      count: 1,
      questions: [
        { id: '8', question: "How can I reach you?", category: "Contact", isDefault: true }
      ]
    }
  ]);

  const categories = questionCategories.map(cat => cat.title);

  const handleCreateQuestion = () => {
    setEditingQuestion({
      id: undefined,
      question: '',
      category: '',
      isDefault: false
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
  };

  const handleDeleteQuestion = (questionId: string, categoryTitle: string) => {
    setQuestionCategories(prev => prev.map(cat => {
      if (cat.title === categoryTitle) {
        const filteredQuestions = cat.questions.filter(q => q.id !== questionId);
        return {
          ...cat,
          count: filteredQuestions.length,
          questions: filteredQuestions
        };
      }
      return cat;
    }));
  };

  const handleSaveQuestion = (question: Question) => {
    if (question.id) {
      // Update existing question
      setQuestionCategories(prev => prev.map(cat => {
        if (cat.title === question.category) {
          const updatedQuestions = cat.questions.map(q => 
            q.id === question.id ? question : q
          );
          return {
            ...cat,
            count: updatedQuestions.length,
            questions: updatedQuestions
          };
        }
        return cat;
      }));
    } else {
      // Add new question
      const newQuestion = {
        ...question,
        id: Date.now().toString()
      };
      setQuestionCategories(prev => prev.map(cat => {
        if (cat.title === question.category) {
          return {
            ...cat,
            count: cat.questions.length + 1,
            questions: [...cat.questions, newQuestion]
          };
        }
        return cat;
      }));
    }
    setEditingQuestion(null);
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all questions to defaults? This will remove all custom questions.')) {
      setQuestionCategories([
        {
          title: "About Me",
          count: 2,
          questions: [
            { id: '1', question: "Who are you?", category: "About Me", isDefault: true },
            { id: '2', question: "What are your passions?", category: "About Me", isDefault: true }
          ]
        },
        {
          title: "Professional",
          count: 2,
          questions: [
            { id: '3', question: "Can I see your resume?", category: "Professional", isDefault: true },
            { id: '4', question: "Why should I hire you?", category: "Professional", isDefault: true }
          ]
        },
        {
          title: "Projects",
          count: 1,
          questions: [
            { id: '5', question: "What projects are you most proud of?", category: "Projects", isDefault: true }
          ]
        },
        {
          title: "Skills",
          count: 1,
          questions: [
            { id: '6', question: "What are your skills?", category: "Skills", isDefault: true }
          ]
        },
        {
          title: "Fun & Personal",
          count: 1,
          questions: [
            { id: '7', question: "What's the craziest thing you've ever done?", category: "Fun & Personal", isDefault: true }
          ]
        },
        {
          title: "Contact",
          count: 1,
          questions: [
            { id: '8', question: "How can I reach you?", category: "Contact", isDefault: true }
          ]
        }
      ]);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader 
        onPreview={onPreview} 
        onPublish={() => onNavigate('publish')}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Suggested Questions</h1>
        <p className="text-text-muted text-sm">Customize the questions visitors can ask your AI</p>
      </div>
      
      <div className="bg-surface border border-border rounded-xl mb-8 shadow-sm h-[320px] flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute inset-0 bg-background/50 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="size-16 bg-primary rounded-full mb-6 shadow-lg flex items-center justify-center overflow-hidden">
            <img alt="AI Avatar" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAetz8sCmxvzkl24KNevlS8HwWmfU9lD35sOrf4b7CG0-7XxJR3nLfQtgVyJDOV2tgKOMPu2MwzLfFS20gW0hIXQkY5PNETd0uyh77Sp7fAyFLOuD1HzARlekzEiUJWir6Zb1Rdu4cJ_fRZV7xrI79iVXZriPNSrf0FDx8a3ApiVX_fHJztLYqcyF7EGU8E0d2Ocx6CckcWg_xraBXejginXoiQ1uiKx2x_EQRg_Zl0XXGt6gTk4TmZvDBKbm1Hq0qxfECi_ry1vg"/>
          </div>
          <div className="w-80 sm:w-96 bg-background rounded-full border border-border shadow-md p-1.5 pl-5 flex items-center gap-2 transition-shadow hover:shadow-lg hover:border-indigo-100 group">
            <span className="text-sm text-text-muted w-full bg-transparent outline-none cursor-text flex items-center">
              Ask me anything
              <span className="w-[1.5px] h-4 bg-primary ml-0.5 animate-pulse"></span>
            </span>
            <button className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-700 transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questionCategories.map((category, catIndex) => (
          <div key={catIndex} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-base font-bold text-primary">{category.title}</h3>
              <p className="text-xs text-text-muted">{category.count} question{category.count !== 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-3">
              {category.questions.map((questionItem) => (
                <div key={questionItem.id} className="relative group">
                  <input 
                    className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" 
                    readOnly 
                    type="text" 
                    value={questionItem.question}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {questionItem.isDefault && (
                      <span className="bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditQuestion(questionItem)}
                        className="p-1 hover:bg-surface-highlight rounded transition-colors"
                        title="Edit question"
                      >
                        <span className="material-symbols-outlined text-text-muted hover:text-primary text-[16px]">edit</span>
                      </button>
                      {!questionItem.isDefault && (
                        <button
                          onClick={() => questionItem.id && handleDeleteQuestion(questionItem.id, category.title)}
                          className="p-1 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete question"
                        >
                          <span className="material-symbols-outlined text-text-muted hover:text-red-500 text-[16px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button 
          onClick={handleCreateQuestion}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Question
        </button>
        <button 
          onClick={handleResetToDefaults}
          className="px-6 border border-border bg-background hover:bg-surface-highlight text-primary py-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Reset to Defaults
        </button>
      </div>

      <DashboardFooter />

      {/* Question Modal */}
      {editingQuestion && (
        <QuestionModal
          question={{
            id: editingQuestion.id,
            isNew: !editingQuestion.id,
            question: editingQuestion.question,
            category: editingQuestion.category,
            isDefault: editingQuestion.isDefault
          }}
          categories={categories}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
};

export default QuestionsTab;

