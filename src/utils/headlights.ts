/**
 * Draw headlights on the canvas.
 * - `ctx`: The canvas rendering context.
 * - `carPosition`: The current position of the car.
 * - `carAngle`: The current angle of the car (in radians).
 */
export const drawHeadlights = (
    ctx: CanvasRenderingContext2D,
    carPosition: { x: number; y: number },
    carAngle: number
  ) => {
    // Save the current canvas state
    ctx.save();
  
    // Translate to the car's position
    ctx.translate(carPosition.x, carPosition.y);
  
    // Rotate the canvas to match the car's angle
    ctx.rotate(carAngle);
  
    // Draw the left headlight
    ctx.beginPath();
    ctx.arc(-20, -15, 10, 0, Math.PI * 2); // Left headlight position
    ctx.fillStyle = 'rgba(255, 255, 200, 0.5)'; // Semi-transparent yellow
    ctx.fill();
  
    // Draw the right headlight
    ctx.beginPath();
    ctx.arc(-20, 15, 10, 0, Math.PI * 2); // Right headlight position
    ctx.fillStyle = 'rgba(255, 255, 200, 0.5)'; // Semi-transparent yellow
    ctx.fill();
  
    // Restore the canvas state
    ctx.restore();
};