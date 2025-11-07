import { colors, typography } from "@/theme";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const AppText = ({ style, ...props }: TextProps) => {
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    ...typography.text,
    color: colors.text,
  },
});

export default AppText;
