import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section className="py-24 px-6 transition-colors duration-300" id="pricing">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-4 text-primary">Transparent Pricing</h2>
        <p className="text-center text-text-muted text-sm font-light mb-16">No hidden fees. Cancel anytime.</p>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* Starter Plan */}
          <div className="bg-background p-8 border border-border rounded-2xl flex flex-col h-full relative transition-colors duration-300">
            <div className="mb-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Starter</h3>
              <div className="text-5xl font-serif text-primary">Free</div>
              <p className="text-text-muted mt-4 text-sm font-light leading-relaxed">Perfect for testing the waters and setting up your initial profile.</p>
            </div>
            <ul className="space-y-3 mb-10 flex-1 font-mono text-xs text-text-muted">
              <li className="flex items-center gap-3">
                <span className="text-text-muted">—</span> 1 AI Project
              </li>
              <li className="flex items-center gap-3">
                <span className="text-text-muted">—</span> 50 Chats / month
              </li>
              <li className="flex items-center gap-3">
                <span className="text-text-muted">—</span> Standard Response Time
              </li>
            </ul>
            <button
              className="w-full py-3 border font-mono text-xs uppercase tracking-widest transition-all cursor-pointer hover:opacity-90"
              style={{ background: 'rgba(59,111,235,0.06)', borderColor: 'rgba(59,111,235,0.2)', color: 'var(--accent-blue)' }}
            >
              Start for Free
            </button>
          </div>

          {/* Pro Plan — blue tint style */}
          <div
            className="p-8 flex flex-col h-full relative transition-colors duration-300 rounded-2xl"
            style={{
              background: 'rgba(59,111,235,0.04)',
              border: '1px solid rgba(59,111,235,0.18)',
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--accent-blue)',
            }}
          >
            {/* Recommended badge */}
            <div
              className="absolute top-4 right-4 text-[10px] font-bold font-mono uppercase px-2.5 py-1 tracking-widest"
              style={{ color: 'var(--accent-blue)', background: 'rgba(59,111,235,0.1)', border: '1px solid rgba(59,111,235,0.2)' }}
            >
              Recommended
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--accent-blue)' }}>Pro</h3>
              <div className="text-5xl font-serif" style={{ color: 'var(--accent-blue)' }}>
                $12<span className="text-lg text-text-muted font-sans font-normal">/mo</span>
              </div>
              <p className="text-text-muted mt-4 text-sm font-light leading-relaxed">For serious job seekers needing advanced analytics and custom domains.</p>
            </div>

            <ul className="space-y-3 mb-10 flex-1 font-mono text-xs text-primary">
              {['Unlimited Chats', 'Custom Domain', 'Visitor Analytics', 'Faster AI Model (GPT-4o)'].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span style={{ color: 'var(--accent-blue)' }}>✓</span> {item}
                </li>
              ))}
            </ul>

            <button
              className="w-full py-3 text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer hover:opacity-90 shadow-lg"
              style={{ background: 'var(--accent-blue)' }}
            >
              Get Pro
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;