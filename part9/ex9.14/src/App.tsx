import Header from "./Header";
import CoursePart from "./CoursePart";
import { CoursePartDetails } from "./types";

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePartDetails[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  return (
    <div>
      <Header title={courseName} />
      {courseParts.map((cp) => (
        <CoursePart key={cp.name} details={cp} />
      ))}
    </div>
  );
};

export default App;
