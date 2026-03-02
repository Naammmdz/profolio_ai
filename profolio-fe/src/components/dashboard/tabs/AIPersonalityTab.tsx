import React, { useState } from 'react';
import { Slider } from '../../ui/slider';

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
  const [personalityValue, setPersonalityValue] = useState(50);

  const getPersonalityLabel = (value: number): string => {
    if (value < 33) return 'Formal';
    if (value < 67) return 'Balanced';
    return 'Energetic';
  };

  const getPersonalityTitle = (value: number): string => {
    if (value < 33) return 'Professional';
    if (value < 67) return 'Business Casual';
    return 'Friendly';
  };
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
        <h1 className="text-4xl font-serif font-normal text-primary mb-2 tracking-tight">AI Personality</h1>
        <p className="text-text-muted text-sm font-light">Define how your AI twin communicates and represents you</p>
      </div>

      {/* Communication Vibe Section */}
      <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-8 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-8">
          <h2 className="text-base font-semibold text-primary mb-1">Communication Vibe</h2>
          <p className="text-sm text-text-muted">Slide to set your AI's personality temperature</p>
        </div>
        <div className="mt-4 px-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-primary">{getPersonalityTitle(personalityValue)}</h3>
            <span className="bg-surface-highlight text-text-muted text-xs font-medium px-3 py-1 rounded-full border border-border">
              {getPersonalityLabel(personalityValue)}
            </span>
          </div>
          <div className="w-full mb-6">
            <Slider
              value={[personalityValue]}
              onValueChange={(value) => setPersonalityValue(value[0])}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2 font-medium uppercase tracking-wide">
            <span>Formal</span>
            <span>Balanced</span>
            <span>Energetic</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-10">
        {/* Professional Identity */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-200">
          <button 
            onClick={() => onToggleSection('professional')}
            className="w-full flex items-center justify-between p-6 bg-transparent hover:bg-surface-highlight/50 transition-colors text-left group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-primary">Professional Identity</h3>
                <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                </span>
              </div>
              <p className="text-sm text-text-muted font-light">Your work and achievements</p>
            </div>
            <span className={`material-symbols-outlined text-text-subtle group-hover:text-primary transition-colors transition-transform duration-200 ${expandedSections['professional'] ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {expandedSections['professional'] && (
            <div className="p-6 pt-0 border-t border-border">
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">What do you do? <span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]" 
                    rows={2}
                    defaultValue="Java Backend Developer Trainee at FPT Software"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Your superpower skills</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    defaultValue="Java, Spring Framework, PostgreSQL, Redis, Docker, RabbitMQ, RESTful APIs, JWT authentication"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Your biggest flex</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    defaultValue="I was recognized as one of the Top 100 Outstanding Students in Fall Semester 2024."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personal Side */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-200">
          <button 
            onClick={() => onToggleSection('personal')}
            className="w-full flex items-center justify-between p-6 bg-transparent hover:bg-surface-highlight/50 transition-colors text-left group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-primary">Personal Side</h3>
                <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                </span>
              </div>
              <p className="text-sm text-text-muted font-light">What makes you, you</p>
            </div>
            <span className={`material-symbols-outlined text-text-subtle group-hover:text-primary transition-colors transition-transform duration-200 ${expandedSections['personal'] ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {expandedSections['personal'] && (
            <div className="p-6 pt-0 border-t border-border">
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">What drives you? <span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]" 
                    rows={2}
                    defaultValue="I believe in continuous learning and the importance of teamwork to achieve impactful results."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Outside of work, you can find me...</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    defaultValue="I enjoy coding personal projects, participating in hackathons, and keeping up with emerging technologies."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">One thing that makes you unique</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    defaultValue="I thrive under pressure and excel at problem-solving in fast-paced environments."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Communication Style */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-200">
          <button 
            onClick={() => onToggleSection('communication')}
            className="w-full flex items-center justify-between p-6 bg-transparent hover:bg-surface-highlight/50 transition-colors text-left group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-primary">Communication Style</h3>
                <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                </span>
              </div>
              <p className="text-sm text-text-muted font-light">How you connect with others</p>
            </div>
            <span className={`material-symbols-outlined text-text-subtle group-hover:text-primary transition-colors transition-transform duration-200 ${expandedSections['communication'] ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {expandedSections['communication'] && (
            <div className="p-6 pt-0 border-t border-border">
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">How do you typically communicate? <span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]" 
                    rows={2}
                    defaultValue="I communicate openly and collaborate effectively with team members, valuing diverse perspectives."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Topics you love discussing</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    defaultValue="I am passionate about Backend Development, software architecture, and algorithm optimization."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal Touch Section */}
      <div className="mb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-normal text-primary mb-2 tracking-tight">Personal Touch</h2>
          <p className="text-sm text-text-muted font-light">Tell your AI more about yourself</p>
        </div>
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary mb-3">For example:</p>
            <ul className="text-sm text-text-muted space-y-2 list-none font-light">
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Life context:</strong> "I have two cats named Docker and Kubernetes", "Living in Berlin for 3 years"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Background:</strong> "Former professional athlete", "Self-taught developer", "Started coding at 25"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Personality traits:</strong> "I love dad jokes", "Coffee addict", "Night owl"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Current situation:</strong> "Looking for remote opportunities", "Building my third startup"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Fun facts:</strong> "Speak 4 languages", "Marathon runner", "Play jazz piano"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Preferences:</strong> "Prefer async communication", "Love pair programming"</span>
              </li>
            </ul>
          </div>
          <div className="relative group">
            <textarea 
              className="w-full h-40 p-4 rounded-lg bg-surface-highlight/50 border border-border focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-mono text-text-muted resize-none shadow-inner placeholder:text-text-subtle transition-all duration-200" 
              placeholder="I have a golden retriever named Pixel who often joins my video calls..."
              defaultValue="I have a golden retriever named Pixel who often joins my video calls..."
            ></textarea>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-text-subtle text-[14px]">drag_handle</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 italic">The more personal details you share, the more authentic and engaging your AI conversations will be</p>
        </div>
      </div>

      {/* Save Button */}
      <hr className="border-border mb-8"/>
      <div className="flex justify-end">
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
          Save
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4 font-light">
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
  );
};

export default AIPersonalityTab;
