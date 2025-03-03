/**
 * Road class responsible for rendering an infinite multi-lane road
 * with seamless upward and downward scrolling and a solid gray background.
 */
export default class Road {
    x: number;
    width: number;
    laneCount: number;
    leftBoundary: number;
    rightBoundary: number;
    laneWidth: number;
    segmentLength: number;
    scrollOffset: number;

    /**
     * Creates a new Road instance.
     * @param x - Horizontal center of the road.
     * @param width - Total width of the road.
     * @param laneCount - Number of lanes (default is 3).
     */
    constructor(x: number, width: number, laneCount: number = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.laneWidth = this.width / this.laneCount;
        this.leftBoundary = this.x - this.width / 2;
        this.rightBoundary = this.x + this.width / 2;
        this.segmentLength = 200;
        this.scrollOffset = 0;
    }

    /**
     * Returns the center X position of a specific lane.
     * @param laneIndex - The index of the lane (0-based).
     */
    getLaneCenter(laneIndex: number): number {
        return this.leftBoundary + (laneIndex + 0.5) * this.laneWidth;
    }

    /**
     * Updates the scroll offset based on the car's Y position.
     * @param carY - Vertical position of the car.
     */
    updateScroll(carY: number) {
        this.scrollOffset = -carY % this.segmentLength;
    }

    /**
     * Returns the center X positions of all lanes.
     */
    getLaneCenters(): number[] {
        return Array.from({ length: this.laneCount }, (_, i) => this.getLaneCenter(i));
    }

    /**
     * Provides debug information about the road.
     */
    getDebugInfo() {
        return {
            lanePositions: this.getLaneCenters(),
            leftBoundary: this.leftBoundary,
            rightBoundary: this.rightBoundary,
        };
    }

    /**
     * Draws the infinite road with a solid gray background, infinite dashes,
     * and solid side boundaries, relative to the car's Y position.
     * @param ctx - Canvas rendering context.
     * @param canvasHeight - Canvas height.
     * @param carY - Car's vertical position for offsetting the view.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number, carY: number) {
        const visibleRange = canvasHeight * 3; // Draw well beyond the screen

        // Solid gray background filling the entire visible road area
        ctx.fillStyle = "#333"; // Dark gray road color
        ctx.fillRect(
            this.leftBoundary,
            carY - visibleRange,
            this.width,
            visibleRange * 2
        );

        // Soft white edge indicators (optional)
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(this.leftBoundary, carY - visibleRange, 5, visibleRange * 2);
        ctx.fillRect(this.rightBoundary - 5, carY - visibleRange, 5, visibleRange * 2);

        // Dashed lane markings
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        ctx.setLineDash([20, 30]);
        ctx.lineDashOffset = -(carY % this.segmentLength);

        for (let j = 1; j < this.laneCount; j++) {
            const x = this.leftBoundary + j * this.laneWidth;
            ctx.beginPath();
            ctx.moveTo(x, carY - visibleRange);
            ctx.lineTo(x, carY + visibleRange);
            ctx.stroke();
        }

        // Solid road boundaries
        ctx.setLineDash([]);
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(this.leftBoundary, carY - visibleRange);
        ctx.lineTo(this.leftBoundary, carY + visibleRange);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rightBoundary, carY - visibleRange);
        ctx.lineTo(this.rightBoundary, carY + visibleRange);
        ctx.stroke();

        // Optional: Lane center markers near car (for debugging or decoration)
        ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
        for (let j = 0; j < this.laneCount; j++) {
            const x = this.getLaneCenter(j);
            ctx.beginPath();
            ctx.arc(x, carY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
