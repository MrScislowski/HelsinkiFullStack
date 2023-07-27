import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import SinglePatient from "./components/SinglePatient";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<
    Patient | undefined | null
  >(undefined);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  const match = useMatch("/patients/:id");
  const selectedId = match ? match.params.id : null;

  useEffect(() => {
    const getSinglePatient = async (id: string) => {
      const patient = await patientService.getOne(id);
      setSelectedPatient(patient);
    };

    const getDiagnosisCodes = async () => {
      const codes = await diagnosisService.getAll();
      setDiagnoses(codes);
    };

    if (!selectedId) {
      setSelectedPatient(null);
    } else {
      getSinglePatient(selectedId)
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .then(() => {})
        .catch((err) => console.error(err));
      getDiagnosisCodes()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [selectedId, patients]);

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
          <Route
            path="/patients/:id"
            element={
              <SinglePatient
                patient={selectedPatient}
                allDiagnoses={diagnoses}
                patients={patients}
                setPatients={setPatients}
              />
            }
          />
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;