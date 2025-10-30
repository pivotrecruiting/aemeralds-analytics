"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInContainer({
  children,
  className = "",
  delay = 0,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({
  children,
  className = "",
  delay = 0,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Export animation variants for custom usage
export { containerVariants, itemVariants };
