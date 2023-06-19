import blogService from "../services/blogs";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";

const ClearDBButton = (props) => {
  const queryClient = useQueryClient();

  const removeAllBlogs = useMutation(
    () => blogService.deleteAllBlogs(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
      }
    }
  )

  const doDeleteAll = () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ALL BLOGS?`
    );
  
    if (!confirmed) {
      return;
    }

    removeAllBlogs.mutate()
  }

  return (<>
  <button onClick={doDeleteAll}> DELETE ALL BLOGS </button>
  </>)
}

export default ClearDBButton;