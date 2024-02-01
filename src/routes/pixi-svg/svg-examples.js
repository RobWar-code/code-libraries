import {Container, Row, Col} from "react-bootstrap";
import {Stage, Graphics} from "@pixi/react";
import {useOutletContext} from "react-router-dom";
import svgPlot from "../../libraries/svgPlot";

export default function SVGExamples () {
    const {svgLoaded, svgObject} = useOutletContext();

    console.log("svgObject on page", svgObject);

    /* Test Example - Bezier Function */
    const bezierSample = (g) => {
        const startNodeX = 50;
        const startNodeY = 50;
        const control1X = 75;
        const control1Y = 70;
        const control2X = 175;
        const control2Y = 20;
        const endPointX = 200;
        const endPointY = 50;

        g.clear();
        g.lineStyle(2, 0x000000);
        g.moveTo(startNodeX, startNodeY);
        g.bezierCurveTo(control1X, control1Y, control2X, control2Y, endPointX, endPointY);
    }

    const bezierSample2 = (g) => {
        const startNodeX = 210;
        const startNodeY = 0;
        const endNodeX = 210;
        const endNodeY = 200;
        const cp1X = 273;
        const cp1Y = 50;
        const cp2X = 220;
        const cp2Y = 175;
        g.clear();
        g.lineStyle(2, 0x000000);
        g.moveTo(startNodeX, startNodeY);
        g.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endNodeX, endNodeY);
    }

    const bezierMinMaxSample = (g) => {
        const doBezierPoints = (g, sx, sy, ex, ey, cp1x, cp1y, cp2x, cp2y) => {
            // Formulation for cubic bezier curve
            // B(t) = (1-t)^3 * P0 + 3(1-t)^2 * t * P1 + 3(1-t) * t^2 * P2 + t^3 * P3
            // where t >= 0 && t <= 1
            const bezier = (t, p1, p2, p3, p4) => {
                let t1 = (1 - t) ** 3 * p1;
                let t2 = 3 * (1 - t) ** 2 * t * p2;
                let t3 = 3 * (1 - t) * t ** 2 * p3;
                let t4 = t ** 3 * p4;
                return (t1 + t2 + t3 + t4);
            }

            const step = 0.1;

            for (let t = step; t < 1; t += step) {
                let nx = bezier(t, sx, cp1x, cp2x, ex);
                let ny = bezier(t, sy, cp1y, cp2y, ey);
                g.beginFill();
                g.drawCircle(nx, ny, 2);
                g.endFill();
            }
        }

        const sx = 50;
        const sy = 200;
        const cp1x = 75;
        const cp1y = 175;
        const cp2x = 200;
        const cp2y = 225;
        const ex = 250;
        const ey = 200;

        g.clear();
        g.lineStyle(1, 0x000000);
        g.moveTo(sx, sy);
        g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);

        doBezierPoints(g, sx, sy, ex, ey, cp1x, cp1y, cp2x, cp2y);

    }

    const svgSamples = (g) => {
        g.clear();
        let found = svgPlot(g, svgObject, "square", 90, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found square:", found);
        found = svgPlot(g, svgObject, "triangle", 240, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found triangle", found);
        found = svgPlot(g, svgObject, "freehand", 360, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found freehand", found);
        found = svgPlot(g, svgObject, "multipath", 480, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found multipath", found);
        found = svgPlot(g, svgObject, "square02", 90, 200, {x:0.5, y:0.5}, 0.4);
        console.log("found square02:", found);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Stage width={600} height={400} options={{background: 0xd0d000, antialias: true}}>
                        {/* <Graphics draw={bezierSample} /> */}
                        {/* <Graphics draw={bezierSample2} /> */}
                        {/* <Graphics draw={bezierMinMaxSample} /> */}
                        { svgLoaded && 
                            <Graphics draw={svgSamples} />
                        }
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}