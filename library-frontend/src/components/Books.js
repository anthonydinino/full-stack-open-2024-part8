import { useQuery } from "@apollo/client";
import { ALL_BOOKS_GENRE, ALL_GENRES } from "../queries";
import { useEffect, useState } from "react";
import BookTable from "./BookTable";

const Books = ({ errorState: [error, setError] }) => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);

  const booksQuery = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre },
  });

  const genresQuery = useQuery(ALL_GENRES);

  useEffect(() => {
    const { loading, data } = genresQuery;
    if (!loading && data && data.allBooks) {
      const flattenedGenres = data.allBooks.map((book) => book.genres).flat();
      setGenres([...new Set(flattenedGenres)]);
    }
  }, [genresQuery]);

  useEffect(() => {
    const { loading, data } = booksQuery;
    if (!loading && data && data.allBooks) {
      setBooks(data.allBooks);
    }
  }, [booksQuery]);

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
          <BookTable books={books} />
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
