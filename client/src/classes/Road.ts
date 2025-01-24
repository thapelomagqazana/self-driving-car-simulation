export class Road {
  x: number; // X-coordinate of the road's center
  width: number; // Total width of the road
  laneCount: number; // Number of lanes
  left: number; // Left boundary of the road
  right: number; // Right boundary of the road
  top: number; // Top boundary of the visible road
  bottom: number; // Bottom boundary of the visible road
  laneWidth: number; // Width of each lane
  curvePoints: { x: number; y: number }[]; // Points defining the curve
  scrollOffset: number; // Tracks how much the road has scrolled

  constructor(x: number, width: number, laneCount: number = 3, canvasHeight: number = 600) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;
    this.top = -canvasHeight; // Visible top boundary relative to the car
    this.bottom = canvasHeight; // Visible bottom boundary relative to the car

    this.laneWidth = width / laneCount;
    this.curvePoints = this.#generateCurvePoints(); // Generate random curved paths
    this.scrollOffset = 0; // Initialize scroll offset
  }

  /**
   * Updates the road's scrolling based on the car's speed.
   * @param {number} carSpeed - The speed of the car.
   */
  updateScroll(carSpeed: number) {
    // Move the road downward relative to the car's speed
    this.scrollOffset += carSpeed;

    // Update the curve points to reflect the scroll
    this.curvePoints = this.curvePoints.map((point) => ({
      x: point.x,
      y: point.y + carSpeed,
    }));

    // Loop the road when the bottom reaches a certain threshold
    const resetThreshold = 600; // Reset when curve points are far enough down
    if (this.curvePoints[0].y > resetThreshold) {
      const deltaY = this.curvePoints[0].y - resetThreshold;
      this.curvePoints = this.curvePoints.map((point) => ({
        x: point.x,
        y: point.y - deltaY,
      }));
    }
  }

  /**
   * Generates points for a curved road section.
   * Adjust this function for custom curvature designs.
   * @private
   * @returns {Array<object>} - Array of points defining the curve.
   */
  #generateCurvePoints(): { x: number; y: number }[] {
    return [
      { x: this.x, y: 0 }, // Start at the center of the canvas
      { x: this.x - 100, y: -200 }, // Slight left curve
      { x: this.x + 150, y: -400 }, // S-curve to the right
      { x: this.x - 50, y: -600 }, // End of the curve
    ];
  }

  /**
   * Draws the road's curved sections and lane markings.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    // Draw curved road boundaries
    ctx.lineWidth = 5;

    // Outer boundaries
    ctx.strokeStyle = "yellow";
    this.#drawCurve(ctx, -this.width / 2); // Left boundary
    this.#drawCurve(ctx, this.width / 2); // Right boundary

    // Lane markings
    ctx.strokeStyle = "white";
    ctx.setLineDash([20, 20]);
    for (let i = 1; i < this.laneCount; i++) {
      const offset = -this.width / 2 + i * this.laneWidth;
      this.#drawCurve(ctx, offset);
    }
    ctx.setLineDash([]); // Reset dash style
  }

  /**
   * Draws a curve offset from the center based on the curve points.
   * @private
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} offsetX - Horizontal offset for the curve.
   */
  #drawCurve(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.beginPath();
    ctx.moveTo(this.curvePoints[0].x + offsetX, this.curvePoints[0].y);

    for (let i = 1; i < this.curvePoints.length; i++) {
      const cp = this.curvePoints[i];
      ctx.lineTo(cp.x + offsetX, cp.y);
    }

    ctx.stroke();
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
}
