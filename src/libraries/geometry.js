/**
 * Determine the intersects of the straight line with the given circle
 * @param {Array} lineSpec - The line an array of two nodes [{x:, y:}, {x:, y:}]
 * @param {number} radius - The radius of the circle
 * @param {number} centreX  - the centre of the circle
 * @param {number} centreY - centre of the circle
 * @return {Array} - [] no intersect, [{x:, y:}] 1 intersect, [{x:, y:}, {x:, y:}] 2 intersects
 */
export function lineCircleIntersects (lineSpec, radius, centreX, centreY) {
    const ax = lineSpec[0].x;
    const ay = lineSpec[0].y;
    const bx = lineSpec[1].x;
    const by = lineSpec[1].y;
    const r = radius;
    const cx = centreX;
    const cy = centreY;

    // Get the gradient of the line
    const m = (by - ay)/(bx - ax)
    const baseY = ay - m * ax;
    // Derive the factors of the quadratic
    const a = m ** 2 + 1;
    const b = -2 * cx + 2 * m * (ay - m * ax - cy);
    const c = (ay - m * ax - cy) ** 2 + cx ** 2 - r ** 2;

    // Derive the values of x for ax^2 + bx + c
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        // No intersection
        return [];
    }
    
    // Find x coordinates of intersections
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    // Find y coordinates of intersections
    const y1 = m * x1 + baseY;
    const y2 = m * x2 + baseY;
    
    if (discriminant === 0) {
        // One intersection
        return [{ x: x1, y: y1 }];
    }

    // Two intersections
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
}

/**
 * 
 * @param {*} x1  - centre of circle 1
 * @param {*} y1  - centre of circle 1
 * @param {*} r1  - radius of circle 1
 * @param {*} x2  - centre of circle 2
 * @param {*} y2  - centre of circle 2
 * @param {*} r2  - radius of circle 2
 * @returns [{x:, y:}, {x:, y:}] or [] if no intersections.
 */
export function circleIntersects(x1, y1, r1, x2, y2, r2) {

    // Distance between the centers
    const d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    // Check for solvability
    if (d > r1 + r2 || d < Math.abs(r1 - r2)) {
        // No solutions, the circles are either too far apart or one is contained within the other
        return [];
    }

    // Find a and h
    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(r1 ** 2 - a ** 2);

    // Find P2
    const x3 = x1 + a * (x2 - x1) / d;
    const y3 = y1 + a * (y2 - y1) / d;

    // Get the points P3
    const x4_1 = x3 + h * (y2 - y1) / d;
    const y4_1 = y3 - h * (x2 - x1) / d;

    const x4_2 = x3 - h * (y2 - y1) / d;
    const y4_2 = y3 + h * (x2 - x1) / d;

    // Return the points of intersection
    
    return [{ x: x4_1, y: y4_1 }, { x: x4_2, y: y4_2 }];
}