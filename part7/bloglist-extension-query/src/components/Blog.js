import { useState, useContext } from "react";
import UserContext from "../reducers/UserContext";
import propTypes from "prop-types";
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from "react-query";

const Blog = ({ blog }) => {
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

  const [detailsShown, setDetailsShown] = useState(false);

  const toggleVisibility = () => {
    setDetailsShown(!detailsShown);
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

  const showWhenVisible = { display: detailsShown ? "" : "none" };

  const buttonText = detailsShown ? "hide" : "view";

  const ownsPost = blog.user && blog.user.id === user.user.id;
  const ownedStyle = { display: ownsPost ? "" : "none" };

  return (
    <div style={blogStyle}>
      <div className="basic-blog-content">
        {blog.title} {blog.author}{" "}
        <button className="visibility-button" onClick={toggleVisibility}>
          {buttonText}
        </button>
      </div>
      <div className="detailed-blog-content" style={showWhenVisible}>
        {blog.url} <br />
        likes {blog.likes}{" "}
        <button
          className="like-button"
          onClick={() => likeMutation.mutate(blog)}
        >
          like
        </button>{" "}
        <br />
        {blog.user ? blog.user.name : ""} <br />
        <button style={ownedStyle} onClick={removeThis}>
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: propTypes.object.isRequired,
};

export default Blog;
