import { Link } from "react-router-dom"

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { useAuth } from "@/auth/useAuth";

import { iconGithub } from "@/assets/index"


const Header = () => {

  const { clearAuthSession, isUserLoggedIn, user } = useAuth();

  const handleLogout = () => {
    clearAuthSession();
  };

  return (
    <header className="shadow border-bottom position-sticky top-0 start-0 z-3">
      <Navbar expand="md" className="bg-primary p-3">
        <Container>

          <Navbar.Brand as={Link} to="/">Help Desk</Navbar.Brand>

          <Navbar.Toggle aria-controls="header-navbar-nav" />
          <Navbar.Collapse id="header-navbar-nav">
            <Nav className="ms-auto align-items-md-center">
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

                  <NavDropdown title={user?.fullname} id="nav-dropdown">
                    <NavDropdown.Item as="button" onClick={handleLogout} className="nav-logout-button">
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                </>
              ) : (
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Nav.Link href="https://github.com/dorukEmre/java-ai-help-desk"
                  target="_blank"
                  rel="noreferrer"
                  className="ms-md-3 d-inline-flex flex-column justify-content-center align-items-center text-body ps-md-3 py-md-0 border-start-md border-color-body gap-1"
                  aria-label="View on GitHub"
                  title="View on GitHub"
                >
                  <img src={iconGithub} height="28" alt="" />
                  <small>Github</small>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header >
  );
}

export default Header
