import { useMutation, useQuery } from "@apollo/client";
import queries from "./queries";
import { useState } from "react";
import mutations from "./mutations";

const Authors = ({ show, user }) => {
  const authorsQuery = useQuery(queries.GET_ALL_AUTHORS);

  if (!show) {
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

      {user && <BirthyearForm />}
    </div>
  );
};

const BirthyearForm = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [editBirthyearMutation] = useMutation(mutations.EDIT_AUTHOR_BIRTHYEAR, {
    refetchQueries: [{ query: queries.GET_ALL_AUTHORS }],
  });
  const authorsQuery = useQuery(queries.GET_ALL_AUTHORS);

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

  const authors = authorsQuery.data ? authorsQuery.data.allAuthors : [];

  return (
    <>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">name</label>
        <select
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          {authors.map((a) => (
            <option value={a.name} key={a.name}>
              {a.name}
            </option>
          ))}
          <option value=""></option>
        </select>
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
