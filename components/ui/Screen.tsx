import { colors, spacing } from "@/theme";
import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

export const Screen = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <ScrollView
    contentContainerStyle={[styles.container, style]}
    keyboardShouldPersistTaps="handled"
  >
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
