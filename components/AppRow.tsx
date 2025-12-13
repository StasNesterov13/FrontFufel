import AppText from '@/components/AppText';
import { colors, spacing } from '@/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const AppRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <AppText style={styles.label}>{label}</AppText>
    <AppText style={styles.value}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
});

export default AppRow;
