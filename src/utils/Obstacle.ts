/**
 * Represents a static obstacle on the road (e.g., cones, barriers).
 */
export class Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  
    /**
     * Initializes a new obstacle.
     * @param {number} x - The x-position of the obstacle.
     * @param {number} y - The y-position of the obstacle.
     * @param {number} width - The width of the obstacle.
     * @param {number} height - The height of the obstacle.
     * @param {string} color - The color of the obstacle.
     */
    constructor(x: number, y: number, width: number, height: number, color = "red") {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
  
    /**
     * Draws the obstacle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
  }
  