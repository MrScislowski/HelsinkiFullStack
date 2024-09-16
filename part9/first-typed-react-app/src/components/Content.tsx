import { Exercise } from "../types";

interface ContentProps {
  courseParts: Exercise[];
}

const Content = (props: ContentProps) => {
  return props.courseParts.map((ex) => (
    <p key={ex.name}>
      {" "}
      {ex.name} {ex.exerciseCount}{" "}
    </p>
  ));
};

export default Content;
