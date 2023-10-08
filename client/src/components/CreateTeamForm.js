import React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import TextAreaField from "./TextAreaField";
import styled from "styled-components";

const FormContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px;
  margin: 0 auto;
`;

const FormHeading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const FormField = styled(Field)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px 0; /* Add margin for spacing */
`;

const ErrorMessageContainer = styled.div`
  color: red;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const DescriptionTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: auto;
  min-height: 150px; /* Adjust this value as needed */
`;

function CreateTeamForm()
{
    const history = useHistory();
    const initialValues = {
        name: "",
        description: "",
        users: ["", "", "", "", ""],
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        description: Yup.string(),
        users: Yup.array()
            .of(
                Yup.string()
                    .email("Invalid email address")
            )
            .min(1, "At least one user is required")
            .max(5, "Up to 5 users are allowed"),
    });

    const onSubmit = async (values, { setSubmitting }) =>
    {
        values.users = values.users.filter((user) => user.trim() !== "");

        try
        {
            await fetch("/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            setSubmitting(false);
            history.push("/dashboard"); // Redirect to the desired URL after successful submission
        } catch (error)
        {
            console.error("Error:", error);
            setSubmitting(false);
        }
    };

    return (
        <FormContainer>
            <FormHeading>Let's create your team!</FormHeading>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {() => (
                    <Form>
                        <FormGroup>
                            <Label>Team Name:</Label>
                            <FormField type="text" name="name" />
                            <ErrorMessage name="name" component={ErrorMessageContainer} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Description:</Label>
                            <Field
                                component={TextAreaField} // Use the custom component
                                name="description"
                                placeholder="Description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Emails:</Label>
                            <FieldArray
                                name="users"
                                render={(arrayHelpers) => (
                                    <div>
                                        {arrayHelpers.form.values.users.map((user, index) => (
                                            <FormGroup key={index}>
                                                <FormField
                                                    type="email"
                                                    name={`users.${index}`}
                                                    placeholder={`User ${index + 1} Email`}
                                                />
                                                <ErrorMessage
                                                    name={`users.${index}`}
                                                    component={ErrorMessageContainer}
                                                />
                                            </FormGroup>
                                        ))}
                                        <SubmitButton type="submit">Create</SubmitButton>
                                    </div>
                                )}
                            />
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
}

export default CreateTeamForm;
