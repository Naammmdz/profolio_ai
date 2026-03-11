'use client';
/**
 * SplashCursorPreview — renders actual SplashCursor inside a clipped container.
 * Uses a portal-like approach: the SplashCursor canvas (fixed, fullscreen) is
 * clipped visually to the preview box using clip-path + pointer-events scoping.
 * Mouse events inside the preview div are forwarded to the cursor manually.
 */
import React, { useEffect, useRef, useState } from 'react';
import SplashCursor from './SplashCursor';

interface SplashCursorPreviewProps {
    /** className for the outer container */
    className?: string;
}

/**
 * Renders SplashCursor but constrains it visually to this container.
 * We achieve this by:
 * 1. Rendering the fixed SplashCursor normally (it covers the whole screen)
 * 2. Using a CSS clip rect on the canvas via a sibling overlay approach:
 *    - The container has `overflow: hidden`
 *    - We move the mouse only when inside the container
 * The SplashCursor is *always* active but only visibly trails inside
 * this container because we only generate splats from within its bounds.
 *
 * SIMPLER: We just render it and accept it's full-screen behind, then
 * overlay a hint. The real demo is on the PortfolioPreview page itself.
 * So instead, we render a CSS-only fluid animation that mimics the look.
 */
export default function SplashCursorPreview({ className = '' }: SplashCursorPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [blobs, setBlobs] = useState(() =>
        Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: 0.6 + Math.random() * 0.4,
            g: 0.2 + Math.random() * 0.5,
            b: 0.8 + Math.random() * 0.2,
            size: 60 + Math.random() * 80,
        }))
    );

    // Auto-animate blobs
    useEffect(() => {
        let rafId: number;
        function tick() {
            setBlobs(prev => prev.map(b => {
                let nx = b.x + b.vx;
                let ny = b.y + b.vy;
                let nvx = b.vx;
                let nvy = b.vy;
                if (nx < 5 || nx > 95) nvx = -nvx;
                if (ny < 5 || ny > 95) nvy = -nvy;
                return { ...b, x: nx, y: ny, vx: nvx, vy: nvy };
            }));
            rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // On hover — attract blobs gently toward cursor
    useEffect(() => {
        if (!isHovered) return;
        const interval = setInterval(() => {
            setBlobs(prev => prev.map((b, i) => {
                const dx = mousePos.x - b.x;
                const dy = mousePos.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                const force = Math.min(1.5 / dist, 0.08);
                return {
                    ...b,
                    vx: b.vx * 0.96 + dx * force * 0.3 + (Math.random() - 0.5) * 0.1,
                    vy: b.vy * 0.96 + dy * force * 0.3 + (Math.random() - 0.5) * 0.1,
                };
            }));
        }, 16);
        return () => clearInterval(interval);
    }, [isHovered, mousePos]);

    function handleMouseMove(e: React.MouseEvent) {
        const rect = containerRef.current!.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }

    return (
        <div
            ref={containerRef}
            className={`w-full h-full absolute inset-0 overflow-hidden bg-zinc-950 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* SVG fluid blobs with feGaussianBlur + feColorMatrix for metaball effect */}
            <svg className="absolute inset-0 w-full h-full" style={{ filter: 'url(#goo)' }}>
                <defs>
                    <filter id="goo-preview">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix in="blur" mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
                            result="goo" />
                    </filter>
                </defs>
                <g style={{ filter: 'url(#goo-preview)' }}>
                    {blobs.map(b => (
                        <ellipse
                            key={b.id}
                            cx={`${b.x}%`}
                            cy={`${b.y}%`}
                            rx={b.size * 0.6}
                            ry={b.size * 0.5}
                            fill={`rgb(${Math.round(b.r * 180 + 20)},${Math.round(b.g * 60 + 20)},${Math.round(b.b * 220 + 30)})`}
                            opacity={0.75}
                        />
                    ))}
                    {/* cursor blob */}
                    {isHovered && (
                        <ellipse
                            cx={`${mousePos.x}%`}
                            cy={`${mousePos.y}%`}
                            rx={50}
                            ry={45}
                            fill="rgb(120,180,255)"
                            opacity={0.9}
                        />
                    )}
                </g>
            </svg>

            {/* Hint text */}
            <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    {isHovered ? 'fluid cursor active' : 'hover to interact'}
                </span>
            </div>
        </div>
    );
}
