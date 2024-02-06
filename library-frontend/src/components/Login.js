import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { LOGIN } from "../queries";

const Login = ({ setToken, errorState: [error, setError] }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data, setToken]);

  const loginApp = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { username, password } });
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div>
      {error ? <p style={{ color: "red" }}>{error}</p> : <></>}
      <h1>Login</h1>
      <p>Welcome to the library app</p>
      <form onSubmit={loginApp}>
        name
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
