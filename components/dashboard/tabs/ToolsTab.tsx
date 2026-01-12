import React from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardFooter from '../shared/DashboardFooter';

interface ToolsTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
  expandedTools: Record<string, boolean>;
  onToggleTool: (tool: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: any) => void;
  onCreateSkillCategory: () => void;
  onEditSkillCategory: (category: any) => void;
}

const ToolsTab: React.FC<ToolsTabProps> = ({ 
  onPreview,
  onNavigate,
  expandedTools,
  onToggleTool,
  onCreateProject,
  onEditProject,
  onCreateSkillCategory,
  onEditSkillCategory
}) => {
  // Sample data - should come from props or state in real app
  const sampleProjects = [
    { title: "NAVER Hackathon 2025", desc: "WebApp • React, Spring Boot 3.x, PostgreSQL +2 more" },
    { title: "Developer Bookmark Manager", desc: "WebApp • React 18+/TypeScript, Spring Boot 3.x, MS SQL Server +1 more" },
    { title: "School Medical Management System", desc: "WebApp • React.js, Spring Boot, MS SQL Server +1 more" },
    { title: "Apple Product E-commerce", desc: "WebApp • JSP, Java Servlets, SQL Server +2 more" }
  ];

  const sampleSkillCategories = [
    { title: "Languages", skills: ["Java", "Basic HTML", "CSS", "JavaScript", "Data Structures & Algorithms (DSA)", "Object-Oriented Programming (OOP)"] },
    { title: "Frameworks", skills: ["Spring Framework (Spring Boot, Spring MVC, Spring Data JPA, Spring Security)", "Quarkus"] },
    { title: "Databases", skills: ["MS SQL Server", "PostgreSQL", "Redis"] },
    { title: "Tools", skills: ["Git", "Docker", "Maven", "RabbitMQ", "Postman", "Swagger", "IDE (IntelliJ IDEA, VS Code)"] }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader 
        onPreview={onPreview} 
        onPublish={() => onNavigate('publish')}
      />
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
        {/* Projects Tool */}
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
                onClick={() => onToggleTool('projects')}
                className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['projects'] ? 'rotate-180' : ''}`}
              >expand_more</span>
            </div>
          </div>
          {expandedTools['projects'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-4 mb-6">
                {sampleProjects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-surface-highlight transition-colors bg-background">
                    <div>
                      <h4 className="text-sm font-bold text-primary">{project.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{project.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onEditProject(project)}
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
                onClick={onCreateProject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Project
              </button>
            </div>
          )}
        </div>

        {/* Skills Tool */}
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
                onClick={() => onToggleTool('skills')}
                className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['skills'] ? 'rotate-180' : ''}`}
              >expand_more</span>
            </div>
          </div>
          {expandedTools['skills'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-6 mb-6">
                {sampleSkillCategories.map((cat, i) => (
                  <div key={i} className="p-4 border border-border rounded-xl bg-background">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-primary">{cat.title}</h4>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onEditSkillCategory(cat)}
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
                onClick={onCreateSkillCategory}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Category
              </button>
            </div>
          )}
        </div>

        {/* Note: Other tools (Me, Fun & Hobbies, Contact, Resume, Video, Location) 
            can be added similarly. For brevity, showing Projects and Skills as examples */}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default ToolsTab;

