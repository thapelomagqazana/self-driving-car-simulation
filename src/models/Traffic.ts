import Road from "./Road";
import Car from "./Car";

/**
 * Enum for vehicle types.
 */
enum VehicleType {
    CAR = "car",
    TRUCK = "truck",
    MOTORCYCLE = "motorcycle"
}

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
            this.spawnVehicle(this.road);
        }
    }

    /**
     * Updates all traffic vehicles.
     */
    update(playerCar: Car, staticObstacles: { x: number; y: number; width: number; height: number }[]) {
        const now = performance.now();
        if (now - this.lastSpawnTime > this.spawnInterval) {
            this.spawnVehicle(this.road);
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
     * Spawns a random traffic vehicle.
     */
    private spawnVehicle(road: Road) {
        const laneIndex = Math.floor(Math.random() * road.laneCount);
        const x = road.getLaneCenter(laneIndex);
        const y = -Math.random() * 1000; // Ensure it spawns offscreen

        // Randomly select a vehicle type
        const vehicleType = this.getRandomVehicleType();
        let width, height, speed, color;

        switch (vehicleType) {
            case VehicleType.TRUCK:
                width = 40;
                height = 80;
                speed = 1.5 + Math.random() * 1; // Trucks are slower
                color = "brown";
                break;
            case VehicleType.MOTORCYCLE:
                width = 20;
                height = 40;
                speed = 3 + Math.random() * 1.5; // Motorcycles are faster
                color = "yellow";
                break;
            case VehicleType.CAR:
            default:
                width = 30;
                height = 50;
                speed = 2 + Math.random() * 2; // Regular speed
                color = "red";
                break;
        }

        const vehicle = new Car(x, y, road, true);
        vehicle.speed = speed;
        vehicle.width = width;
        vehicle.height = height;
        vehicle.color = color; // Add a color property

        this.cars.push(vehicle);

        // console.log(`🚗 Spawned ${vehicleType} at (x: ${x}, y: ${y}, speed: ${speed.toFixed(2)})`);
    }

    /**
     * Returns a random vehicle type.
     */
    private getRandomVehicleType(): VehicleType {
        const types = Object.values(VehicleType);
        return types[Math.floor(Math.random() * types.length)];
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
