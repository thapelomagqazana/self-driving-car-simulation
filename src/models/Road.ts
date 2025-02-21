export default class Road {
    x: number; // Center x-coordinate of the road
    width: number; // Total road width
    laneCount: number; // Number of lanes
    leftBoundary: number; // Left boundary of the road
    rightBoundary: number; // Right boundary of the road
    laneWidth: number; // Width of each lane
    segmentLength: number; // Height of each road segment
    scrollOffset: number; // Tracks how much the road has scrolled
  
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
      this.laneWidth = this.width / this.laneCount;
      this.leftBoundary = this.x - this.width / 2;
      this.rightBoundary = this.x + this.width / 2;
  
      this.segmentLength = 200; // Each segment is 200px tall
      this.scrollOffset = 0;
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
     * Scrolls the road downward as the car moves up.
     * @param carY - The current Y position of the car.
     */
    updateScroll(carY: number) {
      this.scrollOffset = -carY % this.segmentLength;
    }
  
    /**
     * Draws the road and lane markings.
     * @param ctx - The 2D rendering context of the canvas.
     * @param canvasHeight - The total height of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ffffff"; // White road lines
      ctx.setLineDash([20, 20]); // Dashed lines
  
      // Draw multiple road segments for infinite scrolling
      for (let i = 0; i < Math.ceil(canvasHeight / this.segmentLength) + 1; i++) {
        const y = this.scrollOffset + i * this.segmentLength;
  
        // Draw lane dividers
        for (let j = 1; j < this.laneCount; j++) {
          const x = this.leftBoundary + j * this.laneWidth;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + this.segmentLength);
          ctx.stroke();
        }
      }
  
      // Draw road boundaries
      ctx.setLineDash([]); // Solid lines
      ctx.beginPath();
      ctx.moveTo(this.leftBoundary, 0);
      ctx.lineTo(this.leftBoundary, canvasHeight);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(this.rightBoundary, 0);
      ctx.lineTo(this.rightBoundary, canvasHeight);
      ctx.stroke();
    }
}
  