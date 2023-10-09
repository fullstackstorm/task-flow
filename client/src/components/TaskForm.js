import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  margin: 5px 0;
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

function TaskForm({ projectID, userID })
{
    console.log("ID Values:", projectID, userID);
    const history = useHistory();

    const initialValues = {
        title: "",
        description: "",
        due_date: "",
        status: "PENDING",
        project_id: projectID,
        user_id: userID,
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        due_date: Yup.date().required("Due Date is required"),
    });

    const onSubmit = async (values, { setSubmitting }) =>
    {
        const requestBody = {
            title: values.title,
            description: values.description,
            due_date: values.due_date,
            status: values.status,
            project_id: projectID,
            user_id: userID,
          };

        try
        {
            await fetch("/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } catch (error)
        {
            console.error("Error:", error);
        }
        setSubmitting(false);

        history.push(`/project/${projectID}`);
        window.location.reload();
    };

    return (
        <FormContainer>
            <FormHeading>Create Task</FormHeading>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {() => (
                    <Form>
                        <FormGroup>
                            <Label>Title:</Label>
                            <FormField type="text" name="title" />
                            <ErrorMessage name="title" component={ErrorMessageContainer} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Description:</Label>
                            <Field
                                component={TextAreaField} // Use the custom component
                                name="description"
                                placeholder="Description"
                            />
                            <ErrorMessage name="description" component={ErrorMessageContainer} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Due Date:</Label>
                            <FormField type="date" name="due_date" />
                            <ErrorMessage name="due_date" component={ErrorMessageContainer} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Status:</Label>
                            <FormField as="select" name="status">
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </FormField>
                            <ErrorMessage name="status" component={ErrorMessageContainer} />
                        </FormGroup>

                        <SubmitButton type="submit">Create Task</SubmitButton>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
}

export default TaskForm;
