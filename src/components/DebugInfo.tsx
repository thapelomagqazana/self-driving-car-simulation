import React from "react";

interface DebugInfoProps {
  x: number;
  y: number;
  speed: number;
  angle: number;
  isAIControlled: boolean;
  roadInfo: { lanePositions: number[]; leftBoundary: number; rightBoundary: number };
  sensorReadings: number[];
}

/**
 * DebugInfo Component: Displays real-time car, road, and sensor information.
 */
const DebugInfo: React.FC<DebugInfoProps> = ({ x, y, speed, angle, isAIControlled, roadInfo, sensorReadings }) => {
  return (
    <div className="absolute top-4 left-4 bg-gray-900 text-white p-3 rounded-md text-sm shadow-lg w-60">
      <h3 className="font-bold text-yellow-400">🔍 Debug Info</h3>

      <hr className="my-2 border-gray-600" />

      <p className="font-bold text-yellow-400">🚗 Car Info</p>
      <p>🚗 <strong>Mode:</strong> {isAIControlled ? "AI" : "Manual"}</p>
      <p>📍 <strong>Position:</strong> ({x.toFixed(1)}, {y.toFixed(1)})</p>
      <p>⚡ <strong>Speed:</strong> {speed.toFixed(2)} px/frame</p>
      <p>🔄 <strong>Angle:</strong> {angle.toFixed(2)}°</p>
      <hr className="my-2 border-gray-600" />
      
      <p className="font-bold text-yellow-400">🛣 Road Info</p>
      <p>⬅️ <strong>Left Boundary:</strong> {roadInfo.leftBoundary.toFixed(1)} px</p>
      <p>➡️ <strong>Right Boundary:</strong> {roadInfo.rightBoundary.toFixed(1)} px</p>
      <p>🛤 <strong>Lane Centers:</strong> {roadInfo.lanePositions.map(pos => pos.toFixed(1)).join(", ")}</p>

      <hr className="my-2 border-gray-600" />

      <p className="font-bold text-yellow-400">🛑 Sensor Readings</p>
      <ul className="list-none text-xs">
        {sensorReadings.map((reading, index) => (
          <li key={index} className={reading < 0.5 ? "text-red-400" : "text-green-400"}>
            Sensor {index + 1}: {reading.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebugInfo;
