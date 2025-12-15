import { colors, spacing } from '@/theme';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeekPickerProps {
  onDayChange?: (date: Date) => void;
}

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const screenWidth = Dimensions.get('window').width;

const WeekPicker: React.FC<WeekPickerProps> = ({ onDayChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Получаем дату Пн текущей недели
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };

  const weekStart = getWeekStart(selectedDate);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const handlePress = (date: Date) => {
    setSelectedDate(date);
    onDayChange && onDayChange(date);
  };

  const dayWidth = Math.floor((screenWidth - spacing.lg * 2) / 7);

  return (
    <View style={styles.container}>
      <FlatList
        data={weekDates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toDateString()}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        renderItem={({ item }) => {
          const isSelected = item.toDateString() === selectedDate.toDateString();
          const dayLabel = daysOfWeek[item.getDay() === 0 ? 6 : item.getDay() - 1];

          return (
            <TouchableOpacity
              style={[styles.dayButton, { width: dayWidth }, isSelected && styles.selectedDay]}
              onPress={() => handlePress(item)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>{dayLabel}</Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default WeekPicker;

const styles = StyleSheet.create({
  container: { marginVertical: spacing.md },
  dayButton: {
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs / 2,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 999,
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
  selectedText: { color: colors.white },
});
