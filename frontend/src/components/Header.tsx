import { Link, useNavigate } from "react-router-dom"

import { Container, Nav, Navbar } from 'react-bootstrap';

import { useAuth } from "@/auth/useAuth";


const Header = () => {
  const navigate = useNavigate();

  const { clearAuthSession, isUserLoggedIn, user } = useAuth();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  return (
    <header className="border-bottom position-sticky top-0 start-0 z-3">
      <Navbar expand="lg" className="bg-body-secondary">
        <Container>
          <Navbar.Brand as={Link} to="/">Service Desk</Navbar.Brand>
          <Navbar.Toggle aria-controls="header-navbar-nav" />
          <Navbar.Collapse id="header-navbar-nav">
            <Nav className="me-auto">
              {isUserLoggedIn ? (
                <>
                  {(user?.role == "STANDARD_USER") && (
                    <Nav.Item>
                      <Nav.Link as={Link} to="/tickets/create">Create Ticket</Nav.Link>
                    </Nav.Item>
                  )}
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
