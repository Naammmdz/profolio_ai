import React from 'react';
import { MorphingText } from '../common/MorphingText';

const UseCases: React.FC = () => {
  return (
    <section className="py-24 px-6 transition-colors duration-300 min-h-[500px] flex flex-col justify-center relative overflow-hidden" id="use-cases">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full text-center relative z-10">
        <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-text-muted mb-12">Engineered for your domain</h2>
        
        <div className="py-8">
            <MorphingText />
        </div>
        
        <p className="mt-12 text-text-muted max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
           Whether you build code, design interfaces, or lead companies, Profolio adapts its neural engine to showcase the artifacts that matter most to your industry.
        </p>
      </div>
    </section>
  );
};

export default UseCases;