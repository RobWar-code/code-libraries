import {Container, Row, Col} from "react-bootstrap";
import {Stage, Graphics} from "@pixi/react";
import {useOutletContext} from "react-router-dom";
import svgPlot from "../../libraries/svgPlot";

export default function SVGExamples () {
    const svgObject = useOutletContext()[0];
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

    const svgSamples = (g) => {
        let found = svgPlot(g, svgObject, "square", 250, 200);
        console.log("found:", found);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Stage width={600} height={400} options={{background: 0xd0d000, antialias: true}}>
                        <Graphics draw={bezierSample} />
                        <Graphics draw={bezierSample2} />
                        <Graphics draw={svgSamples} />
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}