import { useRef, useEffect, useState } from "react";
import Car from "../models/Car";
import DebugInfo from "./DebugInfo";
import Road from "../models/Road";

/**
 * SimulationCanvas Component: Renders the simulation and allows toggling AI/manual mode.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIControlled, setIsAIControlled] = useState(false);
  const road = new Road(200, 300, 3); // Centered at x=200, width=300px, 3 lanes
  const [car, setCar] = useState(new Car(road.getLaneCenter(1), 500, road, isAIControlled));

  // Debugging state
  const [debugInfo, setDebugInfo] = useState({
    x: car.x,
    y: car.y,
    speed: car.speed,
    angle: car.angle,
  });

  useEffect(() => {
    setCar(new Car(road.getLaneCenter(1), 500, road, isAIControlled)); // Reset car on mode change
  }, [isAIControlled]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const canvasHeight = canvas.height;

    const handleKeyDown = (event: KeyboardEvent) => car.handleInput(event, true);
    const handleKeyUp = (event: KeyboardEvent) => car.handleInput(event, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    /**
     * Animation loop to update and draw the car.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvasHeight);

      // Update road scrolling
      road.updateScroll(car.y);

      // Draw the road with scrolling effect
      road.draw(ctx, canvasHeight);
      car.update();
      car.draw(ctx);

      // Update debug state on every frame
      setDebugInfo({
        x: car.x,
        y: car.y,
        speed: car.speed,
        angle: car.angle,
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [car]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={canvasRef} width={400} height={500} className="bg-gray-800" />

      {/* Debug Info Panel (Now Updates Dynamically) */}
      <DebugInfo 
        x={debugInfo.x} 
        y={debugInfo.y} 
        speed={debugInfo.speed} 
        angle={debugInfo.angle * (180 / Math.PI)} // Convert radians to degrees
        isAIControlled={isAIControlled} 
      />

      {/* Toggle AI/Manual Mode */}
      <button
        onClick={() => setIsAIControlled(!isAIControlled)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        {isAIControlled ? "Switch to Manual Mode" : "Switch to AI Mode"}
      </button>
    </div>
  );
};

export default SimulationCanvas;
