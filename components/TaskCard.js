import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskCard({ task, setTasks, onToggle, onToggleImportant, onToggleWishlist, styles, currentDay }) {

  // const [updateTodoTaskTitle,setUpdateTodoTaskTitle] = React.useState("");

  const deleteTodoTask = (id) => {
    console.log("Delete Task", id);
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
          {task.completed ? '(Completed)' : `${task.dueDate || ''}${task.time ? ` · ${task.time}` : ''}`}
          {task.currentDay}
          {/* {currentDay} */}
          {/* {task.currentDay === currentDay ? currentDay : ''} */}
        </Text>

{/*         
        <Text style={styles.priorityTaskText}>
          {
        task.priority
        }</Text> */}

        <Text
        style={[
          styles.priorityTaskText,
          task.priority === 'High'
          ? { color: 'red' }
          : task.priority === 'Medium'
          ? { color: 'orange' }
          : { color: 'green' },
  ]}
>
  {task.priority}
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
