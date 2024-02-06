import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useEffect, useState } from "react";
import BookTable from "./BookTable";

const Books = ({ errorState: [error, setError] }) => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);
  const result = useQuery(ALL_BOOKS, {
    onCompleted: () => {
      setBooks(result.data.allBooks);
    },
  });

  useEffect(() => {
    setGenres(
      Array.from(
        new Set(
          books
            .map((book) => book.genres)
            .reduce((a, c) => {
              return c.concat([...a]);
            }, [])
        )
      )
    );
  }, [books]);

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          <BookTable books={books} genre={genre} />
        </tbody>
      </table>
      {genres ? (
        genres.map((genre, i) => (
          <button key={i} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))
      ) : (
        <p>No genres</p>
      )}
      <button onClick={() => setGenre("")}>all genres</button>
    </div>
  );
};

export default Books;
