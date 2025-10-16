import React, { useMemo } from 'react';
import { TouchableOpacity, ScrollView, Text, View, StyleSheet } from 'react-native';

const DAY_THEMES = {
  Light: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    activeBorder: '#6366F1',
    activeBackground: '#EEF2FF',
    text: '#1F2937',
    textActive: '#312E81',
    badgeBackground: '#E2E8F0',
    badgeText: '#1F2937',
    badgeBackgroundActive: '#4F46E5',
    badgeTextActive: '#FFFFFF',
  },
  Dark: {
    background: '#15213A',
    border: 'rgba(148,163,184,0.35)',
    activeBorder: '#818CF8',
    activeBackground: 'rgba(129,140,248,0.25)',
    text: '#CBD5F5',
    textActive: '#E0E7FF',
    badgeBackground: 'rgba(148,163,184,0.3)',
    badgeText: '#E2E8F0',
    badgeBackgroundActive: '#6366F1',
    badgeTextActive: '#F8FAFF',
  },
};

const scaleFont = (value, multiplier) =>
  Math.round(value * multiplier * 100) / 100;

export default function AllDays({
  Days,
  dayFilter,
  setDayFilter,
  dayCounts = {},
  theme = 'Light',
  fontScale = 1,
}) {
  const palette = DAY_THEMES[theme] || DAY_THEMES.Light;

  const displayDays = useMemo(
    () => [{ id: 'all', name: 'Weekly', fullName: 'Weekly summary' }, ...Days],
    [Days],
  );

  const totalCount = useMemo(
    () => Object.values(dayCounts).reduce((acc, value) => acc + value, 0),
    [dayCounts],
  );

  return (
    <View style={{ paddingVertical: 6 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {displayDays.map((day) => {
          const isAll = day.id === 'all';
          const isActive = isAll
            ? dayFilter === 'all'
            : String(dayFilter) === String(day.id);
          const count = isAll ? totalCount : dayCounts[day.id] || 0;

          return (
            <TouchableOpacity
              key={day.id}
              onPress={() => {
                if (isAll) {
                  setDayFilter('all');
                  return;
                }
                setDayFilter(isActive ? 'all' : String(day.id));
              }}
              style={[
                dayStyles.chip,
                {
                  borderColor: isActive ? palette.activeBorder : palette.border,
                  backgroundColor: isActive
                    ? palette.activeBackground
                    : palette.background,
                },
              ]}
            >
              <View style={dayStyles.chipContent}>
                <Text
                  style={{
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? palette.textActive : palette.text,
                    fontSize: scaleFont(14, fontScale),
                  }}
                >
                  {day.name}
                </Text>
                <View
                  style={[
                    dayStyles.badge,
                    {
                      backgroundColor: isActive
                        ? palette.badgeBackgroundActive
                        : palette.badgeBackground,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: scaleFont(12, fontScale),
                      fontWeight: '600',
                      color: isActive
                        ? palette.badgeTextActive
                        : palette.badgeText,
                      textAlign: 'center',
                    }}
                  >
                    {count}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const dayStyles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 10,
    minWidth: 26,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 9999,
  },
});
