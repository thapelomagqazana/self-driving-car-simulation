/**
 * Represents a car in the 2D self-driving car simulation.
 * The car has properties like position, speed, and angle, and methods for acceleration, braking, and steering.
 */
export class Car {
    /**
     * The x-coordinate of the car's position.
     */
    public x: number;
  
    /**
     * The y-coordinate of the car's position.
     */
    public y: number;
  
    /**
     * The current speed of the car.
     */
    public speed: number;
  
    /**
     * The current angle of the car (in radians).
     */
    public angle: number;
  
    /**
     * The maximum speed the car can reach.
     */
    public maxSpeed: number;
  
    /**
     * The rate at which the car accelerates.
     */
    public acceleration: number;
  
    /**
     * The rate at which the car slows down due to friction.
     */
    public friction: number;
  
    /**
     * The angle by which the car turns when steering (in radians).
     */
    public steeringAngle: number;
  
    /**
     * Creates a new Car instance.
     * @param x - The initial x-coordinate of the car.
     * @param y - The initial y-coordinate of the car.
     */
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.speed = 0;
      this.angle = 0;
      this.maxSpeed = 5;
      this.acceleration = 0.2;
      this.friction = 0.05;
      this.steeringAngle = 0.03;
    }
  
    /**
     * Accelerates the car by increasing its speed.
     * The speed will not exceed the car's maximum speed.
     */
    public accelerate(): void {
      if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration;
      }
    }
  
    /**
     * Brakes the car by decreasing its speed.
     * The speed will not go below 0.
     */
    public brake(): void {
      if (this.speed > 0) {
        this.speed -= this.acceleration;
      }
    }
  
    /**
     * Steers the car to the left by decreasing its angle.
     */
    public steerLeft(): void {
      this.angle -= this.steeringAngle;
    }
  
    /**
     * Steers the car to the right by increasing its angle.
     */
    public steerRight(): void {
      this.angle += this.steeringAngle;
    }
  
    /**
     * Updates the car's position based on its speed and angle.
     * Applies friction to gradually slow down the car.
     */
    public update(): void {
      // Apply friction
      if (this.speed > 0) {
        this.speed -= this.friction;
      }
      if (this.speed < 0) {
        this.speed = 0;
      }
  
      // Update position based on speed and angle
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }
  }