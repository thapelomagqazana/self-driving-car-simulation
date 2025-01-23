import { Car } from "./Car";
import { Obstacle } from "./Obstacle";

/**
 * Represents a sensor that emits rays to detect obstacles and road boundaries.
 */
export class Sensor {
    /**
     * The car to which the sensor is attached.
     */
    public car: Car;
  
    /**
     * The number of rays emitted by the sensor.
     */
    public rayCount: number;
  
    /**
     * The spread angle of the rays (in radians).
     */
    public raySpread: number;
  
    /**
     * The length of the rays.
     */
    public rayLength: number;
  
    /**
     * The rays emitted by the sensor.
     */
    public rays: { start: { x: number; y: number }; end: { x: number; y: number } }[];
  
    /**
     * The detected intersections of the rays with the environment.
     * Each reading can be either a point `{ x: number; y: number }` or `null` if no intersection is found.
     */
    public readings: ({ x: number; y: number } | null)[];
  
    /**
     * Creates a new Sensor instance.
     * @param car - The car to which the sensor is attached.
     * @param rayCount - The number of rays emitted by the sensor.
     * @param raySpread - The spread angle of the rays (in radians).
     * @param rayLength - The length of the rays.
     */
    constructor(car: Car, rayCount: number = 5, raySpread: number = Math.PI / 2, rayLength: number = 200) {
      this.car = car;
      this.rayCount = rayCount;
      this.raySpread = raySpread;
      this.rayLength = rayLength;
      this.rays = [];
      this.readings = [];
    }
  
    /**
     * Updates the sensor's rays and detects intersections with the environment.
     * @param roadBorders - The boundaries of the road.
     * @param obstacles - The obstacles on the road.
     */
    public update(roadBorders: { x: number; y: number }[][], obstacles: Obstacle[]): void {
      this.castRays();
      this.readings = [];
      for (let i = 0; i < this.rays.length; i++) {
        const reading = this.getReading(this.rays[i], roadBorders, obstacles);
        this.readings.push(reading); // Now `reading` can be `null`
      }
    }
  
    /**
     * Emits rays from the car's position.
     */
    private castRays(): void {
      this.rays = [];
      for (let i = 0; i < this.rayCount; i++) {
        const rayAngle =
          lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) +
          this.car.angle;
  
        const start = { x: this.car.x, y: this.car.y };
        const end = {
          x: this.car.x - Math.sin(rayAngle) * this.rayLength,
          y: this.car.y - Math.cos(rayAngle) * this.rayLength,
        };
  
        this.rays.push({ start, end });
      }
    }
  
    /**
     * Detects the closest intersection of a ray with the environment.
     * @param ray - The ray to check for intersections.
     * @param roadBorders - The boundaries of the road.
     * @param obstacles - The obstacles on the road.
     * @returns The closest intersection point, or null if no intersection is found.
     */
    private getReading(
      ray: { start: { x: number; y: number }; end: { x: number; y: number } },
      roadBorders: { x: number; y: number }[][],
      obstacles: Obstacle[]
    ): { x: number; y: number } | null {
      let closestIntersection: { x: number; y: number } | null = null;
      let closestDistance = Infinity;
  
      // Check intersections with road borders
      for (const border of roadBorders) {
        const intersection = getIntersection(ray.start, ray.end, border[0], border[1]);
        if (intersection && intersection.distance < closestDistance) {
          closestDistance = intersection.distance;
          closestIntersection = intersection.point;
        }
      }
  
      // Check intersections with obstacles
      for (const obstacle of obstacles) {
        const corners = [
          { x: obstacle.x - obstacle.width / 2, y: obstacle.y - obstacle.height / 2 },
          { x: obstacle.x + obstacle.width / 2, y: obstacle.y - obstacle.height / 2 },
          { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2 },
          { x: obstacle.x - obstacle.width / 2, y: obstacle.y + obstacle.height / 2 },
        ];
  
        for (let i = 0; i < corners.length; i++) {
          const intersection = getIntersection(ray.start, ray.end, corners[i], corners[(i + 1) % corners.length]);
          if (intersection && intersection.distance < closestDistance) {
            closestDistance = intersection.distance;
            closestIntersection = intersection.point;
          }
        }
      }
  
      return closestIntersection;
    }
  
   /**
   * Draws the sensor rays and their intersections on the canvas.
   * @param ctx - The canvas rendering context.
   */
    public draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.rayCount; i++) {
        const ray = this.rays[i];
        const reading = this.readings[i];

        // Draw the ray
        ctx.beginPath();
        ctx.moveTo(ray.start.x, ray.start.y);
        ctx.lineTo(ray.end.x, ray.end.y);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the intersection point (if it exists)
        if (reading) {
            ctx.beginPath();
            ctx.arc(reading.x, reading.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
        }
    }
}

/**
 * Linear interpolation function.
 * @param a - The start value.
 * @param b - The end value.
 * @param t - The interpolation factor (0 to 1).
 * @returns The interpolated value.
 */
function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Calculates the intersection point between two line segments.
 * @param A - The start point of the first line segment.
 * @param B - The end point of the first line segment.
 * @param C - The start point of the second line segment.
 * @param D - The end point of the second line segment.
 * @returns The intersection point and distance, or null if no intersection is found.
 */
function getIntersection(
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number },
    D: { x: number; y: number }
): { point: { x: number; y: number }; distance: number } | null {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
        point: {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
        },
        distance: t,
        };
    }
    }

    return null;
}