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

        this.#setupKeyboardListeners();
    }

    /**
     * Updates the car's position, velocity, rotation, and enforces road boundaries.
     */
    update() {
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

        // Enforce lane boundaries
        if (newX - 25 >= this.road.leftBoundary && newX + 25 <= this.road.rightBoundary) {
            this.x = newX; // Update position only if within boundaries
        } else {
            this.speed = 0; // Stop car if at boundary
        }

        this.y = newY; // Allow movement along Y-axis
        this.sensor.update(this.x, this.y, this.angle); // Update sensors
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
}
