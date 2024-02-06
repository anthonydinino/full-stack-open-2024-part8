import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = () => {
  const authorQuery = useQuery(ALL_AUTHORS);
  const [bornMutation] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const authors = authorQuery.loading ? [] : authorQuery.data.allAuthors;

  const setBorn = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const setBornTo = Number(e.target.elements.born.value);
    bornMutation({
      variables: { name, setBornTo },
    });
  };

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
      <form onSubmit={setBorn} id="setBornForm">
        <select name="name" form="setBornForm">
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <p>
          born
          <input form="setBornForm" type="number" name="born" />
        </p>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
