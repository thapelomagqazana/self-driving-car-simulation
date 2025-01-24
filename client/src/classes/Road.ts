/**
 * Represents a road in the simulation.
 * Handles lane boundaries and road markings.
 */
export class Road {
  x: number; // X-coordinate of the road's center
  width: number; // Total width of the road
  laneCount: number; // Number of lanes
  left: number; // Left boundary of the road
  right: number; // Right boundary of the road
  top: number; // Top boundary of the visible road
  bottom: number; // Bottom boundary of the visible road
  laneWidth: number; // Width of each lane

  constructor(x: number, width: number, laneCount: number = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;
    this.top = -Infinity; // Roads are theoretically infinite vertically
    this.bottom = Infinity;

    this.laneWidth = width / laneCount;
  }

  /**
   * Returns the X-coordinate of the center of a given lane.
   * @param {number} laneIndex - The index of the lane (0 is the leftmost lane).
   * @returns {number} - The X-coordinate of the lane center.
   */
  getLaneCenter(laneIndex: number): number {
    const clampedLaneIndex = Math.min(
      Math.max(laneIndex, 0),
      this.laneCount - 1
    );
    return this.left + this.laneWidth / 2 + clampedLaneIndex * this.laneWidth;
  }

  /**
   * Renders the road on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;

    // Draw lane boundaries
    ctx.strokeStyle = "white";
    for (let i = 0; i <= this.laneCount; i++) {
      const x = this.left + i * this.laneWidth;

      // Solid boundaries for the road's edges
      if (i === 0 || i === this.laneCount) {
        ctx.beginPath();
        ctx.moveTo(x, this.top);
        ctx.lineTo(x, this.bottom);
        ctx.stroke();
      } else {
        // Dashed lines for inner lane markings
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(x, this.top);
        ctx.lineTo(x, this.bottom);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash style
      }
    }

    // Draw the outer road boundaries
    ctx.strokeStyle = "yellow";
    ctx.setLineDash([]); // Solid lines for boundaries
    ctx.beginPath();
    ctx.moveTo(this.left, this.top);
    ctx.lineTo(this.left, this.bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.right, this.top);
    ctx.lineTo(this.right, this.bottom);
    ctx.stroke();
  }
}
