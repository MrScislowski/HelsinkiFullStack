import { useState } from "react";
import blogService from "../services/blogs";
import { useQueryClient, useMutation } from "react-query";

const AddCommentForm = (props) => {
  const [newComment, setNewComment] = useState("");
  const { blogId } = props;

  const queryClient = useQueryClient();
  const newCommentMutation = useMutation(
    (args) => {
        const {blogId, comment} = args;
        blogService.addCommentToBlog(blogId, comment)
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
      <input type="text" value={newComment} onChange={(e) => {setNewComment(e.target.value)} }/>
      <button type="submit" onClick={(event) => handleSubmit(event)}>Add comment</button>
    </form>
  );
};

export default AddCommentForm;
