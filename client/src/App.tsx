import React from "react";
import Canvas from "./components/Canvas";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>2D Self-Driving Car Simulation</h1>
      <Canvas width={800} height={600} />
    </div>
  );
};

export default App;
