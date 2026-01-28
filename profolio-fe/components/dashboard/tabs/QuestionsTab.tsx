import React, { useState } from 'react';
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
      {/* Header with Draft Mode, Preview, Publish Changes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="hidden sm:block">
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
          <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-800/60 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-yellow-500 dark:bg-yellow-400"></span>
            Draft Mode
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700 mx-1"></div>
          <button 
            onClick={onPreview}
            className="bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Preview
          </button>
          <button 
            onClick={() => onNavigate('publish')}
            className="bg-primary dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-100 text-primary-foreground dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-serif text-zinc-900 dark:text-white mb-3 tracking-tight">Suggested Questions</h1>
        <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed">Customize the conversation starters visitors see when they open your AI chat. These help guide the interaction and showcase your best self.</p>
      </div>

      {/* Preview Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl mb-10 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgb(63,63,70)_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
          <div className="size-16 bg-zinc-900 dark:bg-white rounded-full mb-6 shadow-xl ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center overflow-hidden">
            <img alt="AI Avatar" className="w-full h-full object-cover grayscale opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAetz8sCmxvzkl24KNevlS8HwWmfU9lD35sOrf4b7CG0-7XxJR3nLfQtgVyJDOV2tgKOMPu2MwzLfFS20gW0hIXQkY5PNETd0uyh77Sp7fAyFLOuD1HzARlekzEiUJWir6Zb1Rdu4cJ_fRZV7xrI79iVXZriPNSrf0FDx8a3ApiVX_fHJztLYqcyF7EGU8E0d2Ocx6CckcWg_xraBXejginXoiQ1uiKx2x_EQRg_Zl0XXGt6gTk4TmZvDBKbm1Hq0qxfECi_ry1vg"/>
          </div>
          <div className="w-full bg-white dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm p-1.5 pl-5 flex items-center gap-2 transition-all group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-600">
            <span className="text-sm text-zinc-400 dark:text-gray-500 w-full bg-transparent outline-none cursor-default flex items-center">
              Ask me anything...
              <span className="w-[1.5px] h-4 bg-zinc-900 dark:bg-white ml-0.5 animate-pulse"></span>
            </span>
            <button className="size-8 rounded-full bg-primary dark:bg-white text-primary-foreground dark:text-black flex items-center justify-center shrink-0 shadow-sm hover:bg-zinc-800 dark:hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Categories */}
      <div className="space-y-6">
        {questionCategories.map((category, catIndex) => (
          <div key={catIndex} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-baseline mb-6">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{category.title}</h3>
              <span className="text-xs font-medium text-zinc-400 dark:text-gray-500 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-700">{category.count} question{category.count !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-4">
              {category.questions.map((questionItem) => (
                <div key={questionItem.id} className="relative group">
                  <input 
                    className="w-full py-3 pl-4 pr-20 rounded-xl border-gray-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-white bg-white dark:bg-zinc-900 placeholder-zinc-400 dark:placeholder-gray-500 focus:border-zinc-900 dark:focus:border-white focus:ring-0 transition-all shadow-sm group-hover:border-gray-300 dark:group-hover:border-zinc-600" 
                    readOnly 
                    type="text" 
                    value={questionItem.question}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {questionItem.isDefault && (
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-gray-400 text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded border border-zinc-200/50 dark:border-zinc-700/50">Default</span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditQuestion(questionItem)}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        title="Edit question"
                      >
                        <span className="material-symbols-outlined text-zinc-500 dark:text-gray-400 hover:text-zinc-800 dark:hover:text-white text-[16px]">edit</span>
                      </button>
                      {!questionItem.isDefault && (
                        <button
                          onClick={() => questionItem.id && handleDeleteQuestion(questionItem.id, category.title)}
                          className="p-1 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete question"
                        >
                          <span className="material-symbols-outlined text-zinc-500 dark:text-gray-400 hover:text-red-500 text-[16px]">delete</span>
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

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button 
          onClick={handleCreateQuestion}
          className="flex-1 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-gray-200 dark:border-zinc-700 py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 group hover:border-zinc-300 dark:hover:border-zinc-600"
        >
          <span className="material-symbols-outlined text-[20px] text-zinc-400 dark:text-gray-500 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors">add</span>
          Add Question
        </button>
        <button 
          onClick={handleResetToDefaults}
          className="px-6 border border-transparent text-zinc-400 dark:text-gray-500 hover:text-zinc-600 dark:hover:text-gray-300 py-3 rounded-xl text-xs font-medium transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          Reset to Defaults
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 dark:border-zinc-800 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 dark:text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 dark:text-white font-serif tracking-tight text-sm">Profolio</span>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-black dark:hover:text-white transition-colors" href="#">Dashboard</a>
            <a className="hover:text-black dark:hover:text-white transition-colors" href="#">Billing</a>
            <a className="hover:text-black dark:hover:text-white transition-colors" href="#">Support</a>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-black dark:hover:text-white transition-colors" href="#">Terms</a>
            <a className="hover:text-black dark:hover:text-white transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>

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
