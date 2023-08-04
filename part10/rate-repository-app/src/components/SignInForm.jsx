import { useState } from "react";
import { TextInput, Text } from "react-native";
import styled from "styled-components/native";
import { useFormik } from "formik";
import * as yup from "yup";

const Container = styled.View``;

const SignInButton = styled.Pressable`
  padding: 10px;
  margin: 5px;
  background-color: grey;
  align-self: flex-start;
`;

const FormFieldContainer = styled.View`
  padding: 10px;
  margin: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => (props.error ? "red" : "black")};
`;

const FormFieldErrorMessage = styled.Text`
  color: red;
`;

const FormField = (props) => {
  const { formik, name, ...passThruProps } = props;
  return (
    <>
      <FormFieldContainer error={formik.touched[name] && formik.errors[name]}>
        <TextInput
          value={formik.values[name]}
          onChangeText={formik.handleChange(name)}
          placeholder={props.name}
          {...props}
        />
      </FormFieldContainer>
      {formik.touched[name] && formik.errors[name] ? (
        <FormFieldErrorMessage>{formik.errors[name]}</FormFieldErrorMessage>
      ) : null}
    </>
  );
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, "username must be 4 letters long or more")
    .required("username is required"),

  password: yup
    .string()
    .min(8, "password must be 8 letters or longer")
    .required("password is required"),
});

const SignInForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(
        `submitting username:${values.username}, password:${values.password}`
      );
    },
    validationSchema: validationSchema,
  });

  return (
    <Container>
      <FormField formik={formik} name="username" />

      <FormField formik={formik} name="password" secureTextEntry />

      <SignInButton onPress={formik.handleSubmit}>
        <Text>Sign in</Text>
      </SignInButton>
    </Container>
  );
};

export default SignInForm;
