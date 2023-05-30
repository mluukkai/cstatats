import React, { createContext, useContext, useReducer } from "react";
import { Diagnosis, Patient } from "../types";

import { Action } from "./reducer";

export type State = {
  patients: { [id: string]: Patient };
  diagnoses: { [code: string]: Diagnosis };
};

const initialState: State = {
  patients: {},
  diagnoses: {}
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);

export const setPatientList = (patientList: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patientList
  };
};

export const setPatient = (patient: Patient): Action => {
  return {
    type: "SET_PATIENT",
    payload: patient
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const setDiagnosistList = (diagnosisList: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload: diagnosisList
  };
};

