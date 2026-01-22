import { Link } from "react-router-dom"
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from "@/context/AuthContext";

function Header() {
  const { user, token, clearAuthSession } = useAuth();

  const isUserLoggedIn = (user && token) ? true : false;

  const handleLogout = () => {
    clearAuthSession();
    // navigate("/login");
  };

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
                  <Nav.Item>
                    <Nav.Link as={Link} to="/tickets/create">Create Ticket</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/tickets/view">View Tickets</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" onClick={handleLogout} className="nav-logout-button">
                      Logout
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  );
}

export default Header
