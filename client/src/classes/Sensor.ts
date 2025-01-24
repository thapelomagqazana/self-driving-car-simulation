import { Road } from "./Road";
import { Car } from "./Car";

/**
 * Simulates sensors (LIDAR-like) for detecting obstacles and boundaries.
 */
export class Sensor {
  car: Car; // Reference to the car
  rayCount: number; // Number of sensor rays
  rayLength: number; // Maximum length of each ray
  raySpread: number; // Angle spread of the rays in radians
  rays: { start: { x: number; y: number }; end: { x: number; y: number } }[]; // Ray segments
  readings: ({ x: number; y: number } | null)[]; // Detected intersection points

  constructor(car: Car, rayCount: number = 5, rayLength: number = 150, raySpread: number = Math.PI / 4) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpread = raySpread;
    this.rays = [];
    this.readings = [];
  }

  /**
   * Updates the rays based on the car's position and angle.
   * Also calculates intersections with road boundaries.
   * @param {Road} road - The road object for detecting boundaries.
   */
  update(road: Road) {
    this.#castRays();
    this.readings = this.rays.map((ray) => this.#getIntersection(ray, road));
  }

  /**
   * Casts rays outward from the car's position.
   * Rays are evenly spread within the specified angle.
   */
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        this.car.angle -
        this.raySpread / 2 +
        (i / (this.rayCount - 1)) * this.raySpread;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push({ start, end });
    }
  }

  /**
   * Detects the intersection of a ray with the road boundaries.
   * @param {object} ray - The ray segment (start and end points).
   * @param {Road} road - The road object for boundary detection.
   * @returns {object | null} - The closest intersection point or null if none is found.
   */
  #getIntersection(ray: { start: { x: number; y: number }; end: { x: number; y: number } }, road: Road) {
    let closestPoint = null;
    let minDistance = Infinity;

    // Check against the road boundaries
    const roadBoundaries = [
      { start: { x: road.left, y: road.top }, end: { x: road.left, y: road.bottom } },
      { start: { x: road.right, y: road.top }, end: { x: road.right, y: road.bottom } },
    ];

    for (const boundary of roadBoundaries) {
      const intersection = this.#getRayIntersection(ray, boundary);
      if (intersection) {
        const distance = Math.hypot(intersection.x - ray.start.x, intersection.y - ray.start.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = intersection;
        }
      }
    }

    return closestPoint;
  }

  /**
   * Calculates the intersection point between two line segments.
   * @param {object} ray - The ray segment.
   * @param {object} boundary - A boundary segment.
   * @returns {object | null} - Intersection point or null if none is found.
   */
  #getRayIntersection(ray: { start: { x: number; y: number }; end: { x: number; y: number } }, boundary: { start: { x: number; y: number }; end: { x: number; y: number } }) {
    const x1 = ray.start.x, y1 = ray.start.y;
    const x2 = ray.end.x, y2 = ray.end.y;
    const x3 = boundary.start.x, y3 = boundary.start.y;
    const x4 = boundary.end.x, y4 = boundary.end.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return null; // Lines are parallel or coincident

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
      };
    }

    return null; // No intersection
  }

  /**
   * Renders the sensor rays and their readings on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      const reading = this.readings[i];

      // Draw the ray
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray.start.x, ray.start.y);
      if (reading) {
        ctx.lineTo(reading.x, reading.y);
      } else {
        ctx.lineTo(ray.end.x, ray.end.y);
      }
      ctx.stroke();

      // Draw the intersection point
      if (reading) {
        ctx.beginPath();
        ctx.arc(reading.x, reading.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
  }
}
