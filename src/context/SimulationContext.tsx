import React, { createContext, useContext, useState } from 'react';

/**
 * Interface for the simulation state.
 * - `carPosition`: The current position of the car.
 * - `setCarPosition`: Function to update the car's position.
 */
interface SimulationState {
  carPosition: { x: number; y: number };
  setCarPosition: (position: { x: number; y: number }) => void;
}

/**
 * Create a React Context for the simulation state.
 * - Initializes with default values.
 */
const SimulationContext = createContext<SimulationState | null>(null);

/**
 * SimulationProvider component.
 * - Wraps the application and provides the simulation state to all child components.
 * - Manages the car's position state.
 */
export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });

  return (
    <SimulationContext.Provider value={{ carPosition, setCarPosition }}>
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