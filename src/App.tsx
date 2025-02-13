import React from "react";
import GameLoop from "./components/GameLoop";

/**
 * App Component
 * This component initializes the game loop and manages the self-driving car simulation.
 */
const App: React.FC = () => {
  return (
    <div>
      <GameLoop />
    </div>
  );
};

export default App;
