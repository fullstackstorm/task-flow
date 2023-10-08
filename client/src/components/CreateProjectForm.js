import React from "react";
import { Formik, Field, Form, ErrorMessage} from "formik";
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

function CreateProjectForm()
{
    const history = useHistory();
    const initialValues = {
        name: "",
        description: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        description: Yup.string()
    });

    const onSubmit = async (values, { setSubmitting }) =>
    {
        try
        {
            fetch("/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((response) =>
                {
                    if (!response.ok)
                    {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // Parse the JSON response
                })
                .then((data) =>
                {
                    const projectID = data.id; // Extract the projectId from the response
                    const projectPath = `/project/${projectID}`; 

                    setSubmitting(false);
                    history.push(projectPath); // Redirect to the project page
                })
                .catch((error) =>
                {
                    console.error("Error:", error);
                    setSubmitting(false);
                });
        } catch (error)
        {
            console.error("Error:", error);
            setSubmitting(false);
        }
    }


    return (
        <FormContainer>
            <FormHeading>Let's set up your project. . .</FormHeading>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {() => (
                    <Form>
                        <FormGroup>
                            <Label>Project Name:</Label>
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
                        <SubmitButton type="submit">Submit</SubmitButton>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
}



export default CreateProjectForm;
