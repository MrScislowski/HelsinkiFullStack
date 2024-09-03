import { useQuery } from "react-query";
import blogsService from "../services/blogs";

const useBlogsQuery = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      return await blogsService.getAll();
    },
  });
};

export default useBlogsQuery;
