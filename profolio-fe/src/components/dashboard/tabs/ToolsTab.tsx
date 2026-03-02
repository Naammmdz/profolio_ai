import React from 'react';

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

  // Me (personal info) state
  const [meInfo, setMeInfo] = React.useState({
    name: "Ta Giang Nam",
    age: "19",
    location: "District 9, Ho Chi Minh City, Vietnam",
    introduction: "I am a high-achieving Software Engineering student passionate about Backend Systems and Algorithmic Problem Solving. I am eager to join a high-growth product team to tackle challenging technical problems and deliver user-centric value."
  });

  const [tags, setTags] = React.useState<string[]>(['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'RabbitMQ', 'Redis']);
  const [tagInput, setTagInput] = React.useState("");

  const [contactInfo, setContactInfo] = React.useState({
    email: "tagiangnamttg@gmail.com",
    phone: "0886545188",
    name: "Ta Giang Nam",
    handle: "tagiangnam",
    address: "District 9, Ho Chi Minh City, Vietnam"
  });

  const [locationInfo, setLocationInfo] = React.useState({
    city: "Ho Chi Minh City",
    country: "Vietnam"
  });

  const [hobbies, setHobbies] = React.useState([
    "Photography",
    "Hiking",
    "Reading",
    "Gaming"
  ]);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      {/* Header with Draft Mode, Preview, Publish Changes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="hidden sm:block">
          <button className="p-2 -ml-2 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface-highlight">
            <span className="material-symbols-outlined">dock_to_left</span>
          </button>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-background border border-border text-text-muted px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="size-1.5 rounded-full bg-orange-500"></span>
            Draft Mode
          </div>
          <button 
            onClick={onPreview}
            className="bg-background hover:bg-surface-highlight border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Preview
          </button>
          <button 
            onClick={() => onNavigate('publish')}
            className="bg-primary hover:opacity-90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-serif text-primary tracking-tight">Tools</h1>
          <div className="flex items-center gap-3 bg-surface-highlight px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Global Toggle</span>
            <div className="h-4 w-px bg-border"></div>
            <label className="switch">
              <input checked type="checkbox"/>
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <p className="text-text-muted text-lg font-light max-w-2xl">Configure the tools your AI assistant can use to answer questions about you.</p>
      </div>

      {/* Preview Section */}
      <div className="bg-surface border border-border rounded-2xl p-0 mb-10 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] h-[360px] relative overflow-hidden flex flex-col items-center justify-center group hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] transition-all duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface opacity-80"></div>
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="mb-6 relative size-20 bg-surface-highlight rounded-2xl shadow-lg border border-border flex items-center justify-center apple-float">
            <span className="material-symbols-outlined text-[40px] text-primary">smart_toy</span>
            <div className="absolute -right-2 -bottom-2 bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg>
            </div>
          </div>
          <div className="bg-surface-highlight/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border shadow-sm text-xs font-medium text-text-muted">
            Interactive Preview
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
          <div className="bg-surface-highlight/90 backdrop-blur-xl rounded-full border border-border shadow-lg p-2 pl-6 flex items-center hover:border-border transition-colors group-hover:shadow-xl group-hover:-translate-y-1 duration-300">
            <span className="text-sm text-text-subtle flex-1 font-light">Ask me anything about my work...</span>
            <button className="size-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shadow-md">
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Me (personal info) - First Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Me (personal info)</h3>
                  <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 rounded-full px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-0.5 uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-sm text-text-muted font-light">Basic information about you - name, photo, bio</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('personal')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['personal'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['personal'] && (
            <div className="p-6 border-t border-border">
              <div className="mb-6">
                <h4 className="text-sm font-bold text-primary mb-2">Presentation Photo</h4>
                <p className="text-xs text-text-muted mb-3">This photo will be displayed in the presentation tool</p>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-text-muted text-4xl mb-2">image</span>
                  <p className="text-sm text-text-muted mb-1">Drop image here or <span className="text-primary font-medium">browse</span></p>
                  <p className="text-[10px] text-text-muted">Square format recommended • PNG, JPG or GIF (max. 2MB)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Name <span className="text-red-500">*</span></label>
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow"
                    type="text"
                    value={meInfo.name}
                    onChange={(e) => setMeInfo({ ...meInfo, name: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Age</label>
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow"
                    type="text"
                    value={meInfo.age}
                    onChange={(e) => setMeInfo({ ...meInfo, age: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Location</label>
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow"
                    type="text"
                    value={meInfo.location}
                    onChange={(e) => setMeInfo({ ...meInfo, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-1.5">Introduction <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary min-h-[100px] resize-y shadow-sm transition-shadow"
                  value={meInfo.introduction}
                  onChange={(e) => setMeInfo({ ...meInfo, introduction: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-1.5">Tags</label>
                <div className="p-2 border border-border rounded-lg bg-surface mb-3 shadow-sm">
                  <input
                    className="w-full text-sm outline-none bg-transparent text-primary placeholder:text-text-subtle"
                    placeholder="Type tags (e.g., SaaS Builder, Developer, Student...)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        setTags([...tags, tagInput.trim()]);
                        setTagInput('');
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-highlight rounded-full text-xs font-medium text-primary">
                      {tag}
                      <span
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-500"
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      >close</span>
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Presentation Information
              </button>
            </div>
          )}
        </div>

        {/* Projects Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">folder_open</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Projects</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Showcase your portfolio projects and work</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('projects')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['projects'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['projects'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-4 mb-6">
                {sampleProjects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-surface-highlight transition-colors bg-surface">
                    <div>
                      <h4 className="text-sm font-bold text-primary">{project.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{project.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditProject(project)}
                        className="text-xs font-medium text-primary hover:text-primary transition-colors"
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Project
              </button>
            </div>
          )}
        </div>

        {/* Skills Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Skills</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Your technical and soft skills</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('skills')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['skills'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['skills'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-6 mb-6">
                {sampleSkillCategories.map((cat, i) => (
                  <div key={i} className="p-4 border border-border rounded-xl bg-surface">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-primary">{cat.title}</h4>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onEditSkillCategory(cat)}
                          className="text-xs font-medium text-primary hover:text-primary transition-colors"
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Category
              </button>
            </div>
          )}
        </div>

        {/* Fun & Hobbies Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">sports_esports</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Fun & Hobbies</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Fun facts, hobbies, and photos</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('hobbies')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['hobbies'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['hobbies'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">Title</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="e.g., My Adventures" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                  <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle min-h-[100px] resize-y shadow-sm transition-shadow" placeholder="Tell something fun about yourself..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">Photos (Max 3)</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-highlight transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-text-muted text-4xl mb-2">image</span>
                    <p className="text-sm font-medium text-primary mb-1">Drop your photos here</p>
                    <p className="text-[10px] text-text-muted mb-4">PNG, JPG or GIF (max. 5MB per file)<br />3 photos remaining</p>
                    <button className="bg-surface border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-highlight transition-colors flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Select photos
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Fun Section
              </button>
            </div>
          )}
        </div>

        {/* Contact Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Contact</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Contact information and social links</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('contact')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['contact'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['contact'] && (
            <div className="p-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Name</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue={contactInfo.name} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Email</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue={contactInfo.email} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Phone</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue={contactInfo.phone} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Handle/Username</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue={contactInfo.handle} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1.5">Address</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue={contactInfo.address} />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-primary">Social Links</label>
                  <button className="text-xs font-medium text-primary border border-border bg-surface px-3 py-1.5 rounded-lg hover:bg-surface-highlight flex items-center gap-1 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Social
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1/3">
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue="GitHub" />
                  </div>
                  <div className="flex-1">
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue="https://github.com/Naammmdz" />
                  </div>
                  <button className="text-text-muted hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Contact Information
              </button>
            </div>
          )}
        </div>

        {/* Resume/CV Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Resume/CV</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Your downloadable resume or CV</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('resume')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['resume'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['resume'] && (
            <div className="p-6 border-t border-border">
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-2">Resume File (PDF)</label>
                <div className="border border-border border-dashed rounded-xl p-6 flex items-center gap-4 bg-surface-highlight">
                  <div className="size-12 bg-surface border border-border rounded-lg flex items-center justify-center text-text-muted shrink-0">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">resume.pdf</p>
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
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue="Ta Giang Nam - Backend Developer" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary shadow-sm transition-shadow" defaultValue="Backend Developer with a passion for solving technical challenges" />
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Resume Information
              </button>
            </div>
          )}
        </div>

        {/* Video Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">movie</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Video</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Showcase a video of what you want!</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('video')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['video'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
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
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="Enter video title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">Video URL <span className="text-red-500">*</span></label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">Description (optional)</label>
                    <textarea className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow resize-y min-h-[80px]" placeholder="Brief description of the video" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Video
              </button>
            </div>
          )}
        </div>

        {/* Location Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-300 group">
          <div className="w-full flex items-center justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="material-symbols-outlined text-[20px]">map</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-primary">Location</h3>
                </div>
                <p className="text-sm text-text-muted font-light">Display your location on an interactive map</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-4 py-1.5 bg-surface-highlight hover:bg-surface-highlight text-text-muted border border-border text-xs font-medium rounded-lg transition-colors">
                Try it out
              </button>
              <div className="h-6 w-px bg-surface-highlight"></div>
              <label className="switch">
                <input checked type="checkbox"/>
                <span className="slider"></span>
              </label>
              <button 
                onClick={() => onToggleTool('location')}
                className={`p-1 rounded hover:bg-surface-highlight text-text-subtle hover:text-primary transition-colors ${expandedTools['location'] ? 'rotate-180' : ''}`}
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          {expandedTools['location'] && (
            <div className="p-6 border-t border-border">
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">Search for a location</label>
                  <div className="relative">
                    <input className="w-full py-2 pl-4 pr-10 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="Start typing a city name..." />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-lg">search</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-primary mb-1.5">City</label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="e.g., Paris" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-primary mb-1.5">Country</label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder:text-text-subtle shadow-sm transition-shadow" placeholder="e.g., France" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">Profolio</span>
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
  );
};

export default ToolsTab;
