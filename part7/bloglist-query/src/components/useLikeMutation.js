import { useQueryClient, useMutation } from "react-query";
import {
  setInfoNotification,
  useNotificationDispatch,
  clearNotification,
} from "../NotificationContext";
import blogsService from "../services/blogs";

const useLikeMutation = () => {
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationKey: ["likeBlog"],
    mutationFn: async (blog) => {
      const result = await blogsService.putAmended({
        ...blog,
        likes: blog.likes + 1,
      });
      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["blogs"], (blogs) =>
        blogs
          .map((b) => (b.id === result.id ? { ...result, user: b.user } : b))
          .sort((b1, b2) => b2.likes - b1.likes)
      );
      notificationDispatch(setInfoNotification(`"${result.title}" liked`));
      setTimeout(() => notificationDispatch(clearNotification()), 3000);
    },
  });
  return likeMutation;
};

export default useLikeMutation;
