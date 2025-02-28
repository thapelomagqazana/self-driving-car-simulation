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
            this.handleLaneChange(car);
            this.handleSpeedAdjustment(car);
            this.handleObstacleAvoidance(car, staticObstacles);
            this.enforceRoadBoundaries(car);
            this.addUnpredictableBraking(car);
            this.increaseTrafficDensity();


            car.update([], staticObstacles);
        }

        // Ensure AI-controlled player car reacts to traffic
        if (playerCar.isAIControlled) {
            playerCar.makeAIDecision(this.cars);
        }

        this.cars = this.cars.filter(car => car.y < playerCar.y + 600);
    }

    /**
     * **Unpredictable Braking**
     * - Cars will suddenly brake to make gameplay more challenging.
     */
    private addUnpredictableBraking(car: Car) {
        if (Math.random() < 0.02) {
            car.speed *= 0.75; // Random braking
        }
    }

    /**
     * **Dynamically Increase Traffic Density**
     * - As the player progresses, spawn more cars.
     */
    private increaseTrafficDensity() {
        if (Math.random() < 0.02 && this.cars.length < 10) {
            this.spawnVehicle();
        }
    }

    /**
     * **Smooth Speed Changes:**
     * - Gradually accelerate instead of instant speed jumps.
     * - Decelerate smoothly instead of sudden stops.
     */
    private smoothSpeedChanges(car: Car) {
        const targetSpeed = car.speed;
        if (Math.abs(targetSpeed - car.speed) > 0.05) {
            car.speed += (targetSpeed - car.speed) * 0.1; // Smooth transition
        }
    }

    /**
     * **Traffic AI: Natural Lane Changing**
     * - Look ahead and decide when to switch lanes safely.
     * - Add randomness to prevent predictable behavior.
     */
    private handleLaneChange(car: Car) {
        const aheadCar = this.getCarAhead(car);
        if (aheadCar && car.y - aheadCar.y < 100) {
            const laneOptions = this.getAvailableLanes(car);
            if (laneOptions.length > 0 && Math.random() < 0.02) { // Random chance to switch
                car.x = this.road.getLaneCenter(laneOptions[Math.floor(Math.random() * laneOptions.length)]);
            }
        }
    }

    /**
     * **AI: Adjust Speed Based on Traffic Density**
     */
    private handleSpeedAdjustment(car: Car) {
        const aheadCar = this.getCarAhead(car);
        if (aheadCar && car.y - aheadCar.y < 120) {
            car.speed *= 0.98; // Smoothly reduce speed
        } else {
            car.speed *= 1.01; // Gradually return to normal speed
        }
    }

    /**
     * AI: Stop for obstacles.
     */
    private handleObstacleAvoidance(car: Car, staticObstacles: { x: number; y: number; width: number; height: number }[]) {
        for (const obstacle of staticObstacles) {
            if (Math.abs(car.x - obstacle.x) < 30 && Math.abs(car.y - obstacle.y) < 100) {
                car.speed *= 0.85; // Gradual slowdown
                if (Math.abs(car.y - obstacle.y) < 50) {
                    car.speed = 0; // Full stop if too close
                }
            }
        }
    }

    /**
     * Prevents cars from hitting road boundaries.
     */
    private enforceRoadBoundaries(car: Car) {
        if (car.x < this.road.leftBoundary + 20) {
            car.x = this.road.leftBoundary + 20;
            car.speed *= 0.9;
        }
        if (car.x > this.road.rightBoundary - 20) {
            car.x = this.road.rightBoundary - 20;
            car.speed *= 0.9;
        }
    }

    /**
     * Gets the car directly ahead in the same lane.
     */
    private getCarAhead(car: Car): Car | null {
        let closestCar: Car | null = null;
        for (const other of this.cars) {
            if (other !== car && other.x === car.x && other.y < car.y) {
                if (!closestCar || other.y > closestCar.y) {
                    closestCar = other;
                }
            }
        }
        return closestCar;
    }

    /**
     * Gets available lanes for lane switching.
     */
    private getAvailableLanes(car: Car): number[] {
        const currentLane = this.road.getLaneCenters().indexOf(car.x);
        const availableLanes = [];

        if (currentLane > 0) availableLanes.push(currentLane - 1);
        if (currentLane < this.road.laneCount - 1) availableLanes.push(currentLane + 1);

        return availableLanes;
    }

    /**
     * Spawns a random traffic vehicle.
     */
    private spawnVehicle() {
        const laneIndex = Math.floor(Math.random() * this.road.laneCount);
        const x = this.road.getLaneCenter(laneIndex);
        const y = -Math.random() * 800 - 200; // More natural spacing

        const vehicleType = this.getRandomVehicleType();
        let width, height, speed, color;

        switch (vehicleType) {
            case VehicleType.TRUCK:
                width = 40;
                height = 80;
                speed = 1.8 + Math.random() * 0.5;
                color = "brown";
                break;
            case VehicleType.MOTORCYCLE:
                width = 20;
                height = 40;
                speed = 3.5 + Math.random() * 1;
                color = "yellow";
                break;
            case VehicleType.CAR:
            default:
                width = 30;
                height = 50;
                speed = 2.5 + Math.random() * 0.8;
                color = "red";
                break;
        }

        const vehicle = new Car(x, y, this.road, true);
        vehicle.speed = speed;
        vehicle.width = width;
        vehicle.height = height;
        vehicle.color = color;

        this.cars.push(vehicle);
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
