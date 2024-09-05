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
      <h2 className="text-lg font-semibold">{user.name}</h2>
      {user.blogs.length === 0 ? null : (
        <>
          <h3 className="pl-2 text-base font-medium">added blogs: </h3>
          <ul className="list-inside list-disc pl-4 text-slate-500">
            {user.blogs.map((blog) => {
              return <li key={blog.id}>{blog.title}</li>;
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default User;
