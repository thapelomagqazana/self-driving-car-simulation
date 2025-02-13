import React, { useRef, useEffect, useState } from "react";
import Car from "../models/Car";

/**
 * GameLoop Component
 * Implements a smooth game loop at 60 FPS and integrates a Car object.
 */
const GameLoop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Create the car instance
  const car = useRef(new Car(window.innerWidth / 2, window.innerHeight / 2));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();
    const frameDuration = 1000 / 60; // 60 FPS

    /**
     * The main game loop.
     */
    const gameLoop = (currentTime: number) => {
      if (!isRunning) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameDuration) {
        lastTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update car physics
        car.current.update();

        // Draw car
        car.current.draw(ctx);

        animationFrameId.current = requestAnimationFrame(gameLoop);
      } else {
        animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

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
