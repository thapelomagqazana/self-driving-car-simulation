import React, { createContext, useContext, useState } from 'react';

/**
 * Interface for the simulation state.
 * - `carPosition`: The current position of the car.
 * - `carSpeed`: The current speed of the car.
 * - `carAngle`: The current angle (direction) of the car.
 * - `friction`: The friction coefficient (slows down the car over time).
 * - `inertia`: The inertia coefficient (resists changes in direction).
 * - `setCarPosition`: Function to update the car's position.
 * - `setCarSpeed`: Function to update the car's speed.
 * - `setCarAngle`: Function to update the car's angle.
 */
interface SimulationState {
  carPosition: { x: number; y: number };
  carSpeed: number;
  carAngle: number;
  friction: number;
  inertia: number;
  setCarPosition: (position: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setCarSpeed: (speed: number | ((prev: number) => number)) => void;
  setCarAngle: (angle: number | ((prev: number) => number)) => void;
}

/**
 * Create a React Context for the simulation state.
 * - Initializes with default values.
 */
const SimulationContext = createContext<SimulationState | null>(null);

/**
 * SimulationProvider component.
 * - Wraps the application and provides the simulation state to all child components.
 * - Manages the car's position, speed, angle, friction, and inertia.
 */
export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [carSpeed, setCarSpeed] = useState(0); // Speed in pixels per frame
  const [carAngle, setCarAngle] = useState(0); // Angle in radians
  const [friction, setFriction] = useState(0.02); // Friction coefficient
  const [inertia, setInertia] = useState(0.1); // Inertia coefficient

  // Create the value object that matches the SimulationState interface
  const value: SimulationState = {
    carPosition,
    carSpeed,
    carAngle,
    friction,
    inertia,
    setCarPosition,
    setCarSpeed,
    setCarAngle,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

/**
 * Custom hook to access the simulation state.
 * - Throws an error if used outside of a SimulationProvider.
 */
export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};