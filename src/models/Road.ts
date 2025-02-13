/**
 * Road Class
 * Defines a 2D road with scrolling to simulate forward motion.
 */
export default class Road {
    x: number; // Center X position of the road
    width: number; // Road width
    laneCount: number; // Number of lanes
    leftBoundary: number; // Left boundary
    rightBoundary: number; // Right boundary
    scrollOffset: number; // Offset to simulate road scrolling

    constructor(x: number, width: number, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.leftBoundary = this.x - this.width / 2;
        this.rightBoundary = this.x + this.width / 2;
        this.scrollOffset = 0;
    }

    /**
     * Simulates road scrolling by increasing the offset when the car moves forward.
     * @param speed - The current speed of the car.
     */
    updateScroll(speed: number) {
        this.scrollOffset += speed; // Move the road downward when the car moves forward
    }

    /**
     * Returns the X position of the center of a given lane.
     * @param laneIndex - The index of the lane (0 to laneCount - 1).
     */
    getLaneCenter(laneIndex: number): number {
        const laneWidth = this.width / this.laneCount;
        return this.leftBoundary + laneWidth / 2 + laneIndex * laneWidth;
    }

    /**
     * Draws the road with scrolling behavior.
     * @param ctx - The rendering context of the canvas.
     * @param canvasHeight - Height of the canvas to wrap road lines.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
        ctx.lineWidth = 5;

        // Draw road boundaries
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.leftBoundary, 0);
        ctx.lineTo(this.leftBoundary, canvasHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rightBoundary, 0);
        ctx.lineTo(this.rightBoundary, canvasHeight);
        ctx.stroke();

        // Draw lane dividers with scrolling effect
        ctx.setLineDash([20, 20]); // Dashed lines
        for (let i = 1; i < this.laneCount; i++) {
            const x = this.leftBoundary + (i * this.width) / this.laneCount;
            ctx.beginPath();
            
            // Draw vertical lane lines that scroll
            for (let y = -this.scrollOffset % 40; y < canvasHeight; y += 40) {
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + 20);
            }
            
            ctx.stroke();
        }
        ctx.setLineDash([]); // Reset line dash
    }
}
