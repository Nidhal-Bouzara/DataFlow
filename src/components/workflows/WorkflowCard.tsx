"use client";

import { WorkflowTemplate } from "@/types/workflows";
import { WorkflowPreview } from "./WorkflowPreview";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Heart, Info } from "lucide-react";

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  "document-processing": "bg-purple-100 text-purple-700 border-purple-200",
  "data-extraction": "bg-cyan-100 text-cyan-700 border-cyan-200",
  automation: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "ai-powered": "bg-blue-100 text-blue-700 border-blue-200",
};

const categoryLabels: Record<string, string> = {
  "document-processing": "Doc Processing",
  "data-extraction": "Data Extraction",
  automation: "Automation",
  "ai-powered": "AI Powered",
};

export function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  const handleCardClick = () => {
    console.log(`Clicked workflow: ${workflow.title} (${workflow.id})`);
    if (onClick) onClick();
  };

  return (
    <motion.div
      className="group relative w-[320px] h-[380px] bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden cursor-pointer flex flex-col"
      whileHover={{
        y: -8,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Preview Area - Takes up most of the card */}
      <div className="relative flex-1 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <WorkflowPreview nodes={workflow.nodes} edges={workflow.edges} />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm", categoryColors[workflow.category] || "bg-gray-100 text-gray-700 border-gray-200")}>
            {categoryLabels[workflow.category] || workflow.category}
          </span>
        </div>

        {/* Featured Badge */}
        {workflow.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm flex items-center gap-1">⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="relative z-10 p-5 pt-2 bg-white flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-neutral-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{workflow.title}</h3>
        </div>

        <p className="text-neutral-500 text-sm line-clamp-2 h-10">{workflow.description}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1">
              <Play className="w-3 h-3" /> {workflow.usageCount} uses
            </span>
            {workflow.difficulty && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded border",
                  workflow.difficulty === "Beginner"
                    ? "bg-green-50 text-green-600 border-green-100"
                    : workflow.difficulty === "Intermediate"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-red-50 text-red-600 border-red-100"
                )}
              >
                {workflow.difficulty}
              </span>
            )}
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0">
            <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors" title="Save to favorites">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors" title="View details">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
