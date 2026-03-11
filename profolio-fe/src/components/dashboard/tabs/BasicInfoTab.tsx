import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio, useUpdatePortfolio } from '../../../hooks/usePortfolio';
import { portfolioApi } from '../../../services/portfolioApi';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '../../ui/switch';
import DashboardFooter from '../DashboardFooter';
import DashboardTopBar from '../DashboardTopBar';


interface BasicInfoTabProps {
  onPreview: () => void;
  onNavigate: (tab: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ onPreview, onNavigate }) => {
  const { data: portfolio, isLoading } = usePortfolio();
  const updatePortfolio = useUpdatePortfolio();

  const [form, setForm] = useState({
    headline: '',
    tagline: '',
    chatPlaceholder: 'Ask me anything...',
    showModal: true,
    modalTitle: '',
    modalContent: '',
    theme: 'DEFAULT',
    cursorAnimation: 'FLUID',
    avatarShape: 'SQUARED',
  });

  useEffect(() => {
    if (portfolio) {
      setForm({
        headline: portfolio.headline || '',
        tagline: portfolio.tagline || '',
        chatPlaceholder: portfolio.chatPlaceholder || 'Ask me anything...',
        showModal: portfolio.showModal ?? true,
        modalTitle: portfolio.modalTitle || '',
        modalContent: portfolio.modalContent || '',
        theme: portfolio.theme || 'DEFAULT',
        cursorAnimation: portfolio.cursorAnimation || 'FLUID',
        avatarShape: portfolio.avatarShape || 'SQUARED',
      });
    }
  }, [portfolio]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = () => {
    updatePortfolio.mutate(form);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const result = await portfolioApi.uploadFile(file);
      await updatePortfolio.mutateAsync({ avatarUrl: result.url } as any);
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-surface-highlight rounded-lg w-1/3" />
          <div className="h-64 bg-surface-highlight rounded-xl" />
          <div className="h-48 bg-surface-highlight rounded-xl" />
          <div className="h-48 bg-surface-highlight rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
      <DashboardTopBar onPreview={onPreview} onPublish={() => onNavigate('publish')} />

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-normal text-primary mb-2 tracking-tight">Portfolio Settings</h1>
        <p className="text-text-muted text-sm font-light">Customize your portfolio's appearance and settings</p>
      </div>

      {/* Preview Section with Browser Mockup */}
      <div className="bg-surface border border-border rounded-xl p-0 mb-8 flex flex-col items-center justify-center min-h-[400px] relative shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Browser Header */}
        <div className="absolute top-0 left-0 right-0 border-b border-border px-6 py-4 flex justify-between items-center bg-surface/50 backdrop-blur-sm z-10">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400/20 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40"></div>
            <div className="size-3 rounded-full bg-amber-400/20 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40"></div>
            <div className="size-3 rounded-full bg-green-400/20 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40"></div>
          </div>
          <span className="text-xs text-text-subtle font-mono">profol.io/{portfolio?.slug}</span>
          <span className="material-symbols-outlined text-text-subtle text-[18px]">refresh</span>
        </div>

        {/* Preview Content */}
        <div className="w-full h-full flex flex-col items-center justify-center pt-20 pb-12 px-6">
          <div className="text-center mb-8 relative z-0">
            <div className="inline-flex items-center gap-2 text-xl font-medium text-text-muted mb-2 font-serif italic">
              {form.headline || 'Hello everyone'} <span className="not-italic">👋</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-primary tracking-tight mb-8">{form.tagline || 'Your Name'}</h2>
            <div className={`size-32 bg-primary ${form.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-2xl'} mx-auto flex items-center justify-center mb-10 shadow-2xl shadow-black/10 relative group cursor-pointer transition-transform hover:scale-[1.02] duration-300`}>
              {portfolio?.avatarUrl ? (
                <img src={portfolio.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-inherit" />
              ) : (
                <span className="text-primary-foreground/80/70 font-serif text-2xl italic">
                  {(form.tagline || 'U')[0]?.toUpperCase()}
                </span>
              )}
              <div className={`absolute inset-0 border border-primary-foreground/10 ${form.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-2xl'}`}></div>
            </div>
            <div className="w-full max-w-md mx-auto relative group">
              <input
                className="w-full pl-5 pr-12 py-3.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all shadow-sm group-hover:shadow-md placeholder:text-text-subtle text-primary"
                disabled
                placeholder={form.chatPlaceholder}
                type="text"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-full text-white hover:opacity-90 transition-colors" style={{ background: 'var(--accent-blue)' }}>
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-serif text-primary mb-1">Avatar</h2>
              <p className="text-sm text-text-muted font-light">Configure your profile picture for the chat interface</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="flex bg-surface-highlight rounded-lg p-1 border border-border">
              <button
                onClick={() => {
                  handleChange('avatarShape', 'SQUARED');
                  updatePortfolio.mutate({ avatarShape: 'SQUARED' } as any);
                }}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${form.avatarShape === 'SQUARED' ? 'bg-surface shadow-sm text-primary border border-border/50' : 'text-text-muted hover:text-primary'}`}
              >
                Squared
              </button>
              <button
                onClick={() => {
                  handleChange('avatarShape', 'ROUNDED');
                  updatePortfolio.mutate({ avatarShape: 'ROUNDED' } as any);
                }}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${form.avatarShape === 'ROUNDED' ? 'bg-surface shadow-sm text-primary border border-border/50' : 'text-text-muted hover:text-primary'}`}
              >
                Rounded
              </button>
            </div>
            <div className="flex items-center gap-5">
              <div className={`size-20 bg-surface-highlight ${form.avatarShape === 'ROUNDED' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden border border-border flex items-center justify-center shadow-inner`}>
                {portfolio?.avatarUrl ? (
                  <img src={portfolio.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[32px] text-text-subtle">image</span>
                )}
              </div>
              <div>
                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="text-sm font-medium text-primary border border-border px-4 py-2 rounded-lg hover:bg-surface-highlight transition-colors mb-2 bg-surface shadow-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {isUploadingAvatar ? (
                    <>
                      <span className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Upload Avatar
                    </>
                  )}
                </button>
                <p className="text-xs text-text-muted">Min 200x200px • JPG, PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary mb-1">Appearance</h2>
            <p className="text-sm text-text-muted font-light">Choose a visual theme for your portfolio</p>
          </div>
          <div className="space-y-6">
            {/* Theme visual card picker */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'DEFAULT', label: 'Default', swatchBg: '#f9fafb', swatchAccent: '#1f2937', swatchBubble: '#1f2937' },
                  { value: 'DARK', label: 'Dark', swatchBg: '#09090b', swatchAccent: '#2563eb', swatchBubble: '#2563eb' },
                  { value: 'PLAYFUL', label: 'Playful', swatchBg: 'linear-gradient(135deg,#faf5ff,#fdf2f8)', swatchAccent: '#9333ea', swatchBubble: '#9333ea' },
                ].map(({ value, label, swatchBg, swatchAccent, swatchBubble }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange('theme', value)}
                    className={`relative flex flex-col items-center gap-2 p-0 rounded-xl border-2 transition-all overflow-hidden ${form.theme === value ? 'border-[var(--accent-blue)] shadow-md' : 'border-border hover:border-primary/30'
                      }`}
                  >
                    {/* Mini preview */}
                    <div
                      className="w-full h-20 flex flex-col items-center justify-center gap-1.5 px-2"
                      style={{ background: swatchBg }}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ background: value === 'DARK' ? '#3f3f46' : value === 'PLAYFUL' ? 'linear-gradient(135deg,#e9d5ff,#fbcfe8)' : '#e5e7eb' }}></div>
                      <div className="w-full space-y-1">
                        <div className="h-1 rounded-full mx-2" style={{ background: swatchAccent, opacity: 0.8 }}></div>
                        <div className="self-end h-1 rounded-full" style={{ background: swatchBubble, width: '55%', marginLeft: 'auto', marginRight: '4px' }}></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary pb-2">{label}</span>
                    {form.theme === value && (
                      <div className="absolute top-1.5 right-1.5 size-4 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--accent-blue)' }}>
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Cursor Animation</label>
              <div className="relative">
                <select
                  value={form.cursorAnimation}
                  onChange={(e) => handleChange('cursorAnimation', e.target.value)}
                  className="w-full appearance-none bg-surface border border-border text-primary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow"
                >
                  <option value="FLUID">Fluid</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="text-xl font-serif text-primary mb-1">Landing Page</h2>
            <p className="text-sm text-text-muted font-light">Customize the first impression visitors have of your portfolio</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Portfolio Headline <span className="text-text-subtle font-normal ml-1">(Optional)</span>
              </label>
              <input
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm placeholder:text-text-subtle shadow-sm transition-shadow"
                placeholder="Leave empty to use default: Hey, I'm {name} 👋"
                type="text"
                value={form.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Welcome Tagline</label>
              <input
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow"
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Chat Input Placeholder</label>
              <input
                className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow"
                type="text"
                value={form.chatPlaceholder}
                onChange={(e) => handleChange('chatPlaceholder', e.target.value)}
              />
            </div>
            <div className="pt-6 border-t border-border mt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <label className="block text-sm font-medium text-primary">Welcome Modal</label>
                  <p className="text-xs text-text-muted mt-0.5">Show a greeting popup when visitors open your portfolio</p>
                </div>
                <Switch
                  checked={form.showModal}
                  onChange={(val) => handleChange('showModal', val)}
                />
              </div>
              <div className="space-y-4 p-5 bg-surface-highlight/50 rounded-xl border border-border">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Modal Title</label>
                  <input
                    className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm transition-shadow"
                    type="text"
                    value={form.modalTitle}
                    onChange={(e) => handleChange('modalTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Modal Content</label>
                  <textarea
                    className="w-full bg-surface border border-border text-primary py-2.5 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[100px] resize-y shadow-sm transition-shadow"
                    value={form.modalContent}
                    onChange={(e) => handleChange('modalContent', e.target.value)}
                  >
                  </textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar — sticks while scrolling, sits above footer at page bottom */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-surface/90 backdrop-blur-md px-0 py-3 mt-8">
        <button
          onClick={handleSave}
          disabled={updatePortfolio.isPending}
          className="w-full text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'var(--accent-blue)' }}
        >
          {updatePortfolio.isPending ? (
            <>
              <span className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default BasicInfoTab;
