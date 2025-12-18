import { colors, spacing } from '@/theme';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeekPickerProps {
  onDayChange: (date: Date) => void;
}

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const screenWidth = Dimensions.get('window').width;

const WeekPicker: React.FC<WeekPickerProps> = ({ onDayChange }) => {
  const [date, setDate] = useState(new Date());

  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };

  const weekStart = getWeekStart(date);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const handlePress = (date: Date) => {
    setDate(date);
    onDayChange && onDayChange(date);
  };

  const dayWidth = Math.floor((screenWidth - spacing.lg * 4) / 7);

  return (
    <View style={styles.container}>
      <View style={styles.weekWrapper}>
        {weekDates.map((item) => {
          const isSelected = item.toDateString() === date.toDateString();
          const dayLabel = daysOfWeek[item.getDay() === 0 ? 6 : item.getDay() - 1];

          return (
            <TouchableOpacity
              key={item.toDateString()}
              style={[styles.dayButton, isSelected && styles.selectedDay]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>{dayLabel}</Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WeekPicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    alignItems: 'center', // центрируем рамку по горизонтали
  },
  weekWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border, // рамка вокруг всей недели
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    width: '100%',
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: colors.primaryLight,
  },
  dayText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  selectedText: {
    color: colors.primaryDark,
  },
});
