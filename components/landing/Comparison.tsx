import React from 'react';

const Comparison: React.FC = () => {
  return (
    <section className="py-24 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl lg:text-5xl font-serif mb-6 leading-tight text-primary">Old vs. New: <br/>The Paradigm Shift</h2>
            <p className="text-text-muted font-light leading-relaxed border-l border-primary/10 pl-4">
              Static PDFs are an artifact of the past. In a world of interaction, static is invisible. Give them something to query.
            </p>
          </div>
          
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-px bg-border border border-border overflow-hidden rounded-sm transition-colors duration-300">
            
            {/* Legacy Format Card */}
            <div className="bg-background p-8 flex flex-col relative group transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-8 opacity-50">
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Legacy Format</span>
                <span className="material-symbols-outlined text-text-muted">description</span>
              </div>
              <div className="flex-1 space-y-4 mb-8 grayscale opacity-30">
                <div className="h-2 bg-primary/10 w-3/4"></div>
                <div className="h-2 bg-primary/10 w-full"></div>
                <div className="h-2 bg-primary/10 w-5/6"></div>
                <div className="h-20 bg-primary/5 w-full mt-6 border border-primary/5"></div>
              </div>
              <ul className="space-y-3 mt-auto font-mono text-xs text-text-muted">
                <li className="flex items-center gap-3"><span className="text-red-500">×</span> 10-second skim time</li>
                <li className="flex items-center gap-3"><span className="text-red-500">×</span> Zero interaction</li>
                <li className="flex items-center gap-3"><span className="text-red-500">×</span> High bounce rate</li>
              </ul>
            </div>

            {/* AI Format Card */}
            <div className="bg-background p-8 flex flex-col relative group transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">Profolio AI</span>
                <span className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              </div>
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="self-start bg-surface-highlight border border-border px-3 py-2 text-text-muted max-w-[80%]">
                    <span className="text-primary/30 mr-2">&gt;</span> Check out my design work
                  </div>
                  <div className="self-end bg-primary text-primary-foreground px-3 py-2 max-w-[80%]">
                    Here is the latest system...
                  </div>
                  <div className="self-start bg-surface-highlight border border-border px-3 py-2 text-text-muted max-w-[80%]">
                    <span className="text-primary/30 mr-2">&gt;</span> Tech stack?
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mt-auto font-mono text-xs text-primary">
                <li className="flex items-center gap-3"><span className="text-green-600">✓</span> 2-way interactive experience</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✓</span> Instant personalized answers</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✓</span> memorable impression</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;