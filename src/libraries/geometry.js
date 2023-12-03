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
 * @param {number} x1  - centre of circle 1
 * @param {number} y1  - centre of circle 1
 * @param {number} r1  - radius of circle 1
 * @param {number} x2  - centre of circle 2
 * @param {number} y2  - centre of circle 2
 * @param {number} r2  - radius of circle 2
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

/**
 * Get upper and lower tangent points of the vectors parallel to dx, dy
 * @param {number} cx - centre of circle
 * @param {number} cy - centre of circle
 * @param {number} r - radius of circle
 * @param {number} dx - vector x at centre
 * @param {number} dy - vector y at centre
 * @return {Array} [{x: x1, y: y1}, {x: x2, y: y2}]
 */
export function radialVectorPoints(cx, cy, r, dx, dy) {

    // derive the first vector at right angles to dx,dy
    const dx1 = dy;
    const dy1 = -dx;
    // normalise the vectors and adjust for r
    let x1 = r * dx1 / Math.sqrt(dx1 ** 2 + dy1 ** 2);
    let y1 = r * dy1 / Math.sqrt(dx1 ** 2 + dy1 ** 2);
    x1 = x1 + cx;
    y1 = y1 + cy;

    // The second point
    const dx2 = -dy
    const dy2 = dx
    // normalise the vectors and adjust for r
    let x2 = r * dx2 / Math.sqrt(dx2 ** 2 + dy2 ** 2);
    let y2 = r * dy2 / Math.sqrt(dx2 ** 2 + dy2 ** 2);
    x2 = x2 + cx;
    y2 = y2 + cy;

    return [{x: x1, y: y1}, {x: x2, y: y2}]
}

/**
 * 
 * @param {number} c1x - centre of circle 1
 * @param {number} c1y - centre of circle 1
 * @param {number} r - radius circle 1
 * @param {number} c2x - centre of circle 1 at further position
 * @param {number} c2y - centre of circle 1 at further position
 * @param {number} c3x - centre of circular arc
 * @param {number} c3y - centre of circular arc
 * @param {number} r3 - radius of circular arc
 * @param {number} corner - (0 - top-left, 1 - top-right, 2 - bottom-right, 3 - bottom-left)
 * @returns [hit, centreOfContactCircle - c5x, c5y, point of contact - p5x, p5y]
 */
export function movingCircleToArcContactPosition(c1x, c1y, r, c2x, c2y, c3x, c3y, r3, corner) {
    // Get the vector between C1, C2
    const d1x = c2x - c1x;
    const d1y = c2y - c1y;
    // normalise
    const v1x = d1x / Math.sqrt(d1x ** 2 + d1y ** 2);
    const v1y = d1y / Math.sqrt(d1y ** 2 + d1x ** 2);

    // Get radial vector points
    let rs = [];
    rs[0] = radialVectorPoints(c1x, c1y, r, v1x, v1y);
    rs[1] = radialVectorPoints(c2x, c2y, r, v1x, v1y);

    // Determine the trajectories and their intersects of C3
    let found = 0;
    let i1x, i1y, p1y, p1x, v1;
    let rp = [];
    for(let i = 0; i < 2; i++) {
        let l1 = [{}, {}];
        l1[0].x = rs[0][i].x;
        l1[0].y = rs[0][i].y;
        l1[1].x = rs[1][i].x;
        l1[1].y = rs[1][i].y;

        let [gotPoint, p1x, p1y] = findNearestLineCircleIntersectToPoint(l1, c3x, c3y, r3, c1x, c1y, corner);
        if (gotPoint) {
            let h = {};
            h.p1x = p1x;
            h.p1y = p1y;
            h.v1 = i;
            rp.push(h);
            ++found;
        }
    }
    if (found === 2) {
        i1x = rp[0].p1x;
        i1y = rp[0].p1x;
        p1x = rp[1].p1x;
        p1y = rp[1].p1y;
        // Find the nearest of the two points to c1
        let dc1x = i1x - c1x;
        let dc1y = i1y - c1y;
        let dc1 = dc1x ** 2 + dc1y ** 2;
        let dc2x = p1x - c1x;
        let dc2y = p1y - c1y;
        let dc2 = dc2x ** 2 + dc2y ** 2;
        if (dc1 < dc2) {
            p1x = i1x;
            p1y = i1y;
            v1 = rp[0].v1;
        }
        else {
            v1 = rp[1].v1;
        }
    }
    else if (found === 1) {
        p1x = rp[0].p1x;
        p1y = rp[0].p1y;
        v1 = rp[0].v1;
    }
    if (found) {

        // Find the position of the circle that intersects p1 and on the same vector as p1 from c1
        // since the centres of the circles and their radial points form a parallelogram we can simply
        // adjust the coordinates of the centre accordingly.
        const c4x = c1x + (p1x - rs[0][v1].x);
        const c4y = c1y + (p1y - rs[0][v1].y);

        // Adjust position of c4 along the normal from c3 to yield c5
        // get the normal
        let n1x = c4x - c3x;
        let n1y = c4y - c3y;
        let rd = Math.sqrt(n1x ** 2 + n1y ** 2)
        let overlap = r + r3 - rd;
        let c5x = c4x + overlap * n1x/rd;
        let c5y = c4y + overlap * n1y/rd;
        let p5x = c5x - r * n1x/rd;
        let p5y = c5y - r * n1y/rd;
        // Check whether the point of contact is within the arc
        if (
            (corner === 0 && p5x >= c3x - r3 && p5x <= c3x && p5y <= c3y && p5y >= c3y - r3) ||
            (corner === 1 && p5x >= c3x && p5x < c3x + r3 && p5y <= c3y && p5y >= c3y - r3) ||
            (corner === 2 && p5x >= c3x && p5x < c3x + r3 && p5y >= c3y && p5y <= c3y + r3) ||
            (corner === 3 && p5x >= c3x - r3 && p5x <= c3x && p5y >= c3y && p5y <= c3y + r3))
        {
            let hit = true;
            return [hit, c5x, c5y, p5x, p5y];
        }
        else {
            return [false, c5x, c5y, p5x, p5y];
        }
    }
    else return [false, 0, 0, 0, 0];
}


function findNearestLineCircleIntersectToPoint(lineSpec, c3x, c3y, r3, c1x, c1y, corner) {
    let found = 0;
    let p1x, p1y;
    let i1 = lineCircleIntersects(lineSpec, r3, c3x, c3y);
    if (i1.length !== 0) {
        // Get the range for corner
        let a1x,a2y;
        switch (corner) {
            case 0:
                a1x = c3x - r3;
                a2y = c3y - r3;
                break;
            case 1:
                a1x = c3x + r3;
                a2y = c3y - r3;
                break;
            case 2:
                a1x = c3x + r3;
                a2y = c3y + r3;
                break;
            case 3:
                a1x = c3x - r3;
                a2y = c3y + r3;
                break;
            default:
                console.log("erroneous corner number", corner);
                break;
        }
        // Determine whether either of the intersects lie on the arc and is nearest to c1
        let i1x, i1y;
        for (let j = 0; j < i1.length; j++) {
            i1x = i1[j].x;
            i1y = i1[j].y;
            console.log("i1x, i1y:", i1x, i1y);
            if ((corner === 0 && i1x >= a1x && i1x <= c3x && i1y <= c3y && i1y >= a2y) ||
                (corner === 1 && i1x <= a1x && i1x >= c3x && i1y <= c3y && i1y >= a2y) ||
                (corner === 2 && i1x <= a1x && i1x >= c3x && i1y >= c3y && i1y <= a2y) ||
                (corner === 3 && i1x >= a1x && i1x <= c3x && i1y >= c3y && i1y <= a2y)
            ){
                if (i1.length === 0 || j === 0 || (j === 1 && found === 0)) {
                    found = 1;
                    p1x = i1x;
                    p1y = i1y;
                    console.log("p1x, p1y in test loop", p1x, p1y);
                }
                else {
                    ++found;
                }
                
            }
        }
        if (found === 2) {
            // Find the nearest intersect to c1
            let dc1x = p1x - c1x;
            let dc1y = p1y - c1y;
            let dc1 = dc1x ** 2 + dc1y ** 2;
            let dc2x = i1x - c1x;
            let dc2y = i1y - c1y;
            let dc2 = dc2x ** 2 + dc2y ** 2;
            if (dc2 < dc1) {
                p1x = i1x;
                p1y = i1y;
            }
        }
    }
    console.log("found, p1x, p1y", found, p1x, p1y);
    return [found, p1x, p1y];
}