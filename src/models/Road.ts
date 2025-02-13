/**
 * Road Class
 * Defines a 2D road with lanes and boundaries.
 */
export default class Road {
    x: number; // Center X position of the road
    width: number; // Total width of the road
    laneCount: number; // Number of lanes
    leftBoundary: number; // Leftmost road boundary
    rightBoundary: number; // Rightmost road boundary
  
    constructor(x: number, width: number, laneCount = 3) {
      this.x = x;
      this.width = width;
      this.laneCount = laneCount;
  
      this.leftBoundary = this.x - this.width / 2;
      this.rightBoundary = this.x + this.width / 2;
    }
  
    /**
     * Returns the X position of the center of a given lane.
     * @param laneIndex - The index of the lane (0 to laneCount - 1).
     */
    getLaneCenter(laneIndex: number): number {
      const laneWidth = this.width / this.laneCount;
      return this.leftBoundary + laneWidth / 2 + laneIndex * laneWidth;
    }
  
    /**
     * Draws the road with lanes and boundaries.
     * @param ctx - The rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.lineWidth = 5;
  
      // Draw road boundaries
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(this.leftBoundary, 0);
      ctx.lineTo(this.leftBoundary, ctx.canvas.height);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(this.rightBoundary, 0);
      ctx.lineTo(this.rightBoundary, ctx.canvas.height);
      ctx.stroke();
  
      // Draw lane dividers
      ctx.setLineDash([20, 20]); // Dashed lines
      for (let i = 1; i < this.laneCount; i++) {
        const x = this.leftBoundary + (i * this.width) / this.laneCount;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset line dash
    }
}
  