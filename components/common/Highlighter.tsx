import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { annotate } from "rough-notation";

// Types
type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  delay?: number;
}

const Highlighter: React.FC<HighlighterProps> = ({
  children,
  action = "highlight",
  color = "#d97706",
  strokeWidth = 2,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = true,
  delay = 0,
}) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<any>(null);

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });

  const shouldShow = !isView || isInView;
  
  // For overlay actions (crossing out), we want the annotation to render ON TOP of the text.
  // The SVG is appended after the text span, so naturally it will be on top if z-indexes are equal.
  // For background actions (highlight), we need the text to be elevated (z-10) to show above the color.
  const isOverlayAction = action === "crossed-off" || action === "strike-through";

  useEffect(() => {
    if (!shouldShow) return;

    const element = elementRef.current;
    if (!element) return;

    // Small delay to ensure layout is ready
    const timeout = setTimeout(() => {
        const annotationConfig = {
            type: action,
            color,
            strokeWidth,
            animationDuration,
            iterations,
            padding,
            multiline,
        };

        const annotation = annotate(element, annotationConfig as any);
        annotationRef.current = annotation;
        annotationRef.current.show();
    }, delay);

    // Resize observer to handle layout changes
    const resizeObserver = new ResizeObserver(() => {
      if (annotationRef.current) {
         // Re-showing forces recalculation in rough-notation
        annotationRef.current.hide();
        annotationRef.current.show();
      }
    });

    resizeObserver.observe(element);
    
    return () => {
      clearTimeout(timeout);
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
      resizeObserver.disconnect();
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    delay
  ]);

  return (
    <span ref={elementRef} className="relative inline-block">
        <span className={`relative ${isOverlayAction ? "" : "z-10"}`}>{children}</span>
    </span>
  );
};

export default Highlighter;