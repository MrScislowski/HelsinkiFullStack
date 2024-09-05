import { Link } from "react-router-dom";
import useUsersQuery from "./useUsersQuery";

const UserList = () => {
  const usersQuery = useUsersQuery();

  const users = usersQuery.data || [];

  return (
    <>
      <h2 className="text-lg font-semibold">Users</h2>
      <table className="table-auto border-2">
        <thead>
          <tr>
            <th className="px-2 text-left font-medium">Name</th>
            <th className="px-2 text-left font-medium"># blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserList;

const UserRow = ({ user }) => {
  return (
    <tr>
      <td className="px-2 text-left">
        <Link
          className="text-blue-500 underline underline-offset-2"
          to={`/users/${user.id}`}
        >
          {user.name}
        </Link>
      </td>
      <td className="px-2 text-left">{user.blogs.length}</td>
    </tr>
  );
};
