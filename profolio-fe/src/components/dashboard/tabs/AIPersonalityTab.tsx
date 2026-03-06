import React, { useState, useEffect } from 'react';
import { Slider } from '../../ui/slider';
import { usePersonality, useUpdatePersonality } from '../../../hooks/usePersonality';

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
  const { data: personality, isLoading } = usePersonality();
  const updatePersonality = useUpdatePersonality();

  const [form, setForm] = useState({
    professionalBio: '',
    skills: '',
    biggestFlex: '',
    personalDrives: '',
    interests: '',
    uniqueness: '',
    communicationStyle: '',
    topicsLoveDiscussing: '',
    generalContext: '',
    temperature: 50,
  });

  useEffect(() => {
    if (personality) {
      setForm({
        professionalBio: personality.professionalBio || '',
        skills: personality.skills || '',
        biggestFlex: personality.biggestFlex || '',
        personalDrives: personality.personalDrives || '',
        interests: personality.interests || '',
        uniqueness: personality.uniqueness || '',
        communicationStyle: personality.communicationStyle || '',
        topicsLoveDiscussing: personality.topicsLoveDiscussing || '',
        generalContext: personality.generalContext || '',
        temperature: personality.temperature ?? 50,
      });
    }
  }, [personality]);

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updatePersonality.mutate(form);
  };

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

  if (isLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-surface-highlight rounded-lg w-1/3" />
          <div className="h-32 bg-surface-highlight rounded-xl" />
          <div className="h-48 bg-surface-highlight rounded-xl" />
          <div className="h-48 bg-surface-highlight rounded-xl" />
          <div className="h-48 bg-surface-highlight rounded-xl" />
        </div>
      </div>
    );
  }

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
            <h3 className="text-lg font-medium text-primary">{getPersonalityTitle(form.temperature)}</h3>
            <span className="bg-surface-highlight text-text-muted text-xs font-medium px-3 py-1 rounded-full border border-border">
              {getPersonalityLabel(form.temperature)}
            </span>
          </div>
          <div className="w-full mb-6">
            <Slider
              value={[form.temperature]}
              onValueChange={(value) => handleChange('temperature', value[0])}
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
                {form.professionalBio && (
                  <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                  </span>
                )}
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
                    value={form.professionalBio}
                    onChange={(e) => handleChange('professionalBio', e.target.value)}
                    placeholder="e.g. Java Backend Developer at FPT Software"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Your superpower skills</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    value={form.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    placeholder="e.g. Java, Spring Framework, PostgreSQL, Docker"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Your biggest flex</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    value={form.biggestFlex}
                    onChange={(e) => handleChange('biggestFlex', e.target.value)}
                    placeholder="e.g. Won first place at a national hackathon"
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
                {form.personalDrives && (
                  <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                  </span>
                )}
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
                    value={form.personalDrives}
                    onChange={(e) => handleChange('personalDrives', e.target.value)}
                    placeholder="e.g. Continuous learning and building impactful products"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Outside of work, you can find me...</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    value={form.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    placeholder="e.g. Hiking, reading sci-fi novels, playing guitar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">One thing that makes you unique</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    value={form.uniqueness}
                    onChange={(e) => handleChange('uniqueness', e.target.value)}
                    placeholder="e.g. I thrive under pressure and love solving complex problems"
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
                {form.communicationStyle && (
                  <span className="size-5 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                  </span>
                )}
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
                    value={form.communicationStyle}
                    onChange={(e) => handleChange('communicationStyle', e.target.value)}
                    placeholder="e.g. Open, collaborative, valuing diverse perspectives"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Topics you love discussing</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-primary bg-surface resize-y min-h-[50px]"
                    rows={2}
                    value={form.topicsLoveDiscussing}
                    onChange={(e) => handleChange('topicsLoveDiscussing', e.target.value)}
                    placeholder="e.g. Software architecture, algorithm optimization, AI trends"
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
                <span><strong className="font-medium text-text-muted">Life context:</strong> "I have two cats named Docker and Kubernetes"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Background:</strong> "Former professional athlete", "Self-taught developer"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-subtle">•</span>
                <span><strong className="font-medium text-text-muted">Fun facts:</strong> "Speak 4 languages", "Marathon runner"</span>
              </li>
            </ul>
          </div>
          <div className="relative group">
            <textarea
              className="w-full h-40 p-4 rounded-lg bg-surface-highlight/50 border border-border focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-mono text-text-muted resize-none shadow-inner placeholder:text-text-subtle transition-all duration-200"
              placeholder="Share anything that makes you unique..."
              value={form.generalContext}
              onChange={(e) => handleChange('generalContext', e.target.value)}
            ></textarea>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-text-subtle text-[14px]">drag_handle</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 italic">The more personal details you share, the more authentic and engaging your AI conversations will be</p>
        </div>
      </div>

      {/* Save Button */}
      <hr className="border-border mb-8" />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updatePersonality.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-60"
        >
          {updatePersonality.isPending ? 'Saving...' : 'Save'}
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
