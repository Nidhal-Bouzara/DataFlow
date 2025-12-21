"use client";

import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightPanel } from "@/components/sidebar/RightPanel";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";

export default function Home() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Navigation Sidebar */}
      <LeftSidebar />

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col relative">
        <WorkflowCanvas />
      </main>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
