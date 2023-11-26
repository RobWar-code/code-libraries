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