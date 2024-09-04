import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";

const NavigationMenu = () => {
  return (
    <nav className="border-b-4 py-2">
      <ul className="list-none">
        <li className="inline-block rounded-lg px-4 py-2 text-sky-800 hover:bg-slate-100 hover:text-sky-400 hover:underline">
          <Link to="/">blogs</Link>
        </li>
        <li className="inline-block rounded-lg px-4 py-2 text-sky-800 hover:bg-slate-100 hover:text-sky-400 hover:underline">
          <Link to="/users">users</Link>
        </li>
        <li className="inline-block px-4">
          <UserInfo />
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
