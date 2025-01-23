/**
 * Represents a 2D road with lanes, curves, and boundaries.
 */
export class Road {
    /**
     * The width of the road (including all lanes).
     */
    public width: number;
  
    /**
     * The number of lanes on the road.
     */
    public laneCount: number;
  
    /**
     * The points defining the centerline of the road.
     */
    public points: { x: number; y: number }[];
  
    /**
     * The boundaries of the road.
     */
    public borders: { x: number; y: number }[][];
  
    /**
     * Creates a new Road instance.
     * @param width - The width of the road.
     * @param laneCount - The number of lanes on the road.
     * @param points - The points defining the centerline of the road.
     */
    constructor(width: number, laneCount: number, points: { x: number; y: number }[]) {
      this.width = width;
      this.laneCount = laneCount;
      this.points = points;
      this.borders = this.calculateBorders();
    }
  
    /**
     * Calculates the road boundaries based on the centerline and width.
     * @returns An array of line segments representing the road boundaries.
     */
    private calculateBorders(): { x: number; y: number }[][] {
      const borders: { x: number; y: number }[][] = [];
  
      for (let i = 0; i < this.points.length - 1; i++) {
        const start = this.points[i];
        const end = this.points[i + 1];
  
        // Calculate the angle of the road segment
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
  
        // Calculate the perpendicular offsets for the boundaries
        const offsetX = Math.sin(angle) * (this.width / 2);
        const offsetY = Math.cos(angle) * (this.width / 2);
  
        // Define the left and right boundaries
        const leftStart = { x: start.x - offsetX, y: start.y + offsetY };
        const leftEnd = { x: end.x - offsetX, y: end.y + offsetY };
        const rightStart = { x: start.x + offsetX, y: start.y - offsetY };
        const rightEnd = { x: end.x + offsetX, y: end.y - offsetY };
  
        // Add the boundary segments to the borders array
        borders.push([leftStart, leftEnd]);
        borders.push([rightStart, rightEnd]);
      }
  
      return borders;
    }
  
    /**
     * Draws the road on the canvas.
     * @param ctx - The canvas rendering context.
     */
    public draw(ctx: CanvasRenderingContext2D): void {
      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
  
      // Draw the road boundaries
      this.borders.forEach((border) => {
        ctx.beginPath();
        ctx.moveTo(border[0].x, border[0].y);
        ctx.lineTo(border[1].x, border[1].y);
        ctx.stroke();
      });
  
      ctx.restore();
    }
  }