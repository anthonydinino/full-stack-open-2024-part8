const BookTable = ({ books }) => {
  return books.map((a) => (
    <tr key={a.title}>
      <td>{a.title}</td>
      <td>{a.author.name}</td>
      <td>{a.published}</td>
    </tr>
  ));
};

export default BookTable;
