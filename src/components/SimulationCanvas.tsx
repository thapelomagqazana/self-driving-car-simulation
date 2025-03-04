import { useRef, useEffect, useState } from "react";
import Car from "../models/Car";
import Road from "../models/Road";
import Traffic from "../models/Traffic";
import DebugInfo from "./DebugInfo";

/**
 * SimulationCanvas Component: Optimized for performance.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIControlled, setIsAIControlled] = useState(false);
  const road = new Road(200, 300, 3);
  const [car, setCar] = useState(new Car(road.getLaneCenter(1), 500, road, isAIControlled));

  const [collisionMessage, setCollisionMessage] = useState<string | null>(null);
  const [trafficData, setTrafficData] = useState({ carCount: 0, nearestCarDistance: Infinity });

  // Add this state at the top of your component:
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const traffic = new Traffic(road, 5, 3000);

  const staticObstacles = [
    { x: road.getLaneCenter(0) - 20, y: 350, width: 40, height: 40 },
    { x: road.getLaneCenter(2) - 20, y: 500, width: 40, height: 40 },
  ];

  const [debugInfo, setDebugInfo] = useState({
    x: car.x,
    y: car.y,
    speed: car.speed,
    angle: car.angle,
    roadInfo: road.getDebugInfo(),
    sensorReadings: car.sensor.smoothReadings,
    trafficData
  });

  useEffect(() => {
    setCar(new Car(road.getLaneCenter(1), 500, road, isAIControlled));
    setCollisionMessage(null);
  }, [isAIControlled]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const canvasHeight = canvas.height;
    let animationFrameId: number;

    const handleKeyDown = (event: KeyboardEvent) => car.handleInput(event, true);
    const handleKeyUp = (event: KeyboardEvent) => car.handleInput(event, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const updateTrafficStats = () => {
      let minDistance = Number.MAX_VALUE;
      for (const trafficCar of traffic.cars) {
        const distance = Math.abs(car.y - trafficCar.y);
        if (distance < minDistance) minDistance = distance;
      }
      setTrafficData({ carCount: traffic.cars.length, nearestCarDistance: minDistance });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cameraY = -car.y + canvasHeight * 0.7;

      ctx.save();
      ctx.translate(0, cameraY);

      // Draw Road
      road.updateScroll(car.y);
      road.draw(ctx, canvasHeight, car.y);

      // Draw Static Obstacles
      ctx.fillStyle = "orange";
      for (const obstacle of staticObstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }

      traffic.update(car, staticObstacles);
      traffic.draw(ctx);

      // Update & Draw Player Car
      car.update(traffic.cars, staticObstacles);
      car.draw(ctx);

      if (car.collided && !collisionMessage) {
        setCollisionMessage("🚨 Collision Detected! Click Restart");
      }

      ctx.restore();

      setDebugInfo({
        x: car.x,
        y: car.y,
        speed: car.speed,
        angle: car.angle,
        roadInfo: road.getDebugInfo(),
        sensorReadings: car.sensor.smoothReadings,
        trafficData
      });
      updateTrafficStats(); // Update traffic stats
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [car]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-900 relative">
      
      {/* Debug Info Panel */}
      <div className="w-full max-w-sm mb-4 sm:mb-0">
        <DebugInfo 
          x={debugInfo.x} 
          y={debugInfo.y} 
          speed={debugInfo.speed} 
          angle={debugInfo.angle * (180 / Math.PI)} 
          isAIControlled={isAIControlled} 
          roadInfo={debugInfo.roadInfo}
          collisionStatus={car.collided}
          sensorReadings={debugInfo.sensorReadings}
          trafficData={trafficData}
        />
      </div>
  
      {/* Simulation Canvas */}
      <div className="relative flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={450}
          className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg"
        />
  
        {/* Collision Message */}
        {collisionMessage && (
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded shadow-lg animate-pulse">
            {collisionMessage}
          </div>
        )}
      </div>
  
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsToolbarVisible(!isToolbarVisible)}
        className="fixed bottom-20 right-4 p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 z-50"
        title={isToolbarVisible ? "Hide Controls" : "Show Controls"}
      >
        {isToolbarVisible ? "⬇️" : "⬆️"}
      </button>
  
      {/* Sticky Toolbar with animation */}
      <div
        className={`fixed bottom-0 left-0 right-0 py-3 px-4 shadow-inner flex flex-wrap justify-center gap-3 z-40 transition-transform duration-500 ${
          isToolbarVisible ? "translate-y-0" : "translate-y-full"
        } bg-black bg-opacity-70 backdrop-blur-md`}
      >
  
        {/* AI/Manual Mode Toggle */}
        <button
          onClick={() => setIsAIControlled(!isAIControlled)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transition-transform transform active:scale-95"
        >
          {isAIControlled ? "Switch to Manual Mode" : "Switch to AI Mode"}
        </button>
  
        {/* Training Buttons */}
        {!isAIControlled && (
          <>
            <button
              onClick={() => car.trainFromRecordedData()}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md transition-transform transform active:scale-95"
            >
              Train AI
            </button>
  
            <button
              onClick={() => car.saveModel()}
              className="px-4 py-2 bg-purple-500 text-white rounded-md shadow-md transition-transform transform active:scale-95"
            >
              Save AI Model
            </button>
  
            <button
              onClick={() => car.exportTrainingData()}
              className="px-4 py-2 bg-yellow-500 text-black rounded-md shadow-md transition-transform transform active:scale-95"
            >
              Export Training Data
            </button>
          </>
        )}
  
        {/* Restart Button */}
        {car.collided && (
          <button
            onClick={() => {
              car.reset();
              setCollisionMessage(null);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md transition-transform transform active:scale-95"
          >
            Restart Simulation
          </button>
        )}
      </div>
  
    </div>
  );  
};

export default SimulationCanvas;
