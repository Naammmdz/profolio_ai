import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTab from './tabs/DashboardTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PublishTab from './tabs/PublishTab';
import ProjectModal from './modals/ProjectModal';
import SkillCategoryModal from './modals/SkillCategoryModal';
import BasicInfoTab from './tabs/BasicInfoTab';
import AIPersonalityTab from './tabs/AIPersonalityTab';
import ToolsTab from './tabs/ToolsTab';
import QuestionsTab from './tabs/QuestionsTab';
import OnboardingModal from './modals/OnboardingModal';

type Tab = 'dashboard' | 'analytics' | 'publish' | 'basic-info' | 'ai-personality' | 'tools' | 'questions';

interface DashboardProps {
  onPreview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPreview }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Show onboarding only if not completed before
    return localStorage.getItem('profolio_onboarding_completed') !== 'true';
  });
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingSkillCategory, setEditingSkillCategory] = useState<any>(null);
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

  const handleSaveProject = (project: any) => {
    // TODO: Implement save logic with API
    console.log('Saving project:', project);
    setEditingProject(null);
  };

  // Skill Handlers
  const handleCreateSkillCategory = () => {
    setEditingSkillCategory({
      isNew: true,
      title: '',
      skills: []
    });
  };

  const handleEditSkillCategory = (category: any) => {
    setEditingSkillCategory({
      ...category,
      isNew: false
    });
  };

  const handleSaveSkillCategory = (category: any) => {
    // TODO: Implement save logic with API
    console.log('Saving skill category:', category);
    setEditingSkillCategory(null);
  };

  // Tab navigation handler to keep typing simple for children
  const handleNavigate = (tab: Tab) => {
    setCurrentTab(tab);
  };

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
            background: var(--background);
            border: 2px solid var(--primary);
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
            background-color: var(--background);
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        input:checked + .slider {
            background-color: var(--primary);
        }
        input:checked + .slider:before {
            background-color: var(--background);
        }
        input:focus + .slider {
            box-shadow: 0 0 1px var(--primary);
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

      <DashboardSidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background bg-grid relative transition-colors duration-300">
        {currentTab === 'dashboard' && (
          <DashboardTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsTab onNavigate={handleNavigate} />
        )}

        {currentTab === 'publish' && (
          <PublishTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'basic-info' && (
          <BasicInfoTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'ai-personality' && (
          <AIPersonalityTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        )}

        {currentTab === 'tools' && (
          <ToolsTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
            expandedTools={expandedTools}
            onToggleTool={toggleTool}
            onCreateProject={handleCreateProject}
            onEditProject={handleEditProject}
            onCreateSkillCategory={handleCreateSkillCategory}
            onEditSkillCategory={handleEditSkillCategory}
          />
        )}

        {currentTab === 'questions' && (
          <QuestionsTab
            onPreview={onPreview}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Modals */}
      {editingProject && (
        <ProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />
      )}

      {editingSkillCategory && (
        <SkillCategoryModal
          category={editingSkillCategory}
          onClose={() => setEditingSkillCategory(null)}
          onSave={handleSaveSkillCategory}
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          localStorage.setItem('profolio_onboarding_completed', 'true');
          setShowOnboarding(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
