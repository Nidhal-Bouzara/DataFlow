"use client";

import { LeftPanel } from "@/components/sidebar/LeftPanel";
import { FeaturedHero } from "@/components/workflows/FeaturedHero";
import { CategorySection } from "@/components/workflows/CategorySection";
import { FilterBar } from "@/components/workflows/FilterBar";
import { mockWorkflows } from "@/lib/workflowsData";
import { FileText, Database, Zap, Bot } from "lucide-react";

export default function WorkflowsPage() {
  // Group workflows by category
  const docProcessingWorkflows = mockWorkflows.filter((w) => w.category === "document-processing");
  const dataExtractionWorkflows = mockWorkflows.filter((w) => w.category === "data-extraction");
  const automationWorkflows = mockWorkflows.filter((w) => w.category === "automation");
  const aiWorkflows = mockWorkflows.filter((w) => w.category === "ai-powered");
  const featuredWorkflows = mockWorkflows.filter((w) => w.isFeatured);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50 font-sans relative">
      {/* Preview Ribbon */}
      <div className="absolute top-0 right-0 w-56 h-56 overflow-hidden pointer-events-none z-50">
        <div className="absolute top-[32px] right-[-60px] w-[260px] rotate-45 bg-amber-400 text-amber-950 font-bold py-2 text-center shadow-lg border-2 border-amber-500/50">
          <span className="block text-lg">PREVIEW</span>
          <span className="block text-xs uppercase tracking-wider opacity-90">Under Construction</span>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <LeftPanel />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="min-h-full pb-20">
          {/* Header */}
          <header className="pt-12 pb-6 px-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Explore Workflows</h1>
            <p className="text-neutral-500 text-lg">Discover pre-built templates to automate your data tasks.</p>
          </header>

          {/* Filter Bar */}
          <FilterBar />

          {/* Featured Hero Section */}
          <FeaturedHero workflows={featuredWorkflows} />

          {/* Categories */}
          <div className="space-y-4">
            <CategorySection title="Document Processing" icon={<FileText className="w-6 h-6" />} workflows={docProcessingWorkflows} />

            <CategorySection title="AI Powered" icon={<Bot className="w-6 h-6" />} workflows={aiWorkflows} />

            <CategorySection title="Data Extraction" icon={<Database className="w-6 h-6" />} workflows={dataExtractionWorkflows} />

            <CategorySection title="Automation" icon={<Zap className="w-6 h-6" />} workflows={automationWorkflows} />
          </div>
        </div>
      </main>
    </div>
  );
}
