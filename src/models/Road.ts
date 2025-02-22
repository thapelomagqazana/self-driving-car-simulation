export default class Road {
    x: number;
    width: number;
    laneCount: number;
    leftBoundary: number;
    rightBoundary: number;
    laneWidth: number;
    segmentLength: number;
    segments: number[]; // List of road segment Y-positions
    scrollOffset: number;

    constructor(x: number, width: number, laneCount: number = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.laneWidth = this.width / this.laneCount;
        this.leftBoundary = this.x - this.width / 2;
        this.rightBoundary = this.x + this.width / 2;
        this.segmentLength = 200;
        this.scrollOffset = 0;

        // **Initialize Road Segments for Smooth Recycling**
        this.segments = [];
        for (let i = 0; i < 20; i++) { // Keep extra segments for recycling
            this.segments.push(i * this.segmentLength);
        }
    }

    /**
     * Returns the center X position of a specific lane.
     */
    getLaneCenter(laneIndex: number): number {
        return this.leftBoundary + (laneIndex + 0.5) * this.laneWidth;
    }



    /**
     * Recycles old road segments to maintain infinite scrolling.
     */
    updateScroll(carY: number) {
        this.scrollOffset = -carY % this.segmentLength;

        // **Fix: Proper Segment Recycling Without Unused Variables**
        while (this.segments.length > 0 && this.segments[0] + this.scrollOffset > this.segmentLength) {
            this.segments.push(this.segments[this.segments.length - 1] + this.segmentLength);
            this.segments.shift(); // Remove the top segment
        }
    }

    /**
     * Returns the center X positions of all lanes.
     */
    getLaneCenters(): number[] {
        return Array.from({ length: this.laneCount }, (_, i) => this.leftBoundary + (i + 0.5) * this.laneWidth);
    }

    /**
     * Debugging: Get road info for display.
     */
       getDebugInfo() {
        return {
            lanePositions: this.getLaneCenters(),
            leftBoundary: this.leftBoundary,
            rightBoundary: this.rightBoundary,
        };
    }

    /**
     * Draws the road with infinite scrolling and lane continuity.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";

        // **Fix: Use `lineDashOffset` for Continuous Dashed Lines**
        ctx.setLineDash([20, 30]);
        ctx.lineDashOffset = -this.scrollOffset; // Global dash alignment

        // **Draw Lane Markings in a Single Pass**
        for (let j = 1; j < this.laneCount; j++) {
            const x = this.leftBoundary + j * this.laneWidth;
            ctx.beginPath();
            ctx.moveTo(x, -canvasHeight * 10);
            ctx.lineTo(x, canvasHeight * 10);
            ctx.stroke();
        }

        // **Fix: Ensure Boundaries Extend Indefinitely**
        ctx.setLineDash([]);
        ctx.strokeStyle = "#ffffff";

        // Left boundary
        ctx.beginPath();
        ctx.moveTo(this.leftBoundary, -canvasHeight * 10);
        ctx.lineTo(this.leftBoundary, canvasHeight * 10);
        ctx.stroke();

        // Right boundary
        ctx.beginPath();
        ctx.moveTo(this.rightBoundary, -canvasHeight * 10);
        ctx.lineTo(this.rightBoundary, canvasHeight * 10);
        ctx.stroke();
    }
}
