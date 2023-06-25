import { useContext } from "react";
import UserContext from "../reducers/UserContext";
import blogService from '../services/blogs'
import AddCommentForm from "./AddCommentForm";
import { useMutation, useQueryClient } from "react-query";

import { Paper, Text, Title, Button } from "@mantine/core";

const Blog = (props) => {
  const {blog} = props;
  const queryClient = useQueryClient();
  const [user, userActions] = useContext(UserContext);
  const removeMutation = useMutation(
    (blog) => blogService.deleteBlog(blog),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
      }
    }
  )

  const likeMutation = useMutation(
    (blog) => blogService.amendBlog({...blog, user:user.id, likes:blog.likes + 1}),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
      }
    }
  )

  const removeThis = () => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
  
    if (!confirmed) {
      return;
    }

    removeMutation.mutate(blog)
  };

  if (!blog.user) {
    return <Text>loading...</Text>
  }

  const ownsPost = blog.user && blog.user.id === user.user.id;
  const ownedStyle = { display: ownsPost ? "" : "none" };

  return (
    <Paper withBorder radius="md">
      <Text size="xl" weight={500} mt="md">
        {blog.title} {blog.author}
      </Text>

      <Text size="sm" mt="sm" color="dimmed">
        {blog.url} <br />
        likes {blog.likes}
      </Text>

      <Button
          className="like-button"
          onClick={() => likeMutation.mutate(blog)}
        >
          like
        </Button>
        <br />
        {blog.user ? blog.user.name : ""} <br />
        <Button style={ownedStyle} onClick={removeThis}>
          remove
        </Button>

        <div className="blog-comments">
        <Title order={3}>comments</Title>
        <AddCommentForm blogId={blog.id} />
        <ul>
        {blog.comments
        ? blog.comments.map((comment, index) => <li key={index}>{comment}</li>)
        : null}
        </ul>
      </div>

    </Paper>
  );
};

// Blog.propTypes = {
//   blog: propTypes.object.isRequired,
// };

export default Blog;
