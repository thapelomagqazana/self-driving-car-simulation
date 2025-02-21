/**
 * Represents the road environment, including lanes, boundaries, and lane markings.
 */
export class Road {
    x: number;
    width: number;
    laneCount: number;
    leftBoundary: number;
    rightBoundary: number;
    laneWidth: number;
    markings: number[];
  
    /**
     * Initializes a new road object.
     * @param {number} x - The center x-position of the road.
     * @param {number} width - The total width of the road.
     * @param {number} laneCount - The number of lanes in the road.
     */
    constructor(x: number, width: number, laneCount = 3) {
      this.x = x;
      this.width = width;
      this.laneCount = laneCount;
  
      // Calculate road boundaries
      this.leftBoundary = this.x - this.width / 2;
      this.rightBoundary = this.x + this.width / 2;
  
      // Calculate lane width
      this.laneWidth = this.width / this.laneCount;
  
      // Precompute lane positions for drawing lane markings
      this.markings = Array.from({ length: laneCount - 1 }, (_, i) =>
        this.getLaneCenter(i + 1)
      );
    }
  
    /**
     * Returns the x-position of a given lane's center.
     * @param {number} laneIndex - The index of the lane (0-based).
     * @returns {number} The x-coordinate of the lane's center.
     */
    getLaneCenter(laneIndex: number): number {
      return this.leftBoundary + this.laneWidth / 2 + laneIndex * this.laneWidth;
    }
  
    /**
     * Draws the road, lane markings, and boundaries on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "white";
  
      // Draw lane markings (dashed lines)
      ctx.setLineDash([20, 20]);
      this.markings.forEach((xPos) => {
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, ctx.canvas.height);
        ctx.stroke();
      });
  
      // Draw solid road boundaries
      ctx.setLineDash([]);
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
  