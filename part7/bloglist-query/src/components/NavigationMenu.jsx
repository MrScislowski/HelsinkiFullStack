import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";

const NavigationMenu = () => {
  return (
    <nav style={{ backgroundColor: "lightgrey" }}>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <li>
          <Link to="/">blogs</Link>
        </li>
        <li>
          <Link to="/users">users</Link>
        </li>
        <li>
          <UserInfo />
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
