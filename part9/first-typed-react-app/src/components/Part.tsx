import { CoursePart } from "../types";

interface PartProps {
  coursePart: CoursePart;
}

const Part = ({ coursePart: part }: PartProps) => {
  const returnValue = [
    <>
      <strong>
        {part.name} {part.exerciseCount}
      </strong>
      <br />
    </>,
  ];
  switch (part.kind) {
    case "basic": {
      returnValue.push(
        <>
          <em>{part.description}</em>
        </>
      );
      break;
    }
    case "group": {
      break;
    }
    case "background": {
      break;
    }
    default: {
      const _exhaustive: never = part;
      return _exhaustive;
    }
  }
  return <li style={{ padding: "5px", listStyle: "none" }}>{returnValue}</li>;
};

export default Part;

/*
{" "}
      {ex.name} {ex.exerciseCount}{" "}
*/
