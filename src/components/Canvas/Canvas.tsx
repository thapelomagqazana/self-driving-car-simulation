import React, { useRef, useEffect, useState } from 'react';

/**
 * Props for the Canvas component.
 * - `draw`: Function to draw on the canvas.
 * - `aspectRatio`: The aspect ratio (width / height) of the canvas.
 */
interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  aspectRatio: number; // Width / Height
}

/**
 * A reusable and responsive Canvas component for rendering 2D graphics.
 * - Dynamically adjusts the canvas size based on the parent container's dimensions.
 * - Maintains the specified aspect ratio to prevent distortion.
 */
const Canvas: React.FC<CanvasProps> = ({ draw, aspectRatio }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  /**
   * Update the canvas dimensions based on the parent container's size.
   */
  const updateDimensions = () => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    // Calculate the width and height based on the parent's width and the aspect ratio
    const parentWidth = parent.clientWidth;
    const width = Math.min(parentWidth, window.innerWidth); // Ensure it doesn't exceed the viewport width
    const height = width / aspectRatio;

    setDimensions({ width, height });
  };

  // Update dimensions on mount and window resize
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw on the canvas whenever dimensions or the draw function changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas and redraw
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    draw(ctx, dimensions.width, dimensions.height);
  }, [draw, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: '100%', height: 'auto' }} // Make the canvas responsive
    />
  );
};

export default Canvas;