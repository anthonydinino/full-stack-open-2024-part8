import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";
import BookTable from "./BookTable";

const Recommend = ({ errorState: [error, setError] }) => {
  const meQuery = useQuery(ME);
  const bookQuery = useQuery(ALL_BOOKS);

  if (meQuery.loading || bookQuery.loading) {
    return <p>...loading</p>;
  }

  const books = bookQuery.data.allBooks;
  const favoriteGenre = meQuery.data?.me?.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          <BookTable books={books} genre={favoriteGenre} />
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
