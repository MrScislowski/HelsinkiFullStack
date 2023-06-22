import { useState, useContext } from "react";
import UserContext from "../reducers/UserContext";
import propTypes from "prop-types";
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from "react-query";

const Blog = (props) => {
  console.log("props passed to Blog are: ");
  console.dir(props);
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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

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
    console.log("returning early because blog.user is undefined")
    return <div>loading...</div>
  }

  const ownsPost = blog.user && blog.user.id === user.user.id;
  const ownedStyle = { display: ownsPost ? "" : "none" };

  return (
    <div style={blogStyle}>
      <div className="basic-blog-content">
        {blog.title} {blog.author}{" "}
      </div>
      <div className="detailed-blog-content" >
        {blog.url} <br />
        likes {blog.likes}{" "}
        <button
          className="like-button"
          onClick={() => likeMutation.mutate(blog)}
        >
          like
        </button>
        <br />
        {blog.user ? blog.user.name : ""} <br />
        <button style={ownedStyle} onClick={removeThis}>
          remove
        </button>
      </div>
    </div>
  );
};

// Blog.propTypes = {
//   blog: propTypes.object.isRequired,
// };

export default Blog;
