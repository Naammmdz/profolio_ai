import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Project, ToolboxConfig } from '../../types/portfolio';
import SplashCursor from '../common/SplashCursor';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; }
interface AICardData { section_type?: string; title?: string; text?: string; tags?: string[]; }
interface AIResponse {
  type: 'PROFILE' | 'SKILLS' | 'PROJECTS' | 'CONTACT' | 'LOCATION' | 'RESUME' | 'HOBBIES' | 'MIXED' | 'GENERAL';
  lead?: string;
  cards?: AICardData[];
  followUp?: string;
}

function parseAIResponse(raw: string): AIResponse | null {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned) as AIResponse;
  } catch { return null; }
}

// ── Shared UI Components ───────────────────────────────────────────────────────
const TagBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-gray-900 text-white">{label}</span>
);

const AICard: React.FC<{ card: AICardData }> = ({ card }) => (
  <div className="mb-3">
    {card.title && <p className="text-[11px] font-semibold uppercase tracking-widest opacity-40 mb-1.5">{card.title}</p>}
    {card.text && <p className="text-[15px] leading-relaxed mb-2">{card.text}</p>}
    {card.tags && card.tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag, i) => <TagBadge key={i} label={tag} />)}
      </div>
    )}
  </div>
);

// ── Project Detail Modal ───────────────────────────────────────────────────────
const ProjectDetailModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-7 relative max-h-[85vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-5 right-5 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      {project.category && (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 mb-3">
          {project.category}
        </span>
      )}
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">{project.title}</h2>
      {project.date && <p className="text-[12px] text-gray-400 mb-4">{project.date}</p>}
      {project.description && <p className="text-[14px] leading-relaxed text-gray-600 mb-5 whitespace-pre-wrap">{project.description}</p>}
      {project.tags && project.tags.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => <span key={i} className="px-3 py-1 rounded-full text-[12px] font-semibold bg-gray-900 text-white">{tag}</span>)}
          </div>
        </div>
      )}
      {project.links && project.links.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Links</p>
          <div className="flex flex-col gap-2">
            {project.links.map((link, i) => (
              <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] text-blue-600 hover:underline">
                <span className="material-symbols-outlined text-[14px]">link</span>
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  </div>
);

// ── Projects Carousel ──────────────────────────────────────────────────────────
const ProjectsCarousel: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selected, setSelected] = useState<Project | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });

  return (
    <>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {projects.map((p, i) => (
          <button key={p.id ?? i} onClick={() => setSelected(p)}
            className="shrink-0 w-44 text-left rounded-2xl bg-white border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
            style={{ height: '278px' }}>
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{p.category || 'Project'}</span>
                <span className="text-[10px] font-mono text-gray-300">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-gray-900 font-serif text-[16px] font-bold leading-snug mb-2 line-clamp-4 flex-1">{p.title}</p>
              {p.description && <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-3">{p.description}</p>}
              {p.tags && p.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-auto">
                  {p.tags.slice(0, 3).map((t, j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{t}</span>)}
                  {p.tags.length > 3 && <span className="text-[10px] text-gray-400">+{p.tags.length - 3}</span>}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <button onClick={() => scroll('left')} className="size-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
        <button onClick={() => scroll('right')} className="size-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
      <AnimatePresence>{selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </>
  );
};

// ── ConnectedProjectsCard — uses pre-fetched projects ──────────────────────────
const ProjectsCardFromData: React.FC<{ projects: Project[]; lead?: string; followUp?: string; textClass: string }> = ({ projects, lead, followUp, textClass }) => (
  <div className={`${textClass} space-y-3`}>
    {lead && <p className="text-[15px] leading-relaxed">{lead}</p>}
    {projects.length === 0 ? (
      <p className="text-[14px] opacity-50">No projects added yet.</p>
    ) : (
      <ProjectsCarousel projects={projects} />
    )}
    {followUp && <p className="text-[14px] mt-2 opacity-50 italic">{followUp}</p>}
  </div>
);

// ── Section Labels ─────────────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, string> = {
  SKILLS: '🛠 Skills',
  PROJECTS: '📁 Projects',
  PROFILE: '👤 About',
  CONTACT: '📬 Contact',
  HOBBIES: '🎯 Interests',
  GENERAL: '',
};

// ── AI Response Renderer (full logic from Preview) ─────────────────────────────
const AIResponseRenderer: React.FC<{ content: string; textClass: string; projects: Project[] }> = ({ content, textClass, projects }) => {
  const parsed = parseAIResponse(content);

  if (!parsed) {
    return <p className={`text-[15px] leading-relaxed ${textClass} whitespace-pre-wrap`}>{content}</p>;
  }

  const { type, lead, cards = [], followUp } = parsed;

  // PROJECTS type → use real data carousel
  if (type === 'PROJECTS') {
    return <ProjectsCardFromData projects={projects} lead={lead} followUp={followUp} textClass={textClass} />;
  }

  // For MIXED: group cards by section_type and render with section headers
  let renderedCards: React.ReactNode;
  if (type === 'MIXED' && cards.some(c => c.section_type)) {
    const groups: { section: string; items: AICardData[] }[] = [];
    cards.forEach(card => {
      const s = (card.section_type || 'GENERAL').toUpperCase();
      const last = groups[groups.length - 1];
      if (last && last.section === s) {
        last.items.push(card);
      } else {
        groups.push({ section: s, items: [card] });
      }
    });
    renderedCards = (
      <div className="space-y-6">
        {groups.map((group, gi) => (
          <div key={gi}>
            {SECTION_LABELS[group.section] && (
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-30 mb-3">
                {SECTION_LABELS[group.section]}
              </p>
            )}
            {group.section === 'PROJECTS' ? (
              <ProjectsCardFromData projects={projects} textClass={textClass} />
            ) : (
              <div className="space-y-4">
                {group.items.map((card, i) => <AICard key={i} card={card} />)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else if (cards.some(c => (c.section_type || '').toUpperCase() === 'PROJECTS')) {
    const nonProjectCards = cards.filter(c => (c.section_type || '').toUpperCase() !== 'PROJECTS');
    renderedCards = (
      <div className="space-y-4">
        {nonProjectCards.map((card, i) => <AICard key={i} card={card} />)}
        <ProjectsCardFromData projects={projects} textClass={textClass} />
      </div>
    );
  } else {
    renderedCards = (
      <div className="space-y-4">
        {cards.map((card, i) => <AICard key={i} card={card} />)}
      </div>
    );
  }

  return (
    <div className={`${textClass} space-y-1`}>
      {lead && <p className="text-[15px] leading-relaxed mb-4">{lead}</p>}
      {cards.length > 0 && renderedCards}
      {followUp && <p className="text-[14px] mt-4 opacity-50 italic">{followUp}</p>}
    </div>
  );
};

// ── THEMES ─────────────────────────────────────────────────────────────────────
const THEMES = {
  DEFAULT: {
    bg: 'bg-gray-50', text: 'text-gray-900', inputBg: 'bg-white', inputBorder: 'border-gray-200',
    inputText: 'text-gray-900 placeholder:text-gray-400', sendBtn: 'bg-gray-900 hover:bg-gray-800',
    chipBtn: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
    userBubble: 'bg-gray-900 text-white', aiBubble: 'bg-white text-gray-800 border border-gray-100 shadow-sm',
    typingDot: 'bg-gray-400', heroText: 'text-gray-900', subText: 'text-gray-500',
    card: 'bg-white border border-gray-100 shadow-sm', divider: 'border-gray-100',
  },
  DARK: {
    bg: 'bg-zinc-950', text: 'text-zinc-100', inputBg: 'bg-zinc-800', inputBorder: 'border-zinc-700',
    inputText: 'text-zinc-100 placeholder:text-zinc-500', sendBtn: 'bg-blue-600 hover:bg-blue-500',
    chipBtn: 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200',
    userBubble: 'bg-blue-600 text-white', aiBubble: 'bg-zinc-800 text-zinc-100 border border-zinc-700',
    typingDot: 'bg-zinc-500', heroText: 'text-white', subText: 'text-zinc-400',
    card: 'bg-zinc-900 border border-zinc-700', divider: 'border-zinc-800',
  },
  PLAYFUL: {
    bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50', text: 'text-gray-900',
    inputBg: 'bg-white/90', inputBorder: 'border-purple-200',
    inputText: 'text-gray-900 placeholder:text-purple-300',
    sendBtn: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    chipBtn: 'bg-white border border-purple-100 hover:bg-purple-50 text-purple-800',
    userBubble: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    aiBubble: 'bg-white text-gray-800 border border-purple-100 shadow-sm',
    typingDot: 'bg-purple-400',
    heroText: 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent',
    subText: 'text-purple-600', card: 'bg-white border border-purple-100 shadow-sm', divider: 'border-purple-100',
  },
} as const;
type ThemeKey = keyof typeof THEMES;

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:8080/api';

// ── Main Component ─────────────────────────────────────────────────────────────
const PublicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [toolboxConfig, setToolboxConfig] = useState<ToolboxConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = messages.length > 0 || isLoading;

  useEffect(() => {
    contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/v1/public/portfolio/${slug}`);
        const data = res.data;
        setPortfolio(data.portfolio);
        setToolboxConfig(data.tools ?? null);
        setProjects(data.projects ?? []);
        if (data.portfolio?.showModal && data.portfolio?.modalTitle) {
          setShowWelcomeModal(true);
        }
      } catch (err: any) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleSend = async (text?: string) => {
    const msg = text || inputValue;
    if (!msg.trim() || !slug) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInputValue('');
    setIsLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await axios.post(`${API_BASE}/v1/public/chat/${slug}`, { message: msg, history }, { timeout: 30000 });
      const payload = res.data?.data ?? res.data;
      setMessages(prev => [...prev, { role: 'assistant', content: payload.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Quick Actions (all 8 tools, same logic as PortfolioPreview) ──
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

  // ── Loading / Not Found ──
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="flex gap-2">{[0, 150, 300].map(d => <span key={d} className="size-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
    </div>
  );

  if (notFound || !portfolio) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <p className="text-6xl mb-4">🤔</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio not found</h1>
      <p className="text-gray-500">This portfolio doesn't exist or hasn't been published yet.</p>
    </div>
  );

  const themeKey: ThemeKey = (portfolio?.theme as ThemeKey) in THEMES ? (portfolio.theme as ThemeKey) : 'DEFAULT';
  const t = THEMES[themeKey];
  const profileGreeting = portfolio?.headline || 'Hello 👋';
  const userTitle = portfolio?.tagline || 'Portfolio';

  return (
    <div className={`${t.bg} ${t.text} font-sans h-screen flex flex-col relative overflow-hidden transition-colors duration-300`}>
      {portfolio?.cursorAnimation === 'FLUID' && <SplashCursor />}

      {/* ── Welcome Modal ─────────────────────────── */}
      {showWelcomeModal && portfolio?.modalTitle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowWelcomeModal(false)}>
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border p-8 ${themeKey === 'DARK' ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-gray-100 text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowWelcomeModal(false)} className={`absolute top-4 right-4 size-8 flex items-center justify-center rounded-full transition-colors ${themeKey === 'DARK' ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-gray-100 text-gray-400'}`}>
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-xl font-bold mb-3">{portfolio.modalTitle}</h2>
            {portfolio.modalContent && <p className={`text-sm leading-relaxed whitespace-pre-wrap ${themeKey === 'DARK' ? 'text-zinc-400' : 'text-gray-500'}`}>{portfolio.modalContent}</p>}
            <button onClick={() => setShowWelcomeModal(false)} className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'var(--accent-blue, #3b6feb)' }}>Got it</button>
          </div>
        </div>
      )}

      {/* ── Info button (re-open welcome modal) ─────── */}
      {portfolio?.modalTitle && (
        <button onClick={() => setShowWelcomeModal(true)} title="Welcome info" className={`fixed top-4 right-4 size-8 rounded-full flex items-center justify-center shadow-md z-40 transition-all hover:scale-105 ${themeKey === 'DARK' ? 'bg-zinc-800 border border-zinc-600 text-zinc-300' : 'bg-white border border-gray-200 text-gray-500'}`}>
          <span className="material-symbols-outlined text-[16px]">info</span>
        </button>
      )}

      {/* ══════════════════════════════════════════════
          IDLE STATE — Hero centered
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {!hasConversation && (
          <motion.div key="hero" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            {/* Avatar */}
            <motion.div
              className={`mb-6 ${portfolio?.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-[2rem]'} overflow-hidden shadow-2xl ring-1 ${themeKey === 'DARK' ? 'ring-white/10' : 'ring-gray-900/5'}`}
              style={{ width: 180, height: 180 }}>
              {portfolio?.avatarUrl
                ? <img src={portfolio.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : <div className={`w-full h-full flex items-center justify-center text-7xl font-black ${themeKey === 'DARK' ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-400'}`}>{profileGreeting.charAt(0).toUpperCase()}</div>
              }
            </motion.div>

            <h2 className={`text-lg font-serif italic mb-2 text-center ${t.subText}`}>
              {profileGreeting} <span className="not-italic">👋</span>
            </h2>
            <h1 className={`text-4xl md:text-5xl font-serif mb-10 text-center tracking-tight ${t.heroText}`}>{userTitle}</h1>

            {/* Chat input (idle) */}
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="w-full max-w-xl mb-8">
              <div className={`flex items-center h-14 rounded-full border ${t.inputBorder} ${t.inputBg} shadow-sm px-2 pl-6 gap-2 transition-all duration-300 ${inputFocused ? 'shadow-md ring-2 ring-gray-200' : ''}`}>
                <input ref={inputRef} className={`flex-1 bg-transparent outline-none text-[15px] ${t.inputText}`}
                  placeholder={portfolio?.chatPlaceholder || 'Ask me anything...'}
                  value={inputValue} onChange={e => setInputValue(e.target.value)}
                  onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
                <button type="submit" disabled={!inputValue.trim()} className={`size-10 rounded-full ${t.sendBtn} text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40`}>
                  <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                </button>
              </div>
            </form>

            {/* Quick action chips (idle — big cards) */}
            {quickActions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                {quickActions.map(btn => (
                  <button key={btn.id} onClick={() => handleSend(btn.q)}
                    className={`w-[90px] h-[90px] ${t.chipBtn} rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-md hover:-translate-y-0.5`}>
                    <span className="material-symbols-outlined text-[24px]">{btn.icon}</span>
                    <span className="text-[12px] font-semibold">{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          ACTIVE STATE — compact header + content + fixed bottom bar
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {hasConversation && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col overflow-hidden">
            {/* Compact avatar header */}
            <div className="flex flex-col items-center pt-5 pb-3 px-4 shrink-0">
              <motion.div
                initial={{ scale: 1.4, y: 30 }} animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className={`size-14 overflow-hidden shadow-lg ring-1 ${portfolio?.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-2xl'} ${themeKey === 'DARK' ? 'ring-white/10' : 'ring-gray-900/5'}`}>
                {portfolio?.avatarUrl
                  ? <img src={portfolio.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className={`w-full h-full flex items-center justify-center text-2xl font-black ${themeKey === 'DARK' ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-400'}`}>{profileGreeting.charAt(0).toUpperCase()}</div>
                }
              </motion.div>
            </div>

            {/* Scrollable conversation — ONLY latest Q&A */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4">
              <AnimatePresence initial={false}>
                {(() => {
                  const lastAiIdx = [...messages].map((m, i) => ({ m, i })).reverse().find(x => x.m.role === 'assistant')?.i;
                  if (lastAiIdx === undefined) return null;
                  const aiMsg = messages[lastAiIdx];
                  const userMsg = lastAiIdx > 0 && messages[lastAiIdx - 1]?.role === 'user' ? messages[lastAiIdx - 1] : null;
                  return (
                    <motion.div key={lastAiIdx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      className="w-full max-w-3xl mx-auto mb-8">
                      {userMsg && (
                        <div className="flex justify-center mb-4">
                          <span className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium shadow-sm max-w-sm text-center">{userMsg.content}</span>
                        </div>
                      )}
                      <AIResponseRenderer content={aiMsg.content} textClass={t.text} projects={projects} />
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl mx-auto py-2">
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map(delay => <span key={delay} className={`size-2.5 ${t.typingDot} rounded-full animate-bounce`} style={{ animationDelay: `${delay}ms` }} />)}
                  </div>
                </motion.div>
              )}
              <div ref={contentEndRef} />
            </div>

            {/* ── Fixed bottom bar ─── */}
            <div className="shrink-0 px-4 pt-3 pb-5">
              <div className="mx-auto transition-all duration-300" style={{ maxWidth: inputFocused ? '36rem' : '26rem' }}>

                {/* Quick action chips — only visible when input focused */}
                <AnimatePresence>
                  {inputFocused && quickActions.length > 0 && (
                    <motion.div key="chips"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {quickActions.map(btn => (
                          <button key={btn.id}
                            onMouseDown={e => { e.preventDefault(); handleSend(btn.q); }}
                            disabled={isLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${t.chipBtn} disabled:opacity-50`}>
                            <span className="material-symbols-outlined text-[14px]">{btn.icon}</span>
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat input */}
                <form onSubmit={e => { e.preventDefault(); handleSend(); }}>
                  <div className={`flex items-center rounded-full border ${t.inputBorder} ${t.inputBg} shadow-sm px-2 pl-6 gap-2 transition-all duration-300 ${inputFocused ? 'h-14 shadow-md' : 'h-11'}`}>
                    <input className={`flex-1 bg-transparent outline-none text-[15px] ${t.inputText}`}
                      placeholder={portfolio?.chatPlaceholder || 'Ask me anything...'}
                      value={inputValue} onChange={e => setInputValue(e.target.value)}
                      onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                      disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className={`rounded-full ${t.sendBtn} text-white flex items-center justify-center shrink-0 transition-all duration-300 disabled:opacity-40 ${inputFocused ? 'size-10' : 'size-7'}`}>
                      <span className={`material-symbols-outlined transition-all duration-300 ${inputFocused ? 'text-[16px]' : 'text-[14px]'}`}>arrow_upward</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Powered badge */}
      <div className={`fixed bottom-4 right-4 px-3 py-1.5 text-[11px] font-medium rounded-lg shadow-md opacity-60 hover:opacity-90 transition-opacity z-30 ${themeKey === 'DARK' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-gray-900 text-white'}`}>
        Powered by Profolio
      </div>
    </div>
  );
};

export default PublicPortfolioPage;
