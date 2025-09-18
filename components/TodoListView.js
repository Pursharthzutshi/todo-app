// components/TodoListView.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import TaskCard from './TaskCard';

export default function TodoListView({
  styles,
  NAV_HEIGHT,
  newTask, setNewTask, addTask,
  filteredTasks, toggleTask, toggleImportant,
}) {
  return (
    <View style={styles.innerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} hitSlop={{ top: 10 }}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>To-Do List</Text>
        <TouchableOpacity style={styles.moreButton} hitSlop={{ top: 10 }}>
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.todoInput}
          placeholder="Enter a new task"
          placeholderTextColor="#999"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
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

      <TouchableOpacity style={styles.fab} onPress={addTask} hitSlop={{ top: 12 }}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
