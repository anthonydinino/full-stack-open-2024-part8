import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = () => {
  const authorQuery = useQuery(ALL_AUTHORS);
  const [bornMutation] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const authors = authorQuery.loading ? [] : authorQuery.data.allAuthors;

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <p>
        name
        <input value={name} onChange={({ target }) => setName(target.value)} />
      </p>
      <p>
        born
        <input
          type="number"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
      </p>
      <button
        onClick={() =>
          bornMutation({ variables: { name, setBornTo: Number(born) } })
        }
      >
        update author
      </button>
    </div>
  );
};

export default Authors;
