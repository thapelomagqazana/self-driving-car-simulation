import React, { useEffect, useRef } from "react";
import { Car } from "../classes/Car";
import { Road } from "../classes/Road";
import { Sensor } from "../classes/Sensor";
import { Obstacle } from "../classes/Obstacle";

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
    const sensor = new Sensor(car);

    // Add obstacles
    const obstacles = [
      new Obstacle(road.getLaneCenter(0) - 20, canvas.height / 2 - 50, 40, 40),
      new Obstacle(road.getLaneCenter(2) - 20, canvas.height / 3, 40, 40),
    ];

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

      // Draw obstacles
      for (const obstacle of obstacles) {
        obstacle.draw(ctx);
      }

      // Update and draw car
      car.update(keys.ArrowUp, keys.ArrowDown, keys.ArrowLeft, keys.ArrowRight);
      car.draw(ctx);

      // Update and draw sensor
      sensor.update(road);

      // Extract sensor readings logic to reduce nesting
      sensor.readings = sensor.rays.map((ray) => getClosestIntersection(ray, obstacles));

      // Draw the sensor
      sensor.draw(ctx);

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

/**
 * Finds the closest intersection point for a ray and a list of obstacles.
 * @param ray - The ray segment to check.
 * @param obstacles - Array of obstacles to check for intersections.
 * @returns The closest intersection point or null if none is found.
 */
function getClosestIntersection(ray: { start: { x: number; y: number }; end: { x: number; y: number } }, obstacles: Obstacle[]): { x: number; y: number } | null {
  // Get all intersection points
  const intersections = getAllIntersections(ray, obstacles);

  // Find the closest intersection
  return findClosestIntersection(ray, intersections);
}

/**
 * Gets all intersection points between a ray and a list of obstacles.
 * @param ray - The ray segment to check.
 * @param obstacles - Array of obstacles to check for intersections.
 * @returns Array of intersection points or null for non-intersecting rays.
 */
function getAllIntersections(ray: { start: { x: number; y: number }; end: { x: number; y: number } }, obstacles: Obstacle[]): ({ x: number; y: number } | null)[] {
  return obstacles.map((obstacle) => obstacle.getIntersection(ray)).filter((intersection) => intersection !== null);
}

/**
 * Finds the closest intersection point from a list of intersection points.
 * @param ray - The ray segment to check.
 * @param intersections - Array of intersection points to evaluate.
 * @returns The closest intersection point or null if none exist.
 */
function findClosestIntersection(
  ray: { start: { x: number; y: number }; end: { x: number; y: number } },
  intersections: ({ x: number; y: number } | null)[]
): { x: number; y: number } | null {
  return intersections.reduce((closest, current) => {
    if (!current) return closest;

    const currentDistance = Math.hypot(current.x - ray.start.x, current.y - ray.start.y);
    const closestDistance = closest ? Math.hypot(closest.x - ray.start.x, closest.y - ray.start.y) : Infinity;

    return currentDistance < closestDistance ? current : closest;
  }, null as { x: number; y: number } | null);
}

export default Canvas;
