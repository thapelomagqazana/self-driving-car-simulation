export default class Road {
    x: number; // Center x-coordinate of the road
    width: number; // Total road width
    laneCount: number; // Number of lanes
    leftBoundary: number; // Left boundary of the road
    rightBoundary: number; // Right boundary of the road
    laneWidth: number; // Width of each lane
  
    /**
     * Constructs a new Road instance.
     * @param x - Center X coordinate of the road.
     * @param width - Total width of the road.
     * @param laneCount - Number of lanes.
     */
    constructor(x: number, width: number, laneCount: number = 3) {
      this.x = x;
      this.width = width;
      this.laneCount = laneCount;
  
      // Compute lane width
      this.laneWidth = this.width / this.laneCount;
  
      // Compute road boundaries
      this.leftBoundary = this.x - this.width / 2;
      this.rightBoundary = this.x + this.width / 2;
    }
  
    /**
     * Returns the center X position of a specific lane.
     * @param laneIndex - The lane index (0-based).
     * @returns The center X-coordinate of the lane.
     */
    getLaneCenter(laneIndex: number): number {
      const laneOffset = (laneIndex + 0.5) * this.laneWidth;
      return this.leftBoundary + laneOffset;
    }
  
    /**
     * Draws the road and lane markings.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ffffff"; // White road lines
  
      // Draw lane dividers
      for (let i = 1; i < this.laneCount; i++) {
        const x = this.leftBoundary + i * this.laneWidth;
  
        ctx.setLineDash([20, 20]); // Dashed lines
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.stroke();
      }
  
      // Draw road boundaries
      ctx.setLineDash([]); // Solid lines
      ctx.beginPath();
      ctx.moveTo(this.leftBoundary, 0);
      ctx.lineTo(this.leftBoundary, ctx.canvas.height);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(this.rightBoundary, 0);
      ctx.lineTo(this.rightBoundary, ctx.canvas.height);
      ctx.stroke();
    }
}
  