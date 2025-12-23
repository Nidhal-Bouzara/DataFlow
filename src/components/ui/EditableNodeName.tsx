"use client";

import { useState } from "react";

interface EditableNodeNameProps {
  name: string;
  onNameChange: (newName: string) => void;
  className?: string;
}

export function EditableNodeName({ name, onNameChange, className = "" }: EditableNodeNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTempName(name);
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isEditing ? (
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-xs border border-cyan-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setTempName(name);
            setIsEditing(true);
          }}
          className="flex-1 px-2 py-1 text-xs text-left text-gray-700 hover:bg-gray-50 rounded transition-colors"
        >
          <span className="font-medium">{name}</span>
        </button>
      )}
    </div>
  );
}
