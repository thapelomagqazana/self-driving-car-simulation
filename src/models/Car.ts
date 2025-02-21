/**
 * Represents a 2D car entity in the simulation.
 * The car has position, speed, direction, acceleration, friction, and turning capabilities.
 */
export default class Car {
    x: number; // X-coordinate position of the car
    y: number; // Y-coordinate position of the car
    speed: number; // Current speed of the car
    angle: number; // Orientation of the car in radians
    steering: number; // Steering force (positive for right, negative for left)
    acceleration: number; // Rate at which the car accelerates
    maxSpeed: number; // Maximum allowed speed for the car
    friction: number; // Friction to gradually slow down the car
    turningRate: number; // How fast the car turns based on steering input
  
    /**
     * Constructs a new Car instance.
     * @param x - Initial x position.
     * @param y - Initial y position.
     */
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.speed = 0;
      this.angle = 0;
      this.steering = 0;
      this.acceleration = 0.2; // Acceleration rate
      this.maxSpeed = 5; // Maximum speed limit
      this.friction = 0.05; // Slowdown rate when no acceleration
      this.turningRate = 0.03; // Steering sensitivity
    }
  
    /**
     * Updates the car's movement by applying acceleration, friction, and steering.
     * The car's new position is computed based on its speed and angle.
     */
    update() {
      // Apply acceleration
      this.speed += this.acceleration;
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
  
      // Apply friction to gradually slow down the car
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed = 0; // Prevent reversing when friction is high
  
      // Update the car's direction based on steering input
      this.angle += this.steering * this.turningRate;
  
      // Calculate new position based on movement direction
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
    }
  
    /**
     * Draws the car onto the given canvas rendering context.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save(); // Save the current state of the canvas
  
      // Move and rotate the canvas according to the car's position and angle
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
  
      // Draw the car body
      ctx.fillStyle = "#00ADB5"; // Car color
      ctx.fillRect(-15, -25, 30, 50); // Centered rectangle representing the car
  
      ctx.restore(); // Restore the canvas state
    }
  }
  