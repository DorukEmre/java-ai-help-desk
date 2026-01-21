import { useState } from 'react';
import axios from 'axios';
import { addBaseUrl } from '@/utils/globals';

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
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;