import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";

const NavigationMenu = () => {
  return (
    <nav class="border-b-4 py-2">
      <ul class="list-none">
        <li class="inline-block rounded-lg px-4 text-sky-800 hover:bg-slate-100 hover:text-sky-400 hover:underline">
          <Link to="/">blogs</Link>
        </li>
        <li class="inline-block rounded-lg px-4 text-sky-800 hover:bg-slate-100 hover:text-sky-400 hover:underline">
          <Link to="/users">users</Link>
        </li>
        <li class="inline-block px-4">
          <UserInfo />
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
