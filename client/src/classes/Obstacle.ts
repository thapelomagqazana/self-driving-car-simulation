/**
 * Represents an obstacle on the road (e.g., traffic cone, other car).
 */
export class Obstacle {
    /**
     * The x-coordinate of the obstacle's position.
     */
    public x: number;
  
    /**
     * The y-coordinate of the obstacle's position.
     */
    public y: number;
  
    /**
     * The width of the obstacle.
     */
    public width: number;
  
    /**
     * The height of the obstacle.
     */
    public height: number;
  
    /**
     * Creates a new Obstacle instance.
     * @param x - The x-coordinate of the obstacle's position.
     * @param y - The y-coordinate of the obstacle's position.
     * @param width - The width of the obstacle.
     * @param height - The height of the obstacle.
     */
    constructor(x: number, y: number, width: number, height: number) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    /**
     * Draws the obstacle on the canvas.
     * @param ctx - The canvas rendering context.
     */
    public draw(ctx: CanvasRenderingContext2D): void {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      ctx.restore();
    }
}