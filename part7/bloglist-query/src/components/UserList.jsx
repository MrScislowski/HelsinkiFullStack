import { useEffect, useState } from "react";
import usersService from "../services/users";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

const UserList = () => {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await usersService.getAll();
    },
  });

  const users = usersQuery.data || [];

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
