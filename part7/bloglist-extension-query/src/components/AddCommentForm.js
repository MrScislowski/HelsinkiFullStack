import { useState } from "react";
import blogService from "../services/blogs";
import { useQueryClient, useMutation } from "react-query";
import { TextInput, Button } from "@mantine/core";

const AddCommentForm = (props) => {
  const [newComment, setNewComment] = useState("");
  const { blogId } = props;

  const queryClient = useQueryClient();
  const newCommentMutation = useMutation(
    (args) => {
        const {blogId, comment} = args;
        // only if it returns something is the mutation considered "successful" which leads to the onSuccess callback firing
        return blogService.addCommentToBlog(blogId, comment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("blogs");
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    newCommentMutation.mutate({blogId: blogId, comment: newComment});
    setNewComment("");
  };

  return (
    <form>
      <TextInput value={newComment} onChange={(e) => {setNewComment(e.target.value)} }/>
      <Button type="submit" onClick={(event) => handleSubmit(event)}>Add comment</Button>
    </form>
  );
};

export default AddCommentForm;
