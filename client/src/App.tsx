import React, { useEffect, useState } from 'react';
import Canvas from './components/Canvas';
import { Car } from './classes/Car';

/**
 * The main application component for the 2D self-driving car simulation.
 * 
 * This component handles keyboard inputs to control the car and renders the simulation canvas.
 * It initializes a `Car` instance and passes it to the `Canvas` component for rendering.
 */
const App: React.FC = () => {
  // State to hold the car instance
  const [car, setCar] = useState(new Car(100, 100)); // Initialize the car at position (100, 100)

  /**
   * useEffect hook to handle keyboard input for controlling the car.
   * 
   * This hook adds an event listener for the `keydown` event when the component mounts.
   * It maps keyboard inputs (arrow keys) to car controls (accelerate, brake, steer left, steer right).
   * The event listener is removed when the component unmounts to prevent memory leaks.
   */
  useEffect(() => {
    /**
     * Handles keyboard input to control the car.
     * 
     * @param event - The keyboard event.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          car.accelerate(); // Accelerate the car
          break;
        case 'ArrowDown':
          car.brake(); // Brake the car
          break;
        case 'ArrowLeft':
          car.steerLeft(); // Steer the car to the left
          break;
        case 'ArrowRight':
          car.steerRight(); // Steer the car to the right
          break;
        default:
          break; // Ignore other keys
      }
    };

    // Add event listener for keyboard input
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [car]); // Re-run the effect if the car instance changes

  return (
    <div className="app">
      <h1>Self-Driving Car Simulation</h1>
      {/* Render the Canvas component and pass the car instance as a prop */}
      <Canvas car={car} />
    </div>
  );
};

export default App;