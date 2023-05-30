import React from 'react';

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescribedPart extends CoursePartBase {
  description: string;
}
interface CourseNormalPart extends CourseDescribedPart {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescribedPart {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescribedPart {
  type: "special";
  requirements: Array<string>;
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

const Header = ({ courseName }: { courseName: string }) => 
  <h1>{courseName}</h1>

interface Course {
  name: string;
  exerciseCount: number;
}

const Part = ({ part } : { part : CoursePart} ) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const optionalParts = []

  switch (part.type) {
    case "normal":
      optionalParts.push(<div><i>{part.description}</i></div>)
      break
    case "groupProject":
      optionalParts.push(<div>project exercises {part.groupProjectCount}</div>)
      break
    case "submission":
      optionalParts.push(<div><i>{part.description}</i></div>)
      optionalParts.push(<div>submit to {part.exerciseSubmissionLink}</div>)
      break
    case "special":
      optionalParts.push(<div><i>{part.description}</i></div>)
      optionalParts.push(<div>required skils: {part.requirements.join(', ')}</div>)
      break
    default:
      return assertNever(part);
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div><strong>{part.name} {part.exerciseCount}</strong></div>
      {optionalParts.map(p => p)}
    </div> 
  )   
}

const Content = ({ courseParts }: { courseParts: Array<CoursePart> } ) => {
  return (
    <div>
      {courseParts.map(part =><Part key={part.name} part={part} />)}
    </div>
  )
}

const Total = ({ courseParts }: { courseParts: Array<Course> } ) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    },
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
