import React, { useEffect, useRef } from "react";
import { Car } from "../classes/Car";
import { Road } from "../classes/Road";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carRef = useRef<Car | null>(null);
  const roadRef = useRef<Road | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const road = new Road(width / 2, width * 0.8); // Centered road
    const car = new Car(road.getLaneCenter(1), height - 100); // Car starts in the middle lane
    roadRef.current = road;
    carRef.current = car;

    // Key state management
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      // Draw road and car
      road.draw(ctx);
      car.update(keys.ArrowUp, keys.ArrowDown, keys.ArrowLeft, keys.ArrowRight);
      car.draw(ctx);

      requestAnimationFrame(animate); // Continue animation loop
    };

    animate();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "1px solid black",
        display: "block",
        margin: "0 auto",
      }}
    ></canvas>
  );
};

export default Canvas;
