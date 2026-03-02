import React from 'react';
import Highlighter from '../common/Highlighter';
import Orb from '../common/Orb';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-40 px-6 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[0px] md:top-[-30px] -translate-x-1/2 w-[720px] h-[720px] md:w-[980px] md:h-[980px] opacity-80 [mask-image:radial-gradient(circle_at_center,black_50%,transparent_72%)] block dark:hidden">
          <Orb
            hue={-12}
            hoverIntensity={0.24}
            rotateOnHover={true}
            forceHoverState={true}
            backgroundColor="#ffffff"
            colors={['#a8b4ff', '#9ae4de', '#ffd9a3']}
          />
        </div>
        <div className="absolute left-1/2 top-[0px] md:top-[-30px] -translate-x-1/2 w-[720px] h-[720px] md:w-[980px] md:h-[980px] opacity-85 [mask-image:radial-gradient(circle_at_center,black_58%,transparent_80%)] hidden dark:block">
          <Orb
            hue={32}
            hoverIntensity={0.28}
            rotateOnHover={true}
            forceHoverState={true}
            backgroundColor="#09090b"
            colors={['#f358c4', '#f8de53', '#4c2b6f']}
          />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 text-center">
        <div className="flex flex-col gap-8 items-center">
          
          <div className="flex items-center gap-4 justify-center">
            <div className="flex -space-x-3">
              <div className="size-8 rounded-full bg-surface-highlight border border-background bg-cover grayscale opacity-70" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCybM_PaAA1EWuyzRjSRxM7IdOcypSI8rCcGpfgkJ66mbQrxPLAF98Lxfk6Po8fahg9vaJxXWr1Tf0U_cq5UHl8Wv0jpzgotOkh4WZPjcHYChYeBE_8xiteXxJhjG48YIjAieh_2hVmrBIvSxzln_DCEuxurQSVv74BsK8nWrg2xDdCI5EvOot3aCL4Mz3DohymKM1uutUxNmemycr6J4ccIBN5oXqy2hfUVb1RxxsudxXElQi9szfpLd-Y7i3Uc1Bp0dOL6NzWOA')" }}></div>
              <div className="size-8 rounded-full bg-surface-highlight border border-background bg-cover grayscale opacity-70" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyJh-9n1qxgq0lorptr_y0ona0xymhZcXgEJCt0qj9YPwSUtIas4ld3wLE1jWXgelAO5QVkFAd3HEBcdd6wVgi9fW6bF4X_55oXDT2y7NZcCX-U8vGQ5xW6BqLKcNiuvu14s5_4ldtXIxJpnCi5K4D4XGjukw2XRwpSKoWUGO0hPyzT4wPCDSFrnfLC_P8WbB-Co0Ksn42B9mGuArAxLu1mm9xoBaq0rEZOmuZwBi-Fr1PgPnW7DDG80QXdpdKNmFncIzqK04Ehg')" }}></div>
              <div className="size-8 rounded-full bg-surface-highlight border border-background bg-cover grayscale opacity-70" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgWsmvnB4AUYbX_oS-IHr9UGoQjAWoAt4BLokLAum8IIfuWkuvQnmDQlu-uI-5xQMqGAn2Ik1Y9rEkQSJAsu7_IQ0vpPaHtXi8jJ36MtlC70FktJLN0wSmRdaP0lEqhWII5uH1RdPBr1lUV6QjbTWD2bhBy2ybR0PjL4JplVG1e3vBO5moceznnKg67eclNqUxndx5JnzW178-vbHxRf997Th626d_vHh4aqJYNT4C86PHUO7C87I_YPKzr1RM7zIOwbR22wJOMA')" }}></div>
            </div>
            <p className="text-xs font-mono text-text-muted">Trusted by 10,000+ Designers & Devs</p>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-serif font-medium leading-[0.95] tracking-tight text-primary transition-colors duration-300">
            Your Portfolio is <Highlighter action="crossed-off" color="#ef4444" strokeWidth={2}><span className="text-text-muted italic">dead</span></Highlighter>. <br/>
            <span className="text-primary italic relative">
               Let Profolio <Highlighter action="highlight" color="var(--primary)" strokeWidth={2} delay={400}><span className="text-primary-foreground">bring it to life.</span></Highlighter>
            </span>
          </h1>
          
          <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-light transition-colors duration-300">
            Don't let recruiters skim your profile in 6 seconds. Keep them engaged with a real conversation with your own AI twin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <button 
              onClick={onStart}
              className="h-12 px-8 rounded-md bg-primary text-primary-foreground hover:opacity-90 font-medium text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <span>Create your AI Twin</span>
              <span className="text-[10px] border border-primary-foreground/20 px-1.5 py-0.5 rounded ml-1">(Free)</span>
            </button>
            <button className="h-12 px-8 rounded-md bg-transparent border border-primary/10 hover:bg-primary/5 text-primary font-medium text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 group">
              <span>View Demo</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
