import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Container, Form } from 'react-bootstrap';

import { ErrorMessage } from '@/components/ErrorMessage';

import { addBaseUrl } from '@/utils/globals';
import { useAuth } from '@/auth/useAuth';
import { RequestButton } from '@/components/RequestButton';


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
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
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
    <Container fluid className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: '366px' }}>

      <div className='small'>
        <p className="text-muted">Demo Login Credentials</p>
        <ul className="text-muted">
          <li>
            <p className='fw-bold'>Standard User:</p>
            <ul>
              <li className='ms-4'>Username: <code>standard</code></li>
              <li className='ms-4'>Password: <code>Standard1</code></li>
            </ul>
          </li>
          <li>
            <p className='fw-bold'>Agent:</p>
            <ul>
              <li className='ms-4'>Username: <code>agent</code></li>
              <li className='ms-4'>Password: <code>Agent1</code></li>
            </ul>
          </li>
          <li>
            <p className='fw-bold'>Admin:</p>
            <ul>
              <li className='ms-4'>Username: <code>admin</code></li>
              <li className='ms-4'>Password: <code>Admin1</code></li>
            </ul>
          </li>
        </ul>
      </div>

      <ErrorMessage error={error} />

      <Form onSubmit={handleSubmit} className="w-100">
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

        <RequestButton
          variant="primary"
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          style={{ width: "105px" }}
        >
          Log in
        </RequestButton>

      </Form>

    </Container>
  );
};

export default Login;