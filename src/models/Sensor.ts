import Road from "./Road";

/**
 * Sensor Class
 * Uses raycasting to detect obstacles and road boundaries.
 */
export default class Sensor {
    carX: number; // Car's X position
    carY: number; // Car's Y position
    angle: number; // Car's rotation angle
    rayCount: number; // Number of sensor rays
    rayLength: number; // Maximum sensing distance
    raySpread: number; // Field of view (FOV)
    readings: { distance: number; point: { x: number; y: number } | null }[]; // Stores distances and intersection points
    road: Road; // Reference to the road

    constructor(carX: number, carY: number, road: Road, rayCount = 5, rayLength = 150, raySpread = Math.PI / 2) {
        this.carX = carX;
        this.carY = carY;
        this.angle = 0;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;
        this.readings = new Array(rayCount).fill({ distance: rayLength, point: null });
        this.road = road;
    }

    /**
     * Updates sensor readings by checking ray intersections.
     * @param carX - Car's updated X position
     * @param carY - Car's updated Y position
     * @param angle - Car's updated angle
     */
    update(carX: number, carY: number, angle: number) {
        this.carX = carX;
        this.carY = carY;
        this.angle = angle;
        this.readings = this.#castRays();
    }

    /**
     * Casts multiple sensor rays and detects intersections with road boundaries.
     * @returns Array of distances and intersection points
     */
    #castRays(): { distance: number; point: { x: number; y: number } | null }[] {
        const readings: { distance: number; point: { x: number; y: number } | null }[] = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.angle - this.raySpread / 2 + (i / (this.rayCount - 1)) * this.raySpread;
            const endX = this.carX + Math.cos(rayAngle) * this.rayLength;
            const endY = this.carY + Math.sin(rayAngle) * this.rayLength;

            // Detect intersections with the road boundaries
            const intersection = this.#getClosestIntersection(endX, endY);
            readings.push(intersection);
        }
        return readings;
    }

    /**
     * Detects the closest intersection between the ray and road boundaries.
     * @param endX - X coordinate of the ray end point
     * @param endY - Y coordinate of the ray end point
     * @returns The closest intersection point and its distance
     */
    #getClosestIntersection(endX: number, endY: number): { distance: number; point: { x: number; y: number } | null } {
        const intersections: { distance: number; point: { x: number; y: number } }[] = [];

        // Check intersection with left boundary
        const leftBoundaryIntersection = this.#getIntersection(this.road.leftBoundary, endX, endY);
        if (leftBoundaryIntersection) intersections.push(leftBoundaryIntersection);

        // Check intersection with right boundary
        const rightBoundaryIntersection = this.#getIntersection(this.road.rightBoundary, endX, endY);
        if (rightBoundaryIntersection) intersections.push(rightBoundaryIntersection);

        // Find the closest intersection
        if (intersections.length > 0) {
            intersections.sort((a, b) => a.distance - b.distance);
            return intersections[0];
        }

        return { distance: this.rayLength, point: null }; // No intersection found
    }

    /**
     * Computes the intersection of a ray with a vertical road boundary.
     * @param boundaryX - The X coordinate of the road boundary
     * @param endX - The ray's end X coordinate
     * @param endY - The ray's end Y coordinate
     * @returns The intersection point and distance, or null if no intersection
     */
    #getIntersection(boundaryX: number, endX: number, endY: number): { distance: number; point: { x: number; y: number } } | null {
        if ((this.carX < boundaryX && endX > boundaryX) || (this.carX > boundaryX && endX < boundaryX)) {
            const intersectionY = this.carY + ((boundaryX - this.carX) * (endY - this.carY)) / (endX - this.carX);
            const distance = Math.hypot(boundaryX - this.carX, intersectionY - this.carY);
            return { distance, point: { x: boundaryX, y: intersectionY } };
        }
        return null;
    }

    /**
     * Draws sensor rays and intersection points on the canvas.
     * @param ctx - The rendering context of the canvas
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 2;
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.angle - this.raySpread / 2 + (i / (this.rayCount - 1)) * this.raySpread;
            const endX = this.carX + Math.cos(rayAngle) * this.readings[i].distance;
            const endY = this.carY + Math.sin(rayAngle) * this.readings[i].distance;

            // Draw sensor ray
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.moveTo(this.carX, this.carY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Draw intersection point if found
            if (this.readings[i].point) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(this.readings[i].point!.x, this.readings[i].point!.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
