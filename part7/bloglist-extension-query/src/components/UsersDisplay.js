import userService from "../services/users"
import { useState, useEffect } from "react";

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
        {usersData.map(user => (<tr key={user.id}>
        <td>{user.name} ({user.username})</td>
        <td>{user.blogs.length}</td>
        </tr>))}
      </tbody>
    </table>
    </>
  )
}

export default UsersDisplay