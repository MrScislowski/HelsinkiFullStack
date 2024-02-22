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

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
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
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </>
  );
};

export default App;
