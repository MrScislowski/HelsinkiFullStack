import { useState, useContext } from "react";
import DisplayContext from "../reducers/displayContext";
import { useMutation, useQueryClient } from "react-query";
import blogService from "../services/blogs";

const useField = (name) => {
  const [fieldValue, setFieldValue] = useState("");

  return {
    name,
    type: "text",
    value: fieldValue,
    placeholder: name,
    onChange: ({ target }) => setFieldValue(target.value),
  };
};

const AddBlogForm = (props) => {
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation(
    (newBlog) => blogService.postBlog(newBlog),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("blogs");
      },
    }
  );

  const displayState = useContext(DisplayContext);

  const visible = displayState.display.addForm;

  const formElements = [useField("title"), useField("author"), useField("url")];

  if (!visible)
    return (
      <button onClick={displayState.showAddForm}>
        add new blog
      </button>
    );

  const handleCreateNewBlog = async (event) => {
    event.preventDefault();
    const blogFormContents = formElements.reduce((acc, curField) => {
      acc[curField.name] = curField.value;
      return acc;
    }, {});
    const blogObject = {
      ...blogFormContents,
      likes: 0,
    };
    newBlogMutation.mutate(blogObject);
    formElements.forEach((el) => el.onChange({ target: { value: "" } }));
    displayState.hideAddForm();
  };

  return (
    <>
      <h2>create new</h2>
      <button onClick={displayState.hideAddForm}>
        hide
      </button>
      <form onSubmit={handleCreateNewBlog}>
        {formElements.map((el) => (
          <div key={el.name}>
            {el.name}: <input {...el} />
          </div>
        ))}
        <button className="add-blog-form-button" type="submit">
          create
        </button>
      </form>
    </>
  );
};

export default AddBlogForm;
