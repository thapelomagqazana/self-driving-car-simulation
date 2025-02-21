import { useEffect, useRef } from "react";
import { Car } from "./utils/Car";
import { Road } from "./utils/Road";
import { Obstacle } from "./utils/Obstacle";
import { Sensor } from "./utils/Sensor";

/**
 * Main React component to render the car simulation with a road and obstacles.
 */
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let car: Car;
  let road: Road;
  let obstacles: Obstacle[];
  let sensor: Sensor;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth * 0.9; // 90% of screen width
    canvas.height = window.innerHeight * 0.5; // 50% of screen height

    // Initialize road
    road = new Road(canvas.width / 2, canvas.width * 0.5, 3); // Adjust width dynamically

    // Initialize car at the center lane
    car = new Car(road.getLaneCenter(1), canvas.height - 60, 40, 60);

    sensor = new Sensor(car);

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
      sensor.update(road, obstacles);
      sensor.draw(ctx);

      // Draw obstacles
      obstacles.forEach((obstacle) => obstacle.draw(ctx));

      requestAnimationFrame(animate);
    };

    animate(); // Start the animation loop

    // Resize canvas dynamically when window resizes
    const handleResize = () => {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.5;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-primary text-xl sm:text-2xl md:text-4xl font-title tracking-widest text-center">
        🚗 Self-Driving Car Simulation
      </h1>
      <canvas
        ref={canvasRef}
        className="border-4 border-secondary mt-5 rounded-lg shadow-lg max-w-full h-auto"
      ></canvas>
    </div>
  );
};

export default App;
