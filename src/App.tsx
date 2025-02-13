import React from "react";
import CanvasRenderer from "./components/CanvasRenderer";

/**
 * Main application component.
 * Renders the CanvasRenderer to visualize the 2D self-driving car simulation.
 */
const App: React.FC = () => {
  return (
    <div style={{ position: "relative" }}>
      <h1 style={{ textAlign: "center", color: "white", position: "absolute", top: 20, width: "100%" }}>
        2D Self-Driving Car Simulation
      </h1>
      <CanvasRenderer />
    </div>
  );
};

export default App;
