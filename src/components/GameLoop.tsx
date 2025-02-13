import React, { useRef, useEffect, useState } from "react";

/**
 * GameLoop Component
 * This component implements a smooth game loop that updates the simulation at 60 FPS.
 */
const GameLoop: React.FC = () => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stores the requestAnimationFrame ID for cleanup
  const animationFrameId = useRef<number | null>(null);

  // Track whether the game is running or paused
  const [isRunning, setIsRunning] = useState<boolean>(true);

  /**
   * Initializes and starts the game loop.
   * - Sets up the canvas.
   * - Handles game updates and rendering at 60 FPS.
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

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();
    const targetFPS = 60;
    const frameDuration = 1000 / targetFPS; // ~16.67ms per frame

    /**
     * The main game loop.
     * - Updates game logic.
     * - Renders the frame.
     * - Ensures smooth animations at 60 FPS.
     */
    const gameLoop = (currentTime: number) => {
      if (!isRunning) return; // Stop updating if game is paused

      // Calculate delta time
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameDuration) {
        lastTime = currentTime;

        // Clear the canvas before rendering
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Example: Draw a moving car
        const carX = (currentTime / 10) % canvas.width; // Moves right over time
        ctx.fillStyle = "red";
        ctx.fillRect(carX, canvas.height / 2, 50, 30); // Draw the car

        // Request the next frame
        animationFrameId.current = requestAnimationFrame(gameLoop);
      } else {
        // Keep requesting frames to maintain smooth updates
        animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start the game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Cleanup function to stop animation on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning]);

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <h1 style={{ position: "absolute", top: 20, width: "100%", color: "white" }}>
        2D Self-Driving Car Simulation
      </h1>
      <canvas ref={canvasRef} className="game-canvas" />
      <button
        onClick={() => setIsRunning((prev) => !prev)}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "18px",
        }}
      >
        {isRunning ? "Pause" : "Resume"}
      </button>
    </div>
  );
};

export default GameLoop;
