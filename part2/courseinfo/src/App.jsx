const Course = (props) => {
  const { name, parts } = props.course;

  return (
    <>
      <Header title={name} />
      <Content content={parts} />
    </>
  );
};

const Header = (props) => {
  const { title } = props;

  return <h1>{title}</h1>;
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

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
