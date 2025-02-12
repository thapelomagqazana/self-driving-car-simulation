import React, { useEffect, useState } from 'react';
import { useSimulation } from './context/SimulationContext';
import { calculateSpeed, calculateAngle, calculatePosition } from './utils/physics';
import { defineRoad, drawRoad } from './utils/road';
import { drawTireMarks } from './utils/tireMarks';
import { drawHeadlights } from './utils/headlights';
import Car from './components/Car/Car';
import Canvas from './components/Canvas/Canvas';

const App: React.FC = () => {
  const {
    carPosition,
    carSpeed,
    carAngle,
    friction,
    inertia,
    isReversing,
    setCarPosition,
    setCarSpeed,
    setCarAngle,
    setIsReversing,
  } = useSimulation();

  const [tireMarks, setTireMarks] = useState<Array<{ x: number; y: number; angle: number }>>([]);

  const [road, setRoad] = useState<RoadSegment[]>([]);

  /**
   * Update the car's position based on its speed and angle.
   */
  useEffect(() => {
    const moveCar = () => {
      const newPosition = calculatePosition(carPosition, carSpeed, carAngle);
      setCarPosition(newPosition);
    };

    const interval = setInterval(moveCar, 16); // Update position every 16ms (~60 FPS)
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [carPosition, carSpeed, carAngle, setCarPosition]);

  // Define the road on component mount
  useEffect(() => {
    const road = defineRoad();
    setRoad(road);
  }, []);

  /**
   * Handle acceleration and braking.
   */
  const handleAcceleration = (acceleration: number) => {
    const newSpeed = calculateSpeed(carSpeed, acceleration, friction, 10, isReversing); // Max speed of 10
    setCarSpeed(newSpeed);
  };

  /**
   * Handle steering.
   */
  const handleSteering = (deltaAngle: number) => {
    const newAngle = calculateAngle(carAngle, deltaAngle, inertia, carSpeed);
    setCarAngle(newAngle);
  };

  /**
   * Toggle reverse mode.
   */
  const toggleReverse = () => {
    setIsReversing((prev) => !prev);
  };

  /**
   * Draw function for the canvas.
   * - Fills the canvas with a black background, draws the car, tire marks, and headlights.
   * @param ctx - The canvas rendering context.
   */
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw a black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the road
    drawRoad(ctx, road);

    // Draw tire marks
    const updatedTireMarks = drawTireMarks(ctx, carPosition, carAngle, tireMarks);
    setTireMarks(updatedTireMarks);

    // Draw headlights
    drawHeadlights(ctx, carPosition, carAngle);

    // Save the current canvas state
    ctx.save();

    // Translate to the car's position
    ctx.translate(carPosition.x, carPosition.y);

    // Rotate the canvas to match the car's angle
    ctx.rotate(carAngle);

    // Draw the car as a rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(-25, -15, 50, 30); // Center the car at (0, 0)

    // Restore the canvas state
    ctx.restore();
  };

  /**
   * Example: Simulate user input for acceleration, braking, steering, and reversing.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w':
          handleAcceleration(0.1); // Accelerate
          break;
        case 's':
          handleAcceleration(-0.1); // Brake
          break;
        case 'a':
          handleSteering(-0.05); // Steer left
          break;
        case 'd':
          handleSteering(0.05); // Steer right
          break;
        case 'r': // Toggle reverse mode
          toggleReverse();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup event listener
  }, [carSpeed, carAngle, friction, inertia, isReversing]);

  return (
    <div>
      <h1>2D Self-Driving Car Simulation</h1>
      <Canvas width={800} height={600} draw={draw} />
      <Car color="red" />
      <p>Reverse Mode: {isReversing ? 'ON' : 'OFF'}</p>
    </div>
  );
};

export default App;