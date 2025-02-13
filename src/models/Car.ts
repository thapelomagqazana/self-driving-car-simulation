import Road from "./Road";
import Sensor from "./Sensor";

/**
 * Car Class
 * Handles car physics, movement, and ensures it stays within lane boundaries.
 */
export default class Car {
    x: number; // X-coordinate of the car
    y: number; // Y-coordinate of the car
    angle: number; // Rotation angle (in radians)
    speed: number; // Current speed
    acceleration: number; // Acceleration rate
    maxSpeed: number; // Maximum speed
    friction: number; // Friction (deceleration when no input is given)
    turnSpeed: number; // Rate of turning
    controls: { left: boolean; right: boolean; up: boolean; down: boolean }; // Input controls
    road: Road; // Reference to the road for boundary checks
    sensor: Sensor;
    width: number; // Width of the car (for collision detection)
    height: number; // Height of the car (for collision detection)
    collided: boolean; // Flag to indicate if the car has collided

    constructor(x: number, y: number, road: Road) {
        this.x = x;
        this.y = y;
        this.angle = 0; // Facing forward
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 5;
        this.friction = 0.05;
        this.turnSpeed = 0.03;
        this.controls = { left: false, right: false, up: false, down: false };
        this.road = road; // Store reference to road
        this.sensor = new Sensor(x, y, road); // Initialize sensor
        this.width = 50; // Car width
        this.height = 30; // Car height
        this.collided = false; // Collision flag

        this.#setupKeyboardListeners();
    }

    /**
     * Updates the car's position, velocity, rotation, and enforces road boundaries.
     */
    update() {
        if (this.collided) return; // Stop updating if a collision has occurred
        // Apply acceleration when moving forward
        if (this.controls.up) {
            this.speed += this.acceleration;
        }
        // Apply deceleration when moving backward
        if (this.controls.down) {
            this.speed -= this.acceleration;
        }

        // Limit speed to maximum speed
        this.speed = Math.max(Math.min(this.speed, this.maxSpeed), -this.maxSpeed / 2);

        // Apply friction (reduces speed when no acceleration is applied)
        if (this.speed > 0) {
            this.speed -= this.friction;
        } else if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Stop car if friction brings speed close to zero
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Handle rotation (only allow turning when moving)
        if (this.speed !== 0) {
            let flip = this.speed > 0 ? 1 : -1; // Reverse turning if going backward
            if (this.controls.left) {
                this.angle -= this.turnSpeed * flip;
            }
            if (this.controls.right) {
                this.angle += this.turnSpeed * flip;
            }
        }

        // Calculate new position
        const newX = this.x + Math.cos(this.angle) * this.speed;
        const newY = this.y + Math.sin(this.angle) * this.speed;

        // Check for collision with road boundaries
        if (this.#checkCollision(newX)) {
            this.speed = 0; // Stop the car if a collision occurs
            this.collided = true; // Mark as collided
            return;
        }

        this.x = newX;
        this.y = newY;
        this.sensor.update(this.x, this.y, this.angle); // Update sensors
    }

    /**
     * Checks if the car has collided with the road boundaries.
     * @param newX - The car's new X position
     * @returns True if collision occurs, otherwise false
     */
    #checkCollision(newX: number): boolean {
        const carLeftEdge = newX - this.width / 2;
        const carRightEdge = newX + this.width / 2;

        // If the car's edges exceed the road boundaries, return true
        if (carLeftEdge < this.road.leftBoundary || carRightEdge > this.road.rightBoundary) {
            console.log("Collision Detected!");
            return true;
        }

        return false;
    }

    /**
     * Handles keyboard inputs to control the car.
     * - Arrow keys control movement.
     */
    #setupKeyboardListeners() {
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.controls.left = true;
                    break;
                case "ArrowRight":
                    this.controls.right = true;
                    break;
                case "ArrowUp":
                    this.controls.up = true;
                    break;
                case "ArrowDown":
                    this.controls.down = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.controls.left = false;
                    break;
                case "ArrowRight":
                    this.controls.right = false;
                    break;
                case "ArrowUp":
                    this.controls.up = false;
                    break;
                case "ArrowDown":
                    this.controls.down = false;
                    break;
            }
        });
    }

    /**
     * Draws the car on the canvas.
     * @param ctx - The rendering context of the canvas
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw car (rectangle for now)
        ctx.fillStyle = "red";
        ctx.fillRect(-25, -15, 50, 30);

        ctx.restore();
        this.sensor.draw(ctx);
    }

    /**
     * Resets the car to the starting position after a collision.
     */
    reset() {
        this.x = this.road.getLaneCenter(1);
        this.y = window.innerHeight - 100;
        this.angle = 0;
        this.speed = 0;
        this.collided = false;
    }
}
