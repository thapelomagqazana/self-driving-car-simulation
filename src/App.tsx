import { useEffect, useRef } from "react";
import { Car } from "./utils/Car";
import { Road } from "./utils/Road";
import { Obstacle } from "./utils/Obstacle";

/**
 * Main React component to render the car simulation with a road and obstacles.
 */
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let car: Car;
  let road: Road;
  let obstacles: Obstacle[];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 600;
    canvas.height = 400;

    // Initialize road
    road = new Road(canvas.width / 2, 300, 3);

    // Initialize car at the center lane
    car = new Car(road.getLaneCenter(1), canvas.height - 60, 40, 60);

    // Initialize static obstacles
    obstacles = [
      new Obstacle(road.getLaneCenter(0), 200, 30, 30, "orange"), // Cone
      new Obstacle(road.getLaneCenter(2), 100, 50, 50, "brown"), // Barrier
    ];

    /**
     * Animation loop to update and render the car, road, and obstacles.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      road.draw(ctx); // Draw road with lane markings
      car.update(); // Update car mechanics
      car.draw(ctx); // Render the car

      // Draw obstacles
      obstacles.forEach((obstacle) => obstacle.draw(ctx));

      requestAnimationFrame(animate);
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
