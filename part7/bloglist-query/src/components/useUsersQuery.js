import { useQuery } from "react-query";
import usersService from "../services/users";

const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await usersService.getAll();
    },
  });
};

export default useUsersQuery;
