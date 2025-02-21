import SimulationCanvas from "./components/SimulationCanvas";

/**
 * Main App Component:
 * - Wraps the simulation in a responsive UI.
 * - Centers the simulation canvas within a flex container.
 */
const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-title text-secondary mb-4">
        🚗 2D Self-Driving Car Simulation
      </h1>
      <SimulationCanvas />
    </div>
  );
};

export default App;
