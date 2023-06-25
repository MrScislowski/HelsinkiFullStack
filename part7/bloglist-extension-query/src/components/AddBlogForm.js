import { useState, useContext } from "react";
import DisplayContext from "../reducers/displayContext";
import { useMutation, useQueryClient } from "react-query";
import blogService from "../services/blogs";
import { Button, TextInput, Title } from "@mantine/core";

const useField = (name) => {
  const [fieldValue, setFieldValue] = useState("");

  return {
    name,
    // type: "text",
    label: name,
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
      
      <Button onClick={displayState.showAddForm}>
        add new blog
      </Button>
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
      <Title order={2} >create new</Title>
      <Button onClick={displayState.hideAddForm}>
        hide
      </Button>
      <form onSubmit={handleCreateNewBlog}>
        {formElements.map((el) => (
          <TextInput key={el.name} {...el} />
        ))}
        <Button className="add-blog-form-button" type="submit">
          create
        </Button>
      </form>
    </>
  );
};

export default AddBlogForm;
