import userService from "../services/users"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UsersDisplay = (props) => {
  const {allUsersData} = props;
  

  return (
    <>
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th></th><th># blogs</th>
        </tr>
      </thead>
      <tbody>
        {allUsersData.map(user => (<tr key={user.id}>
        <td><Link to={`/users/${user.id}`}> {user.name} ({user.username})</Link></td>
        <td>{user.blogs.length}</td>
        </tr>))}
      </tbody>
    </table>
    </>
  )
}

export default UsersDisplay