import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Container, Form, Button, Spinner } from 'react-bootstrap';

import { addBaseUrl } from '@/utils/globals';
import { useAuth } from '@/auth/useAuth';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation()
  // To take the user back to where they came from after log in
  const from = location.state?.from?.pathname || '/'

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setAuthSession, isUserLoggedIn } = useAuth();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/', { state: { from: location }, replace: true });
    }
  }, [isUserLoggedIn, navigate, location]);

  const isValidCredentials = (username: string, password: string): boolean => {
    return (username.length >= 1 && username.length <= 50
      && password.length >= 1 && password.length <= 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isValidCredentials(username, password)) {
      setError("Username or password not valid");
      return;
    }

    try {

      const url = addBaseUrl("/login");

      const response = await axios.post(url,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Login successful:", response.data);

      setAuthSession(response.data);

      // Take user back where they came from
      navigate(from, { replace: true })

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Unexpected error:", error);
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: '600px' }}>

      <div>
        <p className="text-muted">
          To log in as a standard user:
          Username: standard
          Password: Standard1
        </p>
        <p className="text-muted">
          To log in as a service desk user:
          Username: service
          Password: Service1
        </p>
        <p className="text-muted">
          To log in as an admin:
          Username: admin
          Password: Admin1
        </p>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '366px' }}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          Log in{' '}
          {isLoading && (
            <>
              <Spinner as="span"
                animation="border" size="sm" role="status" aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          )}
        </Button>
      </Form>

    </Container>
  );
};

export default Login;