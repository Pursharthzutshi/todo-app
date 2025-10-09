import React, { useMemo } from 'react';
import { TouchableOpacity, ScrollView, Text, View } from 'react-native';

export default function AllDays({ Days, dayFilter, setDayFilter, dayCounts = {} }) {
  const displayDays = useMemo(
    () => [{ id: 'all', name: 'All', fullName: 'All Days' }, ...Days],
    [Days]
  );

  const totalCount = useMemo(
    () => Object.values(dayCounts).reduce((acc, value) => acc + value, 0),
    [dayCounts]
  );

  return (
    <View style={{ paddingVertical: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {displayDays.map(day => {
          const isAll = day.id === 'all';
          const isActive = isAll ? dayFilter === 'all' : String(dayFilter) === String(day.id);
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
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 16,
                marginRight: 12,
                borderWidth: 1,
                borderColor: isActive ? '#4F46E5' : '#e5e7eb',
                backgroundColor: isActive ? '#EEF2FF' : '#ffffff',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#3730A3' : '#111827',
                  }}
                >
                  {day.name}
                </Text>
                <View
                  style={{
                    marginLeft: 8,
                    minWidth: 24,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 9999,
                    backgroundColor: isActive ? '#4F46E5' : '#e5e7eb',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isActive ? '#ffffff' : '#1f2937',
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
