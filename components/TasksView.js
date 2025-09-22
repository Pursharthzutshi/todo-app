// components/TasksView.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import TaskCard from './TaskCard.js';

export default function TasksView({
  styles,
  NAV_HEIGHT,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  filteredTasks,
  toggleTask,
  toggleImportant,
}) {
  return (
    <View style={styles.innerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentView('today')} hitSlop={{ top: 10 }}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.taskList} contentContainerStyle={{ paddingBottom: NAV_HEIGHT + 60 }}>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onToggleImportant={() => toggleImportant(task.id)}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}
