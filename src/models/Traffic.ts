import Road from "./Road";
import Car from "./Car";

/**
 * Traffic Class:
 * - Manages AI-controlled traffic vehicles.
 */
export default class Traffic {
    cars: Car[];
    road: Road;
    spawnInterval: number;
    lastSpawnTime: number;

    constructor(road: Road, count: number, spawnInterval: number = 3000) {
        this.road = road;
        this.cars = [];
        this.spawnInterval = spawnInterval;
        this.lastSpawnTime = performance.now();

        for (let i = 0; i < count; i++) {
            this.spawnVehicle();
        }
    }

    /**
     * Updates all traffic vehicles.
     */
    update(playerCar: Car, staticObstacles: { x: number; y: number; width: number; height: number }[]) {
        const now = performance.now();
        if (now - this.lastSpawnTime > this.spawnInterval) {
            this.spawnVehicle();
            this.lastSpawnTime = now;
        }
    
        for (const car of this.cars) {
            // console.log(`Before update: Car at (x: ${car.x}, y: ${car.y}, speed: ${car.speed})`);
            car.update([], staticObstacles);
            // console.log(`After update: Car at (x: ${car.x}, y: ${car.y}, speed: ${car.speed})`);
        }
    
        this.cars = this.cars.filter(car => car.y < playerCar.y + 600);
    }
    

    /**
     * Spawns a traffic vehicle in a random lane.
     */
    private spawnVehicle() {
        const laneIndex = Math.floor(Math.random() * this.road.laneCount);
        const x = this.road.getLaneCenter(laneIndex);
        const y = -Math.random() * 500 - 100; // Ensure spawn is within visible range
        const speed = 1.5 + Math.random() * 2;
    
        const vehicle = new Car(x, y, this.road, true);
        vehicle.speed = speed;
        this.cars.push(vehicle);
    
        // console.log(`Traffic spawned at (x: ${x}, y: ${y}, speed: ${speed})`);
    }
    

    /**
     * Draws all traffic vehicles.
     */
    draw(ctx: CanvasRenderingContext2D) {
        for (const car of this.cars) {
            car.draw(ctx);
        }
    }
}
