import { useRef, useEffect, useState } from "react";
import Car from "../models/Car";
import Road from "../models/Road";
import DebugInfo from "./DebugInfo";

/**
 * SimulationCanvas Component: Optimized for performance.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIControlled, setIsAIControlled] = useState(false);
  const road = new Road(200, 300, 3);
  const [car, setCar] = useState(new Car(road.getLaneCenter(1), 500, road, isAIControlled));

  // Add traffic cars (later, we can make them move)
  const traffic: Car[] = [
    new Car(road.getLaneCenter(0), 200, road, true), // Static traffic car in left lane
    new Car(road.getLaneCenter(1), 300, road, true),
    new Car(road.getLaneCenter(2), 400, road, true)  // Static traffic car in right lane
  ];

  const [debugInfo, setDebugInfo] = useState({
    x: car.x,
    y: car.y,
    speed: car.speed,
    angle: car.angle,
    roadInfo: road.getDebugInfo(),
  });

  useEffect(() => {
    setCar(new Car(road.getLaneCenter(1), 500, road, isAIControlled));
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

    /**
     * Optimized Animation Loop
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Optimize camera movement
      const cameraY = -car.y + canvasHeight * 0.7;

      ctx.save();
      ctx.translate(0, cameraY);

      // **Optimize Road Rendering**
      road.updateScroll(car.y);
      road.draw(ctx, canvasHeight);

      // **Draw Traffic Cars**
      for (const trafficCar of traffic) {
        trafficCar.draw(ctx);
      }

      // Update & Draw Car
      car.update(traffic);
      car.draw(ctx);

      ctx.restore();

      // Update Debug Info
      setDebugInfo({
        x: car.x,
        y: car.y,
        speed: car.speed,
        angle: car.angle,
        roadInfo: road.getDebugInfo(),
      });

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
    <div className="flex items-start justify-center w-full h-screen p-4">
      {/* Debug Info Panel (Left Side) */}
      <div className="mr-4">
        <DebugInfo 
          x={debugInfo.x} 
          y={debugInfo.y} 
          speed={debugInfo.speed} 
          angle={debugInfo.angle * (180 / Math.PI)} 
          isAIControlled={isAIControlled} 
          roadInfo={debugInfo.roadInfo}
        />
      </div>

      {/* Simulation Canvas */}
      <div className="relative flex flex-col items-center">
        <canvas ref={canvasRef} width={400} height={450} className="bg-gray-800" />

        {/* Toggle AI/Manual Mode */}
        <button
          onClick={() => setIsAIControlled(!isAIControlled)}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {isAIControlled ? "Switch to Manual Mode" : "Switch to AI Mode"}
        </button>
      </div>
    </div>
  );
};

export default SimulationCanvas;
