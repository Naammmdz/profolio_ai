import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../src/services/apiService';
import { useAuth } from 'react-oidc-context';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PortfolioPreviewProps {
  onBack: () => void;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ onBack }) => {
  const auth = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial fetch to get the user's portfolio slug
    const fetchPortfolio = async () => {
      try {
        const data = await apiService.get<any>('/api/v1/portfolio');
        setPortfolio(data);
        setMessages([
          { role: 'assistant', content: `Hi! I'm ${data.headline || 'the AI representative'}. How can I help you today?` }
        ]);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    };

    if (auth.isAuthenticated) {
      fetchPortfolio();
    }
  }, [auth.isAuthenticated]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || !portfolio?.slug) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await apiService.post<any>(`/api/v1/public/chat/${portfolio.slug}`, {
        message: messageText,
        history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const userName = portfolio?.headline || "Profolio AI";
  const userTitle = portfolio?.theme || "AI-Powered Professional";

  return (
    <div className="bg-background text-primary font-sans h-screen flex flex-col relative overflow-hidden dark:bg-zinc-950 transition-colors duration-300">
      {/* Banner Warning */}
      <div className="bg-[#FEFCE8] dark:bg-yellow-900/20 w-full py-2.5 px-4 flex justify-center items-center gap-4 text-xs tracking-wide font-medium border-b border-[#FEF08A] dark:border-yellow-800/30 text-yellow-900/80 dark:text-yellow-200 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-yellow-600 dark:text-yellow-400">lock</span>
          <span>This portfolio is unpublished—only you can see it</span>
        </div>
        <div className="h-4 w-px bg-yellow-900/10 dark:bg-yellow-200/20"></div>
        <a
          onClick={onBack}
          className="flex items-center gap-1 hover:text-yellow-950 dark:hover:text-yellow-100 transition-colors cursor-pointer"
        >
          Back to Dashboard
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col pt-4 pb-32 px-4 relative max-w-5xl mx-auto w-full custom-scrollbar">
        {/* Profile Info (Smaller when messages exist) */}
        <div className={`text-center relative z-10 w-full max-w-3xl mx-auto transition-all duration-500 ${messages.length > 0 ? 'mt-4 mb-8 scale-75' : 'mt-12 mb-4'}`}>
          <h2 className="text-2xl md:text-3xl font-serif italic text-black/70 dark:text-white/70 mb-2 flex items-center justify-center gap-2">
            Hey, I'm {userName.split(' ')[0]} <span className="text-2xl not-italic grayscale opacity-80">👋</span>
          </h2>
          <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-primary dark:text-white mb-4 leading-[1.1]">
            {userTitle}
          </h1>

          <div className="mb-4 flex justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
              <svg className="w-full h-full text-black dark:text-white drop-shadow-sm" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 140C125 140 145 130 145 100C145 70 125 40 100 40C75 40 55 70 55 100C55 130 75 140 100 140Z" fill="white" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M70 100C70 100 80 105 100 105C120 105 130 100 130 100" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="80" cy="85" fill="currentColor" r="4"></circle>
                <circle cx="120" cy="85" fill="currentColor" r="4"></circle>
                <path d="M100 140V180" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M60 180H140" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="65" y="75"></rect>
                <rect height="20" rx="5" stroke="currentColor" strokeWidth="2" width="30" x="105" y="75"></rect>
                <path d="M95 85H105" stroke="currentColor" strokeWidth="2"></path>
                <path d="M55 90C55 90 50 60 70 50C80 45 90 55 100 50C110 45 130 40 145 60C150 70 145 90 145 90" fill="black" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                <path d="M40 200C40 160 60 150 100 150C140 150 160 160 160 200" stroke="currentColor" strokeWidth="2.5"></path>
                <path d="M100 150L100 165L90 180L100 190L110 180L100 165" fill="black"></path>
                <path d="M100 165L80 160M100 165L120 160" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="w-full max-w-2xl mx-auto space-y-6 mb-12 relative z-10 px-4">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm ${m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-white dark:bg-zinc-900 border border-border text-primary dark:text-white rounded-tl-none font-light leading-relaxed'
                    }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-zinc-900 border border-border px-5 py-3 rounded-2xl rounded-tl-none flex gap-1">
                <span className="size-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="size-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="size-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Grid (Always at bottom with Input) */}
        <div className="sticky bottom-0 left-0 right-0 w-full max-w-3xl mx-auto pb-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-12 z-40 px-4">

          {/* Input Box */}
          <div className="w-full max-w-xl mx-auto mb-6">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="relative group"
            >
              <input
                className="w-full pl-6 pr-14 py-4 rounded-xl border border-border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-md focus:outline-none focus:border-primary/50 transition-all text-primary dark:text-white"
                placeholder="Ask me anything..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center justify-center size-9 shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
            {[
              { icon: 'face', label: 'Me', q: 'Tell me about yourself' },
              { icon: 'work', label: 'Projects', q: 'What projects have you worked on?' },
              { icon: 'layers', label: 'Skills', q: 'What are your technical skills?' },
              { icon: 'celebration', label: 'Fun', q: 'What do you do for fun?' },
              { icon: 'person_search', label: 'Contact', q: 'How can I contact you?' }
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(btn.q)}
                disabled={isLoading}
                className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 border border-border rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 group disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary dark:group-hover:text-white transition-colors text-[20px]">{btn.icon}</span>
                <span className="text-[10px] font-medium tracking-wide text-text-muted group-hover:text-primary dark:group-hover:text-white">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Watermark */}
        <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-0 pointer-events-none -z-0 opacity-[0.03] dark:opacity-[0.01] overflow-hidden select-none">
          <h1 className="text-[18vw] font-serif italic leading-[0.8] tracking-tight whitespace-nowrap text-primary dark:text-white">
            {userName}
          </h1>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPreview;
