export default class TrafficCar {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;

    constructor(x: number, y: number, width: number = 30, height: number = 50, color: string = "#FF0000") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    /**
     * Checks collision between this traffic car and the player's car.
     */
    collidesWith(car: { x: number; y: number; width?: number; height?: number }): boolean {
        return (
            this.x < car.x + (car.width || 30) &&
            this.x + this.width > car.x &&
            this.y < car.y + (car.height || 50) &&
            this.y + this.height > car.y
        );
    }

    /**
     * Draws the traffic car.
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}
