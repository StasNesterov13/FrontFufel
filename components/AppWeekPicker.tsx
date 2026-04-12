import { colors, spacing } from '@/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeekPickerProps {
  onDayChange: (date: Date) => void;
}

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const WeekPicker: React.FC<WeekPickerProps> = ({ onDayChange }) => {
  const [date, setDate] = useState(new Date());

  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };

  const shiftWeek = (dir: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + dir * 7);
    setDate(newDate);
    onDayChange(newDate);
  };

  const weekStart = getWeekStart(date);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const handlePress = (d: Date) => {
    setDate(d);
    onDayChange(d);
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={() => shiftWeek(-1)}>
          <Text style={styles.navText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => shiftWeek(1)}>
          <Text style={styles.navText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekWrapper}>
        {weekDates.map((item) => {
          const isSelected = item.toDateString() === date.toDateString();
          const dayLabel = daysOfWeek[item.getDay() === 0 ? 6 : item.getDay() - 1];

          return (
            <TouchableOpacity
              key={item.toDateString()}
              style={[styles.dayButton, isSelected && styles.selectedDay]}
              onPress={() => handlePress(item)}
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
    alignItems: 'center',
  },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: spacing.md,
  },
  navText: {
    fontSize: 20,
    fontWeight: '600',
  },
  weekWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
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
