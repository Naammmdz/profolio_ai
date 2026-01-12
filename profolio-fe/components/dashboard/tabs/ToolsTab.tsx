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
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader
        onPreview={onPreview}
        onPublish={() => onNavigate('publish')}
      />
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-primary">Tools</h1>
          <label className="switch scale-90 origin-left">
            <input defaultChecked type="checkbox" />
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
        {/* Me (personal info) - First Tool */}
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
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('personal')}
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
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary"
                    type="text"
                    value={meInfo.name}
                    onChange={(e) => setMeInfo({ ...meInfo, name: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Age</label>
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary"
                    type="text"
                    value={meInfo.age}
                    onChange={(e) => setMeInfo({ ...meInfo, age: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Location</label>
                  <input
                    className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary"
                    type="text"
                    value={meInfo.location}
                    onChange={(e) => setMeInfo({ ...meInfo, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-1.5">Introduction <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary min-h-[100px] resize-y"
                  value={meInfo.introduction}
                  onChange={(e) => setMeInfo({ ...meInfo, introduction: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-1.5">Tags</label>
                <div className="p-2 border border-border rounded-lg bg-background mb-3">
                  <input
                    className="w-full text-sm outline-none bg-transparent text-primary"
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
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Presentation Information
              </button>
            </div>
          )}
        </div>

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
                <input defaultChecked type="checkbox" />
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
                <input defaultChecked type="checkbox" />
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

        {/* Fun & Hobbies Tool */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
          <div className="w-full flex items-center justify-between p-6 bg-surface">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-primary">Fun & Hobbies</h3>
              </div>
              <p className="text-sm text-text-muted">Fun facts, hobbies, and photos</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors">
                Try it
              </button>
              <label className="switch scale-90">
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('hobbies')}
                className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['hobbies'] ? 'rotate-180' : ''}`}
              >expand_more</span>
            </div>
          </div>
          {expandedTools['hobbies'] && (
            <div className="p-6 border-t border-border">
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">Title</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., My Adventures" />
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
                    <p className="text-[10px] text-text-muted mb-4">PNG, JPG or GIF (max. 5MB per file)<br />3 photos remaining</p>
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

        {/* Contact Tool */}
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
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('contact')}
                className={`material-symbols-outlined text-text-muted cursor-pointer hover:text-primary transition-transform duration-200 ${expandedTools['contact'] ? 'rotate-180' : ''}`}
              >expand_more</span>
            </div>
          </div>
          {expandedTools['contact'] && (
            <div className="p-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Name</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={contactInfo.name} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Email</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={contactInfo.email} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Phone</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={contactInfo.phone} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-primary mb-1.5">Handle/Username</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={contactInfo.handle} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1.5">Address</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue={contactInfo.address} />
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
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="GitHub" />
                  </div>
                  <div className="flex-1">
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="https://github.com/Naammmdz" />
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

        {/* Resume/CV Tool */}
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
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('resume')}
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
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="Ta Giang Nam - Backend Developer" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1.5">Description</label>
                  <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" defaultValue="Backend Developer with a passion for solving technical challenges" />
                </div>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Resume Information
              </button>
            </div>
          )}
        </div>

        {/* Video Tool */}
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
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('video')}
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
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Enter video title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">Video URL <span className="text-red-500">*</span></label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="https://youtube.com/watch?v=..." />
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

        {/* Location Tool */}
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
                <input defaultChecked type="checkbox" />
                <span className="slider"></span>
              </label>
              <span
                onClick={() => onToggleTool('location')}
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
                    <input className="w-full py-2 pl-4 pr-10 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="Start typing a city name..." />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-lg">search</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-primary mb-1.5">City</label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., Paris" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-primary mb-1.5">Country</label>
                    <input className="w-full py-2 px-3 rounded-lg border border-border bg-background text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-primary" placeholder="e.g., France" />
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

      <DashboardFooter />
    </div>
  );
};

export default ToolsTab;
