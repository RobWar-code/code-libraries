import {useCallback} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Stage, Graphics} from '@pixi/react';
import {radialVectorPoints} from '../libraries/geometry';

export default function RadialVectorPoints () {
    const stageWidth=600;
    const stageHeight=400;

    const testSetData = useCallback( (g) => {
        const cx = stageWidth / 2;
        const cy = stageHeight / 2;
        const r = 150;

        // dx, dy values
        const vectors = [
            {dx: 4, dy: 1},
            {dx: 4, dy: 8}
        ]

        g.clear();
        g.lineStyle(2, 0x000040, 1);
        g.drawCircle(cx, cy, r);

        for (let v = 0; v < vectors.length; v++) {
            let dx = vectors[v].dx;
            let dy = vectors[v].dy;

            // Normalise vector and multiply-out for 1.5 * r
            let dx1 = 1.5 * r * dx / Math.sqrt(dx ** 2 + dy ** 2);
            let dy1 = 1.5 * r * dy / Math.sqrt(dx ** 2 + dy ** 2);
            dx1 = cx + dx1;
            dy1 = cy + dy1;
            g.lineStyle(2, 0x000040, 1);
            g.moveTo(cx, cy);
            g.lineTo(dx1, dy1);

            // Get the radial points
            const rp = radialVectorPoints(cx, cy, r, dx, dy);
            for (let i = 0; i < 2; i++) {
                let x = rp[i].x;
                let y = rp[i].y;
                g.beginFill(0xff0000);
                g.drawCircle(x, y, 4);
                g.endFill();
                g.lineStyle(2, 0x000040 + (v + 1) * 0x400000, 1);
                g.moveTo(cx, cy);
                g.lineTo(x, y);
            }
        }

    }, [stageWidth, stageHeight])

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <Stage width={stageWidth} height={stageHeight} options={{background: 0xa0a0e0}}>
                        <Graphics draw={testSetData} />
                    </Stage>
                </Col>
            </Row>
        </Container>
    )
}