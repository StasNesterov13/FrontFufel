import { spacing, typography } from "@/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
});
