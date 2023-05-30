type Props = { 
  parts: CoursePart[]
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDescription extends CoursePartBase {
  description: string;
}


interface CoursePartBasic extends CoursePartBaseWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackround extends CoursePartBaseWithDescription {
  backroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBaseWithDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround | CoursePartSpecial;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header = ({ text }: { text: string }) => {
  return <h1>{text}</h1>
};

const Total = ({ parts }: Props) => {
  return (
    <p>
      Number of exercises{" "}
      {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
};

const Part = ({ part }: { part: CoursePart }) => {
  let details = null;
  switch (part.kind) {
    case "basic":
      details = <i>{part.description}</i>
      break;
    case "group":
      details = <p> project exercises: {part.groupProjectCount}</p>
      break;
    case "background":
      details = (
        <>
           <i>{part.description}</i>
           <p>for more info see {part.backroundMaterial}</p>
        </>
      )
      break;
    case "special":
      details = (
        <>
            <i>{part.description}</i>
            <p>required skills: {part.requirements.join(', ')}</p>
        </>
      )
      break;
    default:
      return assertNever(part);
  }

  return (
    <div>
      <h4>{part.name} (exercises {part.exerciseCount})</h4>
      <>{details}</>
    </div>
  )
}

const Content = ({ parts }: Props) => {
  return (
    <>
      {parts.map(part => <Part key={part.name} part={part}/> )}
    </>
  )
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  return (
    <div>
      <Header text={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;