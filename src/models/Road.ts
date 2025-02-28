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
     * Draws the road with infinite scrolling and better lane continuity.
     */
    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
        // **Apply Road Background (Gray Gradient)**
        const gradient = ctx.createLinearGradient(0, -canvasHeight * 2, 0, canvasHeight * 2);
        gradient.addColorStop(0, "#444"); // Dark top
        gradient.addColorStop(1, "#222"); // Darker bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(this.leftBoundary, -canvasHeight * 2, this.width, canvasHeight * 4);

        // **Soft Lane Edge Indicators (Faded White)**
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(this.leftBoundary, -canvasHeight * 2, 5, canvasHeight * 4);
        ctx.fillRect(this.rightBoundary - 5, -canvasHeight * 2, 5, canvasHeight * 4);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffffff";

        // **Dashed Lane Markings for Center Lanes**
        ctx.setLineDash([20, 30]);
        ctx.lineDashOffset = -this.scrollOffset;

        for (let j = 1; j < this.laneCount; j++) {
            const x = this.leftBoundary + j * this.laneWidth;
            ctx.beginPath();
            ctx.moveTo(x, -canvasHeight * 10);
            ctx.lineTo(x, canvasHeight * 10);
            ctx.stroke();
        }

        // **Solid Road Boundaries**
        ctx.setLineDash([]);
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(this.leftBoundary, -canvasHeight * 10);
        ctx.lineTo(this.leftBoundary, canvasHeight * 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rightBoundary, -canvasHeight * 10);
        ctx.lineTo(this.rightBoundary, canvasHeight * 10);
        ctx.stroke();

        // **Lane Position Markers**
        ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
        for (let j = 0; j < this.laneCount; j++) {
            const x = this.getLaneCenter(j);
            ctx.beginPath();
            ctx.arc(x, 50, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

}
