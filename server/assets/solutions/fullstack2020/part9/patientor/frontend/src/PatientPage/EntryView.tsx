import React from "react";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthCareEntry } from "../types";
import { useStateValue } from "../state";
import { Icon } from "semantic-ui-react";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Symbol = ({ entry } : { entry : Entry }) => {
  switch (entry.type) {
    case "OccupationalHealthcare":
      return (<>
        <Icon name='stethoscope'/>
        <strong>{entry.employerName}</strong>
      </>);
    case "Hospital":
      return <Icon name='hospital'/>;
    case "HealthCheck":
      return <Icon name='user md'/>;
    default:
      return assertNever(entry);
  }
};

const HospitalDetails = ({ entry } : { entry : HospitalEntry }) => {
  if ( !entry.discharge) {
    return <div>currently hospitalized</div>;
  }
  
  return <div>discharged {entry.discharge.date} <i>{entry.discharge.criteria}</i></div>;
};

const HealthcheckDetails = ({ entry } : { entry : HealthCheckEntry }) => {
  if (entry.healthCheckRating === 3) {
    return <Icon name='bell' color='red' />;
  }

  const color = entry.healthCheckRating === 0 ? 'green' : 
                entry.healthCheckRating === 1 ? 'yellow' : 'red';
 
  return <Icon name='heart' color={color} />;
};

const OccupationalHealthcareDetails = ({ entry } : { entry : OccupationalHealthCareEntry }) => {
  if (!entry.sickLeave) {
    return null;
  }
  
  return <div>sickleave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</div>;
};


const EntryDetails = ({ entry } : { entry : Entry }) => {
  switch (entry.type) {
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails  entry={entry}/>;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    case "HealthCheck":
      return <HealthcheckDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const EntryView = ({ entry } : { entry : Entry } ) => {
  const [{ diagnoses }] = useStateValue();

  if (Object.keys(diagnoses).length === 0) return null;

  const style = { padding: 10, borderStyle: 'solid', borderWidth: 'thin', borderRadius: 10, margin: 5 };

  return (
    <div style={style}>
      <h5>{entry.date} <Symbol entry={entry} /> ({entry.specialist})</h5>
      <div>{entry.description}</div>
      {entry.diagnosisCodes && 
        <ul>
          {entry.diagnosisCodes.map(c => <li key={c}>
            {c} {diagnoses[c].name}
          </li>)}
        </ul>
      }
      <EntryDetails entry={entry} />
    </div>
  );
};

export default EntryView;
