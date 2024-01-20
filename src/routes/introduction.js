import {Container, Row, Col} from 'react-bootstrap';
import IntroNavBar from '../components/IntroNavBar';


export default function Introduction() {
    return (
        <>
            <IntroNavBar />
            <Container>
                <Row>
                    <Col>
                        <h1>Geometry and Pixi-SVG Library Functions</h1>
                    </Col>
                </Row>
            </Container>
        </>
    )
}