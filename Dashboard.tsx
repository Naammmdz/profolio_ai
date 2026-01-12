import React, { useState } from 'react';
import AnimatedThemeToggler from './AnimatedThemeToggler';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardProps {
  onPreview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPreview }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'professional': true,
    'personal': false,
    'communication': false
  });
  
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({
    'personal': true,
    'projects': false,
    'skills': false,
    'hobbies': false,
    'contact': false,
    'resume': false,
    'video': false,
    'location': false
  });

  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Skill Modal State
  const [editingSkillCategory, setEditingSkillCategory] = useState<any>(null);
  const [tempSkillInput, setTempSkillInput] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleTool = (tool: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  // Project Handlers
  const handleCreateProject = () => {
    setEditingProject({
        isNew: true,
        title: '',
        category: 'WebApp',
        description: '',
        date: 'November 2025',
        tags: [],
        links: []
    });
  };

  const handleEditProject = (project: any) => {
    setEditingProject({
        ...project,
        isNew: false,
        category: 'WebApp',
        description: "This is a project for developing a full-stack AI Workspace solution under strict time constraints for NAVER Hackathon 2025.",
        date: "November 1st, 2025",
        tags: ["React", "Spring Boot 3.x", "PostgreSQL", "Docker", "Dokploy"]
    });
  };

  // Skill Handlers
  const handleCreateSkillCategory = () => {
    setEditingSkillCategory({
        isNew: true,
        title: '',
        skills: []
    });
    setTempSkillInput("");
  };

  const handleEditSkillCategory = (category: any) => {
    setEditingSkillCategory({
        ...category,
        isNew: false
    });
    setTempSkillInput("");
  };

  const handleAddSkill = () => {
    if (tempSkillInput.trim()) {
        setEditingSkillCategory((prev: any) => ({
            ...prev,
            skills: [...prev.skills, tempSkillInput.trim()]
        }));
        setTempSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditingSkillCategory((prev: any) => ({
        ...prev,
        skills: prev.skills.filter((s: string) => s !== skillToRemove)
    }));
  };

  return (
    <div className="bg-background text-primary font-sans h-screen flex overflow-hidden selection:bg-primary/10 transition-colors duration-300 relative">
      <style>{`
        input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #4f46e5;
            cursor: pointer;
            margin-top: -8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: var(--border);
            border-radius: 2px;
        }
        input[type=range]:focus {
            outline: none;
        }
        /* Toggle Switch Styles */
        .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--border);
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        input:checked + .slider {
            background-color: #4f46e5;
        }
        input:focus + .slider {
            box-shadow: 0 0 1px #4f46e5;
        }
        input:checked + .slider:before {
            -webkit-transform: translateX(20px);
            -ms-transform: translateX(20px);
            transform: translateX(20px);
        }
        /* Float Animation */
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        .apple-float {
            animation: float 4s ease-in-out infinite;
        }
        /* Modal Animation */
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in {
            animation: zoomIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
        }
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: var(--border);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: var(--text-muted);
        }
      `}</style>
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r border-border flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="size-6 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-sm">P</div>
              <span className="text-primary font-serif text-lg tracking-tight font-medium">Profolio</span>
            </div>
            <AnimatedThemeToggler />
          </div>
          <nav className="space-y-1 mb-8">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'dashboard' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${currentTab === 'dashboard' ? 'filled' : ''}`}>home</span>
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'analytics' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${currentTab === 'analytics' ? 'filled' : ''}`}>bar_chart</span>
              Analytics
            </button>
            <button 
              onClick={() => setCurrentTab('publish')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'publish' 
                  ? 'bg-surface-highlight text-primary' 
                  : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${currentTab === 'publish' ? 'filled' : ''}`}>rocket_launch</span>
              Publish
            </button>
          </nav>
          <div>
            <h3 className="px-3 text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Configure</h3>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentTab('basic-info')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                  currentTab === 'basic-info' 
                    ? 'bg-surface-highlight text-primary' 
                    : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[18px] ${currentTab === 'basic-info' ? 'filled' : ''}`}>globe</span>
                  Basic Info
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
              </button>
              <button 
                onClick={() => setCurrentTab('ai-personality')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                  currentTab === 'ai-personality' 
                    ? 'bg-surface-highlight text-primary' 
                    : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[18px] ${currentTab === 'ai-personality' ? 'filled' : ''}`}>smart_toy</span>
                  AI Personality
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
              </button>
              <button 
                onClick={() => setCurrentTab('tools')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                  currentTab === 'tools' 
                    ? 'bg-surface-highlight text-primary' 
                    : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[18px] ${currentTab === 'tools' ? 'filled' : ''}`}>construction</span>
                  Tools
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
              </button>
              <button 
                onClick={() => setCurrentTab('questions')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                  currentTab === 'questions' 
                    ? 'bg-surface-highlight text-primary' 
                    : 'text-text-muted hover:bg-surface-highlight hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[18px] ${currentTab === 'questions' ? 'filled' : ''}`}>help</span>
                  Questions
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[16px]">check</span>
              </button>
            </nav>
          </div>
          <button className="mt-8 w-full border border-border bg-background text-primary hover:bg-surface-highlight transition-colors rounded-lg py-2 text-sm font-medium shadow-sm">
            Share Portfolio
          </button>
        </div>
        <div className="p-6 border-t border-border bg-surface">
          <a className="flex items-center gap-2 text-xs text-text-muted hover:text-primary mb-4 group transition-colors" href="#">
            Suggest a feature
            <span className="material-symbols-outlined text-[10px] group-hover:translate-x-0.5 transition-transform">arrow_outward</span>
          </a>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-primary">Usage</span>
              <span className="text-xs text-text-muted">7/50</span>
            </div>
            <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[14%] rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-medium text-text-muted shrink-0">
              GN
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">Giang Nam</p>
              <p className="text-xs text-text-muted truncate">tagiangnamttg@gmail.com</p>
            </div>
            <span className="material-symbols-outlined text-text-muted text-[16px] cursor-pointer hover:text-primary">unfold_more</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative transition-colors duration-300">
        {currentTab === 'dashboard' && (
           <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
             <div className="hidden sm:block">
               <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
             </div>
             <div className="flex items-center gap-3 self-end sm:self-auto">
               <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                 <span className="size-1.5 rounded-full bg-orange-500"></span>
                 Draft
               </div>
               <button 
                 onClick={onPreview}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
               >
                 <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                 View portfolio
               </button>
               <button 
                 onClick={() => setCurrentTab('publish')}
                 className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
               >
                 Publish
               </button>
             </div>
           </div>
           <div className="mb-8">
             <h1 className="text-3xl font-bold text-primary mb-2">Hello Giang!</h1>
             <div className="flex items-center gap-2 text-sm text-text-muted font-mono">
               <span>https://www.profol.io/giang-nam</span>
               <button className="hover:text-primary transition-colors">
                 <span className="material-symbols-outlined text-[14px]">content_copy</span>
               </button>
             </div>
           </div>
           <div className="bg-surface border border-border rounded-xl p-8 mb-8 h-96 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
             <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none blur-sm scale-110">
               <div className="text-[120px] font-serif italic font-bold leading-none text-primary">I Cooked Apple</div>
             </div>
             <div className="relative z-10 text-center max-w-md">
               <h2 className="text-2xl font-bold text-primary mb-3">Portfolio in Draft Mode</h2>
               <p className="text-text-muted mb-8 leading-relaxed">Your portfolio is not published yet. Publish to make it accessible to everyone.</p>
               <button 
                 onClick={onPreview}
                 className="inline-flex items-center gap-2 bg-background hover:bg-surface-highlight border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
               >
                 Try it
                 <span className="material-symbols-outlined text-[16px]">open_in_new</span>
               </button>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors">
               <div className="flex items-end gap-1 mb-1">
                 <span className="text-3xl font-bold text-primary">6</span>
                 <span className="text-lg text-text-muted font-medium mb-1">/50</span>
               </div>
               <p className="text-sm text-text-muted">Total messages used</p>
             </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors">
               <div className="flex items-end gap-1 mb-1">
                 <span className="text-3xl font-bold text-primary">0</span>
               </div>
               <p className="text-sm text-text-muted">Messages today</p>
             </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/20 transition-colors group cursor-pointer">
               <div className="flex items-center gap-2 mb-2">
                 <span className="font-bold text-primary">Unlock Analytics</span>
                 <span className="material-symbols-outlined text-indigo-600 text-[18px]">crown</span>
               </div>
               <p className="text-sm text-text-muted group-hover:text-primary transition-colors">Upgrade to access</p>
             </div>
           </div>
           <div className="bg-surface border border-border rounded-xl p-6 shadow-sm mb-12">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-primary">Recent Visitor Questions</h3>
                 <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
               </div>
               <a className="flex items-center gap-1 text-xs font-medium text-primary hover:text-indigo-600 transition-colors" href="#">
                 View all
                 <span className="material-symbols-outlined text-[14px]">chevron_right</span>
               </a>
             </div>
             <div className="space-y-4">
               <div className="bg-surface-highlight rounded-lg p-4 hover:bg-border transition-colors border border-transparent hover:border-border cursor-pointer">
                 <p className="font-medium text-primary text-sm mb-2">Can you show me your resume or CV?</p>
                 <div className="flex items-center gap-3 text-xs text-text-muted">
                   <span>1d ago</span>
                   <span className="size-1 rounded-full bg-text-muted"></span>
                   <span>Ho Chi Minh City, Vietnam</span>
                 </div>
               </div>
               <div className="bg-surface-highlight rounded-lg p-4 hover:bg-border transition-colors border border-transparent hover:border-border cursor-pointer">
                 <p className="font-medium text-primary text-sm mb-2">What are your passions?</p>
                 <div className="flex items-center gap-3 text-xs text-text-muted">
                   <span>2d ago</span>
                   <span className="size-1 rounded-full bg-text-muted"></span>
                   <span>London, UK</span>
                 </div>
               </div>
             </div>
           </div>
           <div className="mb-12">
             <h3 className="text-sm text-text-muted font-medium mb-4">Quick Actions</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <button onClick={() => setCurrentTab('basic-info')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                 <span className="material-symbols-outlined text-teal-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">globe</span>
                 <span className="text-sm font-medium text-primary">Basic Info</span>
               </button>
               <button onClick={() => setCurrentTab('ai-personality')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                 <span className="material-symbols-outlined text-green-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">smart_toy</span>
                 <span className="text-sm font-medium text-primary">AI Personality</span>
               </button>
               <button onClick={() => setCurrentTab('tools')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                 <span className="material-symbols-outlined text-purple-600 text-[24px] mb-2 group-hover:scale-110 transition-transform">construction</span>
                 <span className="text-sm font-medium text-primary">Tools</span>
               </button>
               <button onClick={() => setCurrentTab('questions')} className="flex flex-col items-center justify-center py-6 px-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                 <span className="material-symbols-outlined text-rose-500 text-[24px] mb-2 group-hover:scale-110 transition-transform">help</span>
                 <span className="text-sm font-medium text-primary">Questions</span>
               </button>
             </div>
           </div>
           <footer className="mt-auto border-t border-border pt-8 pb-4">
             <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
               <div className="flex items-center gap-2">
                 <span className="font-medium text-primary">Profolio</span>
                 <span>© 2025</span>
               </div>
               <div className="flex gap-6">
                 <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                 <a className="hover:text-primary transition-colors" href="#">Billing</a>
                 <a className="hover:text-primary transition-colors" href="#">Support</a>
               </div>
               <div className="flex gap-6">
                 <a className="hover:text-primary transition-colors" href="#">Terms</a>
                 <a className="hover:text-primary transition-colors" href="#">Privacy</a>
               </div>
             </div>
           </footer>
         </div>
        )}

        {/* ... (Existing code for other tabs: publish, basic-info, ai-personality) ... */}
        {/* Note: Preserving the full structure of other tabs as before */}
        
        {currentTab === 'publish' && (
          <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  Draft
                </div>
                <button 
                  onClick={onPreview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View portfolio
                </button>
                <button className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Publish
                </button>
              </div>
            </div>
            {/* ... rest of publish tab content ... */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Preview &amp; Publish</h1>
              <p className="text-text-muted text-sm">Review your portfolio and make it live</p>
            </div>
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-primary mb-1">Portfolio Checklist</h2>
                  <p className="text-sm text-text-muted">Your portfolio is ready to publish!</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                    </div>
                    <span className="text-sm font-medium text-primary">Basic Information</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                    </div>
                    <span className="text-sm font-medium text-primary">AI Personality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                    </div>
                    <span className="text-sm font-medium text-primary">Tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                    </div>
                    <span className="text-sm font-medium text-primary">Suggested Questions</span>
                    <span className="bg-surface-highlight text-text-muted text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">8</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[20px]">language</span>
                  <h2 className="text-base font-bold text-primary">Custom Domain</h2>
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">crown</span> Pro
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-6">Use your own domain instead of profol.io/giang-nam</p>
                <div className="mb-6">
                  <div className="bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-muted flex justify-between items-center bg-opacity-50 cursor-not-allowed">
                    <span>Custom domains are available for Pro users.</span>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Upgrade to Pro
                </button>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-primary mb-1">Portfolio Preview</h2>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-primary">Show Profolio Badge</h3>
                    <p className="text-xs text-text-muted mt-1">Required for free plan</p>
                  </div>
                </div>
                <div className="self-end mb-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" disabled={true} defaultChecked={true} type="checkbox" />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 opacity-60 cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-0 overflow-hidden shadow-sm relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/10 to-blue-500/5 pointer-events-none"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-base font-bold text-primary">Publish</h2>
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">crown</span> Pro
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-6">Your portfolio is ready!</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Publish now
                  </button>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setCurrentTab('dashboard')}
                  className="text-sm font-medium text-primary hover:text-indigo-600 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
            <footer className="mt-16 border-t border-border pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">Profolio</span>
                  <span>© 2025</span>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <a className="hover:text-primary transition-colors" href="#">Billing</a>
                  <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentTab === 'basic-info' && (
          <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  Draft
                </div>
                <button 
                  onClick={onPreview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View portfolio
                </button>
                <button 
                  onClick={() => setCurrentTab('publish')}
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Publish
                </button>
              </div>
            </div>
            {/* ... rest of basic info ... */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Portfolio Settings</h1>
              <p className="text-text-muted text-sm">Customize your portfolio's appearance and settings</p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-8 mb-6 flex flex-col items-center justify-center min-h-[400px] relative shadow-sm">
              <div className="absolute top-4 right-4">
                <span className="material-symbols-outlined text-text-muted cursor-help" title="Preview Mode">info</span>
              </div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-1">
                  Hello everyone <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8">James Martin</h2>
                <div className="size-32 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-10 shadow-lg relative group cursor-pointer transition-transform hover:scale-105">
                  <span className="text-primary-foreground text-lg font-medium">Avatar</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
                </div>
                <div className="w-full max-w-md mx-auto relative">
                  <input className="w-full pl-4 pr-10 py-3 rounded-full border border-border bg-background focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-shadow shadow-sm text-primary" disabled placeholder="Ask me anything..." type="text"/>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-base font-bold text-primary mb-1">Avatar</h2>
                    <p className="text-sm text-text-muted">Configure your profile picture for the chat interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox"/>
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex bg-surface-highlight rounded-lg p-1">
                    <button className="px-4 py-1.5 bg-background shadow-sm rounded-md text-sm font-medium text-primary">Squared</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors">Rounded</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-surface-highlight rounded-lg overflow-hidden border border-border">
                      <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface">
                        <span className="material-symbols-outlined text-[32px]">person</span>
                      </div>
                    </div>
                    <div>
                      <button className="text-sm font-medium text-primary hover:text-indigo-600 transition-colors mb-1">Upload Avatar</button>
                      <p className="text-xs text-text-muted">Click to upload • Square crop • Min 200x200px</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-primary mb-1">Appearance</h2>
                  <p className="text-sm text-text-muted">Choose a visual theme for your portfolio</p>
                </div>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Theme</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-background border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                        <option value="default">Default - Clean and minimal</option>
                        <option value="dark">Dark - Professional and sleek</option>
                        <option value="playful">Playful - Colorful and friendly</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Cursor Animation</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-background border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                        <option value="fluid">Fluid</option>
                        <option value="solid">Solid</option>
                        <option value="none">None</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-24 w-full rounded-lg bg-surface-highlight border border-border flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 via-purple-200/40 to-indigo-200/40 blur-xl opacity-70"></div>
                    <span className="text-xs text-text-muted relative z-10">Animation Preview</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-primary mb-1">Landing Page</h2>
                  <p className="text-sm text-text-muted">Customize the first impression visitors have of your portfolio</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Portfolio Headline (optional)</label>
                    <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-text-muted" placeholder="Leave empty to use default: Hey, I'm {name} 👋" type="text"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Welcome Tagline</label>
                    <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Backend Developer"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Chat Input Placeholder</label>
                    <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Ask me anything..."/>
                  </div>
                  <div className="pt-2 border-t border-border mt-2">
                    <div className="flex justify-between items-center mb-4 mt-4">
                      <label className="block text-sm font-medium text-primary">Welcome Modal</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox"/>
                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Modal Title</label>
                        <input className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" type="text" defaultValue="Welcome to AI Portfolio"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Modal Content</label>
                        <textarea className="w-full bg-background border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm min-h-[100px] resize-y" defaultValue="This is an AI-powered portfolio that adapts to your questions. Ask me anything about my work, skills, or experience!"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm mt-4">
                Save
              </button>
            </div>
            
            <footer className="mt-16 border-t border-border pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">Profolio</span>
                  <span>© 2025</span>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <a className="hover:text-primary transition-colors" href="#">Billing</a>
                  <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentTab === 'ai-personality' && (
          <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  Draft
                </div>
                <button 
                  onClick={onPreview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View portfolio
                </button>
                <button 
                  onClick={() => setCurrentTab('publish')}
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Publish
                </button>
              </div>
            </div>
            {/* ... rest of ai-personality content ... */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">AI Personality</h1>
              <p className="text-text-muted text-sm">Define how your AI twin communicates and represents you</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-8 mb-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-base font-bold text-primary mb-1">Communication Vibe</h2>
                <p className="text-sm text-text-muted">Slide to set your AI's personality temperature</p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-primary">Business Casual</h3>
                  <span className="bg-surface-highlight text-primary text-xs font-medium px-2.5 py-1 rounded border border-border">Balanced</span>
                </div>
                <div className="relative w-full mb-2">
                  <input className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer" max="100" min="0" step="1" type="range" defaultValue="50"/>
                  <div className="absolute top-1/2 left-0 h-1 bg-indigo-500 rounded-l-lg -translate-y-1/2 pointer-events-none" style={{width: '50%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-2 font-medium">
                  <span>Formal</span>
                  <span>Balanced</span>
                  <span>Energetic</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              
              {/* Professional Identity */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                <button 
                  onClick={() => toggleSection('professional')}
                  className="w-full flex items-center justify-between p-6 bg-surface hover:bg-surface-highlight transition-colors text-left group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Professional Identity</h3>
                      <span className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-full p-0.5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">Your work and achievements</p>
                  </div>
                  <span className={`material-symbols-outlined text-text-muted group-hover:text-primary transition-transform duration-200 ${expandedSections['professional'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {expandedSections['professional'] && (
                  <div className="p-6 pt-0 border-t border-border">
                    <div className="space-y-6 mt-6">
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">What do you do? <span className="text-red-500">*</span></label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]" 
                          rows={2}
                          defaultValue="Java Backend Developer Trainee at FPT Software"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">Your superpower skills</label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]"
                          rows={2}
                          defaultValue="Java, Spring Framework, PostgreSQL, Redis, Docker, RabbitMQ, RESTful APIs, JWT authentication"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">Your biggest flex</label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]"
                          rows={2}
                          defaultValue="I was recognized as one of the Top 100 Outstanding Students in Fall Semester 2024."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Side */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                <button 
                  onClick={() => toggleSection('personal')}
                  className="w-full flex items-center justify-between p-6 bg-surface hover:bg-surface-highlight transition-colors text-left group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Personal Side</h3>
                      <span className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-full p-0.5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">What makes you, you</p>
                  </div>
                  <span className={`material-symbols-outlined text-text-muted group-hover:text-primary transition-transform duration-200 ${expandedSections['personal'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {expandedSections['personal'] && (
                  <div className="p-6 pt-0 border-t border-border">
                    <div className="space-y-6 mt-6">
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">What drives you? <span className="text-red-500">*</span></label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]" 
                          rows={2}
                          defaultValue="I believe in continuous learning and the importance of teamwork to achieve impactful results."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">Outside of work, you can find me...</label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]"
                          rows={2}
                          defaultValue="I enjoy coding personal projects, participating in hackathons, and keeping up with emerging technologies."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">One thing that makes you unique</label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]"
                          rows={2}
                          defaultValue="I thrive under pressure and excel at problem-solving in fast-paced environments."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Communication Style */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                <button 
                  onClick={() => toggleSection('communication')}
                  className="w-full flex items-center justify-between p-6 bg-surface hover:bg-surface-highlight transition-colors text-left group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Communication Style</h3>
                      <span className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-full p-0.5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">How you connect with others</p>
                  </div>
                  <span className={`material-symbols-outlined text-text-muted group-hover:text-primary transition-transform duration-200 ${expandedSections['communication'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {expandedSections['communication'] && (
                  <div className="p-6 pt-0 border-t border-border">
                    <div className="space-y-6 mt-6">
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">How do you typically communicate? <span className="text-red-500">*</span></label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]" 
                          rows={2}
                          defaultValue="I communicate openly and collaborate effectively with team members, valuing diverse perspectives."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2">Topics you love discussing</label>
                        <textarea 
                          className="w-full p-3 rounded-lg border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-primary bg-background resize-y min-h-[50px]"
                          rows={2}
                          defaultValue="I am passionate about Backend Development, software architecture, and algorithm optimization."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-primary mb-1">Personal Touch</h2>
                <p className="text-sm text-text-muted">Tell your AI more about yourself</p>
              </div>
              <div className="bg-transparent border-0 rounded-xl p-0 shadow-none">
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-2">For example:</p>
                  <ul className="text-sm text-text-muted space-y-1 list-disc pl-4 marker:text-text-muted">
                    <li><span className="font-medium text-primary">Life context:</span> "I have two cats named Docker and Kubernetes", "Living in Berlin for 3 years", "Just became a dad"</li>
                    <li><span className="font-medium text-primary">Background:</span> "Former professional athlete", "Self-taught developer", "Started coding at 25"</li>
                    <li><span className="font-medium text-primary">Personality traits:</span> "I love dad jokes", "Coffee addict", "Night owl", "Always use sports analogies"</li>
                    <li><span className="font-medium text-primary">Current situation:</span> "Looking for remote opportunities", "Building my third startup", "Open to freelance projects"</li>
                    <li><span className="font-medium text-primary">Fun facts:</span> "Speak 4 languages", "Marathon runner", "Play jazz piano", "Competitive chess player"</li>
                    <li><span className="font-medium text-primary">Preferences:</span> "Prefer async communication", "Love pair programming", "Big fan of clean code"</li>
                  </ul>
                </div>
                <div className="relative">
                  <textarea className="w-full h-40 p-4 rounded-lg border border-border bg-background focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-mono text-primary resize-none shadow-sm placeholder:text-text-muted" placeholder="I have a golden retriever named Pixel who often joins my video calls..." defaultValue="I have a golden retriever named Pixel who often joins my video calls..."></textarea>
                  <div className="absolute bottom-2 right-2">
                    <span className="material-symbols-outlined text-text-muted text-[14px]">drag_handle</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-2">The more personal details you share, the more authentic and engaging your AI conversations will be</p>
              </div>
            </div>
            <hr className="border-border mb-8"/>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Save
            </button>
            <footer className="mt-16 border-t border-border pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">Profolio</span>
                  <span>© 2025</span>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <a className="hover:text-primary transition-colors" href="#">Billing</a>
                  <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentTab === 'tools' && (
          <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  Draft
                </div>
                <button 
                  onClick={onPreview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View portfolio
                </button>
                <button 
                  onClick={() => setCurrentTab('publish')}
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Publish
                </button>
              </div>
            </div>
            {/* ... rest of tools content ... */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-primary">Tools</h1>
                <label className="switch scale-90 origin-left">
                  <input defaultChecked type="checkbox"/>
                  <span className="slider"></span>
                </label>
                <span className="text-sm font-medium text-primary -ml-2">Enabled</span>
              </div>
              <p className="text-text-muted text-sm">Configure the tools your AI can use to answer questions</p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-0 mb-8 shadow-sm h-[320px] relative overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 relative">
                  <span className="material-symbols-outlined text-[64px] text-primary apple-float">smart_toy</span>
                  <div className="absolute -bottom-4 right-0 pointer-events-none">
                    <svg className="w-6 h-6 text-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6z" stroke="white" strokeWidth="1"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
                <div className="bg-background rounded-full border border-border shadow-sm p-1.5 pl-4 flex items-center">
                  <span className="text-sm text-text-muted flex-1">Ask me anything</span>
                  <div className="size-7 bg-indigo-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-600 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Me (personal info) */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Me (personal info)</h3>
                      <span className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-full p-0.5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">Basic information about you - name, photo, bio</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('personal')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['personal'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['personal'] && (
                  <div className="p-6 border-t border-border">
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-primary mb-2">Presentation Photo</h4>
                        <p className="text-xs text-text-muted mb-3">This photo will be displayed in the presentation tool</p>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-text-muted text-4xl mb-2">image</span>
                        <p className="text-sm text-text-muted mb-1">Drop image here or <span className="text-indigo-600 font-medium">browse</span></p>
                        <p className="text-[10px] text-text-muted">Square format recommended • PNG, JPG or GIF (max. 2MB)</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="col-span-1">
                        <label className="block text-xs font-bold text-primary mb-1.5">Name <span className="text-red-500">*</span></label>
                        <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" type="text" defaultValue="Ta Giang Nam"/>
                        </div>
                        <div className="col-span-1">
                        <label className="block text-xs font-bold text-primary mb-1.5">Age</label>
                        <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" type="text" defaultValue="19"/>
                        </div>
                        <div className="col-span-1">
                        <label className="block text-xs font-bold text-primary mb-1.5">Location</label>
                        <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" type="text" defaultValue="District 9, Ho Chi Minh City, Vietnam"/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-primary mb-1.5">Introduction <span className="text-red-500">*</span></label>
                        <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary min-h-[100px] resize-y" defaultValue="I am a high-achieving Software Engineering student passionate about Backend Systems and Algorithmic Problem Solving. I am eager to join a high-growth product team to tackle challenging technical problems and deliver user-centric value." />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-primary mb-1.5">Tags</label>
                        <div className="p-2 border border-border rounded-lg bg-background mb-3">
                            <input className="w-full text-sm outline-none bg-transparent text-primary" placeholder="Type tags (e.g., SaaS Builder, Developer, Student...)" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                        {['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'RabbitMQ', 'Redis'].map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-highlight rounded-full text-xs font-medium text-primary">
                                {tag} <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">close</span>
                            </span>
                        ))}
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Presentation Information
                    </button>
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Projects</h3>
                    </div>
                    <p className="text-sm text-text-muted">Showcase your portfolio projects and work</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('projects')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['projects'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['projects'] && (
                  <div className="p-6 border-t border-border">
                    <div className="space-y-4 mb-6">
                        {[
                            { title: "NAVER Hackathon 2025", desc: "WebApp • React, Spring Boot 3.x, PostgreSQL +2 more" },
                            { title: "Developer Bookmark Manager", desc: "WebApp • React 18+/TypeScript, Spring Boot 3.x, MS SQL Server +1 more" },
                            { title: "School Medical Management System", desc: "WebApp • React.js, Spring Boot, MS SQL Server +1 more" },
                            { title: "Apple Product E-commerce", desc: "WebApp • JSP, Java Servlets, SQL Server +2 more" }
                        ].map((project, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-surface-highlight transition-colors bg-background">
                                <div>
                                    <h4 className="text-sm font-bold text-primary">{project.title}</h4>
                                    <p className="text-xs text-text-muted mt-0.5">{project.desc}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => handleEditProject(project)}
                                      className="text-xs font-medium text-primary hover:text-indigo-600 transition-colors"
                                    >Edit</button>
                                    <button className="text-text-muted hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleCreateProject}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Project
                    </button>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Skills</h3>
                    </div>
                    <p className="text-sm text-text-muted">Your technical and soft skills</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('skills')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['skills'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['skills'] && (
                  <div className="p-6 border-t border-border">
                    <div className="space-y-6 mb-6">
                        {[
                            { title: "Languages", skills: ["Java", "Basic HTML", "CSS", "JavaScript", "Data Structures & Algorithms (DSA)", "Object-Oriented Programming (OOP)"] },
                            { title: "Frameworks", skills: ["Spring Framework (Spring Boot, Spring MVC, Spring Data JPA, Spring Security)", "Quarkus"] },
                            { title: "Databases", skills: ["MS SQL Server", "PostgreSQL", "Redis"] },
                            { title: "Tools", skills: ["Git", "Docker", "Maven", "RabbitMQ", "Postman", "Swagger", "IDE (IntelliJ IDEA, VS Code)"] }
                        ].map((cat, i) => (
                            <div key={i} className="p-4 border border-border rounded-xl bg-background">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-primary">{cat.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEditSkillCategory(cat)}
                                            className="text-xs font-medium text-primary hover:text-indigo-600 transition-colors"
                                        >Edit</button>
                                        <button className="text-text-muted hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {cat.skills.map((skill, j) => (
                                        <span key={j} className="inline-flex px-3 py-1 bg-surface-highlight rounded-full text-xs font-medium text-primary border border-border">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleCreateSkillCategory}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Category
                    </button>
                  </div>
                )}
              </div>

              {/* Fun & Hobbies */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Fun &amp; Hobbies</h3>
                    </div>
                    <p className="text-sm text-text-muted">Fun facts, hobbies, and photos</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('hobbies')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['hobbies'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['hobbies'] && (
                  <div className="p-6 border-t border-border">
                    <div className="space-y-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Title</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., My Adventures"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                            <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary min-h-[100px] resize-y" placeholder="Tell something fun about yourself..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Photos (Max 3)</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-text-muted text-4xl mb-2">image</span>
                                <p className="text-sm font-medium text-primary mb-1">Drop your photos here</p>
                                <p className="text-[10px] text-text-muted mb-4">PNG, JPG or GIF (max. 5MB per file)<br/>3 photos remaining</p>
                                <button className="bg-background border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-highlight transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">upload</span>
                                    Select photos
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Fun Section
                    </button>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Contact</h3>
                    </div>
                    <p className="text-sm text-text-muted">Contact information and social links</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('contact')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['contact'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['contact'] && (
                  <div className="p-6 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">Name</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="Ta Giang Nam"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">Email</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="tagiangnamttg@gmail.com"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">Phone</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="0886545188"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">Handle/Username</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="tagiangnam"/>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-primary mb-1.5">Address</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="District 9, Ho Chi Minh City, Vietnam"/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-xs font-bold text-primary">Social Links</label>
                            <button className="text-xs font-medium text-primary border border-border bg-background px-3 py-1.5 rounded-lg hover:bg-surface-highlight flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-[14px]">add</span> Add Social
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1/3">
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="GitHub"/>
                            </div>
                            <div className="flex-1">
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="https://github.com/Naammmdz"/>
                            </div>
                            <button className="text-text-muted hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Contact Information
                    </button>
                  </div>
                )}
              </div>

              {/* Resume/CV */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Resume/CV</h3>
                    </div>
                    <p className="text-sm text-text-muted">Your downloadable resume or CV</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('resume')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['resume'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['resume'] && (
                  <div className="p-6 border-t border-border">
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-primary mb-2">Resume File (PDF)</label>
                        <div className="border border-border border-dashed rounded-xl p-6 flex items-center gap-4 bg-surface-highlight">
                            <div className="size-12 bg-background border border-border rounded-lg flex items-center justify-center text-text-muted shrink-0">
                                <span className="material-symbols-outlined text-2xl">description</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary truncate">1d4c6a1c-ca55-4f07-bd6e-3581267171ec-resume-1767636095635.pdf</p>
                                <p className="text-xs text-text-muted">0.31 MB</p>
                            </div>
                            <button className="size-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-primary mb-1.5">Title</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="Ta Giang Nam - Backend Developer"/>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="Backend Developer with a passion for solving technical challenges"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">File Type</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface-highlight text-sm text-text-muted cursor-not-allowed" readOnly defaultValue="PDF"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">Last Updated</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface-highlight text-sm text-text-muted cursor-not-allowed" readOnly defaultValue="January 2026"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-primary mb-1.5">File Size</label>
                            <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface-highlight text-sm text-text-muted cursor-not-allowed" readOnly defaultValue="0.31 MB"/>
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Resume Information
                    </button>
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Video</h3>
                    </div>
                    <p className="text-sm text-text-muted">Showcase a video of what you want!</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('video')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['video'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['video'] && (
                  <div className="p-6 border-t border-border">
                    <div className="mb-6">
                        <div className="w-full aspect-video bg-surface-highlight rounded-xl flex items-center justify-center border border-border mb-6">
                            <span className="material-symbols-outlined text-text-muted text-4xl">videocam</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Title <span className="text-red-500">*</span></label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Enter video title"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Video URL <span className="text-red-500">*</span></label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="https://youtube.com/watch?v=..."/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Description (optional)</label>
                                <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary resize-y min-h-[80px]" placeholder="Brief description of the video" />
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Video
                    </button>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-full flex items-center justify-between p-6 bg-surface">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-primary">Location</h3>
                    </div>
                    <p className="text-sm text-text-muted">Display your location on an interactive map</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                      Try it
                    </button>
                    <label className="switch scale-90">
                      <input defaultChecked type="checkbox"/>
                      <span className="slider"></span>
                    </label>
                    <span 
                      onClick={() => toggleTool('location')}
                      className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['location'] ? 'rotate-180' : ''}`}
                    >expand_more</span>
                  </div>
                </div>
                {expandedTools['location'] && (
                  <div className="p-6 border-t border-border">
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Search for a location</label>
                            <div className="relative">
                                <input className="w-full py-2 pl-4 pr-10 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Start typing a city name..."/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-lg">search</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-primary mb-1.5">City</label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., Paris"/>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-primary mb-1.5">Country</label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., France"/>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Save Location
                    </button>
                  </div>
                )}
              </div>
            </div>
            <footer className="mt-16 border-t border-border pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">Profolio</span>
                  <span>© 2025</span>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <a className="hover:text-primary transition-colors" href="#">Billing</a>
                  <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentTab === 'questions' && (
          <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">dock_to_left</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  Draft
                </div>
                <button 
                  onClick={onPreview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View portfolio
                </button>
                <button 
                  onClick={() => setCurrentTab('publish')}
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Publish
                </button>
              </div>
            </div>
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
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">About Me</h3>
                  <p className="text-xs text-text-muted">2 questions</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="Who are you?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="What are your passions?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">Professional</h3>
                  <p className="text-xs text-text-muted">2 questions</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="Can I see your resume?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="Why should I hire you?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">Projects</h3>
                  <p className="text-xs text-text-muted">1 question</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="What projects are you most proud of?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">Skills</h3>
                  <p className="text-xs text-text-muted">1 question</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="What are your skills?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">Fun &amp; Personal</h3>
                  <p className="text-xs text-text-muted">1 question</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="What's the craziest thing you've ever done?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-primary">Contact</h3>
                  <p className="text-xs text-text-muted">1 question</p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input className="w-full py-2.5 pl-4 pr-20 rounded-lg border border-border text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary bg-background" readOnly type="text" value="How can I reach you?"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-highlight text-text-muted text-[10px] font-medium px-1.5 py-0.5 rounded border border-border">Default</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Question
              </button>
              <button className="px-6 border border-border bg-background hover:bg-surface-highlight text-primary py-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Reset to Defaults
              </button>
            </div>
            <footer className="mt-16 border-t border-border pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">Profolio</span>
                  <span>© 2025</span>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <a className="hover:text-primary transition-colors" href="#">Billing</a>
                  <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
                <div className="flex gap-6">
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentTab === 'analytics' && (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="size-16 bg-surface-highlight rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-text-muted text-3xl">bar_chart</span>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Analytics Coming Soon</h2>
            <p className="text-text-muted mb-8">Track your portfolio performance in the upcoming release.</p>
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Edit/Create Project Modal */}
        {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0 z-10">
                        <h2 className="text-xl font-bold text-primary">
                            {editingProject.isNew ? 'Create Project' : 'Edit Project'}
                        </h2>
                        <button onClick={() => setEditingProject(null)} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        {/* Title & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Title <span className="text-red-500">*</span></label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={editingProject.title} placeholder="Project Title" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Category</label>
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={editingProject.category} placeholder="e.g., WebApp, Mobile App" />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                            <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary min-h-[100px] resize-y" rows={4} defaultValue={editingProject.description} placeholder="Describe your project..." />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Project Date</label>
                            <div className="relative">
                                <select className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary appearance-none" defaultValue={editingProject.date}>
                                    <option>November 1st, 2025</option>
                                    <option>October 2025</option>
                                    <option>September 2025</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-muted">
                                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Image */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Preview Image</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[160px]">
                                <span className="material-symbols-outlined text-text-muted text-5xl mb-3">image</span>
                                <p className="text-sm text-text-muted mb-1">Drop image here or <span className="text-indigo-600 font-medium hover:underline">browse</span></p>
                                <p className="text-[10px] text-text-muted">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Tech Stack (or tags)</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editingProject.tags && editingProject.tags.map((tag: string, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-highlight rounded-full text-xs font-bold text-primary border border-border">
                                        {tag} <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-500 transition-colors">close</span>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="React, Node.js, TypeScript..." />
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg text-sm font-bold transition-colors">Add</button>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Links</label>
                            <div className="space-y-3">
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Link name (e.g., GitHub)" />
                                <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="https://..." />
                                <button className="w-full bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 py-2.5 rounded-lg text-sm font-medium transition-colors">Add Link</button>
                            </div>
                        </div>

                        {/* Project Images */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Project Images (Max 5)</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer min-h-[120px]">
                                <span className="material-symbols-outlined text-text-muted text-4xl mb-2">upload</span>
                                <p className="text-sm text-text-muted mb-1">Drop images here or <span className="text-indigo-600 font-medium hover:underline">browse</span></p>
                                <p className="text-[10px] text-text-muted">5 images remaining</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-surface shrink-0 z-10 flex justify-end gap-3">
                        <button onClick={() => setEditingProject(null)} className="px-6 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors">Cancel</button>
                        <button onClick={() => setEditingProject(null)} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm">
                            {editingProject.isNew ? 'Create Project' : 'Save Project'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Edit/Create Skill Category Modal */}
        {editingSkillCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-surface w-full max-w-lg max-h-[90vh] rounded-xl shadow-2xl border border-border flex flex-col animate-zoom-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border bg-surface shrink-0 z-10">
                        <h2 className="text-xl font-bold text-primary">
                            {editingSkillCategory.isNew ? 'Create Skill Category' : 'Edit Skill Category'}
                        </h2>
                        <button onClick={() => setEditingSkillCategory(null)} className="size-8 flex items-center justify-center rounded-full bg-surface-highlight hover:bg-border transition-colors text-text-muted hover:text-primary">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Category Name</label>
                            <input 
                                className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" 
                                value={editingSkillCategory.title} 
                                onChange={(e) => setEditingSkillCategory({...editingSkillCategory, title: e.target.value})}
                                placeholder="e.g. Languages, Frameworks" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Skills</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editingSkillCategory.skills.map((skill: string, i: number) => (
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
                        <button onClick={() => setEditingSkillCategory(null)} className="px-6 py-2.5 rounded-lg border border-border text-primary hover:bg-surface-highlight font-medium text-sm transition-colors">Cancel</button>
                        <button onClick={() => setEditingSkillCategory(null)} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm">
                            Save Category
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;