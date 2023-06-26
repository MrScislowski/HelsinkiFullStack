import { Link } from "react-router-dom";
import { Table, Title } from "@mantine/core";

const UsersDisplay = (props) => {
  const {allUsersData} = props;
  

  return (
    <>
    <Title order={2}>Users</Title>
    <Table>
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
    </Table>
    </>
  )
}

export default UsersDisplay