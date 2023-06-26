import { Link } from "react-router-dom";
import { List, Title } from "@mantine/core";

const BlogList = (props) => {
  const { blogs } = props;

  const sortedBlogs = [...blogs];
  sortedBlogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return 1;
    } else if (a.likes < b.likes) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <>
      <Title order={2} >blogs</Title>
      <List icon={""} withPadding>
        {sortedBlogs.map((blog) => (
          <List.Item  key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default BlogList;
