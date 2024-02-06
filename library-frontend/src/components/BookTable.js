const BookTable = ({ books, genre }) => {
  return books
    .filter((book) => (genre ? book.genres.includes(genre) : book))
    .map((a) => (
      <tr key={a.title}>
        <td>{a.title}</td>
        <td>{a.author.name}</td>
        <td>{a.published}</td>
      </tr>
    ));
};

export default BookTable;
