import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const App = () => {
  return (
    <div>
      <div>
        <Link to="/authors">
          <button>authors</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>
        <Link to="/add">
          <button>add book</button>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to={"/authors"} />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
      </Routes>
    </div>
  );
};

export default App;
