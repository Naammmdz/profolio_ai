import React, { useRef } from 'react';
import { AnimatedBeam } from '../common/AnimatedBeam';

const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={`z-10 flex size-14 md:size-16 items-center justify-center rounded-full border-2 border-border bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:shadow-[0_0_20px_-12px_rgba(255,255,255,0.2)] ${className}`}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const Icons = {
  linkedin: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <path d="M20.447 20.452H16.892V14.881C16.892 13.553 16.865 11.844 15.038 11.844C13.185 11.844 12.901 13.291 12.901 14.786V20.452H9.34595V9H12.757V10.564H12.805C13.28 9.664 14.44 8.715 16.171 8.715C19.773 8.715 20.447 11.086 20.447 14.129V20.452Z" fill="#0A66C2"/>
      <path d="M5.337 7.433C4.195 7.433 3.274 6.51 3.274 5.373C3.274 4.235 4.195 3.314 5.337 3.314C6.478 3.314 7.4 4.235 7.4 5.373C7.4 6.51 6.478 7.433 5.337 7.433ZM7.119 20.452H3.557V9H7.119V20.452Z" fill="#0A66C2"/>
    </svg>
  ),
  github: () => (
    <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" className="size-full fill-primary">
      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </svg>
  ),
  resume: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full stroke-primary">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 13H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 9H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  openai: () => (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg" 
      alt="ChatGPT"
      className="size-full dark:invert transition-all duration-300"
    />
  ),
  portfolio: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-full">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null); // LinkedIn
  const div2Ref = useRef<HTMLDivElement>(null); // Resume
  const div3Ref = useRef<HTMLDivElement>(null); // GitHub
  const div4Ref = useRef<HTMLDivElement>(null); // AI
  const div5Ref = useRef<HTMLDivElement>(null); // Portfolio

  return (
    <section className="py-24 px-6 relative" id="how-it-works">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Main Card Container */}
        <div 
          className="relative w-full rounded-[2.5rem] bg-surface p-12 md:p-20 overflow-hidden shadow-sm" 
          ref={containerRef}
        >
          
          {/* Header */}
          <div className="text-center mb-16 relative z-20">
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">5 minutes setup</h2>
              <p className="text-text-muted">Three easy steps to create your AI-powered portfolio</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 min-h-[300px] max-w-4xl mx-auto">
              
              {/* Column 1: Import */}
              <div className="flex flex-col justify-between h-full gap-8 md:gap-20 w-full md:w-auto items-center md:items-start relative z-20">
                  <Circle ref={div1Ref} className="hover:scale-110 transition-transform duration-300 bg-background">
                      <Icons.linkedin />
                  </Circle>
                  <Circle ref={div2Ref} className="hover:scale-110 transition-transform duration-300 bg-background">
                      <Icons.resume />
                  </Circle>
                  <Circle ref={div3Ref} className="hover:scale-110 transition-transform duration-300 bg-background">
                      <Icons.github />
                  </Circle>
              </div>

              {/* Column 2: AI Learn */}
              <div className="flex flex-col justify-center h-full w-full md:w-auto items-center relative z-20">
                  <Circle ref={div4Ref} className="size-24 md:size-28 p-6 hover:scale-105 transition-transform duration-500 hover:shadow-[0_0_40px_-5px_var(--primary)] bg-background">
                      <Icons.openai />
                  </Circle>
              </div>

              {/* Column 3: Share */}
              <div className="flex flex-col justify-center h-full w-full md:w-auto items-center md:items-end relative z-20">
                  <Circle ref={div5Ref} className="size-20 md:size-24 hover:scale-110 transition-transform duration-300 bg-primary text-primary-foreground border-primary/20">
                      <Icons.portfolio />
                  </Circle>
              </div>

          </div>

          {/* Labels / Text Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center max-w-4xl mx-auto relative z-20">
              <div>
                  <h3 className="text-lg font-bold text-primary mb-2">1- Import</h3>
                  <p className="text-sm text-text-muted font-mono">LinkedIn • Resume • GitHub</p>
              </div>
              <div>
                  <h3 className="text-lg font-bold text-primary mb-2">2- AI Learn</h3>
                  <p className="text-sm text-text-muted font-mono">Processes & Understands</p>
              </div>
              <div>
                  <h3 className="text-lg font-bold text-primary mb-2">3- Share</h3>
                  <p className="text-sm text-text-muted font-mono">Your AI Portfolio</p>
              </div>
          </div>

          {/* Animated Beams Layer */}
          {/* LinkedIn -> AI */}
          <AnimatedBeam
              containerRef={containerRef}
              fromRef={div1Ref}
              toRef={div4Ref}
              curvature={30}
              endYOffset={-10}
              pathColor="var(--text-muted)"
              pathOpacity={0.2}
              gradientStartColor="var(--accent)"
              gradientStopColor="var(--primary)"
          />
          {/* Resume -> AI */}
          <AnimatedBeam
              containerRef={containerRef}
              fromRef={div2Ref}
              toRef={div4Ref}
              pathColor="var(--text-muted)"
              pathOpacity={0.2}
              gradientStartColor="var(--accent)"
              gradientStopColor="var(--primary)"
          />
          {/* GitHub -> AI */}
          <AnimatedBeam
              containerRef={containerRef}
              fromRef={div3Ref}
              toRef={div4Ref}
              curvature={-30}
              endYOffset={10}
              pathColor="var(--text-muted)"
              pathOpacity={0.2}
              gradientStartColor="var(--accent)"
              gradientStopColor="var(--primary)"
          />
          {/* AI -> Portfolio */}
          <AnimatedBeam
              containerRef={containerRef}
              fromRef={div4Ref}
              toRef={div5Ref}
              pathColor="var(--text-muted)"
              pathOpacity={0.2}
              gradientStartColor="var(--primary)"
              gradientStopColor="var(--accent)"
              delay={1}
          />
        </div>

      </div>
    </section>
  );
};

export default Process;