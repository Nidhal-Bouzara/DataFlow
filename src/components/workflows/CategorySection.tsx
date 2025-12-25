"use client";

import { WorkflowTemplate } from "@/types/workflows";
import { WorkflowCard } from "./WorkflowCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

interface CategorySectionProps {
  title: string;
  icon?: React.ReactNode;
  workflows: WorkflowTemplate[];
}

export function CategorySection({ title, icon, workflows }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (workflows.length === 0) return null;

  return (
    <section className="mb-12 w-full max-w-[100vw] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-500">{icon}</div>}
          <h2 className="text-2xl font-bold text-neutral-800">{title}</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium border border-neutral-200">{workflows.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group">
            See All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 px-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Spacer for left padding alignment */}
          <div className="w-0 shrink-0" />

          {workflows.map((workflow, index) => (
            <motion.div key={workflow.id} className="snap-start shrink-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
              <WorkflowCard workflow={workflow} />
            </motion.div>
          ))}

          {/* Spacer for right padding alignment */}
          <div className="w-0 shrink-0" />
        </div>
      </div>
    </section>
  );
}
