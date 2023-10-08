import React from "react";
import { ErrorMessage } from "formik";
import styled from "styled-components";

const TextAreaContainer = styled.div`
  /* Add any additional styling you need here */
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 150px;
`;

const TextAreaField = ({ field, form, ...props }) => {
  return (
    <TextAreaContainer>
      <StyledTextArea {...field} {...props} />
      <ErrorMessage name={field.name} component="div" className="error" />
    </TextAreaContainer>
  );
};

export default TextAreaField;
