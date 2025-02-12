import React from 'react';
import Canvas from './components/Canvas';

/**
 * Main App component.
 * - Renders the responsive simulation canvas and a title.
 */
const App: React.FC = () => {
  /**
   * Draw function for the canvas.
   * - Fills the canvas with a black background and draws a red rectangle (car).
   * @param ctx - The canvas rendering context.
   * @param width - The current width of the canvas.
   * @param height - The current height of the canvas.
   */
  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw a black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Example: Draw a red rectangle (car)
    ctx.fillStyle = 'red';
    const carWidth = 100;
    const carHeight = 50;
    const x = (width - carWidth) / 2; // Center the car horizontally
    const y = (height - carHeight) / 2; // Center the car vertically
    ctx.fillRect(x, y, carWidth, carHeight);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>2D Self-Driving Car Simulation</h1>
      <div style={{ width: '100%', aspectRatio: '4/3', maxWidth: '800px' }}>
        <Canvas draw={draw} aspectRatio={4 / 3} />
      </div>
    </div>
  );
};

export default App;