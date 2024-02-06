import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS_GENRE, ME } from "../queries";
import BookTable from "./BookTable";

const Recommend = ({ errorState: [error, setError] }) => {
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);

  const { loading: meLoading, data: meData } = useQuery(ME);
  const { loading: booksLoading, data: booksData } = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre },
    skip: !genre,
  });

  useEffect(() => {
    if (!meLoading && meData && meData.me) {
      setGenre(meData.me.favoriteGenre);
    }
  }, [meLoading, meData]);

  useEffect(() => {
    if (!booksLoading && booksData && booksData.allBooks) {
      setBooks(booksData.allBooks);
    }
  }, [booksLoading, booksData]);

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{genre}</b>
      </p>
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
    </div>
  );
};

export default Recommend;
