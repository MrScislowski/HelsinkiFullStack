import { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from "../queries";

const EditAuthor = (props) => {
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors[0].message;
      console.log(messages);
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name: author, bornYear: Number(year) } });
    setAuthor("");
    setYear("");
  };

  return (
    <>
      <form onSubmit={submit}>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="author"
        />
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
