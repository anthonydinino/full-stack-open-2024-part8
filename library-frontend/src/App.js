import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import Recommend from "./components/Recommend";

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    token && setToken(token);
  }, []);

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login setToken={setToken} errorState={[error, setError]} />}
        />
        <Route path="/" element={<Navigate to={"/login"} />} />
      </Routes>
    );
  }
  return (
    <div>
      <Navbar setToken={setToken} />
      {error ? <p style={{ color: "red" }}>{error}</p> : <></>}
      <Routes>
        <Route path="/login" element={<Navigate to={"/authors"} />} />
        <Route path="/authors" element={<Authors setError={setError} />} />
        <Route path="/books" element={<Books setError={setError} />} />
        <Route path="/add" element={<NewBook setError={setError} />} />
        <Route path="/recommend" element={<Recommend setError={setError} />} />
        <Route path="/" element={<Navigate to={"/authors"} />} />
      </Routes>
    </div>
  );
};

export default App;
