
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
export default function svgPlot(g, svgObject, handle, x, y, anchor, scale) {
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
        // Set-up styles
        let fill = pathSet.fill;
        if (fill !== "none") {
            if (typeof fill !== "number") fill = 0;
        }
        let stroke = pathSet.stroke;
        let strokeWidth = parseFloat(pathSet.stroke_width.substr(0, pathSet.stroke_width.length - 2));
        if (stroke !== "none") {
            g.lineStyle(strokeWidth, stroke);
        }
        else {
            g.lineStyle(0);
        }
        for (let path of pathSet.paths) {
            let px = path.nodes[0].x;
            let py = path.nodes[0].y;
            if (fill !== "none") {
                g.beginFill(fill);
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
        }
    }

    return found;
}