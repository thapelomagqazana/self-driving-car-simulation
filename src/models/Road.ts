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
        for (let i = 0; i < 15; i++) { // Increased to 15 for smoother recycling
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

        // Ensure Proper Segment Recycling at High Speeds**
        while (this.segments[0] + this.scrollOffset > this.segmentLength) {
            const removedSegment = this.segments.shift()!; // Remove top segment
            const newSegmentY = this.segments[this.segments.length - 1] + this.segmentLength; // Append at bottom
            this.segments.push(newSegmentY);
        }
    }

    /**
     * Draws the road with continuous scrolling and correct rendering.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";

        // **Fix: Maintain Continuous Lane Markings Across Segments**
        ctx.setLineDash([20, 30]);

        // Render segments efficiently by reusing them
        for (let i = 0; i < this.segments.length; i++) {
            const y = this.scrollOffset + this.segments[i];

            for (let j = 1; j < this.laneCount; j++) {
                const x = this.leftBoundary + j * this.laneWidth;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + this.segmentLength);
                ctx.stroke();
            }
        }

        // **Fix: Ensure Boundaries Extend Indefinitely**
        ctx.setLineDash([]);
        ctx.strokeStyle = "#ffffff";

        // Left boundary
        ctx.beginPath();
        ctx.moveTo(this.leftBoundary, -canvasHeight * 10); // Increased for infinite rendering
        ctx.lineTo(this.leftBoundary, canvasHeight * 10);
        ctx.stroke();

        // Right boundary
        ctx.beginPath();
        ctx.moveTo(this.rightBoundary, -canvasHeight * 10);
        ctx.lineTo(this.rightBoundary, canvasHeight * 10);
        ctx.stroke();
    }
}
