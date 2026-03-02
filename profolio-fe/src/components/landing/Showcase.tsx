import React from 'react';
import Marquee from '../common/Marquee';

const Showcase: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden" id="showcase">
      {/* Background Gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.02] to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-xs font-mono uppercase text-accent tracking-widest mb-2 block">Metrics</span>
            <h2 className="text-4xl lg:text-5xl font-serif text-primary">See how people are <br/><i className="text-primary/50">getting hired</i></h2>
          </div>
          <div className="bg-background border border-border p-6 w-full md:w-auto min-w-[300px] transition-colors duration-300">
            <p className="text-5xl font-serif text-primary mb-1">300%</p>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wide">increase in on-site time</p>
          </div>
        </div>

        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent gap-4">
          
          {/* First Row */}
          <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem] py-2">
            
            {/* Card 1: Testimonial */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD22TqTxQGGgkJSnvI5O5QtNzli6aDa0RfcCPYi_z-zqlgU_4gJRpfoyysC3MAX7BYNAaS0lo8T68N4lZRBOk7ulkv2a9IGJ0WKkwuYODNE0ZtDf8OQ2YSIW8NG74tKgzpwpBSj52vzN3NCPDz3W6rFb8wxgBhTJhocoQZancE0RqZiXGE5kvKGb5FPkurazmuntTpNdAQNC6Zq4Vw1ur1cIe_5Oz-kSvoZ48dXZ-DDK-ThhnZ5jHRoEVk8VSdiowRgrkzfOPPnDg')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Sarah Jenkins</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Product Designer</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"I sent my Profolio link to a recruiter and they spent 15 minutes chatting with my bot."</p>
            </div>

            {/* Card 2: Testimonial - Michael */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGtqL-5X8hR6V5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Michael Chang</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Frontend Dev</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"The way it handles technical questions is impressive. It explained my state management perfectly."</p>
            </div>

             {/* Card 3: Testimonial */}
             <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA2N_DUP9R1-Cvw3NdiXk72uTwspi34eo-99pKu1o8gsdWGibwTjNxNbZKsmVxLVwl9k9OjAdFaTJTdpjscqIKugICdCrQd0r6O0S6XXg2kiyHDB3bK_ecTuXHiSwzPDFJCH6XFJsxJTBqg63xa7CGFvgpisH-fALrGKz0z3073MwYIWguZqnvtmqcCFK5BYLbTN_BrGNx9EUiwbxP_yjklEL22aD55CPZl0uBSARJl9_FFLI_Hu7cEituVrRd5DqZXtk6PXcofQ')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">David Chen</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Full Stack Dev</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"Updating my PDF resume was a nightmare. Dropping my LinkedIn PDF into Profolio took 30 seconds."</p>
            </div>

          </Marquee>

          {/* Second Row */}
          <Marquee reverse pauseOnHover className="[--duration:40s] [--gap:2rem] py-2">
            
             {/* Card 4: Testimonial - Jessica */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCybM_PaAA1EWuyzRjSRxM7IdOcypSI8rCcGpfgkJ66mbQrxPLAF98Lxfk6Po8fahg9vaJxXWr1Tf0U_cq5UHl8Wv0jpzgotOkh4WZPjcHYChYeBE_8xiteXxJhjG48YIjAieh_2hVmrBIvSxzln_DCEuxurQSVv74BsK8nWrg2xDdCI5EvOot3aCL4Mz3DohymKM1uutUxNmemycr6J4ccIBN5oXqy2hfUVb1RxxsudxXElQi9szfpLd-Y7i3Uc1Bp0dOL6NzWOA')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Jessica Lee</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Product Manager</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"Recruiters love the 'Ask me anything' feature. It saves them time and lets my personality shine."</p>
            </div>

            {/* Card 5: Testimonial */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyJh-9n1qxgq0lorptr_y0ona0xymhZcXgEJCt0qj9YPwSUtIas4ld3wLE1jWXgelAO5QVkFAd3HEBcdd6wVgi9fW6bF4X_55oXDT2y7NZcCX-U8vGQ5xW6BqLKcNiuvu14s5_4ldtXIxJpnCi5K4D4XGjukw2XRwpSKoWUGO0hPyzT4wPCDSFrnfLC_P8WbB-Co0Ksn42B9mGuArAxLu1mm9xoBaq0rEZOmuZwBi-Fr1PgPnW7DDG80QXdpdKNmFncIzqK04Ehg')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Elena Rodriguez</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">UX Researcher</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"The analytics feature is a game changer. I can see exactly which case studies recruiters look at."</p>
            </div>

            {/* Card 6: Testimonial - Alex */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgWsmvnB4AUYbX_oS-IHr9UGoQjAWoAt4BLokLAum8IIfuWkuvQnmDQlu-uI-5xQMqGAn2Ik1Y9rEkQSJAsu7_IQ0vpPaHtXi8jJ36MtlC70FktJLN0wSmRdaP0lEqhWII5uH1RdPBr1lUV6QjbTWD2bhBy2ybR0PjL4JplVG1e3vBO5moceznnKg67eclNqUxndx5JnzW178-vbHxRf997Th626d_vHh4aqJYNT4C86PHUO7C87I_YPKzr1RM7zIOwbR22wJOMA')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Alex Thompson</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Engineering Lead</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"I was skeptical at first, but the AI twin actually captures my voice really well. It's 24/7."</p>
            </div>

          </Marquee>

          {/* Third Row */}
          <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem] py-2">
            
            {/* Card 7: Testimonial - Marcus */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD22TqTxQGGgkJSnvI5O5QtNzli6aDa0RfcCPYi_z-zqlgU_4gJRpfoyysC3MAX7BYNAaS0lo8T68N4lZRBOk7ulkv2a9IGJ0WKkwuYODNE0ZtDf8OQ2YSIW8NG74tKgzpwpBSj52vzN3NCPDz3W6rFb8wxgBhTJhocoQZancE0RqZiXGE5kvKGb5FPkurazmuntTpNdAQNC6Zq4Vw1ur1cIe_5Oz-kSvoZ48dXZ-DDK-ThhnZ5jHRoEVk8VSdiowRgrkzfOPPnDg')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Marcus Johnson</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Mobile Dev</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"Native feel on the web. The animations are buttery smooth and the dark mode is perfect."</p>
            </div>

            {/* Card 8: Testimonial - Emily */}
            <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGtqL-5X8hR6V5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5w8R5')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Emily Chen</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Copywriter</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"I'm a writer, not a coder. Profolio let me build a site that looks like I hired an agency."</p>
            </div>

             {/* Card 9: Testimonial - Lucas */}
             <div className="w-[340px] h-[150px] bg-background p-5 border border-border transition-colors duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="size-8 bg-surface-highlight rounded-full bg-cover grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA2N_DUP9R1-Cvw3NdiXk72uTwspi34eo-99pKu1o8gsdWGibwTjNxNbZKsmVxLVwl9k9OjAdFaTJTdpjscqIKugICdCrQd0r6O0S6XXg2kiyHDB3bK_ecTuXHiSwzPDFJCH6XFJsxJTBqg63xa7CGFvgpisH-fALrGKz0z3073MwYIWguZqnvtmqcCFK5BYLbTN_BrGNx9EUiwbxP_yjklEL22aD55CPZl0uBSARJl9_FFLI_Hu7cEituVrRd5DqZXtk6PXcofQ')" }}></div>
                <div>
                  <p className="text-sm font-bold text-primary font-serif leading-none mb-1">Lucas Wright</p>
                  <p className="text-[10px] text-text-muted font-mono uppercase leading-none">Architect</p>
                </div>
              </div>
              <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-2">"Visualizing my blueprints with the interactive gallery has blown my clients away."</p>
            </div>

          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;