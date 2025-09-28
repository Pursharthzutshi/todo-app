import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // ✅ correct import for Expo

export default function TaskCard({ task, setTasks, onToggle, onToggleImportant, styles }) {

  const deleteTodoTask = (id) => {
    console.log("Delete Task", id);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(t => t.id !== id);
      return updatedTasks;
    });
  };

  return (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkedBox]}
        onPress={onToggle}
        hitSlop={{ top: 10 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
          {task.title}
        </Text>
        <Text style={styles.taskDetails}>
          {task.completed ? '(Completed)' : `${task.dueDate || ''}${task.time ? ` · ${task.time}` : ''}`}
        </Text>
      </View>

      <View style={styles.taskActions}>
        <TouchableOpacity onPress={onToggleImportant} hitSlop={{ top: 8 }}>
          <Text style={styles.starIcon}>{task.important ? '★' : '☆'}</Text>
          <Text>{task.priority}</Text>
        <TouchableOpacity onPress={() => deleteTodoTask(task.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
        </TouchableOpacity>

      </View>
    </View>
  );
}
