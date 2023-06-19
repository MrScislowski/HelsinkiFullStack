import blogService from "../services/blogs";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";

const LoadInitialBlogsButton = (props) => {
  const queryClient = useQueryClient();

  const addInitialBlogs = useMutation(
    () => blogService.loadInitialBlogs(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
      }
    }
  )

  return (<>
  <button onClick={() => addInitialBlogs.mutate()}> Add Initial Data </button>
  </>)
}

export default LoadInitialBlogsButton;