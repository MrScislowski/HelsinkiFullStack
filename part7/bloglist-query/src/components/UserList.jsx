import { Link, Route, Routes, useMatch } from "react-router-dom";
import User from "./User";
import useUsersQuery from "./useUsersQuery";

const UserList = () => {
  const usersQuery = useUsersQuery();
  const match = useMatch("/users/:id");

  const users = usersQuery.data || [];
  const chosenUser =
    match && usersQuery.data
      ? users.find((u) => u.id === match.params.id)
      : null;

  const usersList = () => {
    return (
      <>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/:id" element={<User user={chosenUser} />} />
      <Route path="/" element={usersList()} />
    </Routes>
  );
};

export default UserList;

const UserRow = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};
