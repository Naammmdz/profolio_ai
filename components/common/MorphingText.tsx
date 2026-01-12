import React, { useEffect, useRef } from "react";

const defaultTexts = [
  "Designers",
  "Developers",
  "Founders",
  "Product Managers",
  "Data Scientists",
  "Writers",
  "Marketers",
  "Architects"
];

interface MorphingTextProps {
  texts?: string[];
  className?: string;
}

export const MorphingText: React.FC<MorphingTextProps> = ({ 
  texts = defaultTexts, 
  className 
}) => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = 0.25;
    const morphTime = 1;
    const cooldownTime = 0.25;

    const elts = {
      text1: text1Ref.current,
      text2: text2Ref.current,
    };

    if (!elts.text1 || !elts.text2) return;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];

    let animationId: number;

    const doCooldown = () => {
      morph = 0;

      if (!elts.text1 || !elts.text2) return;

      elts.text2.style.filter = "";
      elts.text2.style.opacity = "100%";

      elts.text1.style.filter = "";
      elts.text1.style.opacity = "0%";
    };

    const setMorph = (fraction: number) => {
      if (!elts.text1 || !elts.text2) return;

      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }

        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [texts]);

  return (
    <div
      className={`relative mx-auto h-24 w-full max-w-screen-md text-center [filter:url(#threshold)_blur(0.6px)] md:h-36 ${className}`}
    >
      <span
        ref={text1Ref}
        className="absolute inset-0 m-auto inline-block w-full text-5xl font-serif font-bold text-primary md:text-8xl leading-none"
      />
      <span
        ref={text2Ref}
        className="absolute inset-0 m-auto inline-block w-full text-5xl font-serif font-bold text-primary md:text-8xl leading-none"
      />
      
      {/* SVG Filter for Gooey Effect */}
      <svg className="hidden">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};