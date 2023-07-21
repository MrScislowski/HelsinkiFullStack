import Header from "./Header";
import Content from "./Content";
import { courseParts } from "./types";
import Summary from "./Summary";

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header title={courseName} />
      <Content parts={courseParts} />
      <Summary courseInfo={courseParts} />
    </div>
  );
};

export default App;
