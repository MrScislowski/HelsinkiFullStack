# Part 10 - React Native

## Intro

- Cordova is a platform for building cross-platform applications (using HTML5, CSS3, JavaScript). But it runs within an embedded browser
- React Native uses native system resources instead of an embedded browser

## Initializing

- Expo is a platform to setup, develop, build, deploy react native applications
- `app.json` has expo-related configuration
- `App.js` is the entry point for the application

```sh
pnpm dlx create-expo-app rate-repository-app --template expo-template-blank@sdk-50
cd rate-repository-app
pnpm dlx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/metro-runtime@~3.1.1
```
