import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from "../queries";

const EditAuthor = (props) => {
  const [author, setAuthor] = useState("select");
  const [year, setYear] = useState("");
  const [authors, setAuthors] = useState([]);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors[0].message;
      console.log(messages);
    },
  });

  const authorsResponse = useQuery(ALL_AUTHORS, {
    skip: authors.length > 0,
    onCompleted: (data) => {
      setAuthors(data.allAuthors.map((au) => au.name));
      setAuthor(authors[0]);
    },
  });

  if (!props.show) {
    return null;
  }

  if (authorsResponse.loading) {
    return <div>loading...</div>;
  }

  if (authorsResponse.error) {
    return <div> error </div>;
  }

  const submit = (event) => {
    event.preventDefault();
    console.log("about to run edit author");
    editAuthor({ variables: { name: author, bornYear: Number(year) } });
    setAuthor("");
    setYear("");
  };

  return (
    <>
      <form onSubmit={submit}>
        <select value={author} onChange={(e) => setAuthor(e.target.value)}>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="year"
        />
        <button type="submit">Submit Changes</button>
      </form>
    </>
  );
};

export default EditAuthor;
