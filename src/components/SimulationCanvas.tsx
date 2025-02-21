import { useRef, useEffect, useState } from "react";
import Car from "../models/Car";

/**
 * SimulationCanvas Component: Renders the simulation on a HTML5 Canvas.
 * - Allows toggling between manual and AI control.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIControlled, setIsAIControlled] = useState(false);
  let car = new Car(200, 500, isAIControlled);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Handle key press events
    const handleKeyDown = (event: KeyboardEvent) => car.handleInput(event, true);
    const handleKeyUp = (event: KeyboardEvent) => car.handleInput(event, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    /**
     * Animation loop to update and draw the car.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      car.update();
      car.draw(ctx);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isAIControlled]); // React to AI toggle

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={400} height={500} className="bg-gray-800" />
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
