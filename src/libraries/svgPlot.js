
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
    return found;

    // Determine anchor
    let w = svgItem.width;
    let h = svgItem.height;
    
    // for each path in the drawing
    for (let path of svgItem.paths) {
        // Set-up styles
        let fill = path.fill;
        let stroke = path.stroke;
        let strokeWidth = path.stroke_width;
        if (fill !== "none") {
            g.beginFill(fill);
        }
        if (stroke !== "none") {
            g.lineStyle(strokeWidth, stroke);
        }
        else {
            g.lineStyle(0);
        }
        let px = path.nodes[0].x;
        let py = path.nodes[0].y;
    }

    function getSvg(svgObject, handle) {
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
}