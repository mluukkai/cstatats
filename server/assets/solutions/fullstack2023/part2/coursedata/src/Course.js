const Header = ({ name }) => {
  return <h3>{name}</h3>
}

const Total = ({ total }) => {
  return <strong>Number of exercises {total}</strong>
}

const Part = ({ part }) => {
  const { name, exercises } = part
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
      
    </div>
  )
}

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((sum, p) => sum+p.exercises , 0)
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts} />
      <Total total={totalExercises} />
    </div>
  )
}

export default Course