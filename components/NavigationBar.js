// components/NavigationBar.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function NavigationBar({ styles, currentView, setCurrentView }) {
  const items = [
    { key: 'today', label: 'Today' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'mytasks', label: 'My Tasks' },
    { key: 'todo', label: 'To-Do' },
  ];

  return (
    <View style={styles.navigation}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navButton, currentView === item.key && styles.activeNavButton]}
          onPress={() => setCurrentView(item.key)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.navText, currentView === item.key && styles.activeNavText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
