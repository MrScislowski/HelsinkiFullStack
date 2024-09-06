import { useMutation, useQuery } from "@apollo/client";
import queries from "./queries";
import { useState } from "react";
import mutations from "./mutations";

const Authors = (props) => {
  const authorsQuery = useQuery(queries.GET_ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (!authorsQuery.data) {
    return <div>No author data received...</div>;
  }

  const authors = authorsQuery.data.allAuthors;

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

      <BirthyearForm />
    </div>
  );
};

const BirthyearForm = () => {
  const [editBirthyearMutation] = useMutation(mutations.EDIT_AUTHOR_BIRTHYEAR, {
    refetchQueries: [{ query: queries.GET_ALL_AUTHORS }],
  });
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    editBirthyearMutation({
      variables: {
        name,
        year: Number(year),
      },
    });
    setName("");
    setYear("");
  };

  return (
    <>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <br />
        <label htmlFor="year">born</label>
        <input
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          type="text"
        />
        <br />
        <button type="submit">update author</button>
      </form>
    </>
  );
};

export default Authors;
