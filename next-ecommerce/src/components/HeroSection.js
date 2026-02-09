"use client";

/**
 * HeroSection - Big Sale banner with modern animations
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          className="relative min-h-[280px] md:min-h-[360px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background image with zoom-in animation */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
              alt="Big Sale"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </motion.div>
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          {/* Content */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-8 md:px-16"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-2 tracking-tight"
            >
              Big Sale
            </motion.h1>
            <motion.p
              variants={itemUp}
              className="text-lg md:text-xl text-white/95 mb-6 drop-shadow max-w-md"
            >
              Update Your Style
            </motion.p>
            <motion.div variants={itemUp}>
              <Link href="/products">
                <motion.span
                  className="inline-flex w-fit px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(220, 38, 38, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Shop Now
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
          {/* Subtle floating accent */}
          <motion.div
            className="absolute bottom-4 right-8 md:right-16 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
