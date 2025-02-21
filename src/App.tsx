import { useEffect, useRef } from "react";
import { Car } from "./utils/Car";

/**
 * Main React component to render the car simulation.
 */
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let car: Car;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 600;
    canvas.height = 400;

    // Create a car at the bottom center of the canvas
    car = new Car(canvas.width / 2, canvas.height - 60, 40, 60);

    /**
     * Animation loop to update and render the car on each frame.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      car.update(); // Update car mechanics
      car.draw(ctx); // Render the car
      requestAnimationFrame(animate); // Recursively call the function for smooth animation
    };

    animate(); // Start the animation loop
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold text-blue-600">🚗 Self-Driving Car Simulation</h1>
      <canvas ref={canvasRef} className="border-2 border-gray-800 mt-5"></canvas>
    </div>
  );
};

export default App;
