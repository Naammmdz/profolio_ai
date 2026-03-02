import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import apiClient from '../../config/api';

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
  const hasConversation = messages.length > 0 || isLoading;

  const quickActions = [
    { icon: 'sentiment_satisfied', label: 'Me', q: 'Tell me about yourself' },
    { icon: 'work', label: 'Projects', q: 'What projects have you worked on?' },
    { icon: 'deployed_code', label: 'Skills', q: 'What are your technical skills?' },
    { icon: 'celebration', label: 'Fun', q: 'What do you do for fun?' },
    { icon: 'person_search', label: 'Contact', q: 'How can I contact you?' },
    { icon: 'videocam', label: 'Video', q: 'Do you have a video introduction?' },
    { icon: 'location_on', label: 'Location', q: 'Where are you based?' },
    { icon: 'description', label: 'Resume', q: 'Can I get your resume?' },
  ];

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
        const response = await apiClient.get('/v1/portfolio');
        const payload = response.data?.data ?? response.data;
        setPortfolio(payload);
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
      const response = await apiClient.post(`/v1/public/chat/${portfolio.slug}`, {
        message: messageText,
        history
      });

      const payload = response.data?.data ?? response.data;
      setMessages(prev => [...prev, { role: 'assistant', content: payload.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const profileName =
    auth.user?.profile?.name ||
    auth.user?.profile?.preferred_username ||
    auth.user?.profile?.email ||
    'there';
  const userTitle = portfolio?.headline || 'Backend Developer';

  return (
    <div className="bg-[#f3f3f3] text-zinc-900 font-sans h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="relative bg-[#f1e38b] border-b border-[#d7ca73] py-2.5 px-3 md:px-4 flex items-center justify-center text-xs md:text-sm font-medium shrink-0 z-50">
        <div className="flex items-center gap-2 text-zinc-900">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>This portfolio is unpublished- only you can see it</span>
        </div>
        <button
          onClick={onBack}
          className="ml-8 inline-flex items-center gap-1.5 hover:opacity-75 transition-opacity text-zinc-900"
        >
          Back to Dashboard
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
        <span className="material-symbols-outlined absolute right-4 md:right-5 text-[22px] text-zinc-900/85">info</span>
      </div>

      <main className="relative flex-1 overflow-y-auto custom-scrollbar">
        <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none -z-0 opacity-[0.06] overflow-hidden select-none">
          <h1 className="text-[20vw] font-sans font-bold leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-zinc-400/50">
            {profileName}
          </h1>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-3 pb-14 flex flex-col items-center">
          <h2 className="text-2xl md:text-[44px] leading-tight font-sans font-semibold text-zinc-900 mb-2 text-center">
            Hey, I'm <span className="font-bold">{profileName}</span> <span className="text-[44px] align-middle">👋</span>
          </h2>
          <h1 className="text-5xl md:text-[84px] leading-[0.95] tracking-[-0.03em] font-sans font-bold text-zinc-900 mb-6 text-center">
            {userTitle}
          </h1>

          <div className="mb-6 flex justify-center">
            <div className="w-[240px] h-[240px] md:w-[300px] md:h-[300px] relative">
              <svg className="w-full h-full text-black" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 140C125 140 145 130 145 100C145 70 125 40 100 40C75 40 55 70 55 100C55 130 75 140 100 140Z" fill="transparent" stroke="currentColor" strokeWidth="2.5"></path>
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

          <div className="w-full max-w-3xl mx-auto">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="relative mb-8"
            >
              <input
                className="w-full h-[68px] md:h-[72px] pl-6 md:pl-8 pr-20 rounded-full border border-zinc-300 bg-[#f2f2f2] text-zinc-800 text-base md:text-[22px] leading-none focus:outline-none focus:border-zinc-500"
                placeholder="Ask me anything..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-12 rounded-full bg-zinc-600 text-white flex items-center justify-center hover:bg-zinc-700 transition-colors disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
              </button>
            </form>

            <div className="space-y-4 max-w-[800px] mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {quickActions.slice(0, 5).map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleSendMessage(btn.q)}
                    disabled={isLoading}
                    className="bg-[#f3f3f3] border border-zinc-300 rounded-3xl h-24 md:h-28 flex flex-col items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[24px] text-zinc-700">{btn.icon}</span>
                    <span className="text-sm md:text-[28px] font-medium text-zinc-700 leading-none">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-[480px] mx-auto">
                {quickActions.slice(5).map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleSendMessage(btn.q)}
                    disabled={isLoading}
                    className="bg-[#f3f3f3] border border-zinc-300 rounded-3xl h-24 md:h-28 flex flex-col items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[24px] text-zinc-700">{btn.icon}</span>
                    <span className="text-sm md:text-[28px] font-medium text-zinc-700 leading-none">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasConversation && (
            <div className="w-full max-w-3xl mx-auto mt-10 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-5 py-3 rounded-2xl border text-sm md:text-lg leading-[1.45] ${
                        m.role === 'user'
                          ? 'bg-zinc-900 text-white border-zinc-900 rounded-tr-md'
                          : 'bg-white text-zinc-900 border-zinc-300 rounded-tl-md'
                      }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-300 px-5 py-3 rounded-2xl rounded-tl-md flex gap-1.5">
                    <span className="size-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="size-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="size-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortfolioPreview;
