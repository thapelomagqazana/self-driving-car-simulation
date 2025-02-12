import React, { useRef, useEffect } from 'react';
// import './Canvas.css';

/**
 * Props for the Canvas component.
 * - `width`: The width of the canvas.
 * - `height`: The height of the canvas.
 * - `draw`: Function to draw on the canvas.
 */
interface CanvasProps {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * A reusable Canvas component for rendering 2D graphics.
 * - Uses the Canvas API to draw on a `<canvas>` element.
 * - Calls the `draw` function whenever the component updates.
 */
const Canvas: React.FC<CanvasProps> = ({ width, height, draw }) => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect to handle drawing on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, width, height);

    // Call the draw function with the canvas context
    draw(ctx);
  }, [draw, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid black' }} // Optional: Add a border for visibility
    />
  );
};

export default Canvas;