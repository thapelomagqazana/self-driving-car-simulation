interface CollisionObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

self.onmessage = function (event) {
    const { car, traffic, staticObstacles } = event.data;
    const detectedCollision = checkCollision(car, traffic, staticObstacles);
    self.postMessage(detectedCollision);
};

/**
 * Checks collision asynchronously using bounding boxes.
 */
function checkCollision(
    car: { x: number; y: number; width: number; height: number; leftBoundary: number; rightBoundary: number },
    traffic: { x: number; y: number; width: number; height: number }[],
    staticObstacles: { x: number; y: number; width: number; height: number }[]
) {
    const { x, width, leftBoundary, rightBoundary } = car;

    // **Check road boundaries**
    if (x - width / 2 < leftBoundary || x + width / 2 > rightBoundary) {
        return true;
    }

    // **Use bounding box check for efficiency**
    const detectCollision = (objA: CollisionObject, objB: CollisionObject) => (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
    );

    // **Check moving traffic**
    for (const vehicle of traffic) {
        if (detectCollision(car, vehicle)) {
            return true;
        }
    }

    // **Check static obstacles**
    for (const obstacle of staticObstacles) {
        if (detectCollision(car, obstacle)) {
            return true;
        }
    }

    return false;
}

