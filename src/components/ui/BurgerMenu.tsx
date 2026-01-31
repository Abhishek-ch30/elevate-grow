import { motion, MotionConfig } from "framer-motion";
import { useState } from "react";

interface BurgerMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    className?: string;
}

export function BurgerMenu({ isOpen, setIsOpen, className }: BurgerMenuProps) {
    const variant = isOpen ? "clicked" : "default";

    // Animation variants extracted/adapted from the Framer component
    const topLineVariants = {
        default: { rotate: 0, y: 0 },
        clicked: { rotate: 45, y: 6, originX: 0.5 }, // Adjusted for alignment
    };

    const middleLineVariants = {
        default: { opacity: 1, scale: 1 },
        clicked: { opacity: 0, scale: 0 }, // Fades out
    };

    const bottomLineVariants = {
        default: { rotate: 0, y: 0 },
        clicked: { rotate: -45, y: -6, originX: 0.5 }, // Adjusted for alignment
    };

    return (
        <MotionConfig transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}>
            <motion.button
                animate={variant}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 ${className}`}
                aria-label="Toggle Menu"
            >
                <motion.div
                    className="w-5 h-0.5 bg-white rounded-full origin-center"
                    variants={topLineVariants}
                />
                <motion.div
                    className="w-5 h-0.5 bg-white rounded-full origin-center"
                    variants={middleLineVariants}
                />
                <motion.div
                    className="w-5 h-0.5 bg-white rounded-full origin-center"
                    variants={bottomLineVariants}
                />
            </motion.button>
        </MotionConfig>
    );
}
