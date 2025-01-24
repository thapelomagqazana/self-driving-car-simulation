/**
 * Represents an obstacle in the simulation.
 * Obstacles can be barriers, traffic cones, or other objects on the road.
 */
export class Obstacle {
  x: number; // X-coordinate of the obstacle's position
  y: number; // Y-coordinate of the obstacle's position
  width: number; // Width of the obstacle
  height: number; // Height of the obstacle

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Checks if a ray intersects this obstacle.
   * @param {object} ray - A ray represented by start and end points.
   * @returns {object | null} - The intersection point or null if no intersection occurs.
   */
  getIntersection(ray: { start: { x: number; y: number }; end: { x: number; y: number } }): { x: number; y: number } | null {
    const edges = this.getEdges();
    let closestPoint: { x: number; y: number } | null = null;
    let minDistance = Infinity;

    for (const edge of edges) {
      const intersection = this.#getRayIntersection(ray, edge);
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
   * Renders the obstacle on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Returns the edges of the obstacle as line segments.
   * @returns {Array<object>} - Array of edges represented as start and end points.
   */
  getEdges() {
    return [
      { start: { x: this.x, y: this.y }, end: { x: this.x + this.width, y: this.y } }, // Top edge
      { start: { x: this.x + this.width, y: this.y }, end: { x: this.x + this.width, y: this.y + this.height } }, // Right edge
      { start: { x: this.x + this.width, y: this.y + this.height }, end: { x: this.x, y: this.y + this.height } }, // Bottom edge
      { start: { x: this.x, y: this.y + this.height }, end: { x: this.x, y: this.y } }, // Left edge
    ];
  }

  /**
   * Calculates the intersection point between a ray and a line segment.
   * @private
   * @param {object} ray - The ray segment.
   * @param {object} edge - The line segment representing an edge.
   * @returns {object | null} - The intersection point or null if no intersection occurs.
   */
  #getRayIntersection(
    ray: { start: { x: number; y: number }; end: { x: number; y: number } },
    edge: { start: { x: number; y: number }; end: { x: number; y: number } }
  ) {
    const x1 = ray.start.x, y1 = ray.start.y;
    const x2 = ray.end.x, y2 = ray.end.y;
    const x3 = edge.start.x, y3 = edge.start.y;
    const x4 = edge.end.x, y4 = edge.end.y;

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

    return null;
  }
}
