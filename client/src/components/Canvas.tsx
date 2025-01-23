import React, { useEffect, useRef } from 'react';
import { Car } from '../classes/Car';
import { Road } from '../classes/Road';
import { Obstacle } from '../classes/Obstacle';

/**
 * Props for the Canvas component.
 */
interface CanvasProps {
  /**
   * The car instance to be rendered on the canvas.
   */
  car: Car;
}

/**
 * A React component that renders the 2D self-driving car simulation on a canvas.
 * 
 * This component takes a `Car` instance as a prop and renders it on the canvas.
 * It uses the `requestAnimationFrame` function to create a smooth animation loop.
 */
const Canvas: React.FC<CanvasProps> = ({ car }) => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * useEffect hook to set up the animation loop.
   * 
   * This hook runs when the component mounts and sets up the animation loop using `requestAnimationFrame`.
   * It clears the canvas, draws the car, and updates the car's position on each frame.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if the canvas element is not available

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Exit if the 2D context is not available

    // Define the road
    const road = new Road(200, 3, [
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 700, y: 300 },
        { x: 1000, y: 300 },
    ]);
  
    // Define obstacles
    const obstacles = [
        new Obstacle(300, 100, 20, 20), // Traffic cone
        new Obstacle(600, 300, 30, 50), // Other car
    ];
  

    /**
     * Draws the car and updates its position on the canvas.
     */
    const draw = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the road
      road.draw(ctx);

      // Draw obstacles
      obstacles.forEach((obstacle) => obstacle.draw(ctx));

      // Draw the car
      ctx.save(); // Save the current canvas state
      ctx.translate(car.x, car.y); // Move the origin to the car's position
      ctx.rotate(car.angle); // Rotate the canvas to match the car's orientation
      ctx.fillStyle = 'blue'; // Set the car's color
      ctx.fillRect(-15, -10, 30, 20); // Draw a rectangle for the car
      ctx.restore(); // Restore the canvas state

      // Update the car's position
      car.update();

      // Request the next frame
      requestAnimationFrame(draw);
    };

    // Start the animation loop
    draw();
  }, [car]); // Re-run the effect if the car instance changes

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;