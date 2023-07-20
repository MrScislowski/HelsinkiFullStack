import { CoursePartDetails } from "./types"

interface CoursePartProps {
  details: CoursePartDetails
}

const CoursePart = (props: CoursePartProps) => {
  return (
    <p>
      {props.details.name} {props.details.exerciseCount}
    </p>
  )
}

export default CoursePart;