import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskCard({ task, setTasks, onToggle, onToggleImportant, onToggleWishlist, styles }) {

  // const [updateTodoTaskTitle,setUpdateTodoTaskTitle] = React.useState("");

  const deleteTodoTask = (id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(t => t.id !== id);
      return updatedTasks;
    });
  };

  // console.log(currentDay)

  // const editTodoTask = (id) => {
  //    setTasks(prev => {
  //     const newList = prev.map(t => (t.id === id ? { ...t, title: updateTodoTaskTitle } : t));
  //     AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e => console.error(e));
  //     setSavedTodoTasks(newList);
  //     return newList;
  //   });
  // }

  const detailText = useMemo(() => {
    if (task.completed) return 'Completed';

    const parts = [];
    if (task.dueDateLabel) {
      parts.push(task.dueDateLabel);
    } else {
      parts.push('No due date');
    }
    if (task.time) {
      parts.push(task.time);
    }
    return parts.filter(Boolean).join(' · ');
  }, [task.completed, task.dueDateLabel, task.time]);

  const priorityValue = task.priority || 'None';
  const priorityColor = useMemo(() => {
    if (priorityValue === 'Urgent' || priorityValue === 'High') return { color: 'red' };
    if (priorityValue === 'Medium') return { color: 'orange' };
    if (priorityValue === 'Low') return { color: 'green' };
    return { color: '#6b7280' };
  }, [priorityValue]);

  return (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkedBox]}
        onPress={onToggle}
        hitSlop={{ top: 20 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      
      <View style={styles.taskContent}>

        <View>
        <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
          {task.title}
          {/* {task.currentDay} */}
        </Text>

        {/* <TextInput /> */}
        </View>

        <Text style={styles.taskDetails}>
          {detailText}
        </Text>

{/*         
        <Text style={styles.priorityTaskText}>
          {
        task.priority
        }</Text> */}

        <Text
        style={[
          styles.priorityTaskText,
          priorityColor,
  ]}
>
  {priorityValue}
  </Text>

      </View>

      <View style={styles.taskActionsContainer}>

      <View style={styles.taskActions}>
        
        <TouchableOpacity onPress={() => editTodoTask(task.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="edit" size={33} color="black" />
        </TouchableOpacity>    
         
        <TouchableOpacity onPress={onToggleImportant} hitSlop={{ top: 8 }}>
          <Text style={styles.starIcon}>{task.important ? '★' : '☆'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onToggleWishlist} hitSlop={{ top: 8 }}>
          <Text style={styles.heartIcon}>{task.wishlist ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => deleteTodoTask(task.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="delete" size={19} color="black" />
        </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}
