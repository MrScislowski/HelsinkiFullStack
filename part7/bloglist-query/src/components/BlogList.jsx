import Blog from "./Blog";
import { useQuery, useQueryClient } from "react-query";
import blogService from "../services/blogs";

const BlogList = () => {
  const blogsQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const result = await blogService.getAll();
      return result;
    },
    refetchOnWindowFocus: false,
  });

  const blogs = blogsQuery.isSuccess ? blogsQuery.data : [];

  return (
    <div id="blog-list" data-testid="blog-list">
      <h2 className="text-2xl font-semibold">blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
