import Blog from "./Blog";

const BlogList = (props) => {
    const {blogs} = props;
    const sortedBlogs = [...blogs]
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
        <h2>blogs</h2>
        {sortedBlogs.map(blog => (
            <Blog
            key={blog.id}
            blog={blog}
            />
        ))}
        </>
      )
}

export default BlogList;