import React from 'react';
import DashboardHeader from '../DashboardHeader';
import DashboardFooter from '../shared/DashboardFooter';

interface AIPersonalityTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
  expandedSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
}

const AIPersonalityTab: React.FC<AIPersonalityTabProps> = ({ 
  onPreview, 
  onNavigate,
  expandedSections,
  onToggleSection 
}) => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <DashboardHeader 
        onPreview={onPreview} 
        onPublish={() => onNavigate('publish')}
      />
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
            onClick={() => onToggleSection('professional')}
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
            onClick={() => onToggleSection('personal')}
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
            onClick={() => onToggleSection('communication')}
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
      <DashboardFooter />
    </div>
  );
};

export default AIPersonalityTab;

