import { CoursePart } from "./types";

interface SummaryProps {
  courseInfo: CoursePart[];
}

const Summary = (props: SummaryProps) => {
  const totalExerciseCount = props.courseInfo.reduce((count, curPart) => {
    return (count += curPart.exerciseCount);
  }, 0);

  return <p>Number of exercises {totalExerciseCount}</p>;
};

export default Summary;
