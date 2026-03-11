import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import apiClient from '../../config/api';
import { portfolioApi } from '../../services/portfolioApi';
import { ToolboxConfig } from '../../types/portfolio';
import SplashCursor from '../common/SplashCursor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PortfolioPreviewProps {
  onBack: () => void;
}

// ── Theme Definitions ──────────────────────────────────────────────────────────
const THEMES = {
  DEFAULT: {
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    inputBg: 'bg-white/70 focus:bg-white/95',
    inputBorder: 'border-gray-200',
    inputFocus: 'focus:ring-gray-300',
    inputText: 'text-gray-900 placeholder:text-gray-400',
    sendBtn: 'bg-gray-800 hover:bg-gray-900',
    quickBtn: 'bg-white border-gray-100 hover:bg-gray-50 text-gray-800',
    userBubble: 'bg-gray-800 text-white rounded-tr-sm',
    aiBubble: 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm',
    typingDot: 'bg-gray-400',
    heroText: 'text-black',
    subText: 'text-gray-700',
  },
  DARK: {
    bg: 'bg-zinc-950',
    text: 'text-zinc-100',
    inputBg: 'bg-zinc-800/80 focus:bg-zinc-800',
    inputBorder: 'border-zinc-700',
    inputFocus: 'focus:ring-zinc-600',
    inputText: 'text-zinc-100 placeholder:text-zinc-500',
    sendBtn: 'bg-blue-600 hover:bg-blue-500',
    quickBtn: 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100',
    userBubble: 'bg-blue-600 text-white rounded-tr-sm',
    aiBubble: 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-sm',
    typingDot: 'bg-zinc-500',
    heroText: 'text-white',
    subText: 'text-zinc-400',
  },
  PLAYFUL: {
    bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50',
    text: 'text-gray-900',
    inputBg: 'bg-white/80 focus:bg-white',
    inputBorder: 'border-purple-200',
    inputFocus: 'focus:ring-purple-300',
    inputText: 'text-gray-900 placeholder:text-purple-300',
    sendBtn: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    quickBtn: 'bg-white border-purple-100 hover:bg-purple-50 text-purple-800',
    userBubble: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-sm',
    aiBubble: 'bg-white text-gray-800 border border-purple-100 rounded-tl-sm',
    typingDot: 'bg-purple-400',
    heroText: 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent',
    subText: 'text-purple-700',
  },
} as const;

type ThemeKey = keyof typeof THEMES;

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ onBack }) => {
  const auth = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [toolboxConfig, setToolboxConfig] = useState<ToolboxConfig | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.length > 0 || isLoading;

  const isGlobalEnabled = toolboxConfig?.isGlobalEnabled !== false;

  const quickActions = (!toolboxConfig || !isGlobalEnabled) ? [] : [
    { id: 'me', icon: 'sentiment_satisfied', label: 'Me', q: 'Tell me about yourself', isEnabled: toolboxConfig.meInfo?.isEnabled !== false },
    { id: 'projects', icon: 'work', label: 'Projects', q: 'What projects have you worked on?', isEnabled: toolboxConfig.isProjectsEnabled !== false },
    { id: 'skills', icon: 'layers', label: 'Skills', q: 'What are your technical skills?', isEnabled: toolboxConfig.isSkillsEnabled !== false },
    { id: 'contact', icon: 'person_search', label: 'Contact', q: 'How can I contact you?', isEnabled: toolboxConfig.contactInfo?.isEnabled !== false },
    { id: 'location', icon: 'location_on', label: 'Location', q: 'Where are you based?', isEnabled: toolboxConfig.locationInfo?.isEnabled !== false },
    { id: 'resume', icon: 'description', label: 'Resume', q: 'Can I see your resume or CV?', isEnabled: toolboxConfig.resumeInfo?.isEnabled !== false },
    { id: 'video', icon: 'play_circle', label: 'Video', q: 'Do you have a video introduction?', isEnabled: toolboxConfig.videoInfo?.isEnabled !== false },
    { id: 'hobbies', icon: 'interests', label: 'Hobbies', q: 'What are your hobbies and interests?', isEnabled: toolboxConfig.hobbiesInfo?.isEnabled !== false },
  ].filter(action => action.isEnabled);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await apiClient.get('/v1/portfolio');
        const payload = response.data?.data ?? response.data;
        setPortfolio(payload);
        // Auto-show welcome modal if configured
        if (payload?.isWelcomeModalEnabled && payload?.modalTitle) {
          setShowWelcomeModal(true);
        }
        try {
          const toolsData = await portfolioApi.getToolboxConfig();
          setToolboxConfig(toolsData);
        } catch (e) {
          console.warn("Could not fetch toolbox config, defaulting to all enabled.");
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    };
    if (auth.isAuthenticated) fetchPortfolioData();
  }, [auth.isAuthenticated]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || !portfolio?.slug) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await apiClient.post(`/v1/public/chat/${portfolio.slug}`, { message: messageText, history });
      const payload = response.data?.data ?? response.data;
      setMessages(prev => [...prev, { role: 'assistant', content: payload.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const profileGreeting = portfolio?.headline || 'Hello 👋';
  const userTitle = portfolio?.tagline || 'Portfolio';

  // Resolve theme — fallback to DEFAULT if unknown value
  const themeKey: ThemeKey = (portfolio?.theme as ThemeKey) in THEMES
    ? (portfolio?.theme as ThemeKey)
    : 'DEFAULT';
  const t = THEMES[themeKey];

  return (
    <div className={`${t.bg} ${t.text} font-sans h-screen flex flex-col relative overflow-hidden transition-colors duration-300`}>
      {/* Cursors */}
      {portfolio?.cursorAnimation === 'FLUID' && <SplashCursor />}

      {/* Welcome Modal */}
      {showWelcomeModal && portfolio?.modalTitle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowWelcomeModal(false)}>
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl border p-8 ${themeKey === 'DARK'
              ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
              : 'bg-white border-gray-100 text-gray-900'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWelcomeModal(false)}
              className={`absolute top-4 right-4 size-8 flex items-center justify-center rounded-full transition-colors ${themeKey === 'DARK' ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-gray-100 text-gray-400'
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-xl font-bold mb-3">{portfolio.modalTitle}</h2>
            {portfolio.modalContent && (
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${themeKey === 'DARK' ? 'text-zinc-400' : 'text-gray-500'
                }`}>{portfolio.modalContent}</p>
            )}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent-blue, #3b6feb)' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {/* Banner */}
      <div className="relative bg-[#f1e38b] border-b border-[#d7ca73] py-2.5 px-3 md:px-4 flex items-center justify-center text-xs md:text-sm font-medium shrink-0 z-50">
        <div className="flex items-center gap-2 text-zinc-900">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>This portfolio is unpublished — only you can see it</span>
        </div>
        <button
          onClick={onBack}
          className="ml-8 inline-flex items-center gap-1.5 hover:opacity-75 transition-opacity text-zinc-900"
        >
          Back to Dashboard
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <main className="relative flex-1 flex flex-col overflow-hidden">
        {/* Background radial for DEFAULT/PLAYFUL */}
        {themeKey !== 'DARK' && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)]"></div>
        )}
        {/* Dark mode noise overlay */}
        {themeKey === 'DARK' && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}></div>
        )}

        {/* Info button — opens Welcome Modal */}
        {portfolio?.modalTitle && (
          <button
            onClick={() => setShowWelcomeModal(true)}
            title="Welcome info"
            className={`fixed bottom-4 left-4 md:left-6 size-9 rounded-full flex items-center justify-center shadow-lg z-50 transition-all hover:scale-105 ${themeKey === 'DARK'
              ? 'bg-zinc-800 border border-zinc-600 text-zinc-300 hover:bg-zinc-700'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
          </button>
        )}

        {/* Powered badge */}
        <div className={`fixed bottom-4 right-4 md:right-6 px-4 py-2 text-[12px] font-medium rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity z-50 ${themeKey === 'DARK' ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-gray-800 text-white'}`}>
          Powered by Profolio
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-10 md:pt-16 pb-24 flex flex-col items-center flex-1">
          <h2 className={`text-lg md:text-xl font-serif italic mb-2 md:mb-3 text-center tracking-tight ${t.subText}`}>
            {profileGreeting} <span className="not-italic align-middle text-2xl">👋</span>
          </h2>
          <h1 className={`text-3xl md:text-[4rem] font-serif mb-8 md:mb-10 text-center tracking-tight leading-[1.1] px-4 ${t.heroText}`}>
            {userTitle}
          </h1>

          {/* Avatar */}
          <div className="mb-8 md:mb-10 flex justify-center">
            <div className={`w-[160px] h-[160px] md:w-[220px] md:h-[220px] relative overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] ring-1 ${themeKey === 'DARK' ? 'ring-white/10 bg-zinc-800' : 'ring-gray-900/5 bg-white'} ${portfolio?.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-[1.5rem] md:rounded-[2rem]'}`}>
              {portfolio?.avatarUrl ? (
                <img src={portfolio.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${themeKey === 'DARK' ? 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-400' : themeKey === 'PLAYFUL' ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-400' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400'} text-6xl font-black`}>
                  {profileGreeting.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Chat input */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative mb-8 md:mb-12">
              <input
                className={`w-full h-[54px] md:h-[60px] pl-6 md:pl-7 pr-16 rounded-full border ${t.inputBorder} ${t.inputBg} ${t.inputText} text-base shadow-sm ${t.inputFocus} focus:outline-none focus:ring-2 transition-all hover:shadow-md backdrop-blur-md`}
                placeholder={portfolio?.chatPlaceholder || 'Ask me anything...'}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 size-10 md:size-11 rounded-full ${t.sendBtn} text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-md`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_forward</span>
              </button>
            </form>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 px-2">
              {quickActions.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleSendMessage(btn.q)}
                  disabled={isLoading}
                  className={`w-[84px] h-[84px] md:w-[104px] md:h-[104px] ${t.quickBtn} border rounded-[1.25rem] md:rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:shadow-md transition-all shadow-sm focus:outline-none disabled:opacity-60`}
                >
                  <span className="material-symbols-outlined text-[22px] md:text-[24px] font-light">{btn.icon}</span>
                  <span className="text-[12px] md:text-[13px] font-semibold">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation */}
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
                      className={`max-w-[85%] md:max-w-[78%] px-4 py-3 rounded-2xl md:px-5 md:py-3.5 text-[14px] md:text-[15px] leading-relaxed shadow-sm ${m.role === 'user' ? t.userBubble : t.aiBubble
                        }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`${themeKey === 'DARK' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} border shadow-sm px-6 py-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center`}>
                    <span className={`size-2 ${t.typingDot} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                    <span className={`size-2 ${t.typingDot} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                    <span className={`size-2 ${t.typingDot} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></span>
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
