import { View, Text, TouchableOpacity } from 'react-native';

export default function TaskCard({ task, onToggle, onToggleImportant, styles }) {
  return (
    <View style={styles.taskCard}>
      <TouchableOpacity style={[styles.checkbox, task.completed && styles.checkedBox]} onPress={onToggle} hitSlop={{ top: 10 }}>
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>{task.title}</Text>
        <Text style={styles.taskDetails}>
          {task.completed ? '(Completed)' : `${task.dueDate || ''}${task.time ? ` · ${task.time}` : ''}`}
        </Text>
      </View>

      <View style={styles.taskActions}>
        <TouchableOpacity onPress={onToggleImportant} hitSlop={{ top: 8 }}>
          <Text style={styles.starIcon}>{task.important ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
