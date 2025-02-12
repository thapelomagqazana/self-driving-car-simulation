import React, { useRef, useEffect } from 'react';

/**
 * Props for the Canvas component.
 * - `width`: Width of the canvas.
 * - `height`: Height of the canvas.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Call the draw function with the canvas context
    draw(ctx);
  }, [draw]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Canvas;