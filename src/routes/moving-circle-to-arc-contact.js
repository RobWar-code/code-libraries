import {useCallback} from "react";
import {Container, Row, Col} from "react-bootstrap";
import {Stage, Graphics} from "@pixi/react";
import { movingCircleToArcContactPosition } from "../libraries/geometry";

export default function MovingCircleToArcContact() {
    const stageWidth = 600;
    const stageHeight = 400;

    const drawSamples = useCallback( (g) => {

        function drawBat(g, batWidth, batHeight, arcRadius, batX, batY) {

            let cx = batX - batWidth / 2 + arcRadius;
            let cy = batY - batHeight / 2 + arcRadius;
            drawArc(g, arcRadius, 180, 270, cx, cy);
            g.moveTo(batX - (batWidth / 2) + arcRadius, batY - batHeight / 2);
            g.lineTo(batX + batWidth / 2 - arcRadius, batY - batHeight / 2);
            cx = batX + batWidth / 2 - arcRadius;
            cy = batY - batHeight / 2 + arcRadius;
            drawArc(g, arcRadius, 90, 180, cx, cy);
            g.moveTo(batX + batWidth / 2, batY - batHeight / 2 + arcRadius);
            g.lineTo(batX + batWidth / 2, batY + batHeight / 2 - arcRadius);
            cx = batX + batWidth / 2 - arcRadius;
            cy = batY + batHeight / 2 - arcRadius;
            drawArc(g, arcRadius, 0, 90, cx, cy);
            g.moveTo(batX + batWidth / 2 - arcRadius, batY + batHeight / 2);
            g.lineTo(batX - (batWidth / 2) + arcRadius, batY + batHeight / 2);
            cx = batX - batWidth / 2 + arcRadius;
            cy = batY + batHeight / 2 - arcRadius;
            drawArc(g, arcRadius, 270, 0, cx, cy);
            g.moveTo(batX - batWidth / 2, batY + batHeight / 2 - arcRadius);
            g.lineTo(batX - batWidth / 2, batY - batHeight / 2 + arcRadius);
        }
    
        function drawArc(g, arcRadius, startAngle, endAngle, cx, cy) {
            let da;
            if (endAngle < startAngle) {
                da = 360 - startAngle + endAngle;
            }
            else {
                da = endAngle - startAngle;
            }
            let angleStep = da / 20 * Math.PI / 180;
            let angle = startAngle * Math.PI / 180;
            let x = cx + Math.sin(angle) * arcRadius;
            let y = cy + Math.cos(angle) * arcRadius;
            for (let i = 0; i < 20; i++) {
                g.moveTo(x, y);
                angle = angle + angleStep;
                x = cx + Math.sin(angle) * arcRadius;
                y = cy + Math.cos(angle) * arcRadius;
                g.lineTo(x, y);
            }
        }
    
        // Draw the "bat" shape with four corner arcs
        const batWidth = 150;
        const batHeight = 80;
        const arcRadius = batHeight / 4;
        const batX = stageWidth / 2;
        const batY = stageHeight / 2;

        g.clear();
        g.lineStyle(2, 0x000040, 1);

        drawBat(g, batWidth, batHeight, arcRadius, batX, batY);

        let c1x = batX - batWidth / 2 - 50;
        let c1y = batY - batHeight / 2 + 20;
        let r = 30;
        g.drawCircle(c1x, c1y, r);
        let c2x = batX - batWidth / 2 + 40;
        let c2y = batY - batHeight / 2 - 10;
        g.drawCircle(c2x, c2y, r);
        let c3x = batX - batWidth / 2 + arcRadius;
        let c3y = batY - batHeight / 2 + arcRadius;
        let corner = 0;
        let [hit, px, py, hx, hy] = movingCircleToArcContactPosition(c1x, c1y, r, c2x, c2y, c3x, c3y, arcRadius, corner);
        console.log ("Corner:", corner, " Hit: ", hit);
        if (hit) {
            g.drawCircle(px, py, r);
        }

        c1x = batX + batWidth / 2 + 50;
        c1y = batY - batHeight / 2 - 20;
        g.drawCircle(c1x, c1y, r);
        c2x = batX + batWidth / 2 - 50;
        c2y = batY - batHeight / 2 + 20;
        g.drawCircle(c2x, c2y, r);
        c3x = batX + batWidth / 2 - arcRadius;
        c3y = batY - batHeight / 2 + arcRadius;
        corner = 1;
        [hit, px, py, hx, hy] = movingCircleToArcContactPosition(c1x, c1y, r, c2x, c2y, c3x, c3y, arcRadius, corner);
        console.log ("Corner:", corner, " Hit: ", hit);
        if (hit) {
            g.drawCircle(px, py, r);
        }

        c1x = batX + batWidth / 2 + 50;
        c1y = batY + batHeight / 2 + 20;
        g.drawCircle(c1x, c1y, r);
        c2x = batX + batWidth / 2 - 40;
        c2y = batY + batHeight / 2 - 40;
        g.drawCircle(c2x, c2y, r);
        c3x = batX + batWidth / 2 - arcRadius;
        c3y = batY + batHeight / 2 - arcRadius;
        corner = 2;
        [hit, px, py, hx, hy] = movingCircleToArcContactPosition(c1x, c1y, r, c2x, c2y, c3x, c3y, arcRadius, corner);
        console.log ("Corner:", corner, " Hit: ", hit);
        if (hit) {
            g.drawCircle(px, py, r);
        }

        /*
            g.beginFill(0xff0000);
            g.drawCircle(px, py, 4);
            g.drawCircle(hx, hy, 4);
            g.endFill();
        */

    }, [stageWidth, stageHeight]);


    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <h1>Moving Circle to Arc Contact Point</h1>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Stage width={stageWidth} height={stageHeight} options={{background: 0xc0c0f0}}>
                        <Graphics draw={drawSamples} />
                    </Stage>
                </Col>
            </Row>
        </Container>

    )
}