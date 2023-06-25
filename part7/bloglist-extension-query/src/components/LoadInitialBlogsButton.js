import blogService from "../services/blogs";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { Button } from "@mantine/core";


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
  <Button onClick={() => addInitialBlogs.mutate()}> Add Initial Data </Button>
  </>)
}

export default LoadInitialBlogsButton;