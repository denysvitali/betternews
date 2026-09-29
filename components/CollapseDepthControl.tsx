"use client";

interface CollapseDepthControlProps {
  currentDepth: number;
  onDepthChange: (depth: number) => void;
}

export function CollapseDepthControl({ currentDepth, onDepthChange }: CollapseDepthControlProps) {
  return (
    <label className="discussion-select">
      <span>Depth</span>
      <select aria-label="Thread depth" value={currentDepth} onChange={(event) => onDepthChange(Number(event.target.value))}>
        {[1, 2, 3, 4].map((depth) => <option key={depth} value={depth}>{depth} {depth === 1 ? "level" : "levels"}</option>)}
        <option value={99}>All replies</option>
      </select>
    </label>
  );
}
