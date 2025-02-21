export default class Car {
    x: number;
    y: number;
    speed: number;
    angle: number;
    steering: number;
    acceleration: number;
    maxSpeed: number;
    maxReverseSpeed: number;
    friction: number;
    brakingPower: number;
    turningRate: number;
    gripLevel: number;
    slipFactor: number;
    isAIControlled: boolean; // New property to switch between manual and AI mode
    controls: { forward: boolean; brake: boolean; left: boolean; right: boolean };
  
    constructor(x: number, y: number, isAIControlled: boolean = false) {
      this.x = x;
      this.y = y;
      this.speed = 0;
      this.angle = 0;
      this.steering = 0;
      this.acceleration = 0.2;
      this.maxSpeed = 4;
      this.maxReverseSpeed = -2;
      this.friction = 0.05;
      this.brakingPower = 0.3;
      this.turningRate = 0.03;
      this.gripLevel = 1;
      this.slipFactor = 0.1;
      this.isAIControlled = isAIControlled; // Determines if the car should be AI-driven
      this.controls = { forward: false, brake: false, left: false, right: false };
    }
  
    /**
     * Handles keyboard input for manual control.
     * @param event - The keyboard event.
     * @param isKeyDown - Whether the key is pressed or released.
     */
    handleInput(event: KeyboardEvent, isKeyDown: boolean) {
      if (this.isAIControlled) return; // Ignore input if in AI mode
  
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
     * Updates the car's movement based on mode (manual or AI).
     */
    update() {
      if (this.isAIControlled) {
        // AI movement logic will be implemented later
        return;
      }
  
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
  
      // Limit Speed
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      if (this.speed < this.maxReverseSpeed) this.speed = this.maxReverseSpeed;
  
      // Apply Friction
      if (!this.controls.forward && !this.controls.brake) {
        if (this.speed > 0) {
          this.speed -= this.friction;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.friction;
          if (this.speed > 0) this.speed = 0;
        }
      }
  
      // Simulate Drift/Slippage
      if (Math.abs(this.speed) > 0.1) {
        const driftEffect = this.slipFactor * (1 - this.gripLevel);
        this.angle += this.steering * (this.turningRate + driftEffect) * (this.speed / this.maxSpeed);
      }
  
      // Adjust Steering
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
     * Draws the car onto the canvas.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = "#00ADB5";
      ctx.fillRect(-15, -25, 30, 50);
      ctx.restore();
    }
}
  