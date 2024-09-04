import { useParams } from "react-router-dom";
import useBlogsQuery from "./useBlogsQuery";
import useLikeMutation from "./useLikeMutation";
import { useMutation, useQueryClient } from "react-query";
import blogsService from "../services/blogs";

const BlogDetails = () => {
  const id = useParams().id;
  const { data: blogs } = useBlogsQuery();
  const likeMutation = useLikeMutation();

  if (!blogs) return null;

  const blog = blogs.find((b) => b.id === id);

  return (
    <>
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <ul style={{ listStyleType: "none" }}>
        <li>
          <a href={blog.url}>{blog.url}</a>
        </li>
        <li>
          {blog.likes} likes
          <button onClick={() => likeMutation.mutate(blog)}>like</button>
        </li>
        <li>added by {blog.user.name}</li>

        <li>
          <h3>comments:</h3>
        </li>
        <li>
          <NewCommentForm blog={blog} />
        </li>
        <li>
          <ul>
            {blog.comments.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
};

const NewCommentForm = ({ blog }) => {
  const queryClient = useQueryClient();
  const addCommentMutation = useMutation({
    mutationKey: ["addComment"],
    mutationFn: async (commentData) => {
      const response = await blogsService.commentOnBlog(
        blog,
        commentData.comment
      );
      queryClient.setQueriesData(["blogs"], (initial) =>
        initial.map((b) =>
          b.id === blog.id ? { user: b.user, ...response } : b
        )
      );
    },
  });

  const handleAddComment = (event) => {
    event.preventDefault();
    addCommentMutation.mutate({ comment: event.target.comment.value });
    event.target.comment.value = "";
  };

  return (
    <form onSubmit={handleAddComment}>
      <input name="comment" type="text" />
      <button type="submit">add comment</button>
    </form>
  );
};

export default BlogDetails;
