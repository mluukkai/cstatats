import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon, Button } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { Entry, Patient } from "../types";
import { useStateValue, setPatient } from "../state";
import EntryView from "./EntryView";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../types";

const PatientEntries = ({ entries }: { entries : Entry[]}) => {
  if (!entries) {
    return null;
  } 
  
  if (entries.length === 0){
    return <h4>no health entries</h4>;
  }

  return (
    <>
      <h4>Entries</h4>
      {entries.map(entry => <EntryView key={entry.id} entry={entry} />)}
    </>
  );
};

const PatientPage = () => {
  const { id } = useParams() as { id: string };

  const [{ patients }, dispatch] = useStateValue();

  const patient = patients[id];
  
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if ( !patient || !patient.ssn ) {
      void fetchPatientList();
    }
  }, [id]);
  
  if ( !patient ) {
    return null;
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    if ( values.discharge && values.discharge.date.length === 0) {
      values.discharge = undefined;
    }

    if ( values.sickLeave && values.sickLeave.startDate.length === 0) {
      values.sickLeave = undefined;
    }

    const { data: patientFromApi } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${id}/entries`,
      values
    );
    dispatch(setPatient(patientFromApi));
    closeModal();
  };

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const genderIcon = patient.gender === 'female' ? 
    'venus' : (patient.gender === 'male' ? 'mars' : 'genderless');

  return (
    <div className="App">
      <h3>
          {patient.name}
          <Icon name={genderIcon} />
      </h3>
      
      <div>ssn: {patient.ssn}</div>
      <div>{patient.occupation}</div>

      <PatientEntries entries={patient.entries}/>

      <AddEntryModal 
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientPage;
