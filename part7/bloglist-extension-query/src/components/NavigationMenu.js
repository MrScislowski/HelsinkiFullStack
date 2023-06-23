import { Link } from "react-router-dom";
import LoginStatusDisplay from "./LoginStatusDisplay";  

const NavigationMenu = (props) => {

  return (
    <nav style={{display: "flex", flexDirection: "row", gap:"10px"}}>
    <Link to='/blogs'> blogs </Link>
    <Link to='/users'> users </Link>
    <LoginStatusDisplay />
    </nav>
  )

}

export default NavigationMenu;