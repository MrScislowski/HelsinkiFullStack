import { useState } from "react";
import { Pressable, TextInput, Text } from "react-native";
import styled from "styled-components/native";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <FormField
        value={username}
        placeholder="username"
        onChangeText={setUsername}
      />

      <FormField
        value={password}
        placeholder="password"
        onChangeText={setPassword}
        secureTextEntry
      />

      <SignInButton onPress={() => console.log("button pressed!")}>
        <Text>Sign in</Text>
      </SignInButton>
    </Container>
  );
};

export default SignInForm;
