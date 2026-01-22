import { Link } from "react-router-dom"
import { Container, Nav, Navbar } from 'react-bootstrap';

function Header() {
  // const { auth } = useAuth()
  // const isUserLoggedIn = auth?.accessToken
  const isUserLoggedIn = false;

  return (
    <header className="border-bottom position-sticky top-0 start-0">
      <Navbar expand="lg" className="bg-body-secondary">
        <Container>
          <Navbar.Brand as={Link} to="/">Service Desk</Navbar.Brand>
          <Navbar.Toggle aria-controls="header-navbar-nav" />
          <Navbar.Collapse id="header-navbar-nav">
            <Nav className="me-auto">
              {isUserLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/tickets/create">Create Ticket</Nav.Link>
                  <Nav.Link as={Link} to="/tickets/view">View Tickets</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  );
}

export default Header
