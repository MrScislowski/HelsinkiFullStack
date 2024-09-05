import { useParams } from "react-router-dom";
import useBlogsQuery from "./useBlogsQuery";
import useLikeMutation from "./useLikeMutation";
import { useMutation, useQueryClient } from "react-query";
import blogsService from "../services/blogs";

const BlogDetails = () => {
  const id = useParams().id;
  const { data: blogs, isFetched } = useBlogsQuery();
  const likeMutation = useLikeMutation();

  if (!isFetched) return null;

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
          <button
            className="rounded-lg bg-green-200 p-1 hover:bg-green-300"
            onClick={() => likeMutation.mutate(blog)}
          >
            +
          </button>
        </li>
        <li>added by {blog.user.name}</li>

        <li>
          <h3 className="text-lg font-semibold text-slate-600">comments:</h3>
        </li>
        <li className="ml-4">
          <NewCommentForm blog={blog} />
        </li>
        <li className="ml-4">
          <ul className="text-slate-400">
            {blog.comments.map((c, index) => (
              <li key={index}>{c}</li>
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
        commentData.comment,
      );
      queryClient.setQueriesData(["blogs"], (initial) =>
        initial.map((b) =>
          b.id === blog.id ? { ...response, user: b.user } : b,
        ),
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
      <input
        className="border-2 border-double border-slate-300"
        name="comment"
        type="text"
      />
      <button
        className="rounded-md bg-slate-200 p-1 hover:bg-slate-300"
        type="submit"
      >
        add
      </button>
    </form>
  );
};

export default BlogDetails;
