import { Obstacle } from "./Obstacle";
import { Road } from "./Road";

/**
 * Represents a car in the simulation.
 * Handles position, speed, angle, and collision detection.
 */
export class Car {
  x: number; // X-coordinate of the car's position
  y: number; // Y-coordinate of the car's position
  width: number; // Width of the car
  height: number; // Height of the car
  speed: number; // Current speed
  angle: number; // Current orientation in radians
  maxSpeed: number; // Maximum allowed speed
  acceleration: number; // Rate of acceleration
  friction: number; // Friction coefficient
  turnSpeed: number; // Turning speed
  isColliding: boolean; // Indicates if the car is in a collision state

  constructor(
    x: number,
    y: number,
    width: number = 50,
    height: number = 30,
    maxSpeed: number = 5,
    acceleration: number = 0.2,
    friction: number = 0.05,
    turnSpeed: number = 0.03
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.friction = friction;
    this.turnSpeed = turnSpeed;
    this.isColliding = false;
  }

  /**
   * Updates the car's position, speed, and collision state.
   * @param {boolean} accelerate - Whether the car is accelerating.
   * @param {boolean} brake - Whether the car is braking.
   * @param {boolean} turnLeft - Whether the car is turning left.
   * @param {boolean} turnRight - Whether the car is turning right.
   * @param {Road} road - The road object for boundary detection.
   * @param {Obstacle[]} obstacles - Array of obstacles for collision detection.
   */
  update(
    accelerate: boolean,
    brake: boolean,
    turnLeft: boolean,
    turnRight: boolean,
    road: Road,
    obstacles: Obstacle[]
  ) {
    if (this.isColliding) return; // Stop updating if the car is in collision

    // Handle acceleration and braking
    if (accelerate) this.speed += this.acceleration;
    if (brake) this.speed -= this.acceleration * 2;

    // Clamp speed to maximum and minimum values
    this.speed = Math.max(-this.maxSpeed, Math.min(this.speed, this.maxSpeed));

    // Apply friction
    if (this.speed > 0) this.speed -= this.friction;
    else if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0; // Prevent jittering

    // Handle turning
    if (this.speed !== 0) {
      const direction = this.speed > 0 ? 1 : -1; // Reverse steering if moving backward
      if (turnLeft) this.angle += this.turnSpeed * direction;
      if (turnRight) this.angle -= this.turnSpeed * direction;
    }

    // Update position based on speed and angle
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;

    // Check for collisions
    this.isColliding = this.#checkCollision(road, obstacles);
  }

  /**
   * Checks if the car has collided with road boundaries or obstacles.
   * @param {Road} road - The road object for boundary detection.
   * @param {Obstacle[]} obstacles - Array of obstacles for collision detection.
   * @returns {boolean} - True if a collision occurs, false otherwise.
   */
  #checkCollision(road: Road, obstacles: Obstacle[]): boolean {
    // Check road boundaries
    const carEdges = this.#getEdges();
    const roadBoundaries = [
      { start: { x: road.left, y: road.top }, end: { x: road.left, y: road.bottom } },
      { start: { x: road.right, y: road.top }, end: { x: road.right, y: road.bottom } },
    ];

    for (const boundary of roadBoundaries) {
      if (this.#isCollidingWithEdge(carEdges, boundary)) return true;
    }

    // Check obstacles
    for (const obstacle of obstacles) {
      const obstacleEdges = obstacle.getEdges();
      for (const carEdge of carEdges) {
        for (const obstacleEdge of obstacleEdges) {
          if (this.#isCollidingWithEdge([carEdge], obstacleEdge)) return true;
        }
      }
    }

    return false;
  }

  /**
   * Returns the edges of the car as line segments.
   * @private
   * @returns {Array<object>} - Array of edges represented as start and end points.
   */
  #getEdges() {
    const points = [
      { x: this.x - this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y + this.height / 2 },
      { x: this.x - this.width / 2, y: this.y + this.height / 2 },
    ];

    return [
      { start: points[0], end: points[1] }, // Top edge
      { start: points[1], end: points[2] }, // Right edge
      { start: points[2], end: points[3] }, // Bottom edge
      { start: points[3], end: points[0] }, // Left edge
    ];
  }

  /**
   * Checks if a car edge intersects a given edge.
   * @private
   * @param {Array<object>} carEdges - Array of car edges.
   * @param {object} edge - A single edge to check.
   * @returns {boolean} - True if an intersection occurs, false otherwise.
   */
  #isCollidingWithEdge(
    carEdges: { start: { x: number; y: number }; end: { x: number; y: number } }[],
    edge: { start: { x: number; y: number }; end: { x: number; y: number } }
  ): boolean {
    for (const carEdge of carEdges) {
      const intersection = this.#getIntersection(carEdge, edge);
      if (intersection) return true;
    }
    return false;
  }

  /**
   * Calculates the intersection between two edges.
   * @private
   * @param {object} edge1 - First edge.
   * @param {object} edge2 - Second edge.
   * @returns {object | null} - Intersection point or null if no intersection occurs.
   */
  #getIntersection(
    edge1: { start: { x: number; y: number }; end: { x: number; y: number } },
    edge2: { start: { x: number; y: number }; end: { x: number; y: number } }
  ) {
    const x1 = edge1.start.x, y1 = edge1.start.y;
    const x2 = edge1.end.x, y2 = edge1.end.y;
    const x3 = edge2.start.x, y3 = edge2.start.y;
    const x4 = edge2.end.x, y4 = edge2.end.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return null;

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

  /**
   * Renders the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.isColliding ? "red" : "blue";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
  }
}

