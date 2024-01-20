import {useCallback} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Stage, Graphics} from '@pixi/react';
import {circleIntersects} from '../../libraries/geometry'

export default function CircleIntersects() {
    const stageWidth = 600;
    const stageHeight = 400;

    const drawTestSet = useCallback((g) => {
        // Circle Data
        const c1 = {x: stageWidth / 2, y: stageHeight / 2, r: 150};
        const c = [
            {x: stageWidth / 3, y: stageHeight / 2 - 80, r: 100},
            {x: stageWidth / 3, y: stageHeight / 2 + 80, r: 120},
            {x: stageWidth * 2 / 3, y: stageHeight / 2, r: 90}
        ]
        g.clear();
        g.lineStyle(2, 0x000040);
        g.drawCircle(c1.x, c1.y, c1.r);
        for (let i = 0; i < c.length; i++) {
            g.drawCircle(c[i].x, c[i].y, c[i].r);
            // Get intersects
            let intersects = circleIntersects(c[i].x, c[i].y, c[i].r, c1.x, c1.y, c1.r);
            if (intersects.length) {
                // Plot the intersects
                for (let j = 0; j < intersects.length; j++) {
                    let x = intersects[j].x;
                    let y = intersects[j].y;
                    let r = 4;
                    g.beginFill(0xf00000);
                    g.drawCircle(x,y,r);
                    g.endFill();
                }
            }
        }
    }, [stageWidth, stageHeight])

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <Stage width={stageWidth} height={stageHeight} options={{background:0xc0c0f0}}>
                        <Graphics draw={drawTestSet} />
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}