"use client";

import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const filters = [
  { id: "all", label: "All Workflows" },
  { id: "document-processing", label: "Document Processing" },
  { id: "data-extraction", label: "Data Extraction" },
  { id: "automation", label: "Automation" },
  { id: "ai-powered", label: "AI Powered" },
];

export function FilterBar() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border-b border-neutral-200 mb-8">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeFilter === filter.id
                    ? "bg-neutral-900 text-white shadow-md scale-105"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-xl leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
