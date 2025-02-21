/**
 * Represents a 2D car entity in the simulation.
 * Implements acceleration, braking, reverse driving, and steering mechanics.
 */
export default class Car {
    x: number; // X-coordinate position
    y: number; // Y-coordinate position
    speed: number; // Current speed of the car
    angle: number; // Orientation of the car in radians
    steering: number; // Steering force (-1 for left, 1 for right)
    acceleration: number; // Rate of acceleration
    maxSpeed: number; // Maximum forward speed
    maxReverseSpeed: number; // Maximum reverse speed
    friction: number; // Friction for smooth slowing
    brakingPower: number; // Intensity of braking
    turningRate: number; // Base turning sensitivity
    minTurningSpeed: number; // Minimum speed required to turn
    controls: { forward: boolean; brake: boolean; left: boolean; right: boolean }; // Active controls
  
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
      this.acceleration = 0.2; // Car acceleration rate
      this.maxSpeed = 5; // Max forward speed
      this.maxReverseSpeed = -2; // Max reverse speed
      this.friction = 0.05; // Friction slows the car down naturally
      this.brakingPower = 0.3; // Intensity of braking
      this.turningRate = 0.03; // Base turning speed
      this.minTurningSpeed = 0.2; // Minimum speed required for turning
      this.controls = { forward: false, brake: false, left: false, right: false }; // Active key states
    }
  
    /**
     * Handles keyboard input events.
     * @param event - The keyboard event.
     * @param isKeyDown - Whether the key is pressed (true) or released (false).
     */
    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          this.controls.forward = isKeyDown;
          break;
        case "ArrowDown":
        case "s":
          this.controls.brake = isKeyDown;
          break;
        case "ArrowLeft":
        case "a":
          this.controls.left = isKeyDown;
          break;
        case "ArrowRight":
        case "d":
          this.controls.right = isKeyDown;
          break;
      }
    }
  
    /**
     * Updates the car's movement based on acceleration, braking, inertia, and turning mechanics.
     */
    update() {
      // Acceleration when forward key is pressed
      if (this.controls.forward) {
        this.speed += this.acceleration;
      }
  
      // Braking logic
      if (this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.brakingPower; // Quick stop when moving forward
        } else {
          this.speed -= this.acceleration; // Slow reverse movement
        }
      }
  
      // Implement reverse driving with a speed cap
      if (this.controls.brake && this.speed <= 0) {
        this.speed -= this.acceleration;
        if (this.speed < this.maxReverseSpeed) {
          this.speed = this.maxReverseSpeed;
        }
      }
  
      // Apply friction (gradual slowdown when no input)
      if (!this.controls.forward && !this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.friction;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.friction;
          if (this.speed > 0) this.speed = 0;
        }
      }
  
      // Steering logic (turning left/right)
      if (this.controls.left) {
        this.steering = -1;
      } else if (this.controls.right) {
        this.steering = 1;
      } else {
        this.steering = 0;
      }
  
      // Implement realistic turning radius:
      // The turning rate should be influenced by the car's speed.
      if (Math.abs(this.speed) > this.minTurningSpeed) {
        const turnStrength = this.turningRate * (this.speed / this.maxSpeed);
        this.angle += this.steering * turnStrength;
      }
  
      // Apply inertia: The car continues in its current direction smoothly
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
    }
  
    /**
     * Draws the car onto the given canvas rendering context.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
  
      // Draw the car body
      ctx.fillStyle = "#00ADB5";
      ctx.fillRect(-15, -25, 30, 50); // Centered rectangle representing the car
  
      ctx.restore();
    }
  }
  