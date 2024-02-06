import { useQuery } from "@apollo/client";
import { ALL_BOOKS_GENRE, ALL_GENRES } from "../queries";
import { useEffect, useState } from "react";
import BookTable from "./BookTable";

const Books = () => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);

  const {
    loading: booksLoading,
    data: booksData,
    refetch: booksRefetch,
  } = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre },
  });

  const { loading: genresLoading, data: genresData } = useQuery(ALL_GENRES);

  useEffect(() => {
    if (!genresLoading && genresData && genresData.allBooks) {
      const flattenedGenres = genresData.allBooks
        .map((book) => book.genres)
        .flat();
      setGenres([...new Set(flattenedGenres)]);
    }
  }, [genresLoading, genresData]);

  useEffect(() => {
    if (!booksLoading && booksData && booksData.allBooks) {
      setBooks(booksData.allBooks);
    }
  }, [booksLoading, booksData]);

  useEffect(() => {
    booksRefetch();
  }, [genre, booksRefetch]);

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
