import { useRef, useEffect } from "react";
import Car from "../models/Car";

/**
 * SimulationCanvas Component: Handles rendering the simulation on a HTML5 Canvas.
 * - Initializes and animates the car.
 * - Uses requestAnimationFrame for smooth rendering.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let car = new Car(200, 500); // Initialize the car at a starting position

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    /**
     * Animation loop to update and draw the car on each frame.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      car.update(); // Update car physics
      car.draw(ctx); // Draw the updated car position

      requestAnimationFrame(animate); // Loop the animation
    };

    animate(); // Start the animation loop
  }, []);

  return <canvas ref={canvasRef} width={400} height={600} className="bg-gray-800" />;
};

export default SimulationCanvas;
