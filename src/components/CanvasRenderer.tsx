import React, { useRef, useEffect } from "react";

/**
 * CanvasRenderer component for handling 2D rendering using the Canvas API in React.
 * This component initializes a canvas, sets up a rendering loop, and handles resizing.
 */
const CanvasRenderer: React.FC = () => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Initializes and starts the rendering loop.
   * - Sets up the canvas context.
   * - Clears and redraws the canvas on each frame.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the 2D rendering context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context");
      return;
    }

    // Set canvas dimensions to fill the screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    /**
     * Rendering loop for updating the canvas.
     */
    const render = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Example: Draw a moving car (basic rectangle)
      ctx.fillStyle = "red";
      ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2, 50, 30);

      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render(); // Start rendering loop

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-container" />;
};

export default CanvasRenderer;
