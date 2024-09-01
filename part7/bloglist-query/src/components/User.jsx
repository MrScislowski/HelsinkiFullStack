import { useParams } from "react-router-dom";
import useUsersQuery from "./useUsersQuery";

const User = () => {
  const { id } = useParams();

  const usersQuery = useUsersQuery();

  const user = usersQuery.data
    ? usersQuery.data.find((u) => u.id === id)
    : null;

  if (user === null) return [];

  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </>
  );
};

export default User;
