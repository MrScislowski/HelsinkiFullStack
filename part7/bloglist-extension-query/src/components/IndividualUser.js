import { Link } from "react-router-dom";
import { List, Text, Title } from "@mantine/core"

const IndividualUser = (props) => {
  const { user } = props;

  return (
    <>
      <Title order={2}>{user.name}</Title>
      <Text>username: {user.username}</Text>
      <Title order={3}>blogs</Title>
      <List>
        {user.blogs.map((blog) => {
          return (
            <List.Item key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

export default IndividualUser;
