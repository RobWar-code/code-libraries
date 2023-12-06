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
    
    // Determine whether the intersect is within the line segment
    let do1 = false;
    if (
        ((ax <= bx && x1 >= ax && x1 <= bx) ||
        (ax > bx && x1 <= ax && x1 >= bx)) &&
        ((ay <= by && y1 >= ay && y1 <= by) ||
        (ay > by && y1 <= ay && y1 >= by))
    ) {
        do1 = true;
    }
    let do2 = false;
    if (discriminant > 0) {
        if (
            ((ax <= bx && x2 >= ax && x2 <= bx) ||
            (ax > bx && x2 <= ax && x2 >= bx)) &&
            ((ay <= by && y2 >= ay && y2 <= by) ||
            (ay > by && y2 <= ay && y2 >= by))
        ) {
            do2 = true;
        }
    }
    if (discriminant === 0 && do1) {
        // One intersection
        return [{ x: x1, y: y1 }];
    }

    // Two intersections
    if (do2 && do1) {
        return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
    }
    else if (do1) {
        return [{x: x1, y: y1}];
    }
    else if (do2) {
        return [{x: x2, y: y2}];
    }
    else return [];
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
 * Find the nearest approach of a line to a point.
 * 
 * @param {number} ax  - Point of reference
 * @param {number} ay - Point of reference 
 * @param {number} lax - line for relative minimum distance
 * @param {number} lay 
 * @param {number} lbx 
 * @param {number} lby 
 * @returns { closestPoint: { x: cx, y: cy }, distance } 
 */
export function findClosestPointAndDistance(ax, ay, lax, lay, lbx, lby) {
    // Direction vector of the line
    const dx = lbx - lax;
    const dy = lby - lay;

    // Vector from A to P (lax, lay)
    const APx = ax - lax;
    const APy = ay - lay;

    // Projection of AP onto d
    const t = (APx * dx + APy * dy) / (dx * dx + dy * dy);

    // Closest point (cx, cy) on the line to (ax, ay)
    const cx = lax + t * dx;
    const cy = lay + t * dy;

    // Calculate the distance
    const distance = Math.sqrt((ax - cx) ** 2 + (ay - cy) ** 2);

    return { closestPoint: { x: cx, y: cy }, distance };
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

    // Skimming contact
    // Find the closest approach to the arc circle along the vector
    let {closestPoint, distance} = findClosestPointAndDistance(c3x, c3y, c1x, c1y, c2x, c2y);

    // Check whether the closest point is less than the sum of the radii
    if (distance > r + r3) {
        return [false, 0,0,0,0];
    };

    // Check whether the point on the vector is within circle positions
    if (
        (c1x <= c2x && (closestPoint.x < c1x || closestPoint.x > c2x)) ||
        (c2x < c1x && (closestPoint.x < c2x || closestPoint.x > c1x)) ||
        (c1y <= c2y && (closestPoint.y < c1y || closestPoint.y > c2y)) ||
        (c2y < c1y && (closestPoint.y < c2y || closestPoint.y > c1y))
    ) {
        return [false, 0,0,0,0];
    }

    // Determine the contact circle position along the vector
    let R = r + r3;
    let c4x = closestPoint.x - Math.sqrt(R ** 2 - distance ** 2) * v1x;
    let c4y = closestPoint.y - Math.sqrt(R ** 2 - distance ** 2) * v1y;

    // Determine the contact point
    let d4x = c3x - c4x;
    let d4y = c3y - c4y;
    let v4y = d4y / Math.sqrt(d4x ** 2 + d4y ** 2);
    let v4x = d4x / Math.sqrt(d4x ** 2 + d4y ** 2);
    let hx = c4x + v4x * r;
    let hy = c4y + v4y * r;

    // Check whether the point of contact is within the arc
    if (
        (corner === 0 && hx >= c3x - r3 && hx <= c3x && hy <= c3y && hy >= c3y - r3) ||
        (corner === 1 && hx >= c3x && hx < c3x + r3 && hy <= c3y && hy >= c3y - r3) ||
        (corner === 2 && hx >= c3x && hx < c3x + r3 && hy >= c3y && hy <= c3y + r3) ||
        (corner === 3 && hx >= c3x - r3 && hx <= c3x && hy >= c3y && hy <= c3y + r3))
    {
        let hit = true;
        return [hit, c4x, c4y, hx, hy];
    }
    else {
        return [false, 0, 0, 0, 0];
    }

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

/**
 * Find the position of the circle as it strikes the edge
 * 
 * @param {number} c1x - circle last position
 * @param {*} c1y - circle last position
 * @param {*} r - radius of circle
 * @param {*} c2x - circle new position
 * @param {*} c2y - circle new position
 * @param {*} lax - edge coordinate
 * @param {*} lay 
 * @param {*} lbx 
 * @param {*} lby 
 * @param {number} edgeNum - (0 left, 1 top, 2 right, 3 bottom)
 */
export function circleToEdgeContact(c1x, c1y, r, c2x, c2y, lax, lay, lbx, lby, edgeNum) {

    let dx = c2x - c1x;
    let dy = c2y - c1y;
    let ix, iy;
    let px, py;
    let cpx, cpy, c3x, c3y;
    let found = false;

    if (edgeNum === 0 || edgeNum === 2) {
        // Get intersect between circle and edge on the trajectory
        // we have x for the edge, so we put
        ix = lax;
        iy = c1y + (ix - c1x) * dy/dx;
        // Determine the circle centre on the c1c2 vector that is r from the edge
        // Point of contact:
        cpy = Math.abs(r * dy/dx);
        py = iy - cpy * Math.sign(dy);
        px = lax;
        c3x = px - r * Math.sign(dx);
        c3y = py;
    }
    else {
        iy = lay;
        ix = c1x + (iy - c1y) * dx/dy;
        // Determine the circle centre on the c1c2 vector that is r from the edge
        // Point of contact:
        cpx = Math.abs(r * dx/dy);
        px = ix - cpx * Math.sign(dx);
        py = lay;
        c3y = py - r * Math.sign(dx);
        c3x = px;
    }

    if (
        ((lax <= lbx && px >= lax && px <= lbx) ||
        (lax > lbx && px <= lax && px >= lbx)) &&
        ((lay <= lby && py >= lay && py <= lby) ||
        (lay > lby && py <= lay && py >= lby))
    ) {
      found = true;  
    }
    return [found, c3x, c3y, px, py]
}