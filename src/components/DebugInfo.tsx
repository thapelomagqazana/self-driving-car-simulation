import React, { useState } from "react";

interface DebugInfoProps {
  x: number;
  y: number;
  speed: number;
  angle: number;
  isAIControlled: boolean;
  roadInfo: { lanePositions: number[]; leftBoundary: number; rightBoundary: number };
  collisionStatus: boolean;
  sensorReadings: number[];
  trafficData: { carCount: number; nearestCarDistance: number };
}

/**
 * DebugInfo Component: Displays real-time car, road, and sensor information.
 */
const DebugInfo: React.FC<DebugInfoProps> = ({
  x, y, speed, angle, isAIControlled, roadInfo, collisionStatus, sensorReadings, trafficData
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const copyDebugInfo = () => {
    const debugText = `
🔍 Debug Info
🚗 Car Status
Mode: ${isAIControlled ? "AI" : "Manual"}
Position: (${x.toFixed(1)}, ${y.toFixed(1)})
Speed: ${speed.toFixed(2)} px/frame
Angle: ${angle.toFixed(2)}°
Collision: ${collisionStatus ? "Detected" : "None"}

🛣 Road Info
Left Boundary: ${roadInfo.leftBoundary.toFixed(1)} px
Right Boundary: ${roadInfo.rightBoundary.toFixed(1)} px
Lane Centers: ${roadInfo.lanePositions.map(pos => pos.toFixed(1)).join(", ")}

🛑 Sensor Readings
${sensorReadings.map((r, i) => `Sensor ${i + 1}: ${r.toFixed(2)}`).join("\n")}

🚗 Traffic
Total Cars: ${trafficData.carCount}
Nearest Car: ${trafficData.nearestCarDistance.toFixed(2)} m
    `;
    navigator.clipboard.writeText(debugText.trim());
    alert("✅ Debug info copied to clipboard!");
  };

  return (
    <div className="fixed top-4 left-4 max-h-[90vh] w-72 overflow-hidden bg-black bg-opacity-80 text-white rounded-lg shadow-2xl text-sm z-50 backdrop-blur-md border border-gray-700">

      {/* Header with toggle + copy */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <h3 className="font-bold text-yellow-400 text-lg">🔍 Debug Info</h3>
        <div className="flex gap-2">
          <button
            onClick={copyDebugInfo}
            className="text-xs px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            title="Copy Debug Info"
          >
            📋 Copy
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? "➕" : "➖"}
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto max-h-[75vh] space-y-3">
          
          {/* Car Info */}
          <section>
            <h4 className="font-semibold text-blue-400">🚗 Car Status</h4>
            <p>🧠 Mode: <span className="font-semibold">{isAIControlled ? "AI" : "Manual"}</span></p>
            <p>📍 Position: ({x.toFixed(1)}, {y.toFixed(1)})</p>
            <p>⚡ Speed: {speed.toFixed(2)} px/frame</p>
            <p>🔄 Angle: {angle.toFixed(2)}°</p>
            <p>💥 Collision: <span className={collisionStatus ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
              {collisionStatus ? "Detected" : "None"}
            </span></p>
          </section>

          <hr className="border-gray-700" />

          {/* Road Info */}
          <section>
            <h4 className="font-semibold text-purple-400">🛣 Road Info</h4>
            <p>⬅️ Left: {roadInfo.leftBoundary.toFixed(1)} px</p>
            <p>➡️ Right: {roadInfo.rightBoundary.toFixed(1)} px</p>
            <p>🛤 Lane Centers:</p>
            <ul className="pl-4 list-disc">
              {roadInfo.lanePositions.map((pos, i) => (
                <li key={i}>{pos.toFixed(1)} px</li>
              ))}
            </ul>
          </section>

          <hr className="border-gray-700" />

          {/* Sensor Readings */}
          <section>
            <h4 className="font-semibold text-green-400">🛑 Sensors</h4>
            <ul className="pl-4 list-decimal">
              {sensorReadings.map((reading, index) => (
                <li key={index} className={reading < 0.5 ? "text-red-400" : "text-green-400"}>
                  Sensor {index + 1}: {reading.toFixed(2)}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-gray-700" />

          {/* Traffic Info */}
          <section>
            <h4 className="font-semibold text-pink-400">🚗 Traffic</h4>
            <p>Total Cars: {trafficData.carCount}</p>
            <p>Nearest Car: {trafficData.nearestCarDistance.toFixed(2)} m</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
