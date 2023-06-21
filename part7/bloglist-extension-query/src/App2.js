import { NotificationContext} from "./reducers/NotificationContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const App2 = (props) => {

//   const [usersData, setUsersData] = useState([]);

//   useEffect(() => {
//     const getUsersData = async () => {
//       const theData = await axios.get("http://localhost:3003/api/users")
//       console.log("just got this data: ")
//       console.dir(theData)
//       setUsersData(theData.data);
//     }

//     getUsersData();
//   }, [])

//   return (
//     <>
//     <table>
//       <thead>
//         <tr>
//           <th></th> <th># blogs</th>
//         </tr>
//       </thead>
//       <tbody>
//         {usersData.map(user => (<tr key={user.id}>
//         <td>{user.name} ({user.username})</td>
//         <td>{user.blogs.length}</td>
//         </tr>))}
//       </tbody>
//     </table>
//     </>
//   )
// }

export default App2;