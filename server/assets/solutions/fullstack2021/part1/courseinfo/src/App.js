import React from 'react'

const Header = (props) => <h1>{props.course}</h1> 

const Total = (props) => <p>Number of exercises {props.count}</p>

const Part = (props) => <p>{props.part} {props.exercises}</p>

const Content = props => (
  <>
    <Part part={props.parts[0].name} exercises={props.parts[0].exercises}/>
    <Part part={props.parts[1].name} exercises={props.parts[1].exercises}/>
    <Part part={props.parts[2].name} exercises={props.parts[2].exercises}/>
  </>
)

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content 
          parts={course.parts}
      /> 
      <Total count={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  )
}

export default App