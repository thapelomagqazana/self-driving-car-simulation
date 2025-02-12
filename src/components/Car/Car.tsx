import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
// import './Car.css';

/**
 * Props for the Car component.
 * - `color`: The color of the car.
 */
interface CarProps {
  color: string;
}

/**
 * A reusable Car component for rendering the car in the simulation.
 * - Uses the simulation context to get the car's position.
 */
const Car: React.FC<CarProps> = ({ color }) => {
  const { carPosition } = useSimulation();

  return (
    <div
      className="car"
      style={{
        transform: `translate(${carPosition.x}px, ${carPosition.y}px)`,
        backgroundColor: color,
      }}
    />
  );
};

export default Car;