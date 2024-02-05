
/**
 * Render the given SVG object, using the PIXI graphic object.
 * 
 * @param {object} g - the graphics object
 * @param {array} svgObject  - the set of SVG drawings
 * @param {string} handle - the name of the drawing to use
 * @param {number} x - position
 * @param {number} y - position
 * @param {object} [anchor] - {x: , y: } same as PIXI anchor, reference point in drawing
 * @param {number} [scale] - the scale factor to use
 */
export function svgPlot(g, svgObject, handle, x, y, anchor, scale) {
    const getSvg = (svgObject, handle) => {
        let found = false;
        let svgItem = {};
        for (let item of svgObject) {
            if (item.handle === handle) {
                svgItem = item;
                found = true;
                break;
            }
        }
        return [found, svgItem];
    }

    let anchorSet = {x: 0.5, y: 0.5};
    if (anchor) {
        anchorSet = anchor;
    }
    let scaleSet = 1;
    if (scale) {
        scaleSet = scale;
    }
    // Find the drawing
    let [found, svgItem] = getSvg(svgObject, handle);
    if (!found) {
        return found;
    }

    // Determine anchor
    let w = svgItem.width;
    let h = svgItem.height;

    let anchorX = (w * anchorSet.x) * scaleSet;
    let anchorY = (h * anchorSet.y) * scaleSet;
    
    // for each path in the drawing
    for (let pathSet of svgItem.pathSets) {
        if (!pathSet.cutout) {
            // Set-up styles
            let fill = pathSet.fill;
            if (fill !== "none") {
                if (typeof fill !== "number") fill = 0;
            }
            let stroke;
            if (!(stroke in pathSet)) {
                stroke = 0x000000;
            }
            else {
                stroke = pathSet.stroke;
            }
            let strokeWidth = parseFloat(pathSet.stroke_width.substr(0, pathSet.stroke_width.length - 2));
            if (strokeWidth < 1) strokeWidth = 1;
            if (stroke !== "none") {
                g.lineStyle(strokeWidth, stroke);
            }
            else {
                g.lineStyle(0);
            }
            let trace = false;
            if (pathSet.paths.length > 1) {
                trace = true;
            }
            let count = 0;
            for (let path of pathSet.paths) {
                
                let px = path.nodes[0].x;
                let py = path.nodes[0].y;
                if (fill !== "none") {
                    if (trace && count > 0) {
                        g.beginFill(0xffffff)
                    }
                    else {
                        g.beginFill(fill);
                    }
                }
                g.moveTo(px * scaleSet + x - anchorX, py * scaleSet + y - anchorY);
                let limit = path.nodes.length - 1;
                if (path.closed) limit = path.nodes.length;
                for (let i = 1; i <= limit; i++) {
                    let p = i;
                    if (path.closed && i === limit) p = 0;
                    px = path.nodes[p].x;
                    py = path.nodes[p].y;
                    px = px * scaleSet + x - anchorX;
                    py = py * scaleSet + y - anchorY;
                    if ("curveParam1x" in path.nodes[p]) {
                        let cp1X = path.nodes[p].curveParam1x;
                        let cp1Y = path.nodes[p].curveParam1y;
                        let cp2X = path.nodes[p].curveParam2x;
                        let cp2Y = path.nodes[p].curveParam2y;
                        cp1X = cp1X * scaleSet + x - anchorX;
                        cp1Y = cp1Y * scaleSet + y - anchorY;
                        cp2X = cp2X * scaleSet + x - anchorX;
                        cp2Y = cp2Y * scaleSet + y - anchorY;
                        g.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, px, py);
                    }
                    else {
                        g.lineTo(px, py);
                    }
                }
                // Complete fill
                if (fill !== "none") {
                    g.endFill();
                }
                ++count;
            }
        }
    }

    return found;
}

/**
 * Add a cutout path to the given outer path
 * 
 * @param {array} outerPath  - the path in which the cutout is to be made
 * @param {array} cutoutPath - the path of the cutout
 * 
 * return {array} - the new path including the cutout
 */
export function doPathCutout(outerPath, cutoutPath) {

    const findNearestNodes = (outerPath, cutoutPath) => {
        // Find the nodes that are nearest to eachother
        let outerNearNode1 = 0;
        let outerNearNode2 = 0;
        let cutNearNode1 = 0;
        let cutNearNode2 = 0;
        let outerNearNode1X = 0;
        let outerNearNode1Y = 0;
        let outerNearNode2X = 0;
        let outerNearNode2Y = 0;
        let cutNearNode1X = 0;
        let cutNearNode1Y = 0;
        let cutNearNode2X = 0;
        let cutNearNode2Y = 0;

        for (let i = 0; i < outerPath.length; i++) {
            let outerNode = outerPath[i];
            for (let j = 0; j < cutoutPath.length; j++) {
                let gotNearest = false;
                let cutNode = cutoutPath[j];
                if (i === 0 && j === 0) {
                    outerNearNode1X = outerNode.x;
                    outerNearNode1Y = outerNode.y;
                    cutNearNode1X = cutNode.x;
                    cutNearNode1Y = cutNode.y;
                }
                else {
                    let d1 = Math.sqrt((outerNode.x - cutNode.x) ** 2 + (outerNode.y - cutNode.y) ** 2);
                    let d1last = Math.sqrt((outerNearNode1X - cutNearNode1X) ** 2 + (outerNearNode1Y - cutNearNode1Y) ** 2);
                    if (d1 < d1last) {
                        outerNearNode1X = outerNode.x;
                        outerNearNode1Y = outerNode.y;
                        cutNearNode1X = cutNode.x;
                        cutNearNode1Y = cutNode.y;
                        outerNearNode1 = i;
                        cutNearNode1 = j;
                        gotNearest = true;
                    }
                }

                if (gotNearest || (i === 0 && j === 0)) {
                    // Find the nearest adjacent node pair
                    let o1 = i - 1;
                    if (o1 < 0) o1 = outerPath.length - 1;
                    let c1 = j - 1;
                    if (c1 < 0) c1 = cutoutPath.length - 1;
                    let ad1 = Math.sqrt((outerPath[o1].x - cutoutPath[c1].x) ** 2 + (outerPath[o1].y - cutoutPath[c1].y) ** 2);
                    let o2 = i + 1;
                    if (o2 >= outerPath.length) o2 = 0;
                    let c2 = j + 1;
                    if (c2 >= cutoutPath.length) c2 = 0;
                    let ad2 = Math.sqrt((outerPath[o2].x - cutoutPath[c2].x) ** 2 + (outerPath[o2].y - cutoutPath[c2].y) ** 2);
                    if (ad1 < ad2) {
                        outerNearNode2 = o1;
                        cutNearNode2 = c1;
                        outerNearNode2X = outerPath[o1].x;
                        outerNearNode2Y = outerPath[o1].y;
                        cutNearNode2X = cutoutPath[c1].x;
                        cutNearNode2Y = cutoutPath[c1].y;
                    }
                    else {
                        outerNearNode2 = o2;
                        cutNearNode2 = c2;
                        outerNearNode2X = outerPath[o2].x;
                        outerNearNode2Y = outerPath[o2].y;
                        cutNearNode2X = cutoutPath[c2].x;
                        cutNearNode2Y = cutoutPath[c2].y;
                    }
                }

            }
        }
        return [
            outerNearNode1,
            outerNearNode2,
            outerNearNode1X,
            outerNearNode1Y,
            outerNearNode2X,
            outerNearNode2Y,
            cutNearNode1,
            cutNearNode2,
            cutNearNode1X,
            cutNearNode1Y,
            cutNearNode2X,
            cutNearNode2Y
        ]
    }

    const getPathWithCutout = (outerPath, cutoutPath, outerIncisionX1, 
        outerIncisionY1, outerIncisionX2, outerIncisionY2,
        outerNearNode1, outerNearNode2, 
        cutIncisionX1, cutIncisionY1,
        cutIncisionX2, cutIncisionY2,
        cutNearNode1, cutNearNode2) => {
        // Transfer the nodes from the main outer path, to the new array
        let pathWithCutout = [];
        for (let i = 0; i < outerPath.length; i++) {
            let before = true;
            if (i === outerNearNode1) {
                if (outerNearNode2 > i || outerNearNode2 === 0) {
                    pathWithCutout.push(outerPath[i]);
                    before = false;
                }
                
                pathWithCutout = insertCutout(pathWithCutout, cutoutPath, outerIncisionX1, 
                    outerIncisionY1, cutIncisionX1, cutIncisionY1,
                    outerIncisionX2, outerIncisionY2,
                    cutIncisionX2, cutIncisionY2, 
                    outerNearNode1, outerNearNode2,
                    cutNearNode1, cutNearNode2);
                 
            }
            if (before) pathWithCutout.push(outerPath[i]);
        }
        return pathWithCutout;
    }

    const insertCutout = (pathWithCutout, cutoutPath, outerIncisionX1, 
        outerIncisionY1, cutIncisionX1, cutIncisionY1, outerIncisionX2, 
        outerIncisionY2, cutIncisionX2, cutIncisionY2, 
        outerNearNode1, outerNearNode2,
        cutNearNode1, cutNearNode2) => {
        // Set the first side of the incision
        pathWithCutout.push({x: outerIncisionX1, y: outerIncisionY1});
        pathWithCutout.push({x: cutIncisionX1, y: cutIncisionY1});
        // Add in the path of the cutout
        // Determine which side of the cutout node the cut arises
        let before = true;
        if (cutNearNode2 < cutNearNode1 || cutNearNode2 === cutoutPath.length - 1) before = true;
        let p = cutNearNode1;
        for (let i = 0; i < cutoutPath.length; i++) {
            if (before) {
                p = p - 1;
                if (p < 0) p = cutoutPath.length - 1;
            }
            else {
                p = p + 1;
                if (p >= cutoutPath.length) p = 0;
            }
            pathWithCutout.push(cutoutPath[p]);
        }
        // Set the final cutout incision 
        pathWithCutout.push({x: cutIncisionX2, y: cutIncisionY2})
        pathWithCutout.push({x: outerIncisionX2, y: outerIncisionY2});

        return pathWithCutout;
    }

    let [
        outerNearNode1,
        outerNearNode2,
        outerNearNode1X,
        outerNearNode1Y,
        outerNearNode2X,
        outerNearNode2Y,
        cutNearNode1,
        cutNearNode2,
        cutNearNode1X,
        cutNearNode1Y,
        cutNearNode2X,
        cutNearNode2Y
    ] = findNearestNodes(outerPath, cutoutPath);

    // Make the incision cut to the cutout path
    let outerIncisionX1 = outerNearNode1X + (outerNearNode2X - outerNearNode1X) / 2;
    let outerIncisionY1 = outerNearNode1Y + (outerNearNode2Y - outerNearNode1Y) / 2;
    let outerIncisionX2, outerIncisionY2;
    if (outerNearNode2X < outerNearNode1X) {
        outerIncisionX2 = outerIncisionX1 - 1;
    }
    else {
        outerIncisionX2 = outerIncisionX1 + 1;
    }
    if (outerNearNode2Y < outerNearNode1Y) {
        outerIncisionY2 = outerIncisionY1 - 1;
    }
    else {
        outerIncisionY2 = outerIncisionY1 + 1;
    }
    let cutIncisionX1 = cutNearNode1X + (cutNearNode2X - cutNearNode1X) / 2;
    let cutIncisionY1 = cutNearNode1Y + (cutNearNode2Y - cutNearNode1Y) / 2;
    let cutIncisionX2, cutIncisionY2;
    if (cutNearNode2X < cutNearNode1X) {
        cutIncisionX2 = cutIncisionX1 - 3;
    }
    else {
        cutIncisionX2 = cutIncisionX1 + 3;
    }
    if (cutNearNode2Y < cutNearNode1Y) {
        cutIncisionY2 = cutIncisionY1 - 3;
    }
    else {
        cutIncisionY2 = cutIncisionY1 + 3;
    }

    let pathWithCutout = getPathWithCutout(outerPath, cutoutPath, outerIncisionX1, 
        outerIncisionY1, outerIncisionX2, outerIncisionY2, 
        outerNearNode1, outerNearNode2, 
        cutIncisionX1, cutIncisionY1,
        cutIncisionX2, cutIncisionY2,
        cutNearNode1, cutNearNode2);

    return pathWithCutout;

}