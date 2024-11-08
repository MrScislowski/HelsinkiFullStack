# Part 10 - React Native

## Intro

- Cordova is a platform for building cross-platform applications (using HTML5, CSS3, JavaScript). But it runs within an embedded browser
- React Native uses native system resources instead of an embedded browser

## Initializing

- Expo is a platform to setup, develop, build, deploy react native applications
- `app.json` has expo-related configuration
- `App.js` is the entry point for the application

```sh
pnpm dlx create-expo-app rate-repository-app --template expo-template-blank
cd rate-repository-app
pnpm dlx expo install react-native-web react-dom @expo/metro-runtime
```

## Use eslint

Install eslint:

```sh
pnpm install --save-dev eslint @babel/eslint-parser eslint-plugin-react eslint-plugin-react-native
```

.eslintrc.json:

```json
{
  "plugins": ["react", "react-native"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "@babel/eslint-parser",
  "env": {
    "react-native/react-native": true
  },
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

package.json

```json
{
  //...
  "lint": "eslint ./src/**/*.{js,jsx} App.js --no-error-on-unmatched-pattern"
  //...
}
```

## Debugging

Read about debugging tools [here](https://reactnative.dev/docs/debugging)

## React Native Basics

### Hello world program:

```jsx
import { Text } from "react-native";

const HelloWorld = (props) => {
  return <Text>Hello world!</Text>;
};
```

### Components in react vs react native

| React Native   | Web Analog              | Comments                                                                                                                             |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `<Text>`       | `<p>`                   | Displays, styles, and nests strings of text and handles touch events. The only react native component that can have textual children |
| `<View>`       | `<div>` (non-scrolling) | A container that supports layout with flexbox, style, some touch handling, and accessibility controls                                |
| `<Image>`      | `<img>`                 | Displays different types of images                                                                                                   |
| `<ScrollView>` | `<div>`                 | A generic scrolling container that can contain multiple components and views                                                         |
| `<TextInput>`  | `<input type="text">`   | Allows the user to enter text                                                                                                        |
| `<Pressable>`  | `<button>`              | ...possibly not a core component?                                                                                                    |

NB: You can add an `onClick` handler to basically any web component. That's not true for Native elements; you need to read the docs. For example, a `Pressable` can have an `onPress` handler.

### Styling

```jsx
import Constants from "expo-constants";
import { Text, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <Text>Rate Repository Application</Text>
    </View>
  );
};

export default Main;
```

Styling cheatsheet: [here](https://github.com/vhpoet/react-native-styling-cheat-sheet)

- you can pass an array of objects to the `style` property, and it merges them and reads them left to right applying the most recently evaluated. This allows for conditional render of styles, like:

```js
import { Text, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text: {
    color: "grey",
    fontSize: 14,
  },
  blueText: {
    color: "blue",
  },
  bigText: {
    fontSize: 24,
    fontWeight: "700",
  },
});

const FancyText = ({ isBlue, isBig, children }) => {
  const textStyles = [
    styles.text,
    isBlue && styles.blueText,
    isBig && styles.bigText,
  ];

  return <Text style={textStyles}>{children}</Text>;
};

const Main = () => {
  return (
    <>
      <FancyText>Simple text</FancyText>
      <FancyText isBlue>Blue text</FancyText>
      <FancyText isBig>Big text</FancyText>
      <FancyText isBig isBlue>
        Big blue text
      </FancyText>
    </>
  );
};
```

### Theming

React native does not support global styles, so you can do something like:

`src/theme.js`:

```js
const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: "System",
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
};

export default theme;
```

`src/components/Text.jsx`

```jsx
import { Text as NativeText, StyleSheet } from "react-native";

import theme from "../theme";

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === "textSecondary" && styles.colorTextSecondary,
    color === "primary" && styles.colorPrimary,
    fontSize === "subheading" && styles.fontSizeSubheading,
    fontWeight === "bold" && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
```

And then use that `Text` component elsewhere

## Routing

Install the library

```sh
pnpm install react-router-native
```

Wrap the app in a router provider:

```jsx
import { NativeRouter } from "react-router-native";
// ...

const App = () => {
  return (
    <NativeRouter>
      <Main />
    </NativeRouter>
  );
};
```

Within the `Main` component, add some routes:

```jsx
import { Route, Reoutes, Navigate } from 'react-router-native';
// ...

const Main = () => {
    return (
        // ...
        <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="*" element={Navigate to="/" replace />} />
        </Routes>
        // ...
    )
}
```
