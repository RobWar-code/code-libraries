import {useCallback} from "react";
import {Container, Row, Col} from "react-bootstrap";
import {Stage, Graphics} from "@pixi/react";
import { circleToEdgeContact } from '../../libraries/geometry';

export default function CircleToEdgeContact() {
    const stageWidth = 600;
    const stageHeight = 400;

    const drawTestSet = useCallback((g) => {

        let lax = stageWidth / 3;
        let lay = stageHeight / 4;
        let lbx = stageWidth / 3;
        let lby = stageHeight * 0.75;
        let c1x = 150;
        let c1y = 150;
        let r = 40;
        let c2x = 250;
        let c2y = 250;
        let edgeNum = 0;

        g.clear();
        g.lineStyle(2, 0x404080);
        g.moveTo(lax, lay);
        g.lineTo(lbx, lby);
        g.drawCircle(c1x, c1y, r);
        g.drawCircle(c2x, c2y, r);
        g.moveTo(c1x, c1y);
        g.lineTo(c2x, c2y);
        let [found, c3x, c3y, px, py] = circleToEdgeContact(c1x, c1y, r, c2x, c2y, lax, lay, lbx, lby, edgeNum);
        if (found) {
            g.drawCircle(c3x, c3y, r);
            g.beginFill(0xff0000);
            g.drawCircle(px, py, 4);
            g.endFill();
        }


        lax = stageWidth * 2/3;
        lay = stageHeight / 4;
        lbx = stageWidth * 2/3;
        lby = stageHeight * 0.75;
        c1x = 450;
        c1y = 150;
        r = 40;
        c2x = 350;
        c2y = 250;
        edgeNum = 2;

        g.lineStyle(2, 0x404080);
        g.moveTo(lax, lay);
        g.lineTo(lbx, lby);
        g.drawCircle(c1x, c1y, r);
        g.drawCircle(c2x, c2y, r);
        g.moveTo(c1x, c1y);
        g.lineTo(c2x, c2y);
        [found, c3x, c3y, px, py] = circleToEdgeContact(c1x, c1y, r, c2x, c2y, lax, lay, lbx, lby, edgeNum);
        if (found) {
            g.drawCircle(c3x, c3y, r);
            g.beginFill(0xff0000);
            g.drawCircle(px, py, 4);
            g.endFill();
        }

        lax = stageWidth / 3;
        lay = stageHeight / 4;
        lbx = stageWidth * 2/3;
        lby = stageHeight / 4;
        c1x = 250;
        c1y = 50;
        r = 40;
        c2x = 350;
        c2y = 150;
        edgeNum = 1;

        g.lineStyle(2, 0x404080);
        g.moveTo(lax, lay);
        g.lineTo(lbx, lby);
        g.drawCircle(c1x, c1y, r);
        g.drawCircle(c2x, c2y, r);
        g.moveTo(c1x, c1y);
        g.lineTo(c2x, c2y);
        [found, c3x, c3y, px, py] = circleToEdgeContact(c1x, c1y, r, c2x, c2y, lax, lay, lbx, lby, edgeNum);
        if (found) {
            g.drawCircle(c3x, c3y, r);
            g.beginFill(0xff0000);
            g.drawCircle(px, py, 4);
            g.endFill();
        }

        lax = stageWidth / 3;
        lay = stageHeight * 3/4;
        lbx = stageWidth * 2/3;
        lby = stageHeight * 3/4;
        c1x = 350;
        c1y = 350;
        r = 40;
        c2x = 280;
        c2y = 250;
        edgeNum = 1;

        g.lineStyle(2, 0x404080);
        g.moveTo(lax, lay);
        g.lineTo(lbx, lby);
        g.drawCircle(c1x, c1y, r);
        g.drawCircle(c2x, c2y, r);
        g.moveTo(c1x, c1y);
        g.lineTo(c2x, c2y);
        [found, c3x, c3y, px, py] = circleToEdgeContact(c1x, c1y, r, c2x, c2y, lax, lay, lbx, lby, edgeNum);
        if (found) {
            g.drawCircle(c3x, c3y, r);
            g.beginFill(0xff0000);
            g.drawCircle(px, py, 4);
            g.endFill();
        }

    }, [stageWidth, stageHeight]);

    return (
        <Container >
            <Row >
                <Col className="text-center">
                    <h2>Circle To Edge Contact</h2>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Stage width={stageWidth} height={stageHeight} options={{background: 0xc0c0f0}}>
                        <Graphics draw={drawTestSet} />
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}