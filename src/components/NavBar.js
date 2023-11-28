import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/images/logo.png'

function NavBar() {
  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
            <img
              alt=""
              src={Logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}
            Code Libraries
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto nav">
            <Nav.Link as={Link} to="/">Intro</Nav.Link>
            <Nav.Link as={Link} to="/line-circle-intersects">LineCircleIntersects</Nav.Link>
            <Nav.Link as={Link} to="/circle-intersects">CircleIntersects</Nav.Link>
            <Nav.Link as={Link} to="/radial-vector-points">RadialVectorPoints</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;