import { colors, spacing } from '@/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  loading?: boolean;
  onPress: () => void;
}

const AppButton = ({ title, onPress, loading = false }: Props) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
    {loading ? (
      <ActivityIndicator color={colors.white} />
    ) : (
      <Text style={styles.text}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  text: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AppButton;
