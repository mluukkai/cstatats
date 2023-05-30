const BookList = ({ books }) => (
  <table>
    <tbody>
      <tr>
        <th></th>
        <th>author</th>
        <th>published</th>
      </tr>
      {books.map((a) => (
        <tr key={a.id}>
          <td>{a.title}</td>
          <td>{a.author.name}</td>
          <td>{a.published}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default BookList
