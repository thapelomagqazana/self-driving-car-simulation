/**
 * Represents a 2D car entity in the simulation.
 * The car has position, speed, direction, acceleration, friction, and momentum effects.
 */
export default class Car {
    x: number; // X-coordinate position of the car
    y: number; // Y-coordinate position of the car
    speed: number; // Current speed of the car
    angle: number; // Orientation of the car in radians
    steering: number; // Steering force (positive for right, negative for left)
    acceleration: number; // Acceleration rate
    maxSpeed: number; // Maximum speed limit
    maxReverseSpeed: number; // Maximum speed in reverse
    friction: number; // Friction for slowing down
    brakingPower: number; // Intensity of braking
    turningRate: number; // Steering sensitivity
    controls: { forward: boolean; brake: boolean; left: boolean; right: boolean }; // Stores active keys
  
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
      this.maxSpeed = 5; // Maximum forward speed
      this.maxReverseSpeed = -2; // Maximum reverse speed
      this.friction = 0.05; // Gradual slowdown when no input
      this.brakingPower = 0.3; // Hard braking intensity
      this.turningRate = 0.03; // Steering sensitivity
      this.controls = { forward: false, brake: false, left: false, right: false }; // Key states
    }
  
    /**
     * Handles keyboard input events.
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
     * Updates the car's movement based on input, friction, and momentum.
     */
    update() {
      // Apply acceleration if forward key is pressed
      if (this.controls.forward) {
        this.speed += this.acceleration;
      }
  
      // Apply braking logic
      if (this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.brakingPower; // Quick stop when moving forward
        } else {
          this.speed -= this.acceleration; // Slow reversing if at zero speed
        }
      }
  
      // Implement reverse driving mechanics
      if (this.controls.brake && this.speed <= 0) {
        this.speed -= this.acceleration; // Reverse acceleration
        if (this.speed < this.maxReverseSpeed) {
          this.speed = this.maxReverseSpeed; // Limit reverse speed
        }
      }
  
      // Apply friction (gradual slowdown)
      if (!this.controls.forward && !this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.friction;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.friction;
          if (this.speed > 0) this.speed = 0;
        }
      }
  
      // Steering logic
      if (this.controls.left) {
        this.steering = -1;
      } else if (this.controls.right) {
        this.steering = 1;
      } else {
        this.steering = 0;
      }
  
      // Update car direction and apply turning effect
      if (Math.abs(this.speed) > 0.2) {
        this.angle += this.steering * this.turningRate * (this.speed / this.maxSpeed);
      }
  
      // Update car position based on speed and angle
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
  