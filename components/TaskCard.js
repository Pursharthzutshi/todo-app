import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskCard({ task, setTasks, onToggle, onToggleImportant, onToggleWishlist, styles }) {

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
        hitSlop={{ top: 20 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      

      <View style={styles.taskContent}>

        <View>

        <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
          {task.title}
        </Text>

        </View>

        <Text style={styles.taskDetails}>
          {task.completed ? '(Completed)' : `${task.dueDate || ''}${task.time ? ` · ${task.time}` : ''}`}
        </Text>
        <Text style={{borderStyle:"solid", borderColor:"black", justifyContent:"center", textAlign:"center", color:"white", borderRadius: 10, padding: 3 , backgroundColor:"black", borderWidth:1, width:70, marginTop:12}}>{task.priority}</Text>
      </View>


      <View style={styles.taskActionsContainer}>

      <View style={styles.taskActions}>
        
        <TouchableOpacity onPress={() => deleteTodoTask(task.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="edit" size={27} color="black" />
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
