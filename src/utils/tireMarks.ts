/**
 * Draw tire marks on the canvas.
 * - `ctx`: The canvas rendering context.
 * - `carPosition`: The current position of the car.
 * - `carAngle`: The current angle of the car (in radians).
 * - `tireMarks`: An array of tire mark positions and angles.
 * - Returns the updated tire marks array.
 */
export const drawTireMarks = (
    ctx: CanvasRenderingContext2D,
    carPosition: { x: number; y: number },
    carAngle: number,
    tireMarks: Array<{ x: number; y: number; angle: number }>
  ): Array<{ x: number; y: number; angle: number }> => {
    // Add the current car position and angle to the tire marks array
    tireMarks.push({ x: carPosition.x, y: carPosition.y, angle: carAngle });
  
    // Draw all tire marks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
    ctx.lineWidth = 2;
  
    for (let i = 1; i < tireMarks.length; i++) {
      const prev = tireMarks[i - 1];
      const current = tireMarks[i];
  
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }
  
    // Keep only the last 100 tire marks to avoid performance issues
    if (tireMarks.length > 100) {
      tireMarks.shift();
    }
  
    return tireMarks;
};