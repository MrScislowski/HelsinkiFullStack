import { useState } from "react";
import { TextInput, Text } from "react-native";
import styled from "styled-components/native";
import { useFormik } from "formik";

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
`;

const FormField = (props) => {
  return (
    <FormFieldContainer>
      <TextInput {...props} />
    </FormFieldContainer>
  );
};

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
  });

  return (
    <Container>
      <FormField
        value={formik.values.username}
        onChangeText={formik.handleChange("username")}
        placeholder="username"
      />

      <FormField
        value={formik.values.password}
        placeholder="password"
        onChangeText={formik.handleChange("password")}
        secureTextEntry
      />

      <SignInButton onPress={formik.handleSubmit}>
        <Text>Sign in</Text>
      </SignInButton>
    </Container>
  );
};

export default SignInForm;
