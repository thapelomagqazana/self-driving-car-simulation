/**
 * Represents a car in the simulation.
 * Handles position, speed, angle, and controls.
 */
export class Car {
  x: number; // X-coordinate of the car
  y: number; // Y-coordinate of the car
  speed: number; // Current speed of the car
  angle: number; // Current angle of the car in radians
  width: number; // Width of the car
  height: number; // Height of the car
  maxSpeed: number; // Maximum speed
  acceleration: number; // Acceleration rate
  friction: number; // Friction coefficient
  turnSpeed: number; // Turning speed

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
  }

  /**
   * Updates the car's state: position, speed, and angle.
   * @param {boolean} accelerate - Whether the car is accelerating.
   * @param {boolean} brake - Whether the car is braking.
   * @param {boolean} turnLeft - Whether the car is turning left.
   * @param {boolean} turnRight - Whether the car is turning right.
   */
  update(
    accelerate: boolean,
    brake: boolean,
    turnLeft: boolean,
    turnRight: boolean
  ) {
    // Handle acceleration and braking
    if (accelerate) {
      this.speed += this.acceleration;
    } else if (brake) {
      this.speed -= this.acceleration * 2; // Brake harder
    }

    // Clamp speed to the maximum limits
    this.speed = Math.max(Math.min(this.speed, this.maxSpeed), -this.maxSpeed);

    // Apply friction to gradually reduce speed
    if (this.speed > 0) {
      this.speed -= this.friction;
    } else if (this.speed < 0) {
      this.speed += this.friction;
    }

    // Prevent tiny movements when speed is near zero
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // Handle steering
    if (this.speed !== 0) {
      const direction = this.speed > 0 ? 1 : -1; // Reverse steering when moving backward
      if (turnLeft) {
        this.angle += this.turnSpeed * direction;
      }
      if (turnRight) {
        this.angle -= this.turnSpeed * direction;
      }
    }

    // Update position based on speed and angle
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  /**
   * Renders the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); // Save the current canvas state

    // Translate and rotate the canvas to match the car's position and angle
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw the car as a simple rectangle
    ctx.fillStyle = "blue";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore(); // Restore the canvas to its original state
  }
}
