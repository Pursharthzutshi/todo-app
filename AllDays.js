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

const DAY_THEME_VARIANTS = {
  Pastel: {
    ...DAY_THEMES.Light,
    background: '#F8F5FF',
    border: '#E9D5FF',
    activeBorder: '#8B5CF6',
    activeBackground: '#EDE9FE',
    text: '#5B21B6',
    textActive: '#4C1D95',
    badgeBackground: '#EDE9FE',
    badgeText: '#5B21B6',
    badgeBackgroundActive: '#8B5CF6',
    badgeTextActive: '#F8F5FF',
  },
  Mint: {
    ...DAY_THEMES.Light,
    background: '#F0FBF6',
    border: '#BBF7D0',
    activeBorder: '#10B981',
    activeBackground: '#D1FAE5',
    text: '#047857',
    textActive: '#064E3B',
    badgeBackground: '#D1FAE5',
    badgeText: '#047857',
    badgeBackgroundActive: '#10B981',
    badgeTextActive: '#ECFDF5',
  },
  Sunset: {
    ...DAY_THEMES.Light,
    background: '#FFF7ED',
    border: '#FED7AA',
    activeBorder: '#F97316',
    activeBackground: '#FFEDD5',
    text: '#9A3412',
    textActive: '#7C2D12',
    badgeBackground: '#FFEDD5',
    badgeText: '#9A3412',
    badgeBackgroundActive: '#F97316',
    badgeTextActive: '#FFF7ED',
  },
  Pink: {
    ...DAY_THEMES.Light,
    background: '#FFF5F7',
    border: '#FBCFE8',
    activeBorder: '#EC4899',
    activeBackground: '#FCE7F3',
    text: '#BE185D',
    textActive: '#831843',
    badgeBackground: '#FCE7F3',
    badgeText: '#BE185D',
    badgeBackgroundActive: '#EC4899',
    badgeTextActive: '#FFF5F7',
  },
  Ocean: {
    ...DAY_THEMES.Dark,
    background: '#10243E',
    border: 'rgba(56,189,248,0.32)',
    activeBorder: '#38BDF8',
    activeBackground: 'rgba(56,189,248,0.22)',
    text: '#BAE6FD',
    textActive: '#E0F2FE',
    badgeBackground: 'rgba(56,189,248,0.25)',
    badgeText: '#BAE6FD',
    badgeBackgroundActive: '#38BDF8',
    badgeTextActive: '#0B1120',
  },
};

Object.assign(DAY_THEMES, DAY_THEME_VARIANTS);

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
