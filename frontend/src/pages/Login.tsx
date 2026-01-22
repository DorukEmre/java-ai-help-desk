import { useState } from 'react';
import axios from 'axios';
import { addBaseUrl } from '@/utils/globals';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isValidCredentials = (username: string, password: string): boolean => {
    return (username.length >= 1 && username.length <= 50
      && password.length >= 1 && password.length <= 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidCredentials(username, password)) {
      setError("Username or password not valid");
      return;
    }

    try {

      const url = addBaseUrl("/login");

      console.log("url:", url);

      const response = await axios.post(url,
        { username, password, },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },);
      console.log("Login successful:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: '600px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>

    </Container>
  );
};

export default Login;