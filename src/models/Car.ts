/**
 * Represents a 2D car entity with realistic physics, including:
 * - Friction
 * - Speed limits
 * - Drifting and slippage
 * - Surface handling variations
 */
export default class Car {
    x: number; // X-coordinate
    y: number; // Y-coordinate
    speed: number; // Current speed
    angle: number; // Orientation in radians
    steering: number; // Steering input (-1 for left, 1 for right)
    acceleration: number; // Acceleration rate
    maxSpeed: number; // Maximum allowed speed
    maxReverseSpeed: number; // Maximum reverse speed
    friction: number; // Resistance to movement
    brakingPower: number; // Intensity of braking
    turningRate: number; // Steering sensitivity
    gripLevel: number; // Handling grip level (0 = slippery, 1 = high grip)
    slipFactor: number; // Drifting/slippage effect
    controls: { forward: boolean; brake: boolean; left: boolean; right: boolean }; // Active keys
  
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
      this.maxSpeed = 4; // Max forward speed
      this.maxReverseSpeed = -2; // Max reverse speed
      this.friction = 0.05; // Gradual slowdown when no input
      this.brakingPower = 0.3; // Strength of braking
      this.turningRate = 0.03; // Base turning rate
      this.gripLevel = 1; // High grip by default (lower values = slippery)
      this.slipFactor = 0.1; // Controls drifting effect
      this.controls = { forward: false, brake: false, left: false, right: false }; // Key states
    }
  
    /**
     * Handles keyboard input for acceleration, braking, and steering.
     * @param event - The keyboard event.
     * @param isKeyDown - Whether the key is pressed or released.
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
     * Updates the car's movement based on physics and user input.
     */
    update() {
      // Apply Acceleration
      if (this.controls.forward) {
        this.speed += this.acceleration;
      }
  
      // Apply Braking
      if (this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.brakingPower;
        } else {
          this.speed -= this.acceleration;
        }
      }
  
      // Implement Velocity Clamping (Limit Speed)
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      if (this.speed < this.maxReverseSpeed) this.speed = this.maxReverseSpeed;
  
      // Apply Friction (Gradual Slowdown)
      if (!this.controls.forward && !this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.friction;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.friction;
          if (this.speed > 0) this.speed = 0;
        }
      }
  
      // Simulate Drift/Slippage for Smooth Turns
      if (Math.abs(this.speed) > 0.1) {
        const driftEffect = this.slipFactor * (1 - this.gripLevel); // More drift on low grip
        this.angle += this.steering * (this.turningRate + driftEffect) * (this.speed / this.maxSpeed);
      }
  
      // Adjust Steering Based on Speed & Surface Grip
      if (this.controls.left) {
        this.steering = -1;
      } else if (this.controls.right) {
        this.steering = 1;
      } else {
        this.steering = 0;
      }
  
      // Update Car Position
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
    }
  
    /**
     * Adjusts the car's grip level based on surface type.
     * @param surface - The type of surface (e.g., "asphalt", "ice", "gravel").
     */
    setSurface(surface: string) {
      switch (surface) {
        case "asphalt":
          this.gripLevel = 1;
          this.slipFactor = 0.1;
          break;
        case "gravel":
          this.gripLevel = 0.7;
          this.slipFactor = 0.3;
          break;
        case "ice":
          this.gripLevel = 0.3;
          this.slipFactor = 0.6;
          break;
        default:
          this.gripLevel = 1;
          this.slipFactor = 0.1;
      }
    }
  
    /**
     * Draws the car onto the canvas.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
  
      // Draw the car body
      ctx.fillStyle = "#00ADB5";
      ctx.fillRect(-15, -25, 30, 50); // Centered rectangle for the car
  
      ctx.restore();
    }
  }
  