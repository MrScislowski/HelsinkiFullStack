
const Course = ({course}) => {
  return (
    <>
    <Header name={course.name} />
    <PartCollection parts={course.parts} />
    </>
  )
}

const Header = ({name}) => {
  return (
  <h1> {name} </h1>
  )
}

const PartCollection = ({parts}) => {
  console.log('parts=', parts);
  return (
    <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Part = ({part}) => {
  const {name, exercises} = part
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }
  return <Course course={course} />
}

export default App