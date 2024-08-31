import { useEffect, useState } from "react";
import usersService from "../services/users";
import { useQuery } from "react-query";

const UserList = () => {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await usersService.getAll();
    },
  });

  const users = usersQuery.data || [];

  return (
    <>
      <h2>Users</h2>
      <table>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {users.map((u) => (
          <tr>
            <td>{u.name}</td> <td>{u.blogs.length}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default UserList;

/*
const hi = [
  {
    username: "root",
    name: "David Brent",
    blogs: [
      {
        title: "My first day with react",
        author: "Dennis Ritchie",
        url: "https://react-is-powerful.com",
        id: "66c36a6c35d8423a71a33ff9",
      },
      {
        title: "My second day",
        author: "Brian Kernighan",
        url: "www.example.com",
        id: "66c36ccafc26d492bceb1b19",
      },
    ],
    id: "66be5bd43c4532ff5ba7e694",
  },
  {
    username: "nonroot",
    name: "Finchy",
    blogs: [
      {
        title: "asdf",
        author: "213radsf",
        url: "asdfas",
        id: "66d09a2f32786097fc85b131",
      },
      {
        title: "dsalkjdfsa",
        author: "dsf23f3",
        url: "asdfwdaf",
        id: "66d09b0a32786097fc85b142",
      },
      {
        title: "asdfas",
        author: "afsd",
        url: "asdf",
        id: "66d0ca3b32786097fc85b18c",
      },
      {
        title: "abc",
        author: "abc",
        url: "abc",
        id: "66d0ca4332786097fc85b191",
      },
      {
        title: "def",
        author: "def",
        url: "def",
        id: "66d0cabb329b59a3c36de9d8",
      },
    ],
    id: "66c36dbafc26d492bceb1b23",
  },
];
*/
