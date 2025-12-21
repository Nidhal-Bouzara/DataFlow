"use client";

import { cn } from "@/lib/utils";
import { Play, FileText, Save, Download, Settings, Undo, Wrench, MoreHorizontal, Minus, Plus } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export function BottomToolbar() {
  const { isRunning, runWorkflow } = useWorkflowStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-gray-200 px-2 py-2">
        {/* Run Button */}
        <button
          onClick={runWorkflow}
          disabled={isRunning}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl transition-colors", isRunning ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50 text-gray-700")}
        >
          <Play className={cn("w-4 h-4", isRunning && "animate-pulse")} fill={isRunning ? "currentColor" : "none"} />
          <span className="text-sm font-medium">Run once</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={<FileText className="w-4 h-4" />} label="New" />
          <ToolbarButton icon={<Save className="w-4 h-4" />} label="Save" />
          <ToolbarButton icon={<Download className="w-4 h-4" />} label="Export" />
          <ToolbarButton icon={<Settings className="w-4 h-4" />} label="Settings" />
          <ToolbarButton icon={<Undo className="w-4 h-4" />} label="Undo" />
          <ToolbarButton icon={<Wrench className="w-4 h-4" />} label="Tools" />
          <ToolbarButton icon={<MoreHorizontal className="w-4 h-4" />} label="More" />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={<Minus className="w-4 h-4" />} label="Zoom out" />
          <ToolbarButton icon={<Plus className="w-4 h-4" />} label="Zoom in" />
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors" title={label}>
      {icon}
    </button>
  );
}
