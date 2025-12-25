"use client";

import { WorkflowTemplate } from "@/types/workflows";
import { WorkflowPreview } from "./WorkflowPreview";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface FeaturedHeroProps {
  workflows: WorkflowTemplate[];
}

export function FeaturedHero({ workflows }: FeaturedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate featured items
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workflows.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [workflows.length]);

  if (workflows.length === 0) return null;

  const currentWorkflow = workflows[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto mb-12 px-6">
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWorkflow.id}
            className="absolute inset-0 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Content */}
            <div className="w-1/2 p-12 flex flex-col justify-center z-10 relative">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-amber-400" /> Featured Workflow
                </span>
                <span className="text-neutral-400 text-sm font-medium">by {currentWorkflow.author}</span>
              </motion.div>

              <motion.h1 className="text-4xl font-bold text-white mb-4 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {currentWorkflow.title}
              </motion.h1>

              <motion.p
                className="text-neutral-400 text-lg mb-8 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentWorkflow.description}
              </motion.p>

              <motion.div className="flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
                  onClick={() => console.log("Use workflow clicked")}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Use Template
                </button>
                <button
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 border border-neutral-700"
                  onClick={() => console.log("View details clicked")}
                >
                  View Details
                </button>
              </motion.div>
            </div>

            {/* Right Preview */}
            <div className="w-1/2 relative bg-neutral-800/50 border-l border-neutral-800">
              <div className="absolute inset-0 opacity-90">
                <WorkflowPreview nodes={currentWorkflow.nodes} edges={currentWorkflow.edges} />
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-12 flex gap-2 z-20">
          {workflows.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn("w-2 h-2 rounded-full transition-all duration-300", idx === currentIndex ? "w-8 bg-blue-500" : "bg-neutral-700 hover:bg-neutral-600")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
