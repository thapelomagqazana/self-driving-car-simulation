import SimulationCanvas from "./components/SimulationCanvas";

/**
 * Main App Component:
 * - Wraps the simulation in a responsive UI.
 * - Centers the simulation canvas within a flex container.
 */
const App = () => {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-900">
      <SimulationCanvas />
    </div>
  );
};

export default App;
