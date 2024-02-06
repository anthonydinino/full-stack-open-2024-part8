import { useApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const client = useApolloClient();

  const logout = () => {
    client.resetStore();
    localStorage.clear();
    setToken(null);
  };

  return (
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
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Navbar;
