/**
 * Calculate the new speed of the car based on acceleration and friction.
 * - `currentSpeed`: The current speed of the car.
 * - `acceleration`: The acceleration value (positive for acceleration, negative for braking).
 * - `friction`: The friction coefficient (slows down the car over time).
 * - `maxSpeed`: The maximum speed the car can reach.
 * - Returns the new speed.
 */
export const calculateSpeed = (
    currentSpeed: number,
    acceleration: number,
    friction: number,
    maxSpeed: number
  ): number => {
    let newSpeed = currentSpeed + acceleration; // Apply acceleration
    newSpeed *= (1 - friction); // Apply friction to slow down the car
    return Math.min(Math.max(newSpeed, 0), maxSpeed); // Ensure speed stays within bounds
};

/**
 * Calculate the new angle of the car based on steering and inertia.
 * - `currentAngle`: The current angle of the car (in radians).
 * - `steeringAngle`: The steering angle (positive for right, negative for left).
 * - `inertia`: The inertia coefficient (resists changes in direction).
 * - Returns the new angle.
 */
export const calculateAngle = (
        currentAngle: number,
        steeringAngle: number,
        inertia: number
    ): number => {
    return currentAngle + steeringAngle * (1 - inertia); // Apply steering with inertia
};

/**
 * Calculate the new position of the car based on speed and angle.
 * - `currentPosition`: The current position of the car.
 * - `speed`: The current speed of the car.
 * - `angle`: The current angle of the car (in radians).
 * - Returns the new position.
 */
export const calculatePosition = (
        currentPosition: { x: number; y: number },
        speed: number,
        angle: number
    ): { x: number; y: number } => {
    const deltaX = Math.cos(angle) * speed; // Horizontal movement
    const deltaY = Math.sin(angle) * speed; // Vertical movement
    return { x: currentPosition.x + deltaX, y: currentPosition.y + deltaY };
};