import { useRef, useEffect } from "react";
import Car from "../models/Car";

/**
 * SimulationCanvas Component: Handles rendering the simulation on a HTML5 Canvas.
 * - Initializes and animates the car.
 * - Uses keyboard input for acceleration, braking, and steering.
 */
const SimulationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let car = new Car(200, 500); // Initial position of the car

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    /**
     * Handles key press events.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      car.handleInput(event, true);
    };

    /**
     * Handles key release events.
     */
    const handleKeyUp = (event: KeyboardEvent) => {
      car.handleInput(event, false);
    };

    // Attach event listeners for keyboard input
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    /**
     * Animation loop to update and draw the car.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      car.update(); // Update car physics
      car.draw(ctx); // Draw the updated car position

      requestAnimationFrame(animate); // Loop the animation
    };

    animate(); // Start the animation loop

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={600} className="bg-gray-800" />;
};

export default SimulationCanvas;
