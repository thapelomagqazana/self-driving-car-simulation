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
     * Creates a new Road instance.
     * @param width - The width of the road.
     * @param laneCount - The number of lanes on the road.
     * @param points - The points defining the centerline of the road.
     */
    constructor(width: number, laneCount: number, points: { x: number; y: number }[]) {
      this.width = width;
      this.laneCount = laneCount;
      this.points = points;
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
      this.points.forEach((point, index) => {
        if (index < this.points.length - 1) {
          const nextPoint = this.points[index + 1];
  
          // Draw the centerline
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.stroke();
  
          // Draw the lane boundaries
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          const offsetX = Math.sin(angle) * (this.width / 2);
          const offsetY = Math.cos(angle) * (this.width / 2);
  
          ctx.beginPath();
          ctx.moveTo(point.x - offsetX, point.y + offsetY);
          ctx.lineTo(nextPoint.x - offsetX, nextPoint.y + offsetY);
          ctx.stroke();
  
          ctx.beginPath();
          ctx.moveTo(point.x + offsetX, point.y - offsetY);
          ctx.lineTo(nextPoint.x + offsetX, nextPoint.y - offsetY);
          ctx.stroke();
        }
      });
  
      ctx.restore();
    }
  }