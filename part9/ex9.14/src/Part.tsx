import { CoursePart } from "./types";

interface PartProps {
  details: CoursePart;
}

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface DescriptionProps {
  text: string;
}

const Description = (props: DescriptionProps) => {
  return (
    <div>
      <em>{props.text}</em>
    </div>
  );
};

interface TitleProps {
  title: string;
  exerciseCount: number;
}

const Title = (props: TitleProps) => {
  return (
    <h2>
      {props.title} {props.exerciseCount}
    </h2>
  );
};

interface BackgroundProps {
  background: string;
}

const Background = (props: BackgroundProps) => {
  return <>{props.background}</>;
};

interface GroupProps {
  groupProjects: number;
}

const Group = (props: GroupProps) => {
  return <>Group project count: {props.groupProjects}</>;
};

interface RequirementsProps {
  requirements: string[];
}

const Requirements = (props: RequirementsProps) => {
  return <>required skills: {props.requirements.join(", ")}</>;
};

const Part = (props: PartProps) => {
  switch (props.details.kind) {
    case "basic":
      return (
        <>
          <Title
            title={props.details.name}
            exerciseCount={props.details.exerciseCount}
          />
          <Description text={props.details.description} />
        </>
      );
      break;
    case "background":
      return (
        <>
          <Title
            title={props.details.name}
            exerciseCount={props.details.exerciseCount}
          />
          <Description text={props.details.description} />
          <Background background={props.details.backgroundMaterial} />
        </>
      );
      break;
      break;
    case "group":
      return (
        <>
          <Title
            title={props.details.name}
            exerciseCount={props.details.exerciseCount}
          />
          <Group groupProjects={props.details.groupProjectCount} />
        </>
      );
      break;
    case "special":
      return (
        <>
          <Title
            title={props.details.name}
            exerciseCount={props.details.exerciseCount}
          />
          <Description text={props.details.description} />
          <Requirements requirements={props.details.requirements} />
        </>
      );
      break;
    default:
      assertNever(props.details);
      return <></>;
  }
};

export default Part;
