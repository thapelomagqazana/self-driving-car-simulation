import Car from "./Car";
import Road from "./Road";

export default class Sensor {
    car: Car;
    rayCount: number; // Number of sensor rays
    rayLength: number; // Maximum detection range
    raySpread: number; // Angle spread of the rays
    rays: { start: { x: number; y: number }, end: { x: number; y: number } }[]; // Array of sensor rays
    readings: { x: number; y: number }[]; // Stores detected intersection points

    constructor(car: Car, rayCount = 5, rayLength = 150, raySpread = Math.PI / 2) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;
        this.rays = [];
        this.readings = [];
    }

    /**
     * Updates the sensor rays based on the car's position and angle.
     */
    update(road: Road, traffic: Car[]) {
        this.rays = [];
        this.readings = [];

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.car.angle - this.raySpread / 2 + (i / (this.rayCount - 1)) * this.raySpread;
            const startX = this.car.x;
            const startY = this.car.y;
            const endX = startX + Math.sin(rayAngle) * this.rayLength;
            const endY = startY - Math.cos(rayAngle) * this.rayLength;

            const ray = { start: { x: startX, y: startY }, end: { x: endX, y: endY } };
            this.rays.push(ray);

            // Get closest intersection point with road boundaries and traffic
            const intersection = this.getClosestIntersection(ray, road, traffic);
            this.readings.push(intersection);
        }
    }

    /**
     * Finds the closest intersection point of the sensor ray with road boundaries and traffic.
     */
    getClosestIntersection(
        ray: { start: { x: number; y: number }; end: { x: number; y: number } },
        road: Road,
        traffic: Car[]
    ) {
        let closestIntersection: { x: number; y: number } | null = null;
        const minDist = this.rayLength;

        // Check intersection with road boundaries
        const roadEdges = this.getRoadEdges(road);
        closestIntersection = this.findClosestIntersection(ray, roadEdges, closestIntersection, minDist);

        // Check intersection with traffic cars
        for (const car of traffic) {
            const carEdges = this.getCarEdges(car);
            closestIntersection = this.findClosestIntersection(ray, carEdges, closestIntersection, minDist);
        }

        return closestIntersection ?? { x: ray.end.x, y: ray.end.y }; // If no obstacle, use max range
    }

    /**
     * Returns the edges of the road as an array of line segments.
     */
    private getRoadEdges(road: Road) {
        return [
            { x1: road.leftBoundary, y1: -10000, x2: road.leftBoundary, y2: 10000 }, // Left boundary
            { x1: road.rightBoundary, y1: -10000, x2: road.rightBoundary, y2: 10000 } // Right boundary
        ];
    }

    /**
     * Returns the edges of a traffic car as an array of line segments.
     */
    private getCarEdges(car: Car) {
        return [
            { x1: car.x - 15, y1: car.y - 25, x2: car.x + 15, y2: car.y - 25 }, // Top edge
            { x1: car.x + 15, y1: car.y - 25, x2: car.x + 15, y2: car.y + 25 }, // Right edge
            { x1: car.x + 15, y1: car.y + 25, x2: car.x - 15, y2: car.y + 25 }, // Bottom edge
            { x1: car.x - 15, y1: car.y + 25, x2: car.x - 15, y2: car.y - 25 }  // Left edge
        ];
    }

    /**
     * Finds the closest intersection point of a ray with a set of edges.
     */
    private findClosestIntersection(
        ray: { start: { x: number; y: number }; end: { x: number; y: number } },
        edges: { x1: number; y1: number; x2: number; y2: number }[],
        closestIntersection: { x: number; y: number } | null,
        minDist: number
    ) {
        for (const edge of edges) {
            const intersection = this.getIntersection(
                ray.start,
                ray.end,
                { x: edge.x1, y: edge.y1 },
                { x: edge.x2, y: edge.y2 }
            );

            if (intersection) {
                const dist = Math.hypot(ray.start.x - intersection.x, ray.start.y - intersection.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestIntersection = intersection;
                }
            }
        }
        return closestIntersection;
    }


    /**
     * Computes the intersection point between two line segments.
     */
    getIntersection(A: { x: number; y: number }, B: { x: number; y: number }, C: { x: number; y: number }, D: { x: number; y: number }) {
        const denom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
        if (denom === 0) return null;

        const t = ((D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)) / denom;
        const u = ((B.x - A.x) * (A.y - C.y) - (B.y - A.y) * (A.x - C.x)) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: A.x + t * (B.x - A.x),
                y: A.y + t * (B.y - A.y)
            };
        }
        return null;
    }

    /**
     * Draws sensor rays, changing color when detecting an obstacle.
     */
    draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            const intersection = this.readings[i];

            ctx.beginPath();
            ctx.moveTo(ray.start.x, ray.start.y);
            ctx.lineTo(intersection.x, intersection.y);
            ctx.strokeStyle = intersection.x === ray.end.x && intersection.y === ray.end.y ? "green" : "red"; // Green = No obstacle, Red = Obstacle
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}
