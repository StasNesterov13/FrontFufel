import AppText from '@/components/AppText';
import { colors, spacing } from '@/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const ChoiceButton = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
    <AppText style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</AppText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  choice: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 100,
  },
  choiceSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  choiceTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChoiceButton;
