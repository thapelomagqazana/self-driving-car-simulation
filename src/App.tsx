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
    
    // Set dynamic size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.5;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize road, car, and sensor
    road = new Road(canvas.width / 2, canvas.width * 0.5, 3);
    car = new Car(road.getLaneCenter(1), canvas.height - 60, 40, 60);
    sensor = new Sensor(car);
    obstacles = [
        new Obstacle(road.getLaneCenter(0), 200, 30, 30, "orange"),
        new Obstacle(road.getLaneCenter(2), 100, 50, 50, "brown"),
    ];

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        road.draw(ctx);
        car.update(road, obstacles);
        car.draw(ctx);
        sensor.update(road, obstacles);
        sensor.draw(ctx);
        obstacles.forEach((obstacle) => obstacle.draw(ctx));
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener("resize", resizeCanvas);
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
