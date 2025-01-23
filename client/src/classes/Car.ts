import { Obstacle } from "./Obstacle";

/**
 * Represents a car in the 2D self-driving car simulation.
 * The car has properties like position, speed, and angle, and methods for acceleration, braking, and steering.
 */
export class Car {
    /**
     * The x-coordinate of the car's position.
     */
    public x: number;
  
    /**
     * The y-coordinate of the car's position.
     */
    public y: number;
  
    /**
     * The current speed of the car.
     */
    public speed: number;
  
    /**
     * The current angle of the car (in radians).
     */
    public angle: number;
  
    /**
     * The maximum speed the car can reach.
     */
    public maxSpeed: number;
  
    /**
     * The rate at which the car accelerates.
     */
    public acceleration: number;
  
    /**
     * The rate at which the car slows down due to friction.
     */
    public friction: number;
  
    /**
     * The angle by which the car turns when steering (in radians).
     */
    public steeringAngle: number;

    /**
     * The initial x-coordinate of the car.
     */
    private initialX: number;

    /**
     * The initial y-coordinate of the car.
     */
    private initialY: number;


    /**
     * The width of the car.
     */
    public width: number = 30;

    /**
     * The height of the car.
     */
    public height: number = 20;
  
    /**
     * Creates a new Car instance.
     * @param x - The initial x-coordinate of the car.
     * @param y - The initial y-coordinate of the car.
     */
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.initialX = x;
      this.initialY = y;
      this.speed = 0;
      this.angle = 0;
      this.maxSpeed = 5;
      this.acceleration = 0.2;
      this.friction = 0.05;
      this.steeringAngle = 0.03;
    }
  
    /**
     * Accelerates the car by increasing its speed.
     * The speed will not exceed the car's maximum speed.
     */
    public accelerate(): void {
      if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration;
      }
    }
  
    /**
     * Brakes the car by decreasing its speed.
     * The speed will not go below 0.
     */
    public brake(): void {
      if (this.speed > 0) {
        this.speed -= this.acceleration;
      }
    }
  
    /**
     * Steers the car to the left by decreasing its angle.
     */
    public steerLeft(): void {
      this.angle -= this.steeringAngle;
    }
  
    /**
     * Steers the car to the right by increasing its angle.
     */
    public steerRight(): void {
      this.angle += this.steeringAngle;
    }
  
    /**
     * Updates the car's position based on its speed and angle.
     * Applies friction to gradually slow down the car.
     */
    public update(): void {
        // Apply friction
        if (this.speed > 0) {
          this.speed -= this.friction;
        }
        if (this.speed < 0) {
          this.speed = 0;
        }
    
        // Update position based on speed and angle
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    /**
     * Checks if the car collides with road boundaries or obstacles.
     * @param roadBorders - The boundaries of the road.
     * @param obstacles - The obstacles on the road.
     * @returns True if a collision is detected, otherwise false.
     */
    public checkCollision(roadBorders: { x: number; y: number }[][], obstacles: Obstacle[]): boolean {
      // Define the car's bounding box corners
      const corners = this.getCarCorners();

      // Check for collisions with road boundaries
      if (this.checkCollisionsWithBorders(corners, roadBorders)) {
          return true;
      }

      // Check for collisions with obstacles
      if (this.checkCollisionsWithObstacles(corners, obstacles)) {
          return true;
      }

      return false; // No collision detected
  }

  /**
   * Gets the corners of the car's bounding box.
   * @returns An array of corner points.
   */
  private getCarCorners(): { x: number; y: number }[] {
      return [
          { x: this.x - this.width / 2, y: this.y - this.height / 2 },
          { x: this.x + this.width / 2, y: this.y - this.height / 2 },
          { x: this.x + this.width / 2, y: this.y + this.height / 2 },
          { x: this.x - this.width / 2, y: this.y + this.height / 2 },
      ];
  }

  /**
   * Checks for collisions between the car's bounding box and road boundaries.
   * @param corners - The corners of the car's bounding box.
   * @param roadBorders - The boundaries of the road.
   * @returns True if a collision is detected, otherwise false.
   */
  private checkCollisionsWithBorders(
      corners: { x: number; y: number }[],
      roadBorders: { x: number; y: number }[][]
  ): boolean {
      for (const border of roadBorders) {
          for (let i = 0; i < corners.length; i++) {
              const intersection = getIntersection(
                  corners[i],
                  corners[(i + 1) % corners.length],
                  border[0],
                  border[1]
              );
              if (intersection) {
                  return true; // Collision detected
              }
          }
      }
      return false; // No collision detected
  }

  /**
   * Checks for collisions between the car's bounding box and obstacles.
   * @param corners - The corners of the car's bounding box.
   * @param obstacles - The obstacles on the road.
   * @returns True if a collision is detected, otherwise false.
   */
  private checkCollisionsWithObstacles(
      corners: { x: number; y: number }[],
      obstacles: Obstacle[]
  ): boolean {
      for (const obstacle of obstacles) {
          const obstacleCorners = this.getObstacleCorners(obstacle);

          for (let i = 0; i < corners.length; i++) {
              for (let j = 0; j < obstacleCorners.length; j++) {
                  const intersection = getIntersection(
                      corners[i],
                      corners[(i + 1) % corners.length],
                      obstacleCorners[j],
                      obstacleCorners[(j + 1) % obstacleCorners.length]
                  );
                  if (intersection) {
                      return true; // Collision detected
                  }
              }
          }
      }
      return false; // No collision detected
  }

  /**
   * Gets the corners of an obstacle's bounding box.
   * @param obstacle - The obstacle.
   * @returns An array of corner points.
   */
  private getObstacleCorners(obstacle: Obstacle): { x: number; y: number }[] {
      return [
          { x: obstacle.x - obstacle.width / 2, y: obstacle.y - obstacle.height / 2 },
          { x: obstacle.x + obstacle.width / 2, y: obstacle.y - obstacle.height / 2 },
          { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2 },
          { x: obstacle.x - obstacle.width / 2, y: obstacle.y + obstacle.height / 2 },
      ];
  }

  /**
    * Resets the car's position, speed, and angle to their initial values.
    */
  public reset(): void {
      this.x = this.initialX;
      this.y = this.initialY;
      this.speed = 0;
      this.angle = 0;
  }
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
                  x: A.x + (B.x - A.x) * t,
                  y: A.y + (B.y - A.y) * t,
              },
              distance: t,
          };
      }
  }

  return null; // No intersection
}
