import Car from "./Car";

export default class Sensor {
    car: Car; // Reference to the car
    rayCount: number; // Number of sensor rays
    rayLength: number; // Maximum detection range
    raySpread: number; // Angle spread of the rays
    rays: { start: { x: number; y: number }, end: { x: number; y: number } }[]; // Array of sensor rays

    constructor(car: Car, rayCount = 5, rayLength = 150, raySpread = Math.PI / 2) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;
        this.rays = [];
    }

    /**
     * Updates the sensor rays based on the car's position and angle.
     */
    update() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.car.angle - this.raySpread / 2 + (i / (this.rayCount - 1)) * this.raySpread;
            const startX = this.car.x;
            const startY = this.car.y;
            const endX = startX + Math.sin(rayAngle) * this.rayLength;
            const endY = startY - Math.cos(rayAngle) * this.rayLength;

            this.rays.push({ start: { x: startX, y: startY }, end: { x: endX, y: endY } });
        }
    }

    /**
     * Draws the sensor rays on the canvas.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        for (const ray of this.rays) {
            ctx.beginPath();
            ctx.moveTo(ray.start.x, ray.start.y);
            ctx.lineTo(ray.end.x, ray.end.y);
            ctx.stroke();
        }
    }
}
