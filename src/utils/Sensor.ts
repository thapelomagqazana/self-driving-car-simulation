import { Road } from "./Road";
import { Obstacle } from "./Obstacle";

/**
 * Represents a LIDAR-based sensor system using raycasting.
 */
export class Sensor {
  car: any;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: { x: number; y: number }[][];
  readings: ({ x: number; y: number } | null)[];

  /**
   * Initializes the sensor system.
   * @param {any} car - The car object this sensor is attached to.
   */
  constructor(car: any) {
    this.car = car;
    this.rayCount = 5; // Number of sensor rays
    this.rayLength = 150; // Maximum sensor range
    this.raySpread = Math.PI / 2; // 90-degree spread

    this.rays = [];
    this.readings = [];
  }

  /**
   * Updates the sensor system by casting rays and detecting intersections.
   * @param {Road} road - The road environment.
   * @param {Obstacle[]} obstacles - Array of obstacles to detect.
   */
  update(road: Road, obstacles: Obstacle[]) {
    this.#castRays();
    this.readings = this.rays.map((ray) => this.#getIntersection(ray, road, obstacles));
  }

  /**
   * Casts sensor rays outward from the car.
   */
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const angle =
        this.car.angle +
        ((i / (this.rayCount - 1)) * this.raySpread - this.raySpread / 2);

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(angle) * this.rayLength,
        y: this.car.y - Math.cos(angle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  /**
   * Determines the closest intersection point between the ray and obstacles/road.
   * @param {[{x: number, y: number}, {x: number, y: number}]} ray - A start and end point defining a ray.
   * @param {Road} road - The road to detect boundaries.
   * @param {Obstacle[]} obstacles - The obstacles to detect.
   * @returns {x: number, y: number} | null - Closest detected point or null if no intersection.
   */
    #getIntersection(ray: [{ x: number; y: number }, { x: number; y: number }], road: Road, obstacles: Obstacle[]): { x: number; y: number } | null {
        let closest = null;
        let minDist = Infinity;
    
        // Get nearest intersection for road boundaries
        closest = this.#findNearestIntersection(ray, this.#getRoadEdges(road), closest, minDist);
    
        // Get nearest intersection for obstacles
        closest = this.#findNearestIntersection(ray, this.#getObstacleEdges(obstacles), closest, minDist);
    
        return closest;
    }
    
    /**
     * Finds the nearest intersection between the ray and given edges.
     */
    #findNearestIntersection(
        ray: [{ x: number; y: number }, { x: number; y: number }],
        edges: { x1: number; y1: number; x2: number; y2: number }[],
        closest: { x: number; y: number } | null,
        minDist: number
    ) {
        for (const edge of edges) {
        const intersection = this.#getLineIntersection(ray[0], ray[1], { x: edge.x1, y: edge.y1 }, { x: edge.x2, y: edge.y2 });
        if (intersection) {
            const dist = Math.hypot(intersection.x - this.car.x, intersection.y - this.car.y);
            if (dist < minDist) {
            minDist = dist;
            closest = intersection;
            }
        }
        }
        return closest;
    }
    
    /**
     * Returns road boundaries as edges.
     */
    #getRoadEdges(road: Road) {
        return [
        { x1: road.leftBoundary, y1: 0, x2: road.leftBoundary, y2: window.innerHeight },
        { x1: road.rightBoundary, y1: 0, x2: road.rightBoundary, y2: window.innerHeight },
        ];
    }
    
    /**
     * Returns obstacle edges for intersection checks.
     */
    #getObstacleEdges(obstacles: Obstacle[]) {
        return obstacles.flatMap((obstacle) => [
        { x1: obstacle.x - obstacle.width / 2, y1: obstacle.y - obstacle.height / 2, x2: obstacle.x + obstacle.width / 2, y2: obstacle.y - obstacle.height / 2 },
        { x1: obstacle.x + obstacle.width / 2, y1: obstacle.y - obstacle.height / 2, x2: obstacle.x + obstacle.width / 2, y2: obstacle.y + obstacle.height / 2 },
        { x1: obstacle.x + obstacle.width / 2, y1: obstacle.y + obstacle.height / 2, x2: obstacle.x - obstacle.width / 2, y2: obstacle.y + obstacle.height / 2 },
        { x1: obstacle.x - obstacle.width / 2, y1: obstacle.y + obstacle.height / 2, x2: obstacle.x - obstacle.width / 2, y2: obstacle.y - obstacle.height / 2 },
        ]);
    }
    

  /**
   * Detects the intersection of two line segments.
   * @returns {x: number, y: number} | null - Intersection point or null if no intersection.
   */
  #getLineIntersection(A: { x: number; y: number }, B: { x: number; y: number }, C: { x: number; y: number }, D: { x: number; y: number }) {
    const denominator = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    if (denominator === 0) return null; // Parallel lines

    const t = ((D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)) / denominator;
    const u = ((B.x - A.x) * (A.y - C.y) - (B.y - A.y) * (A.x - C.x)) / -denominator;

    if (t > 0 && t < 1 && u > 0 && u < 1) {
      return {
        x: A.x + t * (B.x - A.x),
        y: A.y + t * (B.y - A.y),
      };
    }

    return null;
  }

  /**
   * Draws the sensor rays on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "yellow";
    this.rays.forEach((ray, i) => {
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);

      if (this.readings[i]) {
        ctx.lineTo(this.readings[i].x, this.readings[i].y);
      } else {
        ctx.lineTo(ray[1].x, ray[1].y);
      }

      ctx.stroke();
    });
  }
}
