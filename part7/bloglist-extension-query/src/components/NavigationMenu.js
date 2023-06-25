import { Link } from "react-router-dom";
import LoginStatusDisplay from "./LoginStatusDisplay";
import { Text } from "@mantine/core";

const NavigationMenu = (props) => {

  return (
    <nav style={{display: "flex", flexDirection: "row", gap:"10px"}}>
    <Link to='/blogs'> <Text>blogs</Text>  </Link> 
    <Link to='/users'> <Text>users</Text> </Link> 
    <LoginStatusDisplay />
    </nav>
  )

}

export default NavigationMenu;