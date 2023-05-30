import { useState, useEffect } from "react";
import { Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { pingBackend } from './util';

import { Patient, Diagnosis } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnosis";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    pingBackend();

    const fetchInitialData = async () => {
      const patients = await patientService.getAll();
      const diagnoses = await diagnosisService.getAll();
      setPatients(patients);
      setDiagnoses(diagnoses);
    };
    
    void fetchInitialData();
  }, []);
  
  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
        </Routes>
        <Routes>
          <Route path="/patients/:id" element={<PatientPage diagnoses={diagnoses} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
