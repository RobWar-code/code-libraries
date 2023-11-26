import {useCallback} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Stage, Graphics} from '@pixi/react';
import { lineCircleIntersects } from '../libraries/geometry';

export default function LineCircleIntersects() {
    const stageWidth = 600;
    const stageHeight = 400;

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
                        <Objects stageWidth={stageWidth} stageHeight={stageHeight}/>
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}

function Objects({stageWidth, stageHeight}) {

    const drawTestSet = useCallback((g) => {
        const cx = stageWidth / 2;
        const cy = stageHeight / 2;
        const r = 100;
        const lines = [
            [{x: stageWidth / 4, y: stageHeight / 2}, {x: stageWidth * 0.75, y: stageHeight / 2}],
            [{x: stageWidth / 4, y: stageHeight / 2 - 20}, {x: stageWidth * 0.75, y: stageHeight / 2 - 80}],
            [{x: stageWidth / 4, y: stageHeight / 2 - r + 10}, {x: stageWidth * 0.75, y: stageHeight / 2 - r - 10.5}]
        ]

        g.clear();
        g.lineStyle(1, 0x000050, 1);
        g.drawCircle(cx, cy, r);

        for (let i = 0; i < lines.length; i++) {
            let ax = lines[i][0].x;
            let ay = lines[i][0].y;
            let bx = lines[i][1].x;
            let by = lines[i][1].y;
            g.moveTo(ax, ay);
            g.lineTo(bx, by);

            // Test whether the line intersects the circle
            let intersects = lineCircleIntersects(lines[i], r, cx, cy);
            console.log(intersects);
            if (intersects.length > 0) {
                for (let j = 0; j < intersects.length; j++) {
                    let px = intersects[j].x;
                    let py = intersects[j].y;
                    g.beginFill(0xf00000);
                    g.drawCircle(px, py, 4);
                    g.endFill();
                }
            }
            else {
                g.beginFill(0x000050);
                g.drawCircle(ax, ay, 4);
                g.endFill();
            }
        }

    }, [stageHeight, stageWidth])
    return (
        <Graphics draw={drawTestSet} />
    )
}