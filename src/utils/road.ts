/**
 * Interface for a road segment.
 * - `start`: The starting point of the segment.
 * - `end`: The ending point of the segment.
 * - `curveRadius`: The radius of the curve (0 for straight segments).
 * - `curveDirection`: The direction of the curve ('left' or 'right').
 */
interface RoadSegment {
    start: { x: number; y: number };
    end: { x: number; y: number };
    curveRadius?: number;
    curveDirection?: 'left' | 'right';
}

/**
 * Define a 2D road with lanes, curves, and boundaries.
 * - Returns an array of road segments.
 */
export const defineRoad = (): RoadSegment[] => {
    const road: RoadSegment[] = [
        // Straight segment
        {
            start: { x: 0, y: 300 },
            end: { x: 400, y: 300 },
        },
        // Right curve
        {
            start: { x: 400, y: 300 },
            end: { x: 600, y: 500 },
            curveRadius: 200,
            curveDirection: 'right',
        },
        // Straight segment
        {
            start: { x: 600, y: 500 },
            end: { x: 1000, y: 500 },
        },
        // Left curve
        {
            start: { x: 1000, y: 500 },
            end: { x: 1200, y: 300 },
            curveRadius: 200,
            curveDirection: 'left',
        },
        // Straight segment
        {
            start: { x: 1200, y: 300 },
            end: { x: 1600, y: 300 },
        },
    ];

    return road;
};

/**
 * Draw the road on the canvas.
 * - `ctx`: The canvas rendering context.
 * - `road`: The array of road segments.
 */
export const drawRoad = (ctx: CanvasRenderingContext2D, road: RoadSegment[]) => {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;

    road.forEach((segment) => {
        ctx.beginPath();

        if (segment.curveRadius && segment.curveDirection) {
            // Draw a curved segment
            const { start, end, curveRadius, curveDirection } = segment;
            const controlPoint = calculateControlPoint(start, end, curveRadius, curveDirection);

            ctx.moveTo(start.x, start.y);
            ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, end.x, end.y);
        } else {
            // Draw a straight segment
            ctx.moveTo(segment.start.x, segment.start.y);
            ctx.lineTo(segment.end.x, segment.end.y);
        }

        ctx.stroke();
    });
};

/**
 * Calculate the control point for a quadratic curve.
 * - `start`: The starting point of the curve.
 * - `end`: The ending point of the curve.
 * - `curveRadius`: The radius of the curve.
 * - `curveDirection`: The direction of the curve ('left' or 'right').
 * - Returns the control point.
 */
const calculateControlPoint = (
        start: { x: number; y: number },
        end: { x: number; y: number },
        curveRadius: number,
        curveDirection: 'left' | 'right'
    ): { x: number; y: number } => {
    const midPoint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
    };

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const perpendicularAngle = angle + (curveDirection === 'left' ? -Math.PI / 2 : Math.PI / 2);

    return {
        x: midPoint.x + Math.cos(perpendicularAngle) * curveRadius,
        y: midPoint.y + Math.sin(perpendicularAngle) * curveRadius,
    };
};