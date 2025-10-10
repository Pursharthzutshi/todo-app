import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const THEME = {
  Light: {
    backdrop: 'rgba(15, 23, 42, 0.28)',
    sheet: '#FFFFFF',
    headerText: '#0F172A',
    subtitle: '#475467',
    divider: '#E2E8F0',
    dayText: '#1F2937',
    dayMuted: '#94A3B8',
    daySelectedBackground: '#6366F1',
    daySelectedText: '#FFFFFF',
    dayTodayBorder: '#6366F1',
    footerBackground: '#EEF2FF',
    footerText: '#4338CA',
    buttonPrimary: '#6366F1',
    buttonPrimaryText: '#F8FAFF',
    buttonSecondary: '#EEF2FF',
    buttonSecondaryText: '#4338CA',
  },
  Dark: {
    backdrop: 'rgba(2, 6, 23, 0.6)',
    sheet: '#111C2E',
    headerText: '#E2E8F0',
    subtitle: '#94A3B8',
    divider: 'rgba(148,163,184,0.2)',
    dayText: '#CBD5F5',
    dayMuted: '#64748B',
    daySelectedBackground: '#818CF8',
    daySelectedText: '#0B1120',
    dayTodayBorder: '#A5B4FC',
    footerBackground: 'rgba(129,140,248,0.2)',
    footerText: '#E0E7FF',
    buttonPrimary: '#818CF8',
    buttonPrimaryText: '#0B1120',
    buttonSecondary: 'rgba(129,140,248,0.16)',
    buttonSecondaryText: '#E0E7FF',
  },
};

const startOfDay = (value) => {
  if (!value && value !== 0) return null;
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatISO = (date) => {
  if (!(date instanceof Date)) return null;
  return date.toISOString().split('T')[0];
};

const generateCalendar = (referenceDate) => {
  const monthStart = startOfDay(referenceDate);
  monthStart.setDate(1);

  const startWeekDay = monthStart.getDay();
  const totalDays = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();

  const days = [];
  // previous month padding
  if (startWeekDay > 0) {
    const prevMonthLastDay = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      0,
    ).getDate();
    for (let i = startWeekDay - 1; i >= 0; i -= 1) {
      days.push({
        key: `prev-${i}`,
        label: String(prevMonthLastDay - i),
        date: null,
        type: 'padding',
      });
    }
  }

  // current month days
  for (let day = 1; day <= totalDays; day += 1) {
    const currentDate = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      day,
    );
    days.push({
      key: `current-${day}`,
      label: String(day),
      date: currentDate,
      type: 'current',
    });
  }

  // trailing padding to fill weeks
  while (days.length % 7 !== 0) {
    const nextIndex = days.length % 7;
    days.push({
      key: `next-${nextIndex}`,
      label: String(nextIndex + 1),
      date: null,
      type: 'padding',
    });
  }

  return days;
};

export default function CalendarModal({
  visible,
  onClose,
  onSelect,
  selectedDateISO,
  theme = 'Light',
}) {
  const palette = THEME[theme] || THEME.Light;
  const todayISO = formatISO(startOfDay(new Date()));

  const initialMonth = useMemo(() => {
    const base = selectedDateISO ? startOfDay(selectedDateISO) : startOfDay(new Date());
    return base || startOfDay(new Date());
  }, [selectedDateISO]);

  const [activeMonth, setActiveMonth] = useState(initialMonth);
  const sheetScale = useRef(new Animated.Value(0.95)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const monthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setActiveMonth(initialMonth);
  }, [initialMonth]);

  const { currentMonthLabel, calendarDays, selectedISO } = useMemo(() => {
    const monthLabel = `${MONTH_NAMES[activeMonth.getMonth()]} ${activeMonth.getFullYear()}`;
    const grid = generateCalendar(activeMonth);
    return {
      currentMonthLabel: monthLabel,
      calendarDays: grid,
      selectedISO: selectedDateISO || null,
    };
  }, [activeMonth, selectedDateISO]);

  useEffect(() => {
    if (visible) {
      sheetScale.setValue(0.95);
      sheetOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(sheetScale, {
          toValue: 1,
          damping: 14,
          stiffness: 180,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(sheetOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      sheetOpacity.setValue(0);
      sheetScale.setValue(0.95);
    }
  }, [visible, sheetScale, sheetOpacity]);

  const animateMonthChange = (direction, newDate) => {
    monthAnim.setValue(direction * 32);
    setActiveMonth(newDate);
    Animated.timing(monthAnim, {
      toValue: 0,
      duration: 210,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const goToPreviousMonth = () => {
    const prev = new Date(activeMonth);
    prev.setMonth(prev.getMonth() - 1);
    animateMonthChange(1, prev);
  };

  const goToNextMonth = () => {
    const next = new Date(activeMonth);
    next.setMonth(next.getMonth() + 1);
    animateMonthChange(-1, next);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: palette.backdrop }]} />
      </TouchableWithoutFeedback>

      <View style={styles.centerWrapper}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: palette.sheet,
              borderColor: palette.divider,
              transform: [{ scale: sheetScale }],
              opacity: sheetOpacity,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: palette.headerText },
                ]}
              >
                Pick a due date
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: palette.subtitle },
                ]}
              >
                Stay on track by anchoring this task on your schedule.
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { borderColor: palette.divider },
              ]}
            >
              <MaterialIcons name="close" size={18} color={palette.subtitle} />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.monthContainer,
              {
                transform: [{ translateX: monthAnim }],
              },
            ]}
          >
            <View style={styles.monthRow}>
              <TouchableOpacity style={styles.monthNav} onPress={goToPreviousMonth}>
                <MaterialIcons name="keyboard-arrow-left" size={20} color={palette.subtitle} />
              </TouchableOpacity>
              <Text style={[styles.monthLabel, { color: palette.headerText }]}>
                {currentMonthLabel}
              </Text>
              <TouchableOpacity style={styles.monthNav} onPress={goToNextMonth}>
                <MaterialIcons name="keyboard-arrow-right" size={20} color={palette.subtitle} />
              </TouchableOpacity>
            </View>

            <View style={styles.dayHeaderRow}>
              {DAY_LABELS.map((label, index) => (
                <Text
                  key={`${label}-${index}`}
                  style={[
                    styles.dayHeaderText,
                    { color: palette.subtitle },
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {calendarDays.map((day, index) => {
                const iso = day.date ? formatISO(day.date) : null;
                const isSelected = iso && selectedISO === iso;
                const isToday = iso === todayISO;

                return (
                  <TouchableOpacity
                    key={`${day.key}-${index}`}
                    style={[
                      styles.dayCell,
                      isSelected && {
                        backgroundColor: palette.daySelectedBackground,
                      },
                    isToday && !isSelected && {
                      borderWidth: 1,
                      borderColor: palette.dayTodayBorder,
                    },
                  ]}
                  disabled={!day.date}
                    onPress={() => {
                      if (day.date && onSelect) {
                        onSelect(formatISO(day.date));
                      }
                    }}
                  >
                    <Animated.Text
                      style={[
                        styles.dayLabel,
                        {
                          color:
                            day.type !== 'current'
                              ? palette.dayMuted
                              : palette.dayText,
                        },
                        isSelected && {
                          color: palette.daySelectedText,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {day.label}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          <View
            style={[
              styles.footer,
              {
                backgroundColor: palette.footerBackground,
              },
            ]}
          >
            <MaterialIcons name="tips-and-updates" size={18} color={palette.footerText} />
            <Text
              style={[
                styles.footerText,
                { color: palette.footerText },
              ]}
            >
              Try locking tasks to the start of your day—you’ll know exactly
              where to begin.
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: palette.buttonSecondary },
              ]}
              onPress={() => {
                if (onSelect) onSelect(null);
              }}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: palette.buttonSecondaryText },
                ]}
              >
                Clear date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: palette.buttonPrimary },
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: palette.buttonPrimaryText },
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  centerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  monthContainer: {
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthNav: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  dayHeaderText: {
    width: '14.285%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  dayCell: {
    width: '14.285%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontWeight: '600',
  },
});
