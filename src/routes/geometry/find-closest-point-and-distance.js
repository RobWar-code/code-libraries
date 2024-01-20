import {useCallback} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Stage, Graphics} from '@pixi/react';
import { findClosestPointAndDistance } from '../../libraries/geometry';

export default function LineCircleIntersects() {
    const stageWidth = 600;
    const stageHeight = 400;

    const drawTestData = useCallback((g) => {

        const testData = [
            {
                ax: stageWidth / 2,
                ay: stageHeight / 2,
                r: 100,
                lax: stageWidth / 2 - 160,
                lay: stageHeight / 2 + 150,
                lbx: stageWidth / 2 - 120,
                lby: stageHeight / 2 - 150,
                cr: 80
            }
        ]

        const ax = testData[0].ax;
        const ay = testData[0].ay;
        const r = testData[0].r;
        g.clear();
        g.lineStyle(2, 0x000040,1);
        g.drawCircle(ax, ay, r);

        for (let i = 0; i < testData.length; i++) {
            let {lax, lay, lbx, lby, cr} = testData[i];
            console.log("lax, lay", lax, lay, lbx, lby);
            g.moveTo(lax, lay);
            g.lineTo(lbx, lby);

            let {closestPoint, distance} = findClosestPointAndDistance(ax, ay, lax, lay, lbx, lby);
            let cp = closestPoint;
            g.moveTo(cp.x, cp.y);
            g.lineTo(ax, ay);
            console.log("distance:", distance);
            g.drawCircle(cp.x, cp.y, cr);
        }

    }, [stageWidth, stageHeight]);

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <h2>Library Function: lineCircleIntersects</h2>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Stage width={stageWidth} height={stageHeight} options={{background: 0xd0d0f0}}>
                        <Graphics draw={drawTestData}/>
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}
