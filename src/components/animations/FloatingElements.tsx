"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    amplitude?: number;
    enableParallax?: boolean;
}

export function FloatingElement({
    children,
    className = "",
    delay = 0,
    duration = 6,
    amplitude = 20,
    enableParallax = true,
}: FloatingElementProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        if (!enableParallax) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) / 30;
            const deltaY = (e.clientY - centerY) / 30;

            mouseX.set(deltaX);
            mouseY.set(deltaY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [enableParallax, mouseX, mouseY]);

    return (
        <motion.div
            ref={ref}
            style={{ x: enableParallax ? x : 0, y: enableParallax ? y : 0 }}
            animate={{
                y: [0, -amplitude, 0],
                rotate: [-2, 3, -2],
            }}
            transition={{
                y: {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                },
                rotate: {
                    duration: duration * 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Floating Racket Component
export function FloatingRacket({ className = "" }: { className?: string }) {
    return (
        <FloatingElement
            className={`relative ${className}`}
            amplitude={25}
            duration={7}
        >
            <div className="relative">
                {/* Racket SVG Representation */}
                <svg
                    width="200"
                    height="400"
                    viewBox="0 0 200 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-2xl"
                >
                    {/* Racket Head */}
                    <ellipse
                        cx="100"
                        cy="100"
                        rx="80"
                        ry="100"
                        stroke="url(#racketGradient)"
                        strokeWidth="6"
                        fill="none"
                    />
                    {/* Strings Horizontal */}
                    {[...Array(8)].map((_, i) => (
                        <line
                            key={`h-${i}`}
                            x1="25"
                            y1={40 + i * 15}
                            x2="175"
                            y2={40 + i * 15}
                            stroke="#00f2ff"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                    ))}
                    {/* Strings Vertical */}
                    {[...Array(6)].map((_, i) => (
                        <line
                            key={`v-${i}`}
                            x1={40 + i * 24}
                            y1="10"
                            x2={40 + i * 24}
                            y2="190"
                            stroke="#00f2ff"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                    ))}
                    {/* Handle */}
                    <rect
                        x="85"
                        y="200"
                        width="30"
                        height="180"
                        rx="5"
                        fill="url(#handleGradient)"
                    />
                    {/* Handle Grip Pattern */}
                    {[...Array(12)].map((_, i) => (
                        <line
                            key={`grip-${i}`}
                            x1="85"
                            y1={210 + i * 14}
                            x2="115"
                            y2={220 + i * 14}
                            stroke="#7b2cbf"
                            strokeWidth="2"
                            opacity="0.8"
                        />
                    ))}
                    <defs>
                        <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f2ff" />
                            <stop offset="100%" stopColor="#7b2cbf" />
                        </linearGradient>
                        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1a1a2e" />
                            <stop offset="50%" stopColor="#0a0a12" />
                            <stop offset="100%" stopColor="#1a1a2e" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Glow Effect */}
                <div className="absolute inset-0 blur-3xl opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-deep-purple rounded-full" />
                </div>
            </div>
        </FloatingElement>
    );
}

// Floating Shuttlecock Component
export function FloatingShuttle({
    className = "",
    delay = 0,
}: {
    className?: string;
    delay?: number;
}) {
    return (
        <FloatingElement
            className={`relative ${className}`}
            amplitude={15}
            duration={5}
            delay={delay}
        >
            <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
            >
                {/* Cork Base */}
                <circle cx="30" cy="70" r="10" fill="url(#corkGradient)" />
                {/* Feathers */}
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x1 = 30 + Math.sin(angle) * 10;
                    const y1 = 60;
                    const x2 = 30 + Math.sin(angle) * 25;
                    const y2 = 10;
                    return (
                        <path
                            key={i}
                            d={`M${x1} ${y1} Q${30 + Math.sin(angle) * 20} 35 ${x2} ${y2}`}
                            stroke="#00f2ff"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.8"
                        />
                    );
                })}
                {/* Feather Tips */}
                <circle cx="30" cy="10" r="3" fill="#00f2ff" />
                <defs>
                    <radialGradient id="corkGradient">
                        <stop offset="0%" stopColor="#f5f5dc" />
                        <stop offset="100%" stopColor="#d4c4a8" />
                    </radialGradient>
                </defs>
            </svg>
            {/* Glow */}
            <div className="absolute inset-0 blur-2xl opacity-40 bg-neon-cyan rounded-full" />
        </FloatingElement>
    );
}

// Particle Effect Background
export function ParticleField() {
    const particles = [...Array(30)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-neon-cyan"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
