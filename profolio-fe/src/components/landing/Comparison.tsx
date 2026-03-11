import React from 'react';

const Comparison: React.FC = () => {
  return (
    <section className="py-24 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: 'var(--accent-blue)' }}>The Shift</span>
          <h2 className="text-4xl lg:text-5xl font-serif mb-4 leading-tight text-primary">Old vs. New</h2>
          <p className="text-text-muted font-light max-w-md mx-auto leading-relaxed">
            Static PDFs are an artifact of the past. In a world of interaction, static is invisible.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="relative grid md:grid-cols-2 gap-6 items-stretch">

          {/* VS Badge — center divider */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="size-10 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-lg border"
              style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              VS
            </div>
          </div>

          {/* ── Left: Legacy ── */}
          <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col relative overflow-hidden opacity-80">
            {/* Label row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-400"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Static Resume</span>
              </div>
              <span className="text-xs font-mono text-text-muted border border-border px-2 py-0.5 rounded-md">2010 — Today</span>
            </div>

            {/* Mock PDF visual */}
            <div className="flex-1 mb-6 rounded-xl border border-border bg-background p-5 grayscale opacity-60">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <div className="size-8 rounded-full bg-border"></div>
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-primary/20 rounded"></div>
                  <div className="h-1.5 w-16 bg-primary/10 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-primary/10 rounded"></div>
                <div className="h-1.5 w-5/6 bg-primary/10 rounded"></div>
                <div className="h-1.5 w-4/5 bg-primary/10 rounded"></div>
                <div className="h-1.5 w-full bg-primary/10 rounded mt-3"></div>
                <div className="h-1.5 w-3/4 bg-primary/10 rounded"></div>
                <div className="h-8 w-full bg-primary/5 rounded mt-3 border border-primary/5"></div>
                <div className="h-1.5 w-full bg-primary/10 rounded mt-2"></div>
                <div className="h-1.5 w-2/3 bg-primary/10 rounded"></div>
              </div>
            </div>

            {/* Cons */}
            <ul className="space-y-2.5 font-mono text-xs text-text-muted">
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 text-[10px]">×</span>
                10-second skim time then discarded
              </li>
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 text-[10px]">×</span>
                Zero two-way interaction
              </li>
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 text-[10px]">×</span>
                No follow-up, instant forget
              </li>
            </ul>
          </div>

          {/* ── Right: Profolio AI ── */}
          <div
            className="rounded-2xl p-8 flex flex-col relative overflow-hidden border"
            style={{
              background: 'rgba(59,111,235,0.04)',
              borderColor: 'rgba(59,111,235,0.2)',
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--accent-blue)',
            }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(to right, var(--accent-blue), transparent)' }}></div>

            {/* Label row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)', boxShadow: '0 0 8px rgba(59,111,235,0.5)' }}></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent-blue)' }}>Profolio AI</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ color: 'var(--accent-blue)', background: 'rgba(59,111,235,0.08)', border: '1px solid rgba(59,111,235,0.2)' }}>
                Live 24/7
              </span>
            </div>

            {/* Live chat mock */}
            <div className="flex-1 mb-6 rounded-xl border bg-background p-4 flex flex-col gap-2.5" style={{ borderColor: 'rgba(59,111,235,0.15)' }}>
              {/* Recruiter messages */}
              <div className="self-start bg-surface-highlight border border-border px-3 py-2 rounded-xl rounded-tl-none max-w-[80%]">
                <p className="text-xs text-text-muted font-mono">&gt; What's your tech stack?</p>
              </div>
              <div className="self-end px-3 py-2 rounded-xl rounded-tr-none max-w-[80%] text-white text-xs font-mono" style={{ background: 'var(--accent-blue)' }}>
                React, TypeScript, Java Spring...
              </div>
              <div className="self-start bg-surface-highlight border border-border px-3 py-2 rounded-xl rounded-tl-none max-w-[80%]">
                <p className="text-xs text-text-muted font-mono">&gt; Show me your best project</p>
              </div>
              <div className="self-end px-3 py-2 rounded-xl rounded-tr-none text-white text-xs font-mono" style={{ background: 'var(--accent-blue)', maxWidth: '85%' }}>
                Here's the Profolio platform — live demo linked below 🚀
              </div>
              {/* Typing indicator */}
              <div className="self-start flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-highlight border border-border">
                <span className="size-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="size-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="size-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>

            {/* Pros */}
            <ul className="space-y-2.5 font-mono text-xs text-primary">
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full flex items-center justify-center text-white shrink-0 text-[10px]" style={{ background: 'var(--accent-blue)' }}>✓</span>
                Avg. 8+ minutes engagement
              </li>
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full flex items-center justify-center text-white shrink-0 text-[10px]" style={{ background: 'var(--accent-blue)' }}>✓</span>
                Instant personalized answers
              </li>
              <li className="flex items-center gap-3">
                <span className="size-4 rounded-full flex items-center justify-center text-white shrink-0 text-[10px]" style={{ background: 'var(--accent-blue)' }}>✓</span>
                Memorable, shareable, always on
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Comparison;