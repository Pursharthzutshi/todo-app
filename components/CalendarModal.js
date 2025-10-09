import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

const startOfMonth = (value) => {
  const date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const toISODate = (value) => startOfDay(value).toISOString();

const getCalendarMatrix = (monthCursor) => {
  const firstOfMonth = startOfMonth(monthCursor);
  const firstVisible = new Date(firstOfMonth);
  firstVisible.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const day = new Date(firstVisible);
    day.setDate(firstVisible.getDate() + index);
    day.setHours(0, 0, 0, 0);
    days.push(day);
  }
  return days;
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarModal({
  visible,
  onClose,
  onSelect,
  selectedDateISO = null,
}) {
  const initialMonth = useMemo(() => {
    if (selectedDateISO) return startOfMonth(selectedDateISO);
    return startOfMonth(new Date());
  }, [selectedDateISO]);

  const [monthCursor, setMonthCursor] = useState(initialMonth);

  useEffect(() => {
    setMonthCursor(initialMonth);
  }, [initialMonth]);

  const matrix = useMemo(() => getCalendarMatrix(monthCursor), [monthCursor]);

  const handleSelect = (date) => {
    if (onSelect) {
      onSelect(toISODate(date));
    }
    if (onClose) onClose();
  };

  const handleClear = () => {
    if (onSelect) {
      onSelect('none');
    }
    if (onClose) onClose();
  };

  const selectedDate = selectedDateISO ? startOfDay(selectedDateISO) : null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <View style={styles.calendar}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                const prev = new Date(monthCursor);
                prev.setMonth(monthCursor.getMonth() - 1);
                setMonthCursor(startOfMonth(prev));
              }}
              style={styles.navButton}
            >
              <Text style={styles.navLabel}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerLabel}>
              {monthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const next = new Date(monthCursor);
                next.setMonth(monthCursor.getMonth() + 1);
                setMonthCursor(startOfMonth(next));
              }}
              style={styles.navButton}
            >
              <Text style={styles.navLabel}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAY_LABELS.map(label => (
              <Text key={label} style={styles.weekdayLabel}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {matrix.map(day => {
              const isCurrentMonth = day.getMonth() === monthCursor.getMonth();
              const isToday =
                day.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate && day.getTime() === selectedDate.getTime();

              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  onPress={() => handleSelect(day)}
                  style={[
                    styles.dayCell,
                    !isCurrentMonth && styles.dayCellOutside,
                    isSelected && styles.dayCellSelected,
                    isToday && styles.dayCellToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      !isCurrentMonth && styles.dayLabelOutside,
                      isSelected && styles.dayLabelSelected,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Text style={styles.clearLabel}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeLabel}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  calendar: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  navButton: {
    padding: 8,
    borderRadius: 999,
  },
  navLabel: {
    fontSize: 20,
    color: '#2563eb',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 999,
  },
  dayCellOutside: {
    opacity: 0.35,
  },
  dayCellSelected: {
    backgroundColor: '#4F46E5',
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  dayLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  dayLabelOutside: {
    color: '#6b7280',
  },
  dayLabelSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearLabel: {
    color: '#ef4444',
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
  },
  closeLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
