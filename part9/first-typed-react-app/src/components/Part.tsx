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
      returnValue.push(<em>{part.description}</em>);
      break;
    }
    case "group": {
      returnValue.push(
        <span>project exercises: {part.groupProjectCount}</span>
      );
      break;
    }
    case "background": {
      returnValue.push(<span>{part.backgroundMaterial}</span>);
      break;
    }
    case "special": {
      returnValue.push(
        <>
          <em>{part.description}</em> <br />
          <span>Required skills: {part.requirements.join(", ")}</span>
        </>
      );
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
