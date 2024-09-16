import { CoursePart } from "../types";
import Part from "./Part";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  return (
    <ul>
      {props.courseParts.map((part) => (
        <Part key={part.name} coursePart={part} />
      ))}
    </ul>
  );
};

export default Content;
