import Road from "./Road";
import Sensor from "./Sensor";

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
    road: Road;
    sensor: Sensor;
    width: number;
    height: number;
    collided: boolean;
    collisionPoints: { x: number; y: number }[]; // Store collision locations
    collisionFlashCounter: number; // Counter for flashing effect
  
    constructor(x: number, y: number, road: Road, isAIControlled: boolean = false) {
      this.x = x;
      this.y = y;
      this.road = road;
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
      this.sensor = new Sensor(this, 7, 150, Math.PI / 2);
      this.width = 30;
      this.height = 50;
      this.collided = false;
      this.collisionPoints = [];
      this.collisionFlashCounter = 0;
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
     * AI Evasive Maneuvers Based on Sensor Readings (Adaptive)
     */
    private makeAIDecision() {
      const inputs = this.sensor.smoothReadings;

      if (inputs.length === 0) return;

      // Basic AI logic: turn if an obstacle is detected within 50% range
      if (inputs[3] < 0.5) {
          this.angle += 0.1; // 
      }

      this.speed += 0.1;
    }
  
    /**
     * Updates the car's movement based on mode (manual or AI).
     */
    update(traffic: Car[], staticObstacles: { x: number; y: number; width: number; height: number }[]) {
      if (this.isAIControlled) {
        this.makeAIDecision();
      }

      if (this.collided) {
        this.collisionFlashCounter++;
        return;
      }

      this.applyAcceleration();
      this.applyBraking();
      this.limitSpeed();
      this.applyFriction();
      this.simulateDrift();
      this.adjustSteering();
      this.updatePosition();
      this.enforceRoadBoundaries();
      this.sensor.update(this.road, traffic, staticObstacles);

      // **Check for Collisions**
      const collision = this.checkCollision(traffic, staticObstacles);
      if (collision && !this.isAIControlled) {
          this.collided = true;
          this.speed = 0;
          this.collisionFlashCounter = 0;
          this.collisionPoints.push({ x: this.x, y: this.y });
          console.warn("🚧 Collision detected! Stopping car.");
      }

      // // **Check for Collisions**
      // if (this.checkCollision(traffic, staticObstacles) && !this.isAIControlled) {
      //   this.collided = true;
      //   this.speed = 0;
      //   console.warn("🚧 Collision detected! Stopping car.");
      // }
    }

    /**
     * Collision detection for road boundaries, traffic, and static obstacles.
     */
    private checkCollision(
        traffic: Car[], 
        staticObstacles: { x: number; y: number; width: number; height: number }[]
    ): boolean {
        // **Check Road Boundaries**
        if (this.x - this.width / 2 < this.road.leftBoundary || this.x + this.width / 2 > this.road.rightBoundary) {
            console.warn("🚨 Collision with road boundary detected!");
            return true;
        }

        // **Check Moving Traffic Cars**
        for (const car of traffic) {
            if (this.detectRectangleCollision(this, car)) {
                console.warn("🚗 Collision with traffic detected!");
                return true;
            }
        }

        // **Check Static Obstacles**
        for (const obstacle of staticObstacles) {
            if (this.detectRectangleCollision(this, obstacle)) {
                console.warn("🛑 Collision with static obstacle detected!");
                return true;
            }
        }

        return false;
    }
  
    /**
     * Detects collision between two rectangular objects.
     */
    private detectRectangleCollision(
        objA: { x: number; y: number; width: number; height: number },
        objB: { x: number; y: number; width: number; height: number }
    ): boolean {
        return (
            objA.x < objB.x + objB.width &&
            objA.x + objA.width > objB.x &&
            objA.y < objB.y + objB.height &&
            objA.y + objA.height > objB.y
        );
    }

    /**
    * Handles car acceleration.
    */
    private applyAcceleration() {
      if (this.controls.forward) {
          this.speed += this.acceleration;
      }
    }

    /**
    * Handles car braking.
    */
    private applyBraking() {
      if (!this.controls.brake) return;

      this.speed -= this.speed > 0 ? this.brakingPower : this.acceleration;
    }

    /**
    * Limits car speed to max forward and reverse speeds.
    */
    private limitSpeed() {
      this.speed = Math.max(this.maxReverseSpeed, Math.min(this.speed, this.maxSpeed));
    }

    /**
     * Applies friction to slow down the car when no input is given.
     */
    private applyFriction() {
      if (this.controls.forward || this.controls.brake) return;

      this.speed += this.speed > 0 ? -this.friction : this.friction;

      // **Prevent Floating-Point Drift**
      if (Math.abs(this.speed) < 0.02) {
          this.speed = 0;
      }
    }

    /**
    * Simulates drift and slippage based on grip level.
    */
    private simulateDrift() {
      if (Math.abs(this.speed) <= 0.1) return;

      const driftEffect = this.slipFactor * (1 - this.gripLevel);
      this.angle += this.steering * (this.turningRate + driftEffect) * (this.speed / this.maxSpeed);
    }

    /**
     * Adjusts steering direction based on user input.
     */
    private adjustSteering() {
      if (!this.controls.left && !this.controls.right) {
          this.steering = 0; // **Prevent small angle changes**
      } else {
          this.steering = this.controls.left ? -1 : 1;
      }
    }


    /**
     * Updates the car's position based on its speed and angle.
     */
    private updatePosition() {
      if (Math.abs(this.speed) <= 0.05) return; // **Stop unnecessary updates**
      
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
    }


    /**
    * Ensures the car stays within the road boundaries.
    */
    private enforceRoadBoundaries() {
      if (this.x < this.road.leftBoundary) {
          this.x = this.road.leftBoundary;
          this.speed *= 0.8;
      }
      if (this.x > this.road.rightBoundary) {
          this.x = this.road.rightBoundary;
          this.speed *= 0.8;
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

      // **Flashing red outline on collision**
      if (this.collided && this.collisionFlashCounter % 10 < 5) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }

      // Set car color based on whether it's AI-controlled (static traffic)
      ctx.fillStyle = this.isAIControlled ? "#FF0000" : "#00ADB5"; // Red for static cars, Blue for player car

      ctx.fillRect(-15, -25, 30, 50);
      ctx.restore();

      // **Draw Collision Points**
      this.drawCollisionPoints(ctx);

      this.sensor.draw(ctx); // Draw sensors
    }

    /**
     * Draw collision points on the canvas.
     */
    private drawCollisionPoints(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "red";
      for (const point of this.collisionPoints) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
          ctx.fill();
      }
    }

}
  