const ExerciseSum = ({course}) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <strong>
        total of {total} exercises
      </strong>
    )
  }
  
  const Course = ({course}) => {
    return (
      <>
      <Header name={course.name} />
      <PartCollection parts={course.parts} />
      <ExerciseSum course={course} />
      </>
    )
  }
  
  const Header = ({name}) => {
    return (
    <h1> {name} </h1>
    )
  }
  
  const PartCollection = ({parts}) => {
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

  export default Course