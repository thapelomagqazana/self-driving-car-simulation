/**
 * Represents a self-driving car with basic physics for movement and steering.
 */
export class Car {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;
    angle: number;
    controls: { left: boolean; right: boolean; up: boolean; down: boolean };
  
    /**
     * Initializes a car object.
     * @param {number} x - The initial x-position of the car.
     * @param {number} y - The initial y-position of the car.
     * @param {number} width - The width of the car.
     * @param {number} height - The height of the car.
     */
    constructor(x: number, y: number, width: number, height: number) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.acceleration = 0.2;
      this.maxSpeed = 5;
      this.friction = 0.05;
      this.angle = 0;
  
      // Object to track key presses
      this.controls = { left: false, right: false, up: false, down: false };
  
      // Attach event listeners for key presses
      this.#addKeyboardListeners();
    }
  
    /**
     * Adds event listeners to handle keyboard input for car movement.
     * Uses private method naming convention (#) to indicate internal use.
     */
    #addKeyboardListeners() {
      document.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "ArrowLeft":
          case "a":
            this.controls.left = true;
            break;
          case "ArrowRight":
          case "d":
            this.controls.right = true;
            break;
          case "ArrowUp":
          case "w":
            this.controls.up = true;
            break;
          case "ArrowDown":
          case "s":
            this.controls.down = true;
            break;
        }
      });
  
      document.addEventListener("keyup", (event) => {
        switch (event.key) {
          case "ArrowLeft":
          case "a":
            this.controls.left = false;
            break;
          case "ArrowRight":
          case "d":
            this.controls.right = false;
            break;
          case "ArrowUp":
          case "w":
            this.controls.up = false;
            break;
          case "ArrowDown":
          case "s":
            this.controls.down = false;
            break;
        }
      });
    }
  
    /**
     * Updates the car's position and angle based on acceleration, steering, and friction.
     */
    update() {
      // Accelerate forward
      if (this.controls.up) {
        this.speed += this.acceleration;
      }
  
      // Brake / Reverse
      if (this.controls.down) {
        this.speed -= this.acceleration;
      }
  
      // Enforce maximum speed limits
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
      }
      if (this.speed < -this.maxSpeed / 2) {
        this.speed = -this.maxSpeed / 2;
      }
  
      // Apply friction to gradually stop the car
      if (this.speed > 0) {
        this.speed -= this.friction;
      }
      if (this.speed < 0) {
        this.speed += this.friction;
      }
      if (Math.abs(this.speed) < this.friction) {
        this.speed = 0;
      }
  
      // Steering logic - The car turns only when moving
      if (this.speed !== 0) {
        const flip = this.speed > 0 ? 1 : -1; // Reverse steering when moving backward
        if (this.controls.left) {
          this.angle -= 0.03 * flip;
        }
        if (this.controls.right) {
          this.angle += 0.03 * flip;
        }
      }
  
      // Update position based on angle and speed
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
    }
  
    /**
     * Draws the car on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save(); // Save the current state
      ctx.translate(this.x, this.y); // Move the drawing position
      ctx.rotate(this.angle); // Rotate the car based on its angle
      ctx.fillStyle = "blue"; // Car color
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height); // Draw rectangle
      ctx.restore(); // Restore original state
    }
  }
  