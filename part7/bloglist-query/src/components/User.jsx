import useUsersQuery from "./useUsersQuery";
import { useParams } from "react-router-dom";

const User = () => {
  const { data: users } = useUsersQuery();
  const id = useParams().id;

  if (!users) return null;

  const user = users.find((user) => user.id === id);

  if (!user) return null;

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
