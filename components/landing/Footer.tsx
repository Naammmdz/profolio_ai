import React from 'react';

interface FooterProps {
  onStart?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onStart }) => {
  return (
    <footer className="relative z-10 pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-20 border-b border-border pb-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-primary">Ready to let your portfolio <br/> <i className="text-text-muted">interview for you?</i></h2>
            <p className="text-text-muted font-light max-w-sm">Join thousands of professionals securing interviews while they sleep.</p>
          </div>
          <button 
            onClick={onStart}
            className="h-14 px-8 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-colors flex items-center gap-2 cursor-pointer"
          >
            Start Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 flex items-center justify-center text-primary border border-primary/10 rounded bg-primary/5 font-serif italic text-sm">
                P
              </div>
              <span className="text-primary font-serif tracking-tight">Profolio</span>
            </div>
            <p className="text-xs text-text-muted font-light leading-relaxed">The AI-first portfolio builder for the modern web. Redefining how talent is discovered.</p>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">Product</h4>
            <ul className="space-y-3 text-xs text-text-muted font-light">
              <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Showcase</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Use Cases</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">Resources</h4>
            <ul className="space-y-3 text-xs text-text-muted font-light">
              <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">Legal</h4>
            <ul className="space-y-3 text-xs text-text-muted font-light">
              <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-muted font-mono uppercase tracking-wider">
          <div>© 2023 Profolio Inc.</div>
          <div className="flex gap-4">
            <a className="hover:text-primary" href="#">Twitter</a>
            <a className="hover:text-primary" href="#">GitHub</a>
            <a className="hover:text-primary" href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;