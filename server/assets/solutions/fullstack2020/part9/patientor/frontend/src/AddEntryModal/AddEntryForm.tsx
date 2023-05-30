import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Formik, Form, Field } from "formik";

import { TextField, NumberField, TypeSelectField } from "../components/FormField";
import { EntryFormValues, TypeOption } from "../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: "HealthCheck", label: "HealthCheck" },
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" }
];

const isDate = (date: string): boolean => {
  if (date.length===0) {
    return true;
  }
  return Boolean(Date.parse(date));
};

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const today = new Date();
  const style = { padding: 5, borderStyle: 'solid', borderWidth: 'thin', borderRadius: 10, marginBottom: 10, borderColor: '#DCDCDC' };
  return (
    <Formik
      initialValues={{
        type: '',
        description: '',
        specialist: '',
        date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDay()}`,
        healthCheckRating: 0,
        discharge: {
          date: '',
          criteria: ''
        },
        sickLeave: {
          startDate: '',
          endDate: ''
        },
        employerName: ''
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const dateError = "Malformatted date";
        const errors: { [field: string]: string } = {};

        if (!values.date) {
          errors.date = requiredError;
        }

        if (values.date && !isDate(values.date) ) {
          errors.date = dateError;
        }

        if (!values.specialist || values.description.length === 0) {
          errors.specialist = requiredError;
        }

        if (!values.description || values.description.length === 0) {
          errors.description = requiredError;
        }

        if (!values.description || values.description.length === 0) {
          errors.description = requiredError;
        }

        if (values.type ===  "HealthCheck") {
          const healthCheckRating = values.healthCheckRating;
          if (!healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
          if (![0, 1, 2, 3 ].includes(healthCheckRating as number)) {
            errors.healthCheckRating = "value must be 0-3";
          }
        }

        if (values.type ===  "Hospital") {
          const discharge = values.discharge;
          if (discharge && !isDate(discharge.date)) {
            errors.discharge= dateError;
          }
        }

        if (values.type ===  "OccupationalHealthcare") {
          const sickLeave = values.sickLeave;
          if (sickLeave && (!isDate(sickLeave.startDate) || !isDate(sickLeave.endDate))) {
            errors.sickLeave= dateError;
          }
        }

        return errors;
      }}
    >
      {({ isValid, dirty, values, errors }) => {
          return (
            <Form className="form ui">
              <TypeSelectField
                label="Type"
                name="type"
                options={typeOptions}
              />
              <Field
                label="date"
                placeholder="date"
                name="date"
                component={TextField}
              />
              <Field
                label="specialist"
                placeholder="specialist"
                name="specialist"
                component={TextField}
              />
              <Field
                label="description"
                placeholder="description"
                name="description"
                component={TextField}
              />
              {values.type === "HealthCheck" &&
                <>
                  <Field
                    label="rating"
                    placeholder="0"
                    name="healthCheckRating"
                    component={NumberField}
                  />
                </>
              }
              {values.type === "Hospital" &&
                <div style={ style }>
                  <h4>discharged</h4>
                  <Field
                    label="date"
                    placeholder="date"
                    name="discharge.date"
                    component={TextField}
                  />
                  <div style={{ color: 'red', marginBottom: 5 }}> 
                    {errors.discharge}
                  </div>
                  <Field
                    label="criteria"
                    placeholder="criteria"
                    name="discharge.criteria"
                    component={TextField}
                  />
                </div>
              }
              {values.type === "OccupationalHealthcare"&&
                <>
                  <Field
                    label="employer name"
                    placeholder="employer name"
                    name="employerName"
                    component={TextField}
                  />
                  <div style={ style }>
                    <h4>sick leave</h4>
                    <div style={{ color: 'red', marginBottom: 5 }}> 
                      {errors.sickLeave}
                    </div>
                    <Field
                      label="starts"
                      placeholder="start date"
                      name="sickLeave.startDate"
                      component={TextField}
                    />
                    <Field
                      label="ends"
                      placeholder="end date"
                      name="sickLeave.endDate"
                      component={TextField}
                    />
                  </div>
                </>
              }
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }
      }
    </Formik>
  );
};

export default AddEntryForm;