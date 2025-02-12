import React, { useEffect } from 'react';
import { useSimulation } from './context/SimulationContext';
import { calculateSpeed, calculateAngle, calculatePosition } from './utils/physics';
import Car from './components/Car/Car';
import Canvas from './components/Canvas/Canvas';

const App: React.FC = () => {
  const { carPosition, carSpeed, carAngle, setCarPosition, setCarSpeed, setCarAngle } = useSimulation();

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

  /**
   * Handle acceleration and braking.
   */
  const handleAcceleration = (acceleration: number) => {
    const newSpeed = calculateSpeed(carSpeed, acceleration, 10); // Max speed of 10
    setCarSpeed(newSpeed);
  };

  /**
   * Handle steering.
   */
  const handleSteering = (deltaAngle: number) => {
    const newAngle = calculateAngle(carAngle, deltaAngle);
    setCarAngle(newAngle);
  };

  /**
   * Example: Simulate user input for acceleration, braking, and steering.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleAcceleration(0.1); // Accelerate
          break;
        case 'ArrowDown':
          handleAcceleration(-0.1); // Brake
          break;
        case 'ArrowLeft':
          handleSteering(-0.05); // Steer left
          break;
        case 'ArrowRight':
          handleSteering(0.05); // Steer right
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup event listener
  }, [carSpeed, carAngle]);

  return (
    <div>
      <h1>2D Self-Driving Car Simulation</h1>
      <Canvas width={800} height={600} draw={() => {}} />
      <Car color="red" />
    </div>
  );
};

export default App;