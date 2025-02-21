import React from "react";

interface DebugInfoProps {
  x: number;
  y: number;
  speed: number;
  angle: number;
  isAIControlled: boolean;
}

/**
 * DebugInfo Component: Displays real-time car statistics for debugging.
 */
const DebugInfo: React.FC<DebugInfoProps> = ({ x, y, speed, angle, isAIControlled }) => {
  return (
    <div className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-md text-sm">
      <p><strong>Debug Info</strong></p>
      <p>🚗 <strong>Mode:</strong> {isAIControlled ? "AI" : "Manual"}</p>
      <p>📍 <strong>Position:</strong> ({x.toFixed(1)}, {y.toFixed(1)})</p>
      <p>⚡ <strong>Speed:</strong> {speed.toFixed(2)} px/frame</p>
      <p>🔄 <strong>Angle:</strong> {angle.toFixed(2)}°</p>
    </div>
  );
};

export default DebugInfo;
