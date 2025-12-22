"use client";

import { LeftPanel, RightPanel } from "@/components/sidebar";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";

export default function Home() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Navigation Sidebar */}
      <LeftPanel />

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col relative">
        <WorkflowCanvas />
      </main>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
