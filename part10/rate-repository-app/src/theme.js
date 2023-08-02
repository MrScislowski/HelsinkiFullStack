import { StyleSheet } from "react-native";

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

const commonText = {
  color: theme.colors.textPrimary,
  fontSize: theme.fontSizes.body,
  fontFamily: theme.fonts.main,
  fontWeight: theme.fontWeights.normal,
  flex: 1,
  flexWrap: "wrap",
};

const styles = {};

export default theme;
