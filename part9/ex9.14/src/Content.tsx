import { CoursePart } from "./types";
import Part from "./Part";

interface CoursePartProps {
  parts: CoursePart[];
}

const Content = (props: CoursePartProps) => {
  return (
    <>
      {props.parts.map((part) => (
        <Part details={part} key={part.name} />
      ))}
    </>
  );
};

export default Content;
