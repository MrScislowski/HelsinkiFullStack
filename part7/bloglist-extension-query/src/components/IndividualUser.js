import { Link } from "react-router-dom";

const IndividualUser = (props) => {
  const { user } = props;

  return (
    <>
      <h2>{user.name}</h2>
      <p>username: {user.username}</p>
      <h3>blogs</h3>
      <ul>
        {user.blogs.map((blog) => {
          return (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default IndividualUser;
