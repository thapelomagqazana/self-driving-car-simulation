import React, { useRef, useEffect, useState } from "react";
import Car from "../models/Car";
import Road from "../models/Road";

/**
 * GameLoop Component
 * Implements a smooth game loop at 60 FPS and integrates a Car and Road.
 */
const GameLoop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Define road parameters
  const roadWidth = 300;
  const laneCount = 3;
  const road = useRef(new Road(window.innerWidth / 2, roadWidth, laneCount));

  // Create the car instance (start in the center lane)
  const car = useRef(new Car(road.current.getLaneCenter(1), window.innerHeight - 100));

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

        // Draw the road
        road.current.draw(ctx);

        // Update and draw car
        car.current.update();
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
