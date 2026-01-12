import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section className="py-24 px-6 transition-colors duration-300" id="pricing">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-16 text-primary">Transparent Pricing</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Starter Plan */}
          <div className="bg-background p-8 border border-border flex flex-col h-full relative transition-colors duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-mono uppercase tracking-widest text-text-muted mb-2">Starter</h3>
              <div className="text-5xl font-serif text-primary">Free</div>
              <p className="text-text-muted mt-4 text-sm font-light">Perfect for testing the waters and setting up your initial profile.</p>
            </div>
            <ul className="space-y-4 mb-10 flex-1 font-mono text-xs text-text-muted">
              <li className="flex items-center gap-3">
                <span className="text-primary">✓</span> 1 AI Project
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">✓</span> 50 Chats / month
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">✓</span> Standard Response Time
              </li>
            </ul>
            <button className="w-full py-3 bg-primary border border-primary hover:opacity-90 text-primary-foreground font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer">Start for Free</button>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-primary p-8 border border-primary/10 flex flex-col h-full relative transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-background text-primary text-[10px] font-bold font-mono uppercase px-3 py-1">Recommended</div>
            <div className="mb-8">
              <h3 className="text-xl font-mono uppercase tracking-widest text-primary-foreground mb-2">Pro</h3>
              <div className="text-5xl font-serif text-primary-foreground">$12<span className="text-lg text-text-muted font-sans font-normal">/mo</span></div>
              <p className="text-text-muted mt-4 text-sm font-light">For serious job seekers needing advanced analytics and custom domains.</p>
            </div>
            <ul className="space-y-4 mb-10 flex-1 font-mono text-xs text-text-muted">
              <li className="flex items-center gap-3 text-primary-foreground">
                <span className="text-accent">✓</span> Unlimited Chats
              </li>
              <li className="flex items-center gap-3 text-primary-foreground">
                <span className="text-accent">✓</span> Custom Domain
              </li>
              <li className="flex items-center gap-3 text-primary-foreground">
                <span className="text-accent">✓</span> Visitor Analytics
              </li>
              <li className="flex items-center gap-3 text-primary-foreground">
                <span className="text-accent">✓</span> Faster AI Model (GPT-4o)
              </li>
            </ul>
            <button className="w-full py-3 bg-background hover:bg-surface text-primary font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer">Get Pro</button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;