import { colors, spacing } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  type?: "primary" | "secondary" | "danger";
}

export const Button = ({ title, onPress, style, type = "primary" }: ButtonProps) => {
  const backgroundColor =
    type === "danger" ? colors.error : type === "secondary" ? colors.white : colors.primary;

  const textColor = type === "secondary" ? colors.primary : colors.white;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
