import React from 'react';
import Canvas from './components/Canvas';

/**
 * Main App component.
 * - Renders the simulation canvas and a title.
 */
const App: React.FC = () => {
  /**
   * Draw function for the canvas.
   * - Fills the canvas with a black background.
   * @param ctx - The canvas rendering context.
   */
  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  return (
    <div>
      <h1>2D Self-Driving Car Simulation</h1>
      <Canvas width={800} height={600} draw={draw} />
    </div>
  );
};

export default App;