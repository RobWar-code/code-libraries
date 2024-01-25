import {Container, Row, Col} from "react-bootstrap";
import {Stage, Graphics} from "@pixi/react";
import {useOutletContext} from "react-router-dom";

export default function SVGExamples () {
    const svgObject = useOutletContext();

    /* Test Example - Bezier Function */
    const bezierSample = (g) => {
        const startNodeX = 50;
        const startNodeY = 50;
        const control1X = 75;
        const control1Y = -20;
        const control2X = 175;
        const control2Y = 20;
        const endPointX = 200;
        const endPointY = 50;

        g.clear();
        g.lineStyle(2, 0x000000);
        g.moveTo(startNodeX, startNodeY);
        g.bezierCurveTo(control1X, control1Y, control2X, control2Y, endPointX, endPointY);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Stage width={600} height={400} options={{background: 0xd0d000, antialias: true}}>
                        <Graphics draw={bezierSample} />
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}