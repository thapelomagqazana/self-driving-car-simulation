import React from "react";

interface DebugInfoProps {
  x: number;
  y: number;
  speed: number;
  angle: number;
  isAIControlled: boolean;
  roadInfo: { lanePositions: number[]; leftBoundary: number; rightBoundary: number };
}

/**
 * DebugInfo Component: Displays real-time car and road information.
 */
const DebugInfo: React.FC<DebugInfoProps> = ({ x, y, speed, angle, isAIControlled, roadInfo }) => {
  return (
    <div className="absolute top-4 left-4 bg-gray-900 text-white p-3 rounded-md text-sm shadow-lg w-60">
      <p className="font-bold text-yellow-400">🔍 Debug Info</p>
      <p>🚗 <strong>Mode:</strong> {isAIControlled ? "AI" : "Manual"}</p>
      <p>📍 <strong>Position:</strong> ({x.toFixed(1)}, {y.toFixed(1)})</p>
      <p>⚡ <strong>Speed:</strong> {speed.toFixed(2)} px/frame</p>
      <p>🔄 <strong>Angle:</strong> {angle.toFixed(2)}°</p>
      <hr className="my-2 border-gray-600" />
      <p className="font-bold text-yellow-400">🛣 Road Info</p>
      <p>⬅️ <strong>Left Boundary:</strong> {roadInfo.leftBoundary.toFixed(1)} px</p>
      <p>➡️ <strong>Right Boundary:</strong> {roadInfo.rightBoundary.toFixed(1)} px</p>
      <p>🛤 <strong>Lane Centers:</strong> {roadInfo.lanePositions.map(pos => pos.toFixed(1)).join(", ")}</p>
    </div>
  );
};

export default DebugInfo;
