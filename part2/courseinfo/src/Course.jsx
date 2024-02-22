const Course = (props) => {
  const { name, parts } = props.course;

  return (
    <>
      <Header title={name} />
      <Content content={parts} />
      <Footer content={parts} />
    </>
  );
};

const Header = (props) => {
  const { title } = props;

  return <h2>{title}</h2>;
};

const Content = (props) => {
  const { content } = props;

  return content.map((part) => (
    <Part key={part.id} name={part.name} exercises={part.exercises} />
  ));
};

const Part = (props) => {
  const { name, exercises } = props;

  return (
    <p>
      {name}: {exercises}
    </p>
  );
};

const Footer = (props) => {
  const { content } = props;

  const exerciseCount = content.reduce(
    (total, part) => total + part.exercises,
    0
  );

  return (
    <p>
      <strong>Total of {exerciseCount} exercises</strong>
    </p>
  );
};

export default Course;
