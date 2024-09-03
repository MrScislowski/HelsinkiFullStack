import { useParams } from "react-router-dom";
import useBlogsQuery from "./useBlogsQuery";
import useLikeMutation from "./useLikeMutation";

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

        {blog.comments.length > 0 ? (
          <>
            <li>
              <h3>comments:</h3>
            </li>
            <li>
              <ul>
                {blog.comments.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </li>
          </>
        ) : null}
      </ul>
    </>
  );
};

export default BlogDetails;
