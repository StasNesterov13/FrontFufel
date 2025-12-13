import { colors, spacing } from '@/theme';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

const AppInput = (props: TextInputProps) => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    placeholderTextColor={colors.textSecondary}
  />
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
});

export default AppInput;
